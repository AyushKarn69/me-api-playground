import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/projects - Get all projects, optionally filtered by skill
router.get('/', async (req, res) => {
  const { skill } = req.query;

  try {
    let query = `
      SELECT p.* FROM projects p
      WHERE 1=1
    `;
    const params = [];

    if (skill) {
      const skillsArray = skill.split(',').map((s) => s.trim().toLowerCase());
      query += `
        AND p.id IN (
          SELECT DISTINCT project_id FROM project_skills 
          WHERE LOWER(skill_name) = ANY($1)
        )
      `;
      params.push(skillsArray);
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);

    // Get skills for each project
    const projectsWithSkills = await Promise.all(
      result.rows.map(async (project) => {
        const skillsResult = await pool.query(
          'SELECT skill_name FROM project_skills WHERE project_id = $1',
          [project.id]
        );
        return {
          ...project,
          skills: skillsResult.rows.map((row) => row.skill_name),
        };
      })
    );

    res.json(projectsWithSkills);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = result.rows[0];
    const skillsResult = await pool.query(
      'SELECT skill_name FROM project_skills WHERE project_id = $1',
      [id]
    );

    res.json({
      ...project,
      skills: skillsResult.rows.map((row) => row.skill_name),
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create project
router.post('/', async (req, res) => {
  const { profile_id, title, description, github_link, live_link, skills } = req.body;

  if (!profile_id || !title) {
    return res.status(400).json({ error: 'Profile ID and title are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO projects (profile_id, title, description, github_link, live_link)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [profile_id, title, description, github_link, live_link]
    );

    const projectId = result.rows[0].id;

    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        await pool.query(
          'INSERT INTO project_skills (project_id, skill_name) VALUES ($1, $2)',
          [projectId, skill]
        );
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, github_link, live_link } = req.body;

  try {
    const result = await pool.query(
      `UPDATE projects 
       SET title = $1, description = $2, github_link = $3, live_link = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, description, github_link, live_link, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
