import FbPost from '../models/FbPost.js';

export const getFbPosts = async (req, res) => {
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
          filterQuery[field] = new RegExp(value, 'i');
        }
      }
    });

    // Build sort object
    const sortField = sortBy || 'created_at';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    const posts = await FbPost.find(filterQuery)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await FbPost.countDocuments(filterQuery);
    console.log(`Found ${posts.length} posts out of ${total} total`);

    // Convert Binary image to base64 string
    const postsWithBase64 = posts.map(post => {
      if (post.image) {
        let imageBase64 = null;
        if (Buffer.isBuffer(post.image)) {
          imageBase64 = post.image.toString('base64');
        } else if (post.image.buffer && Buffer.isBuffer(post.image.buffer)) {
          imageBase64 = post.image.buffer.toString('base64');
        } else if (typeof post.image === 'string') {
          // Already base64 string
          imageBase64 = post.image;
        }
        return {
          ...post,
          image: imageBase64
        };
      }
      return post;
    });

    res.json({
      data: postsWithBase64,
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

