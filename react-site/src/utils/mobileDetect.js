/**
 * Mobile detection and device utilities
 * Provides helpers for detecting mobile devices and screen characteristics
 */

/**
 * Detect if the current device is a mobile device
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detect if the current device is iOS
 * @returns {boolean} True if iOS device
 */
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Detect if the current device is Android
 * @returns {boolean} True if Android device
 */
export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Get current screen size information and device category
 * @returns {Object} Screen dimensions and device category flags
 */
export const getScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isSmallPhone: window.innerWidth <= 375,
    isPhone: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  };
};

/**
 * Detect if the device has a notch (iPhone X and newer)
 * @returns {boolean} True if device has notch/safe areas
 */
export const hasNotch = () => {
  // Check if CSS environment variables are supported
  if (!CSS.supports('padding-top: env(safe-area-inset-top)')) {
    return false;
  }
  
  // Create a temporary element to test safe area insets
  const div = document.createElement('div');
  div.style.paddingTop = 'env(safe-area-inset-top)';
  document.body.appendChild(div);
  const hasNotchValue = parseInt(window.getComputedStyle(div).paddingTop) > 0;
  document.body.removeChild(div);
  return hasNotchValue;
};

/**
 * Check if device supports touch events
 * @returns {boolean} True if touch is supported
 */
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Get device pixel ratio for high-DPI displays
 * @returns {number} Device pixel ratio
 */
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

/**
 * Check if device prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if device is in standalone mode (PWA)
 * @returns {boolean} True if running as standalone app
 */
export const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

/**
 * Get safe area insets (for notch/home indicator)
 * @returns {Object} Safe area inset values
 */
export const getSafeAreaInsets = () => {
  // Create temporary div to measure safe areas
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.paddingTop = 'env(safe-area-inset-top)';
  div.style.paddingRight = 'env(safe-area-inset-right)';
  div.style.paddingBottom = 'env(safe-area-inset-bottom)';
  div.style.paddingLeft = 'env(safe-area-inset-left)';
  
  document.body.appendChild(div);
  const styles = window.getComputedStyle(div);
  
  const insets = {
    top: parseInt(styles.paddingTop) || 0,
    right: parseInt(styles.paddingRight) || 0,
    bottom: parseInt(styles.paddingBottom) || 0,
    left: parseInt(styles.paddingLeft) || 0
  };
  
  document.body.removeChild(div);
  return insets;
};

/**
 * Debounce function for resize/scroll handlers
 * @param {Function} func Function to debounce
 * @param {number} wait Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for high-frequency events
 * @param {Function} func Function to throttle
 * @param {number} limit Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  isMobileDevice,
  isIOS,
  isAndroid,
  getScreenSize,
  hasNotch,
  isTouchDevice,
  getDevicePixelRatio,
  prefersReducedMotion,
  isStandalone,
  getSafeAreaInsets,
  debounce,
  throttle
};
