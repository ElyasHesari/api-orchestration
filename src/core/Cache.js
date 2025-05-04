export default class Cache {
  constructor() {
    this.data = {};
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    return value;
  }

  has(key) {
    return key in this.data;
  }

  // This method can be implemented in the future
  migrate(storage) {
  }

  clear() {
    this.data = {};
  }
}
