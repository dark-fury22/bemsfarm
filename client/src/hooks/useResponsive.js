import { useState, useEffect } from 'react'

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    let timeout
    const handler = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setWidth(window.innerWidth), 50)
    }
    window.addEventListener('resize', handler)
    return () => { window.removeEventListener('resize', handler); clearTimeout(timeout) }
  }, [])

  return {
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  }
}