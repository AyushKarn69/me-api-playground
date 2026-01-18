import React, { useState } from 'react';
import { searchApi } from '../api';
import './Search.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await searchApi.search(query);
      setResults(response.data);
      setError(null);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-section">
      <h2>Search</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search projects, skills, work experience..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {loading && <div className="loading">Searching...</div>}
      {error && <div className="error">{error}</div>}

      {results && (
        <div className="search-results">
          <p className="result-count">Found {results.count} results</p>

          {results.results.length === 0 ? (
            <p>No results found</p>
          ) : (
            <div className="results-list">
              {results.results.map((result, index) => (
                <div key={index} className="result-item">
                  <div className="result-type">{result.type}</div>
                  <div className="result-content">
                    <h4>{result.title || result.name || result.company}</h4>
                    {result.description && <p>{result.description}</p>}
                    {result.position && <p>{result.position}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
