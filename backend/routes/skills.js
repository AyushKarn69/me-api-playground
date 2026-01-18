import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/skills - Get all skills
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT skill_name, proficiency, COUNT(*) as usage_count
       FROM skills
       GROUP BY skill_name, proficiency
       ORDER BY usage_count DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// GET /api/skills/top - Get top skills
router.get('/top', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const result = await pool.query(
      `SELECT skill_name, proficiency, COUNT(*) as usage_count
       FROM skills
       GROUP BY skill_name, proficiency
       ORDER BY proficiency DESC, usage_count DESC
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching top skills:', error);
    res.status(500).json({ error: 'Failed to fetch top skills' });
  }
});

// POST /api/skills - Add skill
router.post('/', async (req, res) => {
  const { profile_id, skill_name, proficiency } = req.body;

  if (!profile_id || !skill_name) {
    return res.status(400).json({ error: 'Profile ID and skill name are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO skills (profile_id, skill_name, proficiency)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [profile_id, skill_name, proficiency || 'Intermediate']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

export default router;
