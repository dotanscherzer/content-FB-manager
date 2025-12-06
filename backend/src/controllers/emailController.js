import Email from '../models/Email.js';

export const getEmails = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery = {};
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('filter[') && key.endsWith(']')) {
        const field = key.slice(7, -1);
        const value = req.query[key];
        if (value) {
          filterQuery[field] = new RegExp(value, 'i'); // Case-insensitive search
        }
      }
    });

    // Build sort object
    const sortField = sortBy || 'created_at';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    // Try to find emails
    const emails = await Email.find(filterQuery)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Email.countDocuments(filterQuery);

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

