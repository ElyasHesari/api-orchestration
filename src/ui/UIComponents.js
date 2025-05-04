/**
 * create Button
 * @param {string} text button text
 * @param {Function} onClick click event handler
 * @param {string} className custom class name for the button
 * @returns {HTMLButtonElement} element button
 */
export function createButton(text, onClick, className = "") {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.addEventListener("click", onClick);
  return button;
}

/**
 * create Loading Element
 * @param {string} message loading message
 * @returns {HTMLDivElement} loading element
 */
export function createLoadingElement(message = "Loading...") {
  const loadingElement = document.createElement("div");
  loadingElement.className = "loading";
  loadingElement.textContent = message;
  return loadingElement;
}

/**
 * Create Error Element
 * @param {string} message error message
 * @returns {HTMLDivElement} error element
 */
export function createErrorElement(message) {
  const errorElement = document.createElement("div");
  errorElement.className = "error";
  errorElement.textContent = `Error: ${message}`;
  return errorElement;
}
