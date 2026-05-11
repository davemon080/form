import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/api/submissions', async (req, res) => {
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
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});