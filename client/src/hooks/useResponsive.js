import { useState, useEffect } from "react";

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let raf;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  return {
    // Device categories
    isPhoneSm: width < 375, // iPhone SE, Galaxy S8
    isPhone: width >= 375 && width < 430, // iPhone 12/14, Pixel 7
    isPhoneLg: width >= 430 && width < 540, // iPhone 14 Pro Max, XR
    isFoldable: width >= 540 && width < 720, // Surface Duo, Galaxy Z Fold
    isTabletSm: width >= 720 && width < 900, // iPad Mini
    isTablet: width >= 900 && width < 1100, // iPad Air, Surface Pro
    isTabletLg: width >= 1100 && width < 1280, // iPad Pro
    isDesktop: width >= 1280,

    // Simplified groups (use these in most components)
    isMobile: width < 640,
    isTabletAny: width >= 640 && width < 1024,
    isDesktopAny: width >= 1024,
    isTouchDevice: width < 1024,

    width,
    // Breakpoint values for dynamic calculations
    cols: width < 480 ? 2 : width < 768 ? 3 : width < 1024 ? 4 : 5,
    padding: width < 480 ? "12px" : width < 768 ? "16px" : "24px",
    gap: width < 480 ? "10px" : width < 768 ? "14px" : "20px",
  };
}
