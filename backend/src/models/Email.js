import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  Subject: {
    type: String
  },
  sent_at: {
    type: Date
  },
  html_body: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  Sender_name: {
    type: String
  },
  sender_email: {
    type: String
  }
}, {
  collection: 'Email',
  timestamps: false
});

export default mongoose.model('Email', emailSchema);

