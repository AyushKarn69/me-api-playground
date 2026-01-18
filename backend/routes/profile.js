import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/profile - Get profile
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profile ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/profile - Create profile
router.post('/', async (req, res) => {
  const { name, email, education, github_link, linkedin_link, portfolio_link } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO profile (name, email, education, github_link, linkedin_link, portfolio_link)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, education, github_link, linkedin_link, portfolio_link]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// PUT /api/profile/:id - Update profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, education, github_link, linkedin_link, portfolio_link } = req.body;

  try {
    const result = await pool.query(
      `UPDATE profile 
       SET name = $1, email = $2, education = $3, github_link = $4, linkedin_link = $5, portfolio_link = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, email, education, github_link, linkedin_link, portfolio_link, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/:id/full - Get full profile with all related data
router.get('/:id/full', async (req, res) => {
  const { id } = req.params;

  try {
    const profileResult = await pool.query('SELECT * FROM profile WHERE id = $1', [id]);
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = profileResult.rows[0];

    const skillsResult = await pool.query('SELECT * FROM skills WHERE profile_id = $1', [id]);
    const projectsResult = await pool.query('SELECT * FROM projects WHERE profile_id = $1', [id]);
    const workResult = await pool.query('SELECT * FROM work_experience WHERE profile_id = $1', [id]);

    // Get project skills
    const projectsWithSkills = await Promise.all(
      projectsResult.rows.map(async (project) => {
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

    res.json({
      ...profile,
      skills: skillsResult.rows.map((row) => ({ name: row.skill_name, proficiency: row.proficiency })),
      projects: projectsWithSkills,
      work: workResult.rows,
    });
  } catch (error) {
    console.error('Error fetching full profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
