import { API_CONFIG } from "../utils/config.js";

export const ENDPOINTS = {
  POSTS: `${API_CONFIG.BASE_URL}/posts`,
  POST_DETAILS: (id) => `${API_CONFIG.BASE_URL}/posts/${id}`,
  POST_COMMENTS: (id) => `${API_CONFIG.BASE_URL}/comments/post/${id}`,
};
