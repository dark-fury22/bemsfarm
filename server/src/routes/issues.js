// routes/issues.js
// ─────────────────────────────────────────────────────────────────────────────
// Issue Resolution API routes
// Mount in server.js:  app.use('/api/issues', require('./routes/issues'));
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { supabaseAdmin } = require("../config/supabaseClient");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { SMS } = require("../services/smsService");

// ─── POST /api/issues  — Customer reports an issue ───────────────────────────
router.post("/", authenticateToken, async (req, res) => {
  const { order_id, type, title, description, photo_urls } = req.body;
  const user_id = req.user.id;

  if (!type || !title || !description) {
    return res
      .status(400)
      .json({ message: "type, title and description are required" });
  }

  try {
    // Create the issue
    const { data: issue, error } = await supabaseAdmin
      .from("issues")
      .insert([
        {
          order_id,
          user_id,
          type,
          title,
          description,
          photo_urls: photo_urls || [],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log initial activity
    await supabaseAdmin.from("issue_activities").insert([
      {
        issue_id: issue.id,
        actor_type: "customer",
        actor_name: req.user.name,
        action: "Issue reported",
        note: `${type}: ${title}`,
      },
    ]);

    // Log system activity
    await supabaseAdmin.from("issue_activities").insert([
      {
        issue_id: issue.id,
        actor_type: "system",
        action: "Issue assigned to admin for review",
      },
    ]);

    return res
      .status(201)
      .json({ message: "Issue reported successfully", issue });
  } catch (err) {
    console.error("Create issue error:", err);
    return res.status(500).json({ message: "Failed to create issue" });
  }
});

// ─── GET /api/issues  — Customer gets their issues ───────────────────────────
router.get("/", authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  try {
    const { data, error } = await supabaseAdmin
      .from("issues")
      .select("*, issue_activities(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.json({ issues: data });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch issues" });
  }
});

// ─── GET /api/issues/admin  — Admin gets ALL issues ──────────────────────────
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  const { status, type, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from("issues")
      .select(
        `
        *,
        issue_activities(*),
        orders(id, total_amount, payment_method, status),
        users:user_id(id, name, email, phone)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (type) query = query.eq("type", type);

    const { data, error, count } = await query;
    if (error) throw error;

    return res.json({
      issues: data,
      total: count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error("Admin get issues error:", err);
    return res.status(500).json({ message: "Failed to fetch issues" });
  }
});

// ─── GET /api/issues/:id  — Get single issue with full activity log ──────────
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from("issues")
      .select(
        `
        *,
        issue_activities(* ),
        orders(id, total_amount, payment_method, status, created_at),
        users:user_id(id, name, email, phone)
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data)
      return res.status(404).json({ message: "Issue not found" });

    // Only allow owner or admin
    if (data.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.json({ issue: data });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch issue" });
  }
});

// ─── PATCH /api/issues/:id/status  — Admin updates issue status ──────────────
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { status, admin_notes, resolution, refund_amount } = req.body;

    const VALID_STATUSES = [
      "open",
      "under_review",
      "resolved_refund",
      "resolved_replacement",
      "resolved_no_action",
      "closed",
    ];

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      // Fetch issue + customer details for SMS
      const { data: issue } = await supabaseAdmin
        .from("issues")
        .select("*, users:user_id(name, phone, email)")
        .eq("id", id)
        .single();

      if (!issue) return res.status(404).json({ message: "Issue not found" });

      const updates = {
        status,
        admin_notes,
        resolution,
        resolved_by: req.user.id,
      };

      if (
        [
          "resolved_refund",
          "resolved_replacement",
          "resolved_no_action",
          "closed",
        ].includes(status)
      ) {
        updates.resolved_at = new Date().toISOString();
      }

      if (refund_amount) {
        updates.refund_amount = refund_amount;
        updates.refund_status = "pending";
      }

      const { data: updated, error } = await supabaseAdmin
        .from("issues")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      const statusLabels = {
        under_review: "Issue marked as under review",
        resolved_refund: `Resolved with refund of ₦${refund_amount || 0}`,
        resolved_replacement: "Resolved with replacement delivery",
        resolved_no_action: "Closed — no refund/replacement",
        closed: "Issue closed",
      };

      await supabaseAdmin.from("issue_activities").insert([
        {
          issue_id: id,
          actor_type: "admin",
          actor_name: req.user.name,
          action: statusLabels[status] || `Status changed to ${status}`,
          note: admin_notes || null,
        },
      ]);

      // Send SMS to customer
      const customer = issue.users;
      if (customer?.phone) {
        if (status === "resolved_refund") {
          await SMS.refundProcessed(
            customer.phone,
            customer.name,
            refund_amount || issue.refund_amount,
          );
        } else if (status === "resolved_replacement") {
          await SMS.replacementScheduled(
            customer.phone,
            customer.name,
            issue.order_id,
          );
        } else if (status === "resolved_no_action" || status === "closed") {
          await SMS.issueResolved(
            customer.phone,
            customer.name,
            resolution || "Please contact support for details",
          );
        }
      }

      // If refund — trigger Paystack refund
      if (
        status === "resolved_refund" &&
        refund_amount &&
        issue.orders?.payment_reference
      ) {
        // Paystack refund (fire and forget — handle async)
        triggerPaystackRefund(issue, refund_amount, id).catch(console.error);
      }

      return res.json({
        message: "Issue updated successfully",
        issue: updated,
      });
    } catch (err) {
      console.error("Update issue status error:", err);
      return res.status(500).json({ message: "Failed to update issue" });
    }
  },
);

// ─── POST /api/issues/:id/note  — Admin adds internal note ───────────────────
router.post("/:id/note", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  if (!note?.trim())
    return res.status(400).json({ message: "Note is required" });

  try {
    await supabaseAdmin.from("issue_activities").insert([
      {
        issue_id: id,
        actor_type: "admin",
        actor_name: req.user.name,
        action: "Admin note added",
        note,
      },
    ]);

    return res.json({ message: "Note added" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add note" });
  }
});

// ─── Helper: Paystack refund ──────────────────────────────────────────────────
async function triggerPaystackRefund(issue, amount, issueId) {
  const axios = require("axios");
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET) return;

  try {
    const response = await axios.post(
      "https://api.paystack.co/refund",
      {
        transaction: issue.orders?.payment_reference,
        amount: Math.round(amount * 100), // Paystack uses kobo
        currency: "NGN",
        customer_note: `Refund for issue #${issueId}`,
        merchant_note: `BemsFarms issue resolution refund`,
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } },
    );

    // Update refund status
    await supabaseAdmin
      .from("issues")
      .update({
        refund_status: "processing",
        paystack_refund_id: response.data?.data?.id,
      })
      .eq("id", issueId);

    console.log("[Paystack Refund] Initiated:", response.data);
  } catch (err) {
    console.error(
      "[Paystack Refund] Failed:",
      err.response?.data || err.message,
    );
    await supabaseAdmin
      .from("issues")
      .update({ refund_status: "failed" })
      .eq("id", issueId);
  }
}

module.exports = router;
