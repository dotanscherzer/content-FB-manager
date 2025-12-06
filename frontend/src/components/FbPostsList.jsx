import { useState, useEffect } from 'react';
import { fbPostService } from '../services/api';
import FilterPanel from './FilterPanel';
import './FbPostsList.css';

const FbPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchPosts(1); // Reset to page 1 when filters/sort change
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    if (pagination.page > 0) {
      fetchPosts(pagination.page);
    }
  }, [pagination.page]);

  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fbPostService.getFbPosts(page, pagination.limit, { filters, sortBy, sortOrder });
      
      if (response && response.data) {
        setPosts(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } else {
        setError('תגובה לא תקינה מהשרת');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      const errorMessage = err.response?.data?.error || err.message || 'שגיאה בטעינת הפוסטים';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return <div className="loading">טוען פוסטים...</div>;
  }

  if (error) {
    return <div className="error">שגיאה: {error}</div>;
  }

  const sortOptions = [
    { value: 'created_at', label: 'תאריך יצירה' },
    { value: 'post_title', label: 'כותרת' },
    { value: 'topic_title', label: 'נושא' }
  ];

  const filterFields = [
    {
      name: 'post_title',
      label: 'כותרת',
      type: 'text',
      placeholder: 'חפש בכותרת'
    },
    {
      name: 'topic_title',
      label: 'נושא',
      type: 'text',
      placeholder: 'חפש בנושא'
    }
  ];

  return (
    <div className="fb-posts-list">
      <div className="fb-posts-list-header">
        <h2>פוסטים בפייסבוק ({pagination.total})</h2>
        <FilterPanel
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
          filterFields={filterFields}
        />
      </div>
      {posts.length === 0 ? (
        <div className="no-data">אין פוסטים להצגה</div>
      ) : (
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
      )}
      {pagination.totalPages > 0 && (
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
      )}
    </div>
  );
};

export default FbPostsList;

