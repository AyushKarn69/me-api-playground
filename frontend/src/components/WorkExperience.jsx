import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkExperience.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function WorkExperience() {
  const [workExperience, setWorkExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkExperience();
  }, []);

  const fetchWorkExperience = async () => {
    try {
      setLoading(true);
      // First get profile to get the ID
      const profileResponse = await axios.get(`${API_URL}/api/profile`);
      const profileId = profileResponse.data.id;
      
      // Then get full profile with work experience
      const response = await axios.get(`${API_URL}/api/profile/${profileId}/full`);
      setWorkExperience(response.data.work || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching work experience:', err);
      setError('Failed to load work experience');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="work-experience-container"><p>Loading work experience...</p></div>;
  if (error) return <div className="work-experience-container error"><p>{error}</p></div>;
  if (workExperience.length === 0) return <div className="work-experience-container"><p>No work experience found</p></div>;

  return (
    <div className="work-experience-container">
      <h2>Work Experience</h2>
      <div className="work-experience-list">
        {workExperience.slice(0, 1).map((work) => (
          <div key={work.id} className="work-experience-card">
            <div className="work-header">
              <h3>{work.position}</h3>
              <span className="company">{work.company}</span>
            </div>
            <div className="work-dates">
              {new Date(work.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}{' '}
              -{' '}
              {new Date(work.end_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </div>
            <p className="work-description">{work.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
