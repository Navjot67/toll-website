# Email Connection Timeout Solutions

## Problem
Gmail connections from Render free tier are timing out due to network restrictions.

## Solution Options

### Option 1: Use SendGrid (Recommended - Free Tier Available) ⭐

SendGrid works reliably on Render and has a free tier (100 emails/day).

#### Step 1: Create SendGrid Account
1. Go to: https://sendgrid.com
2. Sign up for free account
3. Verify your email

#### Step 2: Create API Key
1. Go to: SendGrid Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Name: "Render App"
4. Permissions: "Full Access" (or "Mail Send" only)
5. Copy the API key (you won't see it again!)

#### Step 3: Update Server Code
Replace the email transporter in `server.js` with:

```javascript
// SendGrid configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey', // Literally the word 'apikey'
        pass: process.env.SENDGRID_API_KEY // Your SendGrid API key
    }
});
```

#### Step 4: Update Render Environment Variables
- Remove: `EMAIL_PASSWORD`
- Add: `SENDGRID_API_KEY` = `[your-sendgrid-api-key]`
- Update `EMAIL_USER` = `apikey` (the word "apikey")
- Keep: `RECEIVING_EMAIL` = `navjot67singh@gmail.com`

#### Step 5: Redeploy
- Push code changes to GitHub
- Render will auto-redeploy
- Test form submissions

---

### Option 2: Use Mailgun (Free Tier Available)

#### Step 1: Create Mailgun Account
1. Go to: https://www.mailgun.com
2. Sign up (free tier: 5,000 emails/month)

#### Step 2: Get SMTP Credentials
1. Go to: Mailgun Dashboard → Sending → Domain Settings
2. Copy SMTP credentials:
   - SMTP hostname
   - SMTP username
   - SMTP password

#### Step 3: Update Server Code
```javascript
const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_SMTP_HOST, // e.g., smtp.mailgun.org
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILGUN_SMTP_USER,
        pass: process.env.MAILGUN_SMTP_PASS
    }
});
```

#### Step 4: Update Render Environment Variables
- `MAILGUN_SMTP_HOST` = `smtp.mailgun.org`
- `MAILGUN_SMTP_USER` = `[from mailgun dashboard]`
- `MAILGUN_SMTP_PASS` = `[from mailgun dashboard]`
- `EMAIL_USER` = `[your-mailgun-email]`
- `RECEIVING_EMAIL` = `navjot67singh@gmail.com`

---

### Option 3: Use Outlook/Hotmail (Free)

Outlook sometimes works better than Gmail on cloud platforms.

#### Step 1: Get Outlook App Password
1. Go to: https://account.microsoft.com/security
2. Enable 2-Step Verification
3. Go to: https://account.microsoft.com/security/app-passwords
4. Generate app password for "Mail"

#### Step 2: Update Render Environment Variables
- `EMAIL_SERVICE` = `outlook`
- `EMAIL_USER` = `your-email@outlook.com`
- `EMAIL_PASSWORD` = `[outlook-app-password]`
- `RECEIVING_EMAIL` = `navjot67singh@gmail.com`

#### Step 3: Update Server Code
Change transporter to:
```javascript
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

---

### Option 4: Upgrade Render Plan

Render's paid plans ($7+/month) have better network access and may resolve Gmail timeout issues.

---

### Option 5: Use Webhook Instead of Email (Advanced)

Instead of sending emails directly, you could:
1. Store submissions in a database
2. Send data to a webhook URL
3. Use a service like Zapier/Make to handle emails

---

## Quick Test: Check Environment Variables

Make sure these are set in Render:

1. Go to: Render Dashboard → Your Service → Environment
2. Verify all variables are correct
3. Check for typos or extra spaces
4. Make sure passwords/API keys are correct

---

## Recommended: SendGrid

**Why SendGrid:**
- ✅ Works reliably on Render free tier
- ✅ 100 emails/day free
- ✅ Easy to set up
- ✅ Better delivery rates
- ✅ No network timeout issues

Would you like me to update the server code to use SendGrid?

