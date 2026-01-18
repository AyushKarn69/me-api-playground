-- Schema for Me-API Playground

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS work_experience CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  education TEXT,
  github_link VARCHAR(255),
  linkedin_link VARCHAR(255),
  portfolio_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency VARCHAR(50) DEFAULT 'Intermediate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(profile_id, skill_name)
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  github_link VARCHAR(255),
  live_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_skills (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, skill_name)
);

CREATE TABLE IF NOT EXISTS work_experience (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_profile_id ON skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_profile_id ON work_experience(profile_id);
CREATE INDEX IF NOT EXISTS idx_skills_skill_name ON skills(skill_name);
