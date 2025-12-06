import mongoose from 'mongoose';

const newsletterTopicSchema = new mongoose.Schema({
  topic_key: {
    type: String
  },
  email_id: {
    type: String
  },
  created_at: {
    type: Date
  },
  email_subject: {
    type: String
  },
  topic_score: {
    type: Number
  },
  topic_summary: {
    type: String
  },
  topic_title: {
    type: String
  },
  topic_type: {
    type: String
  },
  fb_post_id: {
    type: String
  }
}, {
  collection: 'newsletter_topics',
  timestamps: false
});

export default mongoose.model('NewsletterTopic', newsletterTopicSchema);

