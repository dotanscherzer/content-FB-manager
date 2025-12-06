import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const emailService = {
  getEmails: (page = 1, limit = 20) => {
    return api.get('/api/emails', { params: { page, limit } });
  },
};

export const fbPostService = {
  getFbPosts: (page = 1, limit = 20) => {
    return api.get('/api/fb-posts', { params: { page, limit } });
  },
};

export const newsletterTopicService = {
  getNewsletterTopics: (page = 1, limit = 20) => {
    return api.get('/api/newsletter-topics', { params: { page, limit } });
  },
  triggerMakeWebhook: (id) => {
    return api.post(`/api/newsletter-topics/${id}/trigger-make`);
  },
};

export default api;

