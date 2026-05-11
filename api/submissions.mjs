import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, others, email, phone, service, learningDevice } = req.body;

  if (!firstName || !lastName || !email || !phone || !service || !learningDevice) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO onboarding_submissions 
       (first_name, last_name, other_names, email, phone_number, training_interest, learning_device) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, submitted_at`,
      [firstName, lastName, others || null, email, phone, service, learningDevice]
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
}
