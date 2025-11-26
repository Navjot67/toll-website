# Troubleshooting SendGrid Connection Timeout

## Current Issue
Seeing "Connection timeout" errors when trying to send emails via SendGrid.

## Quick Checklist

### ✅ Step 1: Verify Environment Variables in Render

1. **Go to Render Dashboard:**
   - https://dashboard.render.com
   - Click on `toll-website` service

2. **Go to Environment Tab:**
   - Click "Environment" (left sidebar)
   - OR Settings → Environment Variables

3. **Verify these variables exist:**
   - `SENDGRID_API_KEY` - Should start with `SG.` and be very long
   - `RECEIVING_EMAIL` - Should be `navjot67singh@gmail.com`
   - `FROM_EMAIL` - Should be `navjot67singh@gmail.com`

4. **Common Issues:**
   - ❌ Variable name misspelled (should be `SENDGRID_API_KEY` exactly)
   - ❌ Extra spaces before/after the value
   - ❌ API key not copied completely
   - ❌ Using wrong variable name

### ✅ Step 2: Verify SendGrid API Key

1. **Check API Key Format:**
   - Should start with: `SG.`
   - Should be very long (usually 69 characters)
   - Example: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **Verify in SendGrid:**
   - Login to: https://app.sendgrid.com
   - Go to: Settings → API Keys
   - Check if your API key exists
   - If not, create a new one

3. **Test API Key:**
   - Make sure it has "Mail Send" permissions
   - Regenerate if unsure

### ✅ Step 3: Verify Sender Authentication

**IMPORTANT:** SendGrid requires sender verification!

1. **Go to SendGrid Dashboard:**
   - Settings → Sender Authentication

2. **Verify Single Sender:**
   - Click "Verify a Single Sender"
   - Enter: `navjot67singh@gmail.com`
   - Fill out the form
   - Check your email and click verification link
   - Status should show "Verified" ✅

**If sender is not verified, emails will fail!**

### ✅ Step 4: Check SendGrid Account Status

1. **Login to SendGrid:**
   - https://app.sendgrid.com

2. **Check Account Status:**
   - Make sure account is active
   - Free tier should show 100 emails/day limit
   - Check if account is suspended (rare)

3. **Check Activity:**
   - Go to: Activity (left sidebar)
   - See if any emails were attempted
   - Check for error messages

### ✅ Step 5: Test API Key Manually

You can test if the API key works by making a curl request:

```bash
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_SENDGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{
      "to": [{"email": "navjot67singh@gmail.com"}]
    }],
    "from": {"email": "navjot67singh@gmail.com"},
    "subject": "Test Email",
    "content": [{
      "type": "text/plain",
      "value": "This is a test email"
    }]
  }'
```

Replace `YOUR_SENDGRID_API_KEY` with your actual key.

If this fails, the API key is invalid.

### ✅ Step 6: Update Render Environment Variables

If you need to update:

1. **Get fresh API key from SendGrid**
2. **In Render:**
   - Go to Environment tab
   - Click on `SENDGRID_API_KEY`
   - Click "Edit" or delete and recreate
   - Paste the new API key
   - Click "Save Changes"
3. **Render will auto-redeploy** (wait 2-3 minutes)
4. **Check logs** after redeploy

### ✅ Step 7: Alternative - Use SendGrid API Directly

If SMTP continues to timeout, we can switch to SendGrid REST API instead of SMTP.

**Benefits:**
- ✅ More reliable on cloud platforms
- ✅ Faster
- ✅ Better error messages

Would you like me to update the code to use SendGrid REST API instead?

## Common Solutions

### Solution 1: Regenerate API Key
- Delete old API key in SendGrid
- Create new one with "Full Access" or "Mail Send"
- Update in Render

### Solution 2: Verify Sender
- Most common issue!
- Must verify sender email in SendGrid
- Check Settings → Sender Authentication

### Solution 3: Check Rate Limits
- Free tier: 100 emails/day
- Check SendGrid dashboard for usage

### Solution 4: Wait and Retry
- Sometimes network issues are temporary
- Wait 5-10 minutes and try again

## Next Steps

1. **Double-check environment variables in Render**
2. **Verify sender email in SendGrid**
3. **Test with a fresh API key**
4. **Check SendGrid Activity dashboard**

If still failing, I can:
- Switch to SendGrid REST API (more reliable)
- Add better error logging
- Try alternative email service

Let me know what you find!


