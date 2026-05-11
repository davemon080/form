# Nexlify Innovation Training Onboarding Form

A frontend onboarding form for the Nexlify Innovation training program. Collects participant details for training enrollment including personal information and service interests.

## Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| First Name | text | Yes | Participant's first name |
| Last Name | text | Yes | Participant's last name |
| Others | text | No | Optional middle name or other names |
| Email | email | Yes | Contact email for schedule delivery |
| Phone Number | tel | Yes | Mobile number for WhatsApp group access |
| Service Interest | select | Yes | Training track: `graphic-design` or `web-development` |

## Database Schema (PostgreSQL)

```sql
-- Connect to/create database first:
-- CREATE DATABASE nexlify_onboarding;
-- \c nexlify_onboarding

CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  other_names VARCHAR(150),
  email VARCHAR(190) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  training_interest VARCHAR(100) NOT NULL,
  whatsapp_consent BOOLEAN NOT NULL DEFAULT true,
  schedule_email_consent BOOLEAN NOT NULL DEFAULT true,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON onboarding_submissions(email);
CREATE INDEX idx_phone ON onboarding_submissions(phone_number);
CREATE INDEX idx_training_interest ON onboarding_submissions(training_interest);
CREATE INDEX idx_submitted_at ON onboarding_submissions(submitted_at);
```

## Database Schema (MySQL)

```sql
CREATE DATABASE IF NOT EXISTS nexlify_onboarding;
USE nexlify_onboarding;

CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  other_names VARCHAR(150) NULL,
  email VARCHAR(190) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  training_interest VARCHAR(100) NOT NULL,
  whatsapp_consent TINYINT(1) NOT NULL DEFAULT 1,
  schedule_email_consent TINYINT(1) NOT NULL DEFAULT 1,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email),
  INDEX idx_phone (phone_number),
  INDEX idx_training_interest (training_interest),
  INDEX idx_submitted_at (submitted_at)
);
```

## Example Insert

```sql
INSERT INTO onboarding_submissions (
  first_name,
  last_name,
  other_names,
  email,
  phone_number,
  training_interest
) VALUES (
  'John',
  'Doe',
  'Michael',
  'john@example.com',
  '08012345678',
  'web-development'
);
```

## Training Interest Options

The `training_interest` field accepts these values:
- `graphic-design` - Creative Graphic Designing track
- `web-development` - Web Development track

## Backend Setup

Install dependencies and configure the database:

```bash
npm install
```

Set the database URL in `.env`:
```bash
DATABASE_URL=your_neon_database_url
```

Run migrations:
```bash
psql $DATABASE_URL -c "
CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  other_names VARCHAR(150),
  email VARCHAR(190) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  training_interest VARCHAR(100) NOT NULL,
  whatsapp_consent BOOLEAN NOT NULL DEFAULT true,
  schedule_email_consent BOOLEAN NOT NULL DEFAULT true,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"
```

Start the server:
```bash
npm run dev
```

## Vercel Deployment

1. Push this repo to GitHub
2. Import to Vercel
3. Add environment variable: `DATABASE_URL` with your Neon connection string
4. The `api/submissions.mjs` will be deployed as a serverless function

## Responsive Design

The form is mobile-responsive with:
- Single-column layout on screens below 640px width
- Grid layout (2 columns) on larger screens
- Touch-friendly button sizes and input fields