import { useState, useEffect } from 'react';
import { fbPostService } from '../services/api';
import './FbPostsList.css';

const FbPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchPosts(pagination.page);
  }, []);

  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      const response = await fbPostService.getFbPosts(page, pagination.limit);
      setPosts(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בטעינת הפוסטים');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPosts(newPage);
    }
  };

  if (loading) {
    return <div className="loading">טוען פוסטים...</div>;
  }

  if (error) {
    return <div className="error">שגיאה: {error}</div>;
  }

  return (
    <div className="fb-posts-list">
      <h2>פוסטים בפייסבוק ({pagination.total})</h2>
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <h3>{post.post_title || 'ללא כותרת'}</h3>
              {post.topic_title && <span className="topic-title">{post.topic_title}</span>}
            </div>
            {post.image && (
              <div className="post-image">
                <img 
                  src={`data:image/jpeg;base64,${post.image}`} 
                  alt={post.post_title || 'Post image'} 
                />
              </div>
            )}
            <div className="post-info">
              <p><strong>ID פוסט:</strong> {post.fb_post_id}</p>
              <p><strong>Email ID:</strong> {post.email_id}</p>
              <p><strong>נוצר ב:</strong> {post.created_at ? new Date(post.created_at).toLocaleString('he-IL') : 'לא זמין'}</p>
            </div>
            {post.post_text && (
              <div className="post-text">
                <p>{post.post_text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(pagination.page - 1)} 
          disabled={pagination.page === 1}
        >
          קודם
        </button>
        <span>עמוד {pagination.page} מתוך {pagination.totalPages}</span>
        <button 
          onClick={() => handlePageChange(pagination.page + 1)} 
          disabled={pagination.page === pagination.totalPages}
        >
          הבא
        </button>
      </div>
    </div>
  );
};

export default FbPostsList;

