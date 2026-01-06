/**
 * Input Validation and Sanitization Utilities
 * Protects against XSS, SQL injection, and other malicious inputs
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
  if (!input || typeof input !== 'string') return '';
  
  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length to prevent abuse
  sanitized = sanitized.substring(0, 1000);
  
  return sanitized;
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number format (US and international)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return true; // Phone is optional
  
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+\.]/g, '');
  
  // Check if it's a valid number (10-15 digits)
  return /^\d{10,15}$/.test(cleaned);
}

/**
 * Validate name field (only letters, spaces, hyphens, apostrophes)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid name format
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') return false;
  
  // Allow letters, spaces, hyphens, apostrophes, and accented characters
  const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]+$/;
  
  return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
}

/**
 * Validate message content
 * @param {string} message - Message to validate
 * @returns {boolean} - True if valid message
 */
export function validateMessage(message) {
  if (!message || typeof message !== 'string') return false;
  
  // Message should be between 10 and 5000 characters
  const trimmed = message.trim();
  return trimmed.length >= 10 && trimmed.length <= 5000;
}

/**
 * Sanitize form data object
 * @param {Object} formData - Form data object to sanitize
 * @returns {Object} - Sanitized form data
 */
export function sanitizeFormData(formData) {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate entire contact form
 * @param {Object} formData - Form data object
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export function validateContactForm(formData) {
  const errors = {};
  
  // Validate name
  if (!formData.name || !validateName(formData.name)) {
    errors.name = 'Please enter a valid name (2-100 characters, letters only)';
  }
  
  // Validate email
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate phone (optional but must be valid if provided)
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  // Validate message
  if (!formData.message || !validateMessage(formData.message)) {
    errors.message = 'Please enter a message (10-5000 characters)';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Detect potential spam patterns
 * @param {Object} formData - Form data to check
 * @returns {boolean} - True if spam detected
 */
export function detectSpam(formData) {
  const message = (formData.message || '').toLowerCase();
  const name = (formData.name || '').toLowerCase();
  const email = (formData.email || '').toLowerCase();
  
  // Spam keywords
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'lottery', 'prize', 'winner',
    'click here', 'buy now', 'limited time', 'act now',
    'cryptocurrency', 'bitcoin', 'investment opportunity',
    'work from home', 'make money fast', 'free money'
  ];
  
  // Check for spam keywords
  for (const keyword of spamKeywords) {
    if (message.includes(keyword) || name.includes(keyword)) {
      return true;
    }
  }
  
  // Check for excessive links
  const linkCount = (message.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    return true;
  }
  
  // Check for suspicious email domains
  const suspiciousDomains = ['.ru', '.cn', 'tempmail', 'throwaway', 'guerrillamail'];
  for (const domain of suspiciousDomains) {
    if (email.includes(domain)) {
      return true;
    }
  }
  
  // Check for excessive repetition
  const words = message.split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
    return true; // Less than 30% unique words indicates spam
  }
  
  return false;
}

