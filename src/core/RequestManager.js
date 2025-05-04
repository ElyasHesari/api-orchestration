export default class RequestManager {
  constructor(logger) {
    this.controllers = new Map();
    this.logger = logger;
  }

  createController(requestId) {
    const controller = new AbortController();
    this.controllers.set(requestId, controller);
    return controller;
  }

  abort(requestId) {
    const controller = this.controllers.get(requestId);
    if (controller) {
      controller.abort();
      this.controllers.delete(requestId);
      this.logger?.log(`Request ${requestId} was aborted`, "warn");
      return true;
    }
    return false;
  }

  abortAll() {
    const count = this.controllers.size;
    this.controllers.forEach((controller) => {
      controller.abort();
    });
    this.controllers.clear();
    this.logger?.log(`Cancelled ${count} active requests`, "warn");
    return count;
  }

  removeController(requestId) {
    this.controllers.delete(requestId);
  }

  isActive(requestId) {
    return this.controllers.has(requestId);
  }

  activeRequestsCount() {
    return this.controllers.size;
  }

  getActiveRequestIds() {
    return Array.from(this.controllers.keys());
  }
}
