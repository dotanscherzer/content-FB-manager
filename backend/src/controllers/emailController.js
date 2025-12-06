import Email from '../models/Email.js';

export const getEmails = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Try to find emails
    const emails = await Email.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Email.countDocuments();

    console.log(`Found ${emails.length} emails out of ${total} total`);
    
    // Log sample email data for debugging
    if (emails.length > 0) {
      console.log('Sample email:', {
        id: emails[0]._id,
        hasBody: !!emails[0].body,
        hasHtmlBody: !!emails[0].html_body,
        bodyLength: emails[0].body?.length || 0,
        htmlBodyLength: emails[0].html_body?.length || 0
      });
    }

    res.json({
      data: emails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: error.message });
  }
};

