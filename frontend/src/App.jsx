import React, { useState, useEffect } from 'react';
import Profile from './components/Profile';
import Projects from './components/Projects';
import Search from './components/Search';
import WorkExperience from './components/WorkExperience';
import './App.css';
const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
       const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      setApiHealth(response.ok ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Health check failed:', error);
      setApiHealth('disconnected');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Me-API Playground</h1>
        <div className="health-status">
          API Status:{' '}
          <span className={apiHealth === 'connected' ? 'connected' : 'disconnected'}>
            {apiHealth || 'checking...'}
          </span>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`nav-btn ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          Work Experience
        </button>
        {activeTab === 'experience' && <WorkExperience />}
      </nav>

      <main className="app-main">
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'projects' && <Projects />}
        {activeTab === 'search' && <Search />}
      </main>

      <footer className="app-footer">
        <p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </p>
      </footer>
    </div>
  );
}
