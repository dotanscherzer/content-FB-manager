import express from 'express';
import { getNewsletterTopics, triggerMakeWebhook } from '../controllers/newsletterTopicController.js';

const router = express.Router();

router.get('/', getNewsletterTopics);
router.post('/:id/trigger-make', triggerMakeWebhook);

export default router;

