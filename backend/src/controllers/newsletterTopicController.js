import NewsletterTopic from '../models/NewsletterTopic.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getNewsletterTopics = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const topics = await NewsletterTopic.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NewsletterTopic.countDocuments();

    res.json({
      data: topics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const triggerMakeWebhook = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await NewsletterTopic.findById(id);
    
    if (!topic) {
      return res.status(404).json({ error: 'Newsletter topic not found' });
    }

    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!makeWebhookUrl) {
      return res.status(500).json({ error: 'Make webhook URL not configured' });
    }

    // Send the topic data to Make webhook
    const response = await axios.post(makeWebhookUrl, {
      ...topic.toObject()
    });

    res.json({
      success: true,
      message: 'Make webhook triggered successfully',
      data: topic,
      webhookResponse: response.data
    });
  } catch (error) {
    console.error('Error triggering Make webhook:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
};

