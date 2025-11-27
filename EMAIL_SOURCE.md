# Where Email Addresses Are Read From

## Current Email Reading Configuration

The code reads email addresses from **environment variables** in this order:

### 1. **Local Development (.env file)**
When running locally, emails are read from the `.env` file:
- Location: `/Users/ghuman/TOLL WEBSITE/.env`
- Loaded by: `require('dotenv').config()` (line 5 of server.js)

### 2. **Production (Render Environment Variables)**
When deployed on Render, emails are read from Render's environment variables:
- Location: Render Dashboard → Your Service → Environment tab
- Loaded by: `process.env.EMAIL_USER` (Node.js environment variables)

## Email Reading Priority

The code reads emails in this order:

### For Receiving Email (where emails are sent TO):
1. **`RECEIVING_EMAIL`** (if set)
2. **`EMAIL_USER`** (primary - from .env line 3)
3. Fallback to `fromEmail` if neither is set

### For From Email (sender address):
1. **`FROM_EMAIL`** (if set)
2. **`EMAIL_USER`** (primary - from .env line 3)
3. Fallback to `noreply@tollwebsite.com` if neither is set

## Current Configuration

From your `.env` file:
```env
EMAIL_USER=navjot67singh@gmail.com          ← Primary email (line 3)
RECEIVING_EMAIL=navjot67singh@gmail.com     ← Where emails are sent (line 5)
```

## Code Locations

### Main Email Endpoint (Form Submissions)
**File:** `server.js`  
**Lines:** 69-72
```javascript
const emailUser = process.env.EMAIL_USER;
const fromEmail = process.env.FROM_EMAIL || emailUser || 'noreply@tollwebsite.com';
const receivingEmail = process.env.RECEIVING_EMAIL || emailUser || fromEmail;
```

### Test Email Endpoint
**File:** `server.js`  
**Lines:** 215-217
```javascript
const emailUser = process.env.EMAIL_USER;
const fromEmail = process.env.FROM_EMAIL || emailUser || 'noreply@tollwebsite.com';
const receivingEmail = process.env.RECEIVING_EMAIL || emailUser || fromEmail;
```

## Summary

**Emails are read from:**
- ✅ `.env` file (local development) - Line 3: `EMAIL_USER`
- ✅ Render Environment Variables (production) - `EMAIL_USER` variable
- ✅ Primary source: `EMAIL_USER` = `navjot67singh@gmail.com`
- ✅ Receiving: `RECEIVING_EMAIL` = `navjot67singh@gmail.com` (or falls back to EMAIL_USER)

**Current email being used:**
- **To:** `navjot67singh@gmail.com` (from RECEIVING_EMAIL or EMAIL_USER)
- **From:** `navjot67singh@gmail.com` (from FROM_EMAIL or EMAIL_USER)

