import FbPost from '../models/FbPost.js';

export const getFbPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await FbPost.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await FbPost.countDocuments();
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

