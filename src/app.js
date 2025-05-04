import ContentDashboard from "./ui/ContentDashboard.js";

function addDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .dashboard-controls {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      margin-bottom: 20px;
    }
    
    .abort-button {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .abort-button:hover {
      background-color: #c0392b;
    }
    
    .load-button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .load-button:hover {
      background-color: #2980b9;
    }
    
    .clear-cache-button {
      background-color: #9b59b6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .clear-cache-button:hover {
      background-color: #8e44ad;
    }
    
    .log-warn {
      color: #e67e22;
      font-weight: bold;
    }
    
    .log-cache {
      color: #9b59b6;
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
  addDynamicStyles();

  const dashboard = new ContentDashboard("content-dashboard", "request-logs");
  dashboard.init();
});
