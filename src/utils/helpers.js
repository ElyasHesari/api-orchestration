/**
 * Generate a unique identifier
 * @returns {string} unique identifier
 */
export function generateUniqueId(prefix = "") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format dates locally
 * @param {Date} date date
 * @returns {string} date formaqtted
 */
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleString();
}

/**
 * Shorten text by adding three dots
 * @param {string} text input text
 * @param {number} maxLength maximum length of the text
 * @returns {string} shortened text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
}
