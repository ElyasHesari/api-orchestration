export default class Logger {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.maxLogs = 100;
    this.logs = [];
  }

  log(message, type = "info") {
    this.logs.push({ message, type, timestamp: new Date() });

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const logEntry = document.createElement("div");
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    this.container.appendChild(logEntry);
    this.container.scrollTop = this.container.scrollHeight;

    console[type === "error" ? "error" : type === "warn" ? "warn" : "log"](
      message
    );
  }

  clear() {
    this.logs = [];
    this.container.innerHTML = "";
  }

  exportLogs() {
    return this.logs
      .map(
        (log) =>
          `[${log.timestamp.toLocaleString()}] [${log.type}] ${log.message}`
      )
      .join("\n");
  }
}
