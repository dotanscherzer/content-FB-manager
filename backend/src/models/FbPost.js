import mongoose from 'mongoose';

const fbPostSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.Buffer
  },
  email_id: {
    type: String
  },
  post_text: {
    type: String
  },
  created_at: {
    type: Date
  },
  fb_post_id: {
    type: String
  },
  post_title: {
    type: String
  },
  topic_title: {
    type: String
  }
}, {
  collection: 'fb_posts',
  timestamps: false
});

export default mongoose.model('FbPost', fbPostSchema);

