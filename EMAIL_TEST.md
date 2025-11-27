# Email Testing Guide

## How to Test Email Functionality

### Option 1: Test Endpoint (Recommended)

I've created a test endpoint that you can use to verify email sending is working.

#### On Local Server:
```bash
curl http://localhost:3001/test-email
```

Or visit in browser:
```
http://localhost:3001/test-email
```

#### On Render:
Once deployed, visit:
```
https://toll-website.onrender.com/test-email
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Test email sent successfully to navjot67singh@gmail.com",
  "timestamp": "2025-11-24T..."
}
```

**Expected Response (Error):**
```json
{
  "error": "SENDGRID_API_KEY not configured",
  "message": "Please set SENDGRID_API_KEY in Render environment variables"
}
```

### Option 2: Test via Form Submission

1. **Visit your website:**
   - Local: `http://localhost:3001`
   - Render: `https://toll-website.onrender.com`

2. **Fill out the form:**
   - Name: Test User
   - Email: your-test-email@gmail.com
   - Select toll type (NY/NJ/Both)
   - Fill in required fields

3. **Submit the form**

4. **Check:**
   - Form shows success message
   - Check email at `navjot67singh@gmail.com`
   - Check Render logs for email status

### Option 3: Check SendGrid Activity

1. **Login to SendGrid:**
   - Go to: https://app.sendgrid.com

2. **Check Activity:**
   - Click "Activity" in left sidebar
   - See all email attempts
   - Green = Delivered
   - Red = Failed (click for details)

3. **Check Stats:**
   - See email delivery statistics
   - Check for bounces/blocks

## Troubleshooting

### Test Endpoint Shows "SENDGRID_API_KEY not configured"

**Solution:**
1. Go to Render Dashboard → Your Service → Environment
2. Add `SENDGRID_API_KEY` = `SG.xxxxxxxxxxxxx`
3. Save and wait for redeploy

### Test Email Fails with "Unauthorized"

**Solution:**
1. Check API key is correct in Render
2. Verify API key has "Mail Send" permissions in SendGrid
3. Regenerate API key if needed

### Test Email Fails with "Sender not verified"

**Solution:**
1. Go to SendGrid Dashboard
2. Settings → Sender Authentication
3. Verify sender email: `navjot67singh@gmail.com`
4. Check email and click verification link

### Email Not Received

**Check:**
1. Spam/junk folder
2. SendGrid Activity dashboard (was it sent?)
3. Render logs for errors
4. Email address is correct

## Quick Test Commands

### Test Locally:
```bash
# Start server
npm start

# In another terminal, test email
curl http://localhost:3001/test-email
```

### Test on Render:
```bash
# Just visit this URL in browser:
https://toll-website.onrender.com/test-email
```

## What Gets Tested

The test endpoint:
- ✅ Checks if SendGrid API key is configured
- ✅ Sends a test email to your receiving email
- ✅ Returns success/error response
- ✅ Logs results in server logs

## Expected Behavior

1. **Success:** Email arrives at `navjot67singh@gmail.com` within 1-2 minutes
2. **Error:** Check Render logs for specific error message
3. **No Response:** Server might not be running or endpoint not accessible

## Next Steps

After successful test:
- ✅ Remove test endpoint (optional, for security)
- ✅ Test actual form submission
- ✅ Monitor SendGrid Activity for delivery


