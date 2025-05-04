import { truncateText } from "../utils/helpers.js";

export default class PostRenderer {
  /**
   * created HTML for displaying a single post
   * @param {Object} post Post object
   * @param {Object} options settings for display
   * @returns {string} post HTML
   */
  static renderPost(post, options = {}) {
    const { truncateBody = false, maxLength = 200 } = options;

    const postBody = truncateBody
      ? truncateText(post.body, maxLength)
      : post.body;

    const commentsHTML = post.comments
      .map(
        (comment) => `
          <div class="comment">
            <div class="comment-header">
              <strong>${comment.user?.username || "Anonymous"}</strong>
            </div>
            <div class="comment-body">${comment.body}</div>
          </div>
        `
      )
      .join("");

    return `
          <div class="post" data-post-id="${post.id}">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
              <span class="post-reactions">👍${post.reactions.likes}
               👎${post.reactions.dislikes} reactions</span>
              <span class="post-tags">${(post.tags || [])
                .map((tag) => `#${tag}`)
                .join(" ")}</span>
            </div>
            <div class="post-body">${postBody}</div>
            <div class="post-comments">
              <h3>Comments (${post.comments.length})</h3>
              ${commentsHTML.length ? commentsHTML : "<p>No comments yet.</p>"}
            </div>
          </div>
        `;
  }

  /**
   * Created HTML for displaying a list of posts
   * @param {Array} posts Array of posts
   * @param {Object} options Settings for display
   * @returns {string} Posts list HTML
   */
  static renderPostsList(posts, options = {}) {
    if (!posts || posts.length === 0) {
      return '<div class="no-posts">No posts found</div>';
    }

    const { title = "Posts" } = options;
    const postsHTML = posts
      .map((post) => this.renderPost(post, options))
      .join("");

    return `
          <h1>${title}</h1>
          <div class="posts-container">
            ${postsHTML}
          </div>
        `;
  }
}
