# Fix Email Connection Timeout on Render

## Issue
You're seeing `Email transporter error: Connection timeout` in Render logs.

## Solution Steps

### Step 1: Verify Environment Variables in Render

1. **Go to Render Dashboard:**
   - Click on your `toll-website` service
   - Click **"Environment"** tab (or **"Settings"** → **"Environment"**)

2. **Check these variables are set correctly:**
   - `EMAIL_USER` = `navjot67singh@gmail.com`
   - `EMAIL_PASSWORD` = `[your-gmail-app-password]` (must be App Password, not regular password)
   - `EMAIL_SERVICE` = `gmail` (optional)
   - `RECEIVING_EMAIL` = `navjot67singh@gmail.com`
   - `NODE_ENV` = `production`

3. **Important:** Make sure `EMAIL_PASSWORD` is a **Gmail App Password**, not your regular Gmail password.

### Step 2: Get/Verify Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
2. **Sign in** with your Google account
3. **Generate a new app password:**
   - Select app: **"Mail"**
   - Select device: **"Other (Custom name)"** → Enter "Render"
   - Click **"Generate"**
4. **Copy the 16-character password** (no spaces)
5. **Update in Render:**
   - Go to Render → Your Service → Environment
   - Update `EMAIL_PASSWORD` with the new app password
   - Save changes
   - Render will automatically redeploy

### Step 3: Enable "Less Secure Apps" (if needed)

If App Passwords still don't work:

1. **Go to:** https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled)
3. **Then generate App Password** (Step 2 above)

### Step 4: Check Render Logs After Redeploy

1. After updating environment variables, Render will redeploy
2. Check the logs for:
   - `✅ Email server is ready to send messages` (success)
   - OR `⚠️ Email transporter warning` (still having issues)

### Step 5: Test the Form

1. Visit: `https://toll-website.onrender.com`
2. Fill out the form and submit
3. Check your email at `navjot67singh@gmail.com`
4. Check Render logs for any email errors

## Common Issues

### Issue 1: Wrong Password Type
**Problem:** Using regular Gmail password instead of App Password  
**Solution:** Generate and use Gmail App Password (see Step 2)

### Issue 2: Environment Variables Not Set
**Problem:** Variables missing or misspelled in Render  
**Solution:** Double-check all variables in Render Environment tab

### Issue 3: Gmail Blocking Connection
**Problem:** Gmail security settings blocking Render's IP  
**Solution:** 
- Use App Password (not regular password)
- Make sure 2-Step Verification is enabled
- Wait a few minutes after changing settings

### Issue 4: Connection Timeout
**Problem:** Network/timeout issues between Render and Gmail  
**Solution:** 
- The updated code now handles this better
- Email verification won't block server startup
- Emails will still attempt to send when form is submitted

## Updated Code

The server code has been updated to:
- Use direct SMTP configuration (better for cloud platforms)
- Handle connection timeouts gracefully
- Not block server startup if email verification fails
- Still attempt to send emails even if verification fails

## Next Steps

1. **Verify environment variables in Render** (Step 1)
2. **Update Gmail App Password if needed** (Step 2)
3. **Push the updated code to GitHub** (already done if you see this file)
4. **Render will auto-redeploy** with the new code
5. **Test the form** and check logs

## Still Having Issues?

If emails still don't send:

1. **Check Render logs** for specific error messages
2. **Try alternative email service:**
   - Outlook/Hotmail: Change `EMAIL_SERVICE` to `outlook`
   - Or use SendGrid, Mailgun, etc. (requires different configuration)
3. **Contact Render support** if it's a network issue
4. **Check Gmail account** for security alerts

---

**Note:** The server will still work and accept form submissions even if email verification fails. The email will be attempted when a form is submitted.

