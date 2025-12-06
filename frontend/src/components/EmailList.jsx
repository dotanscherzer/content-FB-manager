import { useState, useEffect } from 'react';
import { emailService } from '../services/api';
import './EmailList.css';

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [expandedEmails, setExpandedEmails] = useState(new Set());

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

  const toggleEmailExpansion = (emailId) => {
    setExpandedEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
      } else {
        newSet.add(emailId);
      }
      return newSet;
    });
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
              const hasHtmlBody = rawHtmlBody && rawHtmlBody.trim().length > 0;
              const hasBody = rawBody && rawBody.trim().length > 0;
              
              // Prefer HTML body if available
              if (hasHtmlBody) {
                // Remove style, script, head tags and comments before extracting text
                let cleanHtml = rawHtmlBody
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/<!--[\s\S]*?-->/g, '')
                  .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
                  .replace(/<meta[^>]*>/gi, '')
                  .replace(/<link[^>]*>/gi, '');
                
                // Extract text content from cleaned HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cleanHtml;
                let textContent = tempDiv.textContent || tempDiv.innerText || '';
                
                // Clean up the extracted text - remove HTML entities and normalize whitespace
                textContent = textContent
                  .replace(/&zwnj;/g, ' ')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/&[a-z]+;/gi, ' ')
                  .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
                  .trim();
                
                // Find first meaningful text - skip initial empty content
                let previewText = textContent;
                // Remove leading non-text characters
                previewText = previewText.replace(/^[\s\n\r\t\u200B-\u200D\uFEFF]+/, '');
                previewText = previewText.substring(0, 250).trim();
                
                // Show preview of HTML email
                if (previewText.length > 0) {
                  const isExpanded = expandedEmails.has(email._id.toString());
                  const shouldShowExpand = textContent.length > 250;
                  const displayText = isExpanded ? textContent : previewText;
                  
                  return (
                    <div className={`email-body ${isExpanded ? 'expanded' : ''}`}>
                      <div className="email-text-body">
                        {displayText}
                        {!isExpanded && shouldShowExpand && '...'}
                      </div>
                      {shouldShowExpand && (
                        <button 
                          className="expand-text-btn"
                          onClick={() => toggleEmailExpansion(email._id.toString())}
                        >
                          {isExpanded ? 'הצג פחות' : 'הצג עוד'}
                        </button>
                      )}
                    </div>
                  );
                }
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
                  const isExpanded = expandedEmails.has(email._id.toString());
                  const shouldShowExpand = cleanedBody.length > 200;
                  const displayText = isExpanded ? cleanedBody : (shouldShowExpand ? cleanedBody.substring(0, 200) : cleanedBody);
                  
                  return (
                    <div className={`email-body ${isExpanded ? 'expanded' : ''}`}>
                      <div className="email-text-body">
                        {displayText}
                        {!isExpanded && shouldShowExpand && '...'}
                      </div>
                      {shouldShowExpand && (
                        <button 
                          className="expand-text-btn"
                          onClick={() => toggleEmailExpansion(email._id.toString())}
                        >
                          {isExpanded ? 'הצג פחות' : 'הצג עוד'}
                        </button>
                      )}
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

