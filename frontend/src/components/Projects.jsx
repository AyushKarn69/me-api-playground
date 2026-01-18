import React, { useState, useEffect } from 'react';
import { projectsApi, skillsApi } from '../api';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [projectsRes, skillsRes] = await Promise.all([
        projectsApi.getProjects(),
        skillsApi.getSkills(),
      ]);
      const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      // Remove duplicates by project id
      const uniqueProjects = Array.from(
        new Map(projectsData.map((p) => [p.id, p])).values()
      );
      setProjects(uniqueProjects);
      setSkills(skillsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects and skills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillFilter = async (skill) => {
    setSelectedSkill(skill);
    try {
      setLoading(true);
      const response = await projectsApi.getProjects(skill || undefined);
      const projectsData = Array.isArray(response.data) ? response.data : [];
      // Remove duplicates by project id
      const uniqueProjects = Array.from(
        new Map(projectsData.map((p) => [p.id, p])).values()
      );
      setProjects(uniqueProjects);
      setError(null);
    } catch (err) {
      setError('Failed to filter projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-section">
      <h2>Projects</h2>

      <div className="skills-filter">
        <h3>Filter by Skill:</h3>
        <div className="skill-buttons">
          <button
            className={`skill-btn ${selectedSkill === '' ? 'active' : ''}`}
            onClick={() => handleSkillFilter('')}
          >
            All
          </button>
          {skills.map((skill) => (
            <button
              key={skill.skill_name}
              className={`skill-btn ${selectedSkill === skill.skill_name ? 'active' : ''}`}
              onClick={() => handleSkillFilter(skill.skill_name)}
            >
              {skill.skill_name}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <h4>{project.title}</h4>
              <p className="description">{project.description}</p>

              {project.skills && project.skills.length > 0 && (
                <div className="project-skills">
                  <strong>Skills:</strong>
                  <div className="skill-tags">
                    {project.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="project-links">
                {project.github_link && (
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {project.live_link && (
                  <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
