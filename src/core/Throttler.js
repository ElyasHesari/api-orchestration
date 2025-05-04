export default class Throttler {
  constructor(maxConcurrent = 3, logger) {
    this.maxConcurrent = maxConcurrent;
    this.currentConcurrent = 0;
    this.queue = [];
    this.logger = logger;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        this.currentConcurrent++;
        this.logger?.log(
          `Active requests: ${this.currentConcurrent}, Queue: ${this.queue.length}`,
          "info"
        );
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.currentConcurrent--;
          this.executeNext();
        }
      };

      if (this.currentConcurrent < this.maxConcurrent) {
        execute();
      } else {
        this.logger?.log(
          `Request queued. Current active: ${this.currentConcurrent}`,
          "info"
        );
        this.queue.push(execute);
      }
    });
  }

  executeNext() {
    if (this.queue.length > 0 && this.currentConcurrent < this.maxConcurrent) {
      const nextFn = this.queue.shift();
      nextFn();
    }
  }

  setMaxConcurrent(max) {
    this.maxConcurrent = max;
    while (
      this.currentConcurrent < this.maxConcurrent &&
      this.queue.length > 0
    ) {
      this.executeNext();
    }
  }

  clearQueue() {
    const count = this.queue.length;
    this.queue = [];
    return count;
  }
}
