# Nexlify Innovation Training Onboarding Form

A frontend onboarding form for the Nexlify Innovation training program. Collects participant details for training enrollment.

## Form Fields

| Field | Type | Required |
|-------|------|----------|
| First Name | text | Yes |
| Last Name | text | Yes |
| Others | text | No |
| Email | email | Yes |
| Phone Number | tel | Yes |
| Service Interest | select | Yes (graphic-design or web-development) |

## Database Schema (PostgreSQL)

```sql
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
```

## Vercel Deployment

1. Push to GitHub
2. Import to Vercel
3. Add `DATABASE_URL` environment variable with your Neon connection string

The `api/submissions.mjs` function will deploy automatically.