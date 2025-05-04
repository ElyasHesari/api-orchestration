import Cache from "../core/Cache.js";
import Throttler from "../core/Throttler.js";
import RequestManager from "../core/RequestManager.js";
import { API_CONFIG } from "../utils/config.js";
import { ENDPOINTS } from "./endpoints.js";
import { generateUniqueId } from "../utils/helpers.js";

export default class ApiOrchestrator {
  constructor(logger) {
    this.cache = new Cache();
    this.logger = logger;
    this.throttler = new Throttler(API_CONFIG.MAX_CONCURRENT_REQUESTS, logger);
    this.timeoutMs = API_CONFIG.TIMEOUT_MS;
    this.requestManager = new RequestManager(logger);
  }

  async withTimeout(promise, requestId) {
    const timeout = new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        if (requestId) {
          this.requestManager.abort(requestId);
        }
        reject(
          new Error(`Request timeout after ${this.timeoutMs / 1000} seconds`)
        );
      }, this.timeoutMs);

      promise.finally(() => clearTimeout(timeoutId));
    });

    return Promise.race([promise, timeout]);
  }

  async fetchWithOptions(url, options = {}) {
    if (this.cache.has(url) && !options.bypassCache) {
      this.logger.log(`Using cached data for: ${url}`, "cache");
      return this.cache.get(url);
    }

    const requestId = generateUniqueId("req");

    return this.throttler.add(async () => {
      this.logger.log(`Requesting: ${url} (ID: ${requestId})`, "fetch");

      try {
        const controller = this.requestManager.createController(requestId);

        const fetchPromise = fetch(url, {
          ...options,
          signal: controller.signal,
        });

        const response = await this.withTimeout(fetchPromise, requestId);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        if (!options.noCache) {
          this.cache.set(url, data);
        }

        return data;
      } catch (error) {
        if (error.name === "AbortError") {
          this.logger.log(`Request ${requestId} was aborted: ${url}`, "warn");
          throw new Error(`Request was cancelled`);
        } else {
          this.logger.log(`Failed to fetch ${url}: ${error.message}`, "error");
          throw error;
        }
      } finally {
        this.requestManager.removeController(requestId);
      }
    });
  }

  abortAllRequests() {
    return this.requestManager.abortAll();
  }

  async fetchAllPosts() {
    const response = await this.fetchWithOptions(ENDPOINTS.POSTS);
    return response.posts || [];
  }

  async fetchPostDetails(postId) {
    return this.fetchWithOptions(ENDPOINTS.POST_DETAILS(postId));
  }

  async fetchPostComments(postId) {
    const response = await this.fetchWithOptions(
      ENDPOINTS.POST_COMMENTS(postId)
    );
    return response.comments || [];
  }

  async fetchTopPosts(count = 5) {
    try {
      const allPosts = await this.fetchAllPosts();

      const topPosts = [...allPosts]
        .sort((a, b) => b.reactions.likes - a.reactions.likes)
        .slice(0, count);

      const postsWithDetails = await Promise.all(
        topPosts.map(async (post) => {
          try {
            const [details, comments] = await Promise.all([
              this.fetchPostDetails(post.id),
              this.fetchPostComments(post.id),
            ]);

            return {
              ...details,
              comments,
            };
          } catch (error) {
            this.logger.log(
              `Error fetching details for post ${post.id}: ${error.message}`,
              "error"
            );
            return {
              ...post,
              comments: [],
            };
          }
        })
      );

      return postsWithDetails;
    } catch (error) {
      this.logger.log(`Error in fetchTopPosts: ${error.message}`, "error");
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
    this.logger.log("Cache cleared", "info");
  }
}
