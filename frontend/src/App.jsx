import { useState } from 'react';
import EmailList from './components/EmailList';
import FbPostsList from './components/FbPostsList';
import NewsletterTopicsList from './components/NewsletterTopicsList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('emails');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Content FB Manager</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === 'emails' ? 'active' : ''}
            onClick={() => setActiveTab('emails')}
          >
            אימיילים
          </button>
          <button
            className={activeTab === 'fb-posts' ? 'active' : ''}
            onClick={() => setActiveTab('fb-posts')}
          >
            פוסטים בפייסבוק
          </button>
          <button
            className={activeTab === 'newsletter-topics' ? 'active' : ''}
            onClick={() => setActiveTab('newsletter-topics')}
          >
            נושאי ניוזלטר
          </button>
        </nav>
      </header>
      <main className="app-main">
        {activeTab === 'emails' && <EmailList />}
        {activeTab === 'fb-posts' && <FbPostsList />}
        {activeTab === 'newsletter-topics' && <NewsletterTopicsList />}
      </main>
    </div>
  );
}

export default App;

