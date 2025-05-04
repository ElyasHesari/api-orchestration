import Logger from "../core/Logger.js";
import ApiOrchestrator from "../api/ApiOrchestrator.js";
import PostRenderer from "./PostRenderer.js";
import {
  createButton,
  createLoadingElement,
  createErrorElement,
} from "./UIComponents.js";
import { UI_CONFIG } from "../utils/config.js";

export default class ContentDashboard {
  constructor(containerId, logsId) {
    this.container = document.getElementById(containerId);
    this.logger = new Logger(logsId);
    this.orchestrator = new ApiOrchestrator(this.logger);
    this.isLoading = false;
    this.setupControls();
  }

  setupControls() {
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "dashboard-controls";

    const loadButton = createButton(
      "Loading Top Posts",
      () => this.init(),
      "load-button"
    );

    const abortButton = createButton(
      "Abort All Requests",
      () => this.abortAllRequests(),
      "abort-button"
    );

    const clearCacheButton = createButton(
      "Clear Cache",
      () => {
        this.orchestrator.clearCache();
        this.init();
      },
      "clear-cache-button"
    );

    controlsContainer.appendChild(loadButton);
    controlsContainer.appendChild(abortButton);
    controlsContainer.appendChild(clearCacheButton);

    const header = document.querySelector("header");
    if (header) {
      header.appendChild(controlsContainer);
    }
  }

  showLoading() {
    this.isLoading = true;
    this.container.innerHTML = "";
    this.container.appendChild(createLoadingElement("Loading top posts..."));
  }

  showError(message) {
    this.container.innerHTML = "";
    this.container.appendChild(createErrorElement(message));
  }

  abortAllRequests() {
    const cancelledCount = this.orchestrator.abortAllRequests();
    if (cancelledCount > 0) {
      this.isLoading = false;
      this.showError("All active requests have been cancelled.");
    } else {
      this.logger.log("There isn't any activee request", "info");
    }
  }

  renderPosts(posts) {
    this.isLoading = false;
    this.container.innerHTML = PostRenderer.renderPostsList(posts, {
      title: `Top ${UI_CONFIG.POSTS_PER_PAGE} Most Popular Posts`,
    });
  }

  handleError(error) {
    this.isLoading = false;
    this.logger.log(`Dashboard Error: ${error.message}`, "error");
    this.showError(error.message || "Failed to load posts");
  }

  async init() {
    try {
      this.showLoading();
      this.logger.log("Dashboard initialized. Fetching top posts...", "info");
      const topPosts = await this.orchestrator.fetchTopPosts(
        UI_CONFIG.POSTS_PER_PAGE
      );
      this.logger.log(
        `Successfully loaded ${topPosts.length} top posts`,
        "info"
      );
      this.renderPosts(topPosts);
    } catch (error) {
      this.handleError(error);
    }
  }

  async reload() {
    this.orchestrator.abortAllRequests();
    await this.init();
  }
}
