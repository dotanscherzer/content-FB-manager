import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

export const emailService = {
  getEmails: (page = 1, limit = 20, options = {}) => {
    const params = { page, limit };
    if (options.sortBy) {
      params.sortBy = options.sortBy;
      params.sortOrder = options.sortOrder || 'desc';
    }
    if (options.filters) {
      Object.keys(options.filters).forEach(key => {
        if (options.filters[key]) {
          params[`filter[${key}]`] = options.filters[key];
        }
      });
    }
    const config = { params };
    if (options.signal) {
      config.signal = options.signal;
    }
    return api.get('/api/emails', config);
  },
};

export const fbPostService = {
  getFbPosts: (page = 1, limit = 20, options = {}) => {
    const params = { page, limit };
    if (options.sortBy) {
      params.sortBy = options.sortBy;
      params.sortOrder = options.sortOrder || 'desc';
    }
    if (options.filters) {
      Object.keys(options.filters).forEach(key => {
        if (options.filters[key]) {
          params[`filter[${key}]`] = options.filters[key];
        }
      });
    }
    const config = { params };
    if (options.signal) {
      config.signal = options.signal;
    }
    return api.get('/api/fb-posts', config);
  },
};

export const newsletterTopicService = {
  getNewsletterTopics: (page = 1, limit = 20, options = {}) => {
    const params = { page, limit };
    if (options.sortBy) {
      params.sortBy = options.sortBy;
      params.sortOrder = options.sortOrder || 'desc';
    }
    if (options.filters) {
      Object.keys(options.filters).forEach(key => {
        if (options.filters[key]) {
          params[`filter[${key}]`] = options.filters[key];
        }
      });
    }
    const config = { params };
    if (options.signal) {
      config.signal = options.signal;
    }
    return api.get('/api/newsletter-topics', config);
  },
  triggerMakeWebhook: (id) => {
    return api.post(`/api/newsletter-topics/${id}/trigger-make`);
  },
};

export default api;

