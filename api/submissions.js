const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, others, email, phone, service } = req.body;

  if (!firstName || !lastName || !email || !phone || !service) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO onboarding_submissions 
       (first_name, last_name, other_names, email, phone_number, training_interest) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, submitted_at`,
      [firstName, lastName, others || null, email, phone, service]
    );

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
};