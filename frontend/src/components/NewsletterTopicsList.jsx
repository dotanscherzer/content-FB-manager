import { useState, useEffect } from 'react';
import { newsletterTopicService } from '../services/api';
import './NewsletterTopicsList.css';

const NewsletterTopicsList = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [triggeringId, setTriggeringId] = useState(null);
  const [triggerMessage, setTriggerMessage] = useState(null);

  useEffect(() => {
    fetchTopics(pagination.page);
  }, []);

  const fetchTopics = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsletterTopicService.getNewsletterTopics(page, pagination.limit);
      
      if (response && response.data) {
        setTopics(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } else {
        setError('תגובה לא תקינה מהשרת');
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
      const errorMessage = err.response?.data?.error || err.message || 'שגיאה בטעינת הנושאים';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTopics(newPage);
    }
  };

  const handleTriggerMake = async (topicId) => {
    try {
      setTriggeringId(topicId);
      setTriggerMessage(null);
      const response = await newsletterTopicService.triggerMakeWebhook(topicId);
      setTriggerMessage({ type: 'success', text: 'תהליך מייק הופעל בהצלחה!' });
    } catch (err) {
      setTriggerMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'שגיאה בהפעלת תהליך מייק' 
      });
    } finally {
      setTriggeringId(null);
      setTimeout(() => setTriggerMessage(null), 5000);
    }
  };

  if (loading) {
    return <div className="loading">טוען נושאים...</div>;
  }

  if (error) {
    return <div className="error">שגיאה: {error}</div>;
  }

  return (
    <div className="newsletter-topics-list">
      <h2>נושאי ניוזלטר ({pagination.total})</h2>
      {triggerMessage && (
        <div className={`trigger-message ${triggerMessage.type}`}>
          {triggerMessage.text}
        </div>
      )}
      <div className="topics-container">
        {topics.map((topic) => (
          <div key={topic._id} className="topic-card">
            <div className="topic-header">
              <h3>{topic.topic_title || 'ללא כותרת'}</h3>
              <button
                className="trigger-button"
                onClick={() => handleTriggerMake(topic._id)}
                disabled={triggeringId === topic._id}
              >
                {triggeringId === topic._id ? 'מפעיל...' : 'הפעל תהליך מייק'}
              </button>
            </div>
            <div className="topic-info">
              <p><strong>מפתח נושא:</strong> {topic.topic_key}</p>
              <p><strong>Email ID:</strong> {topic.email_id}</p>
              <p><strong>FB Post ID:</strong> {topic.fb_post_id || 'לא זמין'}</p>
              <p><strong>נוצר ב:</strong> {topic.created_at ? new Date(topic.created_at).toLocaleString('he-IL') : 'לא זמין'}</p>
            </div>
            <div className="topic-details">
              <div className="topic-score">
                <span className="score-label">ציון:</span>
                <span className="score-value">{topic.topic_score || 'N/A'}</span>
              </div>
              <div className="topic-type">
                <span className="type-label">סוג:</span>
                <span className="type-value">{topic.topic_type || 'לא זמין'}</span>
              </div>
            </div>
            {topic.email_subject && (
              <div className="email-subject">
                <strong>נושא אימייל:</strong> {topic.email_subject}
              </div>
            )}
            {topic.topic_summary && (
              <div className="topic-summary">
                <strong>סיכום:</strong>
                <p>{topic.topic_summary}</p>
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

export default NewsletterTopicsList;

