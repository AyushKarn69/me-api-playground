import React, { useState, useEffect } from 'react';
import { profileApi } from '../api';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getProfile();
      setProfile(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">No profile found</div>;

  return (
    <div className="profile-section">
      <div className="profile-header">
        <h1>{profile.name}</h1>
        <p className="email">{profile.email}</p>
      </div>

      {profile.education && (
        <div className="profile-field">
          <h3>Education</h3>
          <p>{profile.education}</p>
        </div>
      )}

      <div className="profile-links">
        {profile.github_link && (
          <a href={profile.github_link} target="_blank" rel="noopener noreferrer">
            🔗 GitHub
          </a>
        )}
        {profile.linkedin_link && (
          <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer">
            🔗 LinkedIn
          </a>
        )}
        {profile.portfolio_link && (
          <a href={profile.portfolio_link} target="_blank" rel="noopener noreferrer">
            🔗 Portfolio
          </a>
        )}
      </div>
    </div>
  );
}
