import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/search - Search across profile, projects, and skills
router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchTerm = `%${q}%`;

  try {
    // Search in projects
    const projectsResult = await pool.query(
      `SELECT id, title, description, 'project' as type FROM projects 
       WHERE title ILIKE $1 OR description ILIKE $1`,
      [searchTerm]
    );

    // Search in skills
    const skillsResult = await pool.query(
      `SELECT DISTINCT skill_name as name, 'skill' as type FROM skills 
       WHERE skill_name ILIKE $1`,
      [searchTerm]
    );

    // Search in work experience
    const workResult = await pool.query(
      `SELECT id, company, position, 'work' as type FROM work_experience 
       WHERE company ILIKE $1 OR position ILIKE $1 OR description ILIKE $1`,
      [searchTerm]
    );

    res.json({
      results: [
        ...projectsResult.rows,
        ...skillsResult.rows,
        ...workResult.rows,
      ],
      count: projectsResult.rows.length + skillsResult.rows.length + workResult.rows.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
