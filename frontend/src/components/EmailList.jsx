import { useState, useEffect } from 'react';
import { emailService } from '../services/api';
import './EmailList.css';

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchEmails(pagination.page);
  }, []);

  const fetchEmails = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailService.getEmails(page, pagination.limit);
      
      // Check if response structure is correct
      if (response && response.data) {
        setEmails(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } else {
        setError('תגובה לא תקינה מהשרת');
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
      const errorMessage = err.response?.data?.error || err.message || 'שגיאה בטעינת האימיילים';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchEmails(newPage);
    }
  };

  if (loading) {
    return <div className="loading">טוען אימיילים...</div>;
  }

  if (error) {
    return <div className="error">שגיאה: {error}</div>;
  }

  return (
    <div className="email-list">
      <h2>אימיילים ({pagination.total})</h2>
      {emails.length === 0 ? (
        <div className="no-data">אין אימיילים להצגה</div>
      ) : (
        <div className="emails-container">
          {emails.map((email) => (
          <div key={email._id} className="email-card">
            <div className="email-header">
              <div className="email-title-section">
                <h3>{email.Subject || 'ללא נושא'}</h3>
              </div>
              <div className="email-id">ID: {email.ID}</div>
            </div>
            <div className="email-info">
              <p><strong>שולח:</strong> {email.Sender_name || email.sender_email}</p>
              <p><strong>נשלח ב:</strong> {email.sent_at ? new Date(email.sent_at).toLocaleString('he-IL') : 'לא זמין'}</p>
              <p><strong>נוצר ב:</strong> {email.created_at ? new Date(email.created_at).toLocaleString('he-IL') : 'לא זמין'}</p>
            </div>
            {(() => {
              // Check if we have any content to display
              const rawBody = email.body || '';
              const rawHtmlBody = email.html_body || '';
              const hasHtmlBody = rawHtmlBody.trim().length > 0;
              const hasBody = rawBody.trim().length > 0;
              
              // Prefer HTML body if available
              if (hasHtmlBody) {
                // Only show preview if HTML body is meaningful
                const htmlPreview = rawHtmlBody.length > 50 
                  ? rawHtmlBody.substring(0, 500) + '...' 
                  : rawHtmlBody;
                return (
                  <div className="email-body">
                    <div 
                      className="email-html-body"
                      dangerouslySetInnerHTML={{ __html: htmlPreview }}
                    />
                  </div>
                );
              } 
              
              // Fallback to text body
              if (hasBody) {
                // Clean HTML entities but keep content
                let cleanedBody = rawBody
                  .replace(/&zwnj;/g, ' ')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/&[a-z]+;/gi, ' ') // Remove any remaining HTML entities
                  .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                  .trim();
                
                // Show content even if it's mostly whitespace (after cleaning)
                if (cleanedBody.length > 0) {
                  const preview = cleanedBody.length > 200 
                    ? cleanedBody.substring(0, 200) + '...' 
                    : cleanedBody;
                  return (
                    <div className="email-body">
                      <div className="email-text-body">
                        {preview}
                      </div>
                    </div>
                  );
                } else {
                  // Show a message if body exists but is empty after cleaning
                  return (
                    <div className="email-body">
                      <div className="email-text-body" style={{ fontStyle: 'italic', color: '#999' }}>
                        (תוכן האימייל ריק או מכיל רק HTML entities)
                      </div>
                    </div>
                  );
                }
              }
              
              // No content at all
              return null;
            })()}
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

export default EmailList;

