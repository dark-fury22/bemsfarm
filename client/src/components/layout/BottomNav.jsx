import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'

const C = { primary: '#3D6B2E', muted: '#8B6F47', border: '#E8DDD0', surface: '#FFFBF5' }

const navItems = [
  { icon: '🏠', label: 'Home',     path: '/home'     },
  { icon: '🛍️', label: 'Products', path: '/products' },
  { icon: '🛒', label: 'Cart',     path: '/cart'     },
  { icon: '📋', label: 'Orders',   path: '/orders'   },
  { icon: '👤', label: 'Profile',  path: '/profile'  },
]

export default function BottomNav() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { cartCount } = useCart()

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,251,245,0.96)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid ${C.border}`, padding: '8px 8px 20px', display: 'flex', justifyContent: 'space-around', zIndex: 1000, boxShadow: '0 -4px 24px rgba(0,0,0,0.06)' }}>
      {navItems.map(item => {
        const active = location.pathname === item.path
        return (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate(item.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px', position: 'relative', minWidth: '52px' }}>

            {/* Active pill */}
            {active && (
              <motion.div
                layoutId="navPill"
                style={{ position: 'absolute', inset: 0, backgroundColor: `${C.primary}14`, borderRadius: '14px' }}
              />
            )}

            {/* Icon with cart badge */}
            <div style={{ position: 'relative', fontSize: '22px' }}>
              {item.icon}
              {item.label === 'Cart' && cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ position: 'absolute', top: '-6px', right: '-8px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#E07B39', color: 'white', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                  {cartCount}
                </motion.span>
              )}
            </div>

            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 400, color: active ? C.primary : C.muted }}>
              {item.label}
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}