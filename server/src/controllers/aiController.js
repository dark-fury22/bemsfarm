require('dotenv').config()

const getRecommendations = async (req, res) => {
  try {
    const { cartItems } = req.body
    if (!cartItems || cartItems.length === 0) return res.json({ recommendations: [] })

    const cartSummary = cartItems.map(i => i.product.name).join(', ')

    const prompt = `Nigerian food shopping assistant. Cart has: ${cartSummary}.
Suggest 3 complementary Nigerian food products from this list: Palm Oil, Ofada Rice, Long Grain Rice, Groundnut Oil, Black-eyed Beans, Brown Beans, Garri White, Garri Yellow, Fresh Tomatoes, Dried Crayfish, Cocoyam, Ugu Leaves.
Reply ONLY with JSON array: [{"name":"product","reason":"why (8 words max)","recipe_tip":"Nigerian dish tip (10 words max)"}]`

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 300, temperature: 0.7, return_full_text: false }
        })
      }
    )

    const data = await response.json()
    const text = Array.isArray(data) ? data[0].generated_text : ''

    // Extract JSON from response
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return res.json({ recommendations: getFallbackRecommendations(cartItems) })

    const parsed = JSON.parse(match[0])
    res.json({ recommendations: parsed.slice(0, 3) })

  } catch (error) {
    console.error('AI error:', error.message)
    res.json({ recommendations: getFallbackRecommendations(req.body.cartItems) })
  }
}

// Smart fallback rules (works even without API)
function getFallbackRecommendations(cartItems) {
  const names = cartItems.map(i => i.product.name)
  const rules = [
    { if: ['Ofada Rice', 'Long Grain Rice'],   suggest: [{ name: 'Palm Oil', reason: 'Essential for Nigerian rice dishes', recipe_tip: 'Cook jollof rice with palm oil and tomatoes' }] },
    { if: ['Palm Oil'],                          suggest: [{ name: 'Fresh Tomatoes', reason: 'Perfect pair for stew base', recipe_tip: 'Blend with peppers for red stew' }] },
    { if: ['Fresh Tomatoes'],                    suggest: [{ name: 'Dried Crayfish', reason: 'Adds rich umami to soups', recipe_tip: 'Add to tomato stew for depth' }] },
    { if: ['Black-eyed Beans', 'Brown Beans'],  suggest: [{ name: 'Palm Oil', reason: 'Traditional bean cooking oil', recipe_tip: 'Cook ewa agoyin with palm oil sauce' }] },
    { if: ['Garri (White)', 'Garri (Yellow)'],  suggest: [{ name: 'Dried Crayfish', reason: 'Classic garri soaking combo', recipe_tip: 'Soak garri with crayfish and sugar' }] },
  ]

  for (const rule of rules) {
    if (rule.if.some(item => names.includes(item))) return rule.suggest
  }

  return [
    { name: 'Dried Crayfish', reason: 'Enhances any Nigerian dish', recipe_tip: 'Add to soups and stews for flavor' },
    { name: 'Fresh Tomatoes', reason: 'Base for most Nigerian recipes', recipe_tip: 'Essential for jollof and stew base' },
    { name: 'Palm Oil',       reason: 'Heart of Nigerian cooking', recipe_tip: 'Use in soups, stews and rice dishes' },
  ]
}

module.exports = { getRecommendations }