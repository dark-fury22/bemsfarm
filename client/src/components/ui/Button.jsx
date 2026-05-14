import { motion } from 'framer-motion'

const variants = {
  primary:   { bg: '#3D6B2E', color: 'white',   shadow: 'rgba(61,107,46,0.35)'  },
  accent:    { bg: '#E07B39', color: 'white',   shadow: 'rgba(224,123,57,0.35)' },
  outline:   { bg: 'transparent', color: '#3D6B2E', shadow: 'none'              },
  ghost:     { bg: 'rgba(61,107,46,0.08)', color: '#3D6B2E', shadow: 'none'     },
}

export default function Button({ children, variant = 'primary', onClick, disabled, fullWidth, size = 'md', style = {} }) {
  const v = variants[variant]
  const sizes = { sm: '10px 16px', md: '14px 24px', lg: '18px 32px' }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: v.bg,
        color: v.color,
        border: variant === 'outline' ? '2px solid #3D6B2E' : 'none',
        borderRadius: '16px',
        padding: sizes[size],
        fontSize: size === 'sm' ? '13px' : size === 'lg' ? '17px' : '15px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        boxShadow: v.shadow !== 'none' ? `0 8px 24px ${v.shadow}` : 'none',
        opacity: disabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style
      }}>
      {children}
    </motion.button>
  )
}