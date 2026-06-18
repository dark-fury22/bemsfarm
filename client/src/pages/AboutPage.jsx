import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import { useResponsive } from "../hooks/useResponsive";

export default function AboutPage() {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop, isTabletAny, padding, gap, cols } =
    useResponsive();

  // Replace the team array with this structure:
  const team = [
    {
      name: "Your Boss Name",
      role: "Founder & CEO",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
      // Replace with actual photo URL or upload path
      socials: {
        twitter: "https://twitter.com/yourboss",
        linkedin: "https://linkedin.com/in/yourboss",
        instagram: "https://instagram.com/yourboss",
      },
    },
    {
      name: "Team Member 2",
      role: "Head of Procurement",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
      socials: {
        twitter: "https://twitter.com/member2",
        linkedin: "https://linkedin.com/in/member2",
        instagram: "https://instagram.com/member2",
      },
    },
    {
      name: "Team Member 3",
      role: "Product Designer",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
      socials: {
        twitter: "https://twitter.com/member3",
        linkedin: "https://linkedin.com/in/member3",
        instagram: "https://instagram.com/member3",
      },
    },
  ];

  const stats = [
    { value: '10k+', label: 'Happy Customers', icon: '👥', color: '#D8F3DC' },
  { value: '50+',  label: 'Farm Partners',   icon: '🌾', color: '#FEF3C7' },
  { value: '12+',  label: 'Food Categories', icon: '🥬', color: '#E0F2FE' },
  { value: '99%',  label: 'Satisfaction',    icon: '⭐', color: '#FDE8D8' },
  ];

  return (
    <PageWrapper>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
          padding: "80px 24px",
          textAlign: "center",
          color: "white",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "3px",
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            ABOUT US
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 900,
              marginBottom: "16px",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            Our Story
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Launched in 2024, BemsFarm is Nigeria's premier online farm-fresh
            food marketplace, connecting thousands of customers directly with
            trusted Nigerian farmers.
          </p>
        </motion.div>
      </div>

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 24px" }}
      >
        {/* Story */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "60px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p
              style={{
                color: "#F57C00",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "2px",
                marginBottom: "12px",
              }}
            >
              OUR MISSION
            </p>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#202124",
                marginBottom: "20px",
                fontFamily: "Space Grotesk, sans-serif",
                lineHeight: 1.2,
              }}
            >
              Connecting Farms to
              <br />
              Your Dinner Table
            </h2>
            <p
              style={{
                color: "#5F6368",
                fontSize: "15px",
                lineHeight: 1.8,
                marginBottom: "16px",
              }}
            >
              BemsFarm was founded with a simple mission: make fresh, quality
              Nigerian food accessible to everyone. We partner directly with
              farms across Nigeria to bring you the freshest rice, palm oil,
              garri, beans, and more at fair prices.
            </p>
            <p
              style={{
                color: "#5F6368",
                fontSize: "15px",
                lineHeight: 1.8,
                marginBottom: "28px",
              }}
            >
              We believe every Nigerian deserves access to quality farm produce
              without the hassle of going to the market. Our platform has served
              over 10,000 customers and we're just getting started.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/products")}
              style={{
                backgroundColor: "#2E7D32",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "14px 28px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "15px",
                boxShadow: "0 4px 16px rgba(46,125,50,0.3)",
              }}
            >
              Shop Our Products →
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              height: "400px",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80"
              alt="Nigerian farm"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
            gap: "24px",
          }}
        >
          {stats.map((s, i) => (
  <motion.div key={s.label}
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
    style={{ textAlign: 'center', backgroundColor: 'white', borderRadius: '24px',
      padding: '32px 20px', border: '1px solid #F3F4F6',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
    <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: s.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
      margin: '0 auto 16px' }}>
      {s.icon}
    </div>
    <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', fontWeight: 900,
      color: '#1B4332', marginBottom: '6px' }}>
      {s.value}
    </p>
    <p style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.5px' }}>
      {s.label}
    </p>
  </motion.div>
))}
        </div>

        {/* Team */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p
            style={{
              color: "#F57C00",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            OUR TEAM
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#202124",
              marginBottom: "40px",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            Meet the People Behind BemsFarm
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${isMobile ? 1 : 3}, 1fr)`,
              gap: "24px",
            }}
          >
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #E8EAED",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Photo */}
                <div
                  style={{
                    height: "220px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{
                      display: "none",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#F1F8F1",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "64px",
                      position: "absolute",
                      inset: 0,
                    }}
                  >
                    👤
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#202124",
                      marginBottom: "4px",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      color: "#9AA0A6",
                      fontSize: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    {member.role}
                  </p>

                  {/* Social Icons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    {member.socials.twitter && (
                      <a
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: "#1DA1F2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: 700,
                          textDecoration: "none",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        𝕏
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: "#0A66C2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: 700,
                          textDecoration: "none",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        in
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          textDecoration: "none",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        📸
                      </a>
                    )}
                    {member.socials.facebook && (
                      <a
                        href={member.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: "#1877F2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: 700,
                          textDecoration: "none",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        f
                      </a>
                    )}
                    {member.socials.whatsapp && (
                      <a
                        href={`https://wa.me/${member.socials.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: "#25D366",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          textDecoration: "none",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        💬
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div
          style={{
            backgroundColor: "#F8F9FA",
            borderRadius: "24px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 800,
              marginBottom: "40px",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            Why Choose BemsFarm?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                icon: "🌾",
                title: "Farm Fresh",
                desc: "Direct from Nigerian farms",
              },
              { icon: "🚚", title: "Fast Delivery", desc: "Same-day in Lagos" },
              {
                icon: "💯",
                title: "Quality Assured",
                desc: "100% verified produce",
              },
              {
                icon: "💰",
                title: "Fair Prices",
                desc: "Best prices guaranteed",
              },
              {
                icon: "🔒",
                title: "Secure Payment",
                desc: "Safe and encrypted",
              },
              {
                icon: "📞",
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((v) => (
              <div
                key={v.title}
                style={{ textAlign: "center", padding: "20px" }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#202124",
                    marginBottom: "6px",
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#9AA0A6" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
