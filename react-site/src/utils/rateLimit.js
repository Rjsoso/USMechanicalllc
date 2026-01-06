/**
 * Client-side Rate Limiting Utility
 * Prevents form submission abuse and spam
 */

const RATE_LIMIT_KEY = 'formSubmissions';
const MAX_SUBMISSIONS = 3; // Maximum submissions allowed
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes between submissions

/**
 * Get submission history from localStorage
 * @returns {Array} - Array of submission timestamps
 */
function getSubmissionHistory() {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored);
    
    // Filter out old submissions (outside time window)
    const now = Date.now();
    return history.filter(timestamp => now - timestamp < TIME_WINDOW);
  } catch (error) {
    console.error('Error reading submission history:', error);
    return [];
  }
}

/**
 * Save submission history to localStorage
 * @param {Array} history - Array of submission timestamps
 */
function saveSubmissionHistory(history) {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving submission history:', error);
  }
}

/**
 * Check if user can submit the form
 * @returns {Object} - { allowed: boolean, reason: string, timeUntilNext: number }
 */
export function canSubmitForm() {
  const history = getSubmissionHistory();
  const now = Date.now();
  
  // Check if user has exceeded max submissions
  if (history.length >= MAX_SUBMISSIONS) {
    const oldestSubmission = Math.min(...history);
    const timeUntilReset = TIME_WINDOW - (now - oldestSubmission);
    
    return {
      allowed: false,
      reason: `You've reached the maximum number of submissions (${MAX_SUBMISSIONS}) per hour. Please try again later.`,
      timeUntilNext: timeUntilReset
    };
  }
  
  // Check cooldown period (time between submissions)
  if (history.length > 0) {
    const lastSubmission = Math.max(...history);
    const timeSinceLastSubmission = now - lastSubmission;
    
    if (timeSinceLastSubmission < COOLDOWN_PERIOD) {
      const timeUntilNext = COOLDOWN_PERIOD - timeSinceLastSubmission;
      
      return {
        allowed: false,
        reason: 'Please wait a few minutes between submissions.',
        timeUntilNext: timeUntilNext
      };
    }
  }
  
  return {
    allowed: true,
    reason: null,
    timeUntilNext: 0
  };
}

/**
 * Record a form submission
 */
export function recordSubmission() {
  const history = getSubmissionHistory();
  history.push(Date.now());
  saveSubmissionHistory(history);
}

/**
 * Format time remaining in human-readable format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export function formatTimeRemaining(milliseconds) {
  const minutes = Math.ceil(milliseconds / 60000);
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

/**
 * Clear submission history (for testing/admin purposes)
 */
export function clearSubmissionHistory() {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch (error) {
    console.error('Error clearing submission history:', error);
  }
}

/**
 * Get remaining submissions count
 * @returns {number} - Number of submissions remaining
 */
export function getRemainingSubmissions() {
  const history = getSubmissionHistory();
  return Math.max(0, MAX_SUBMISSIONS - history.length);
}

