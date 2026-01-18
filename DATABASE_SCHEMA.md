# Database Schema Documentation

## Overview
The Me-API Playground uses PostgreSQL with a normalized relational schema supporting candidate profiles, projects, skills, and work experience.

## Tables

### 1. Profile
Primary table storing candidate information.

```sql
CREATE TABLE profile (
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
```

**Fields**:
- `id`: Auto-incremented primary key
- `name`: Candidate name (required)
- `email`: Email address (required, unique)
- `education`: Educational background
- `github_link`: GitHub profile URL
- `linkedin_link`: LinkedIn profile URL
- `portfolio_link`: Portfolio website URL
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Constraints**:
- Email must be unique
- Name is required

---

### 2. Skills
Stores candidate skills with proficiency levels.

```sql
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency VARCHAR(50) DEFAULT 'Intermediate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(profile_id, skill_name)
);
```

**Fields**:
- `id`: Auto-incremented primary key
- `profile_id`: Foreign key to profile (cascades on delete)
- `skill_name`: Name of the skill
- `proficiency`: Level (e.g., Beginner, Intermediate, Advanced)
- `created_at`: Record creation timestamp

**Constraints**:
- Foreign key to profile with CASCADE delete
- Unique constraint on (profile_id, skill_name)

**Index**:
- `idx_skills_profile_id` on profile_id
- `idx_skills_skill_name` on skill_name

---

### 3. Projects
Stores project information.

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  github_link VARCHAR(255),
  live_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields**:
- `id`: Auto-incremented primary key
- `profile_id`: Foreign key to profile (cascades on delete)
- `title`: Project title (required)
- `description`: Project description
- `github_link`: GitHub repository URL
- `live_link`: Live demo URL
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Constraints**:
- Foreign key to profile with CASCADE delete
- Title is required

**Index**:
- `idx_projects_profile_id` on profile_id

---

### 4. Project_Skills (Many-to-Many)
Links projects to their associated skills.

```sql
CREATE TABLE project_skills (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, skill_name)
);
```

**Fields**:
- `id`: Auto-incremented primary key
- `project_id`: Foreign key to projects (cascades on delete)
- `skill_name`: Name of the skill used in project
- `created_at`: Record creation timestamp

**Constraints**:
- Foreign key to projects with CASCADE delete
- Unique constraint on (project_id, skill_name)

**Index**:
- `idx_project_skills_project_id` on project_id

---

### 5. Work_Experience
Stores work experience history.

```sql
CREATE TABLE work_experience (
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
```

**Fields**:
- `id`: Auto-incremented primary key
- `profile_id`: Foreign key to profile (cascades on delete)
- `company`: Company name (required)
- `position`: Job position (required)
- `start_date`: Employment start date
- `end_date`: Employment end date (NULL for current job)
- `description`: Job responsibilities and achievements
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Constraints**:
- Foreign key to profile with CASCADE delete
- Company and position are required

**Index**:
- `idx_work_experience_profile_id` on profile_id

---

## Relationships

### One-to-Many
- `profile` → `skills` (1:N)
- `profile` → `projects` (1:N)
- `profile` → `work_experience` (1:N)

### Many-to-Many
- `projects` ↔ `skills` (via project_skills)

---

## Indexing Strategy

All foreign keys and frequently queried fields have indexes for optimal performance:

```
idx_skills_profile_id          - Fast skill queries by profile
idx_projects_profile_id        - Fast project queries by profile
idx_project_skills_project_id  - Fast skill queries by project
idx_work_experience_profile_id - Fast work queries by profile
idx_skills_skill_name          - Fast skill searches
```

---

## Data Integrity

- **CASCADE DELETE**: When a profile is deleted, all associated skills, projects, and work experience are automatically deleted
- **UNIQUE CONSTRAINTS**: Prevents duplicate skills per profile and duplicate skills per project
- **FOREIGN KEYS**: Maintains referential integrity across tables
- **TIMESTAMPS**: Automatic tracking of creation and update times

---

## Sample Queries

### Get all projects with their skills
```sql
SELECT 
  p.*,
  array_agg(ps.skill_name) as skills
FROM projects p
LEFT JOIN project_skills ps ON p.id = ps.project_id
WHERE p.profile_id = 1
GROUP BY p.id;
```

### Find projects by skill
```sql
SELECT DISTINCT p.*
FROM projects p
LEFT JOIN project_skills ps ON p.id = ps.project_id
WHERE p.profile_id = 1 AND ps.skill_name = 'React';
```

### Get complete profile with all relationships
```sql
SELECT 
  p.*,
  (SELECT json_agg(row_to_json(s.*)) FROM skills s WHERE s.profile_id = p.id) as skills,
  (SELECT json_agg(row_to_json(pr.*)) FROM projects pr WHERE pr.profile_id = p.id) as projects,
  (SELECT json_agg(row_to_json(w.*)) FROM work_experience w WHERE w.profile_id = p.id) as work_experience
FROM profile p
WHERE p.id = 1;
```

### Top skills by usage
```sql
SELECT 
  skill_name,
  COUNT(*) as usage_count,
  AVG(CASE WHEN proficiency = 'Advanced' THEN 1 ELSE 0 END) as advanced_percentage
FROM skills
GROUP BY skill_name
ORDER BY usage_count DESC
LIMIT 10;
```

---

## Performance Considerations

1. **Indexes**: All FK and commonly searched fields are indexed
2. **CASCADE DELETE**: Ensures orphaned records don't accumulate
3. **UNIQUE Constraints**: Prevents duplicate entries
4. **Normalized Schema**: Reduces data redundancy
5. **Timestamp Fields**: Enable time-based queries and sorting

---

## Backup & Recovery

To backup the database:
```bash
pg_dump me_api_playground > backup.sql
```

To restore:
```bash
psql me_api_playground < backup.sql
```

---

Last Updated: January 17, 2026
