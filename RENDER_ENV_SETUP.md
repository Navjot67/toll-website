# How to Fix Email Connection Timeout on Render

## Current Status ✅
- ✅ Website is live at: https://toll-website.onrender.com
- ✅ Server is running correctly
- ⚠️ Email connection timeout (needs environment variables fix)

## Quick Fix - Set Environment Variables in Render

### Step 1: Go to Render Dashboard

1. Visit: https://dashboard.render.com
2. Click on your **`toll-website`** service

### Step 2: Open Environment Variables

1. Click **"Environment"** tab (left sidebar)
   - OR click **"Settings"** → Scroll to **"Environment Variables"**

### Step 3: Add/Update These Variables

Click **"Add Environment Variable"** and add each one:

| Key | Value |
|-----|-------|
| `EMAIL_USER` | `navjot67singh@gmail.com` |
| `EMAIL_PASSWORD` | `[your-gmail-app-password]` ← **See Step 4 below** |
| `RECEIVING_EMAIL` | `navjot67singh@gmail.com` |
| `NODE_ENV` | `production` |
| `EMAIL_SERVICE` | `gmail` (optional) |

**Important:** After adding/updating variables, Render will automatically redeploy (takes 2-3 minutes).

### Step 4: Get Gmail App Password

**You MUST use a Gmail App Password, NOT your regular Gmail password.**

1. **Go to:** https://myaccount.google.com/apppasswords
   - Sign in if needed

2. **If you see "App passwords aren't available":**
   - Enable 2-Step Verification first:
     - Go to: https://myaccount.google.com/security
     - Turn on **"2-Step Verification"**
     - Then go back to App Passwords

3. **Generate App Password:**
   - Select app: **"Mail"**
   - Select device: **"Other (Custom name)"**
   - Type: **"Render"**
   - Click **"Generate"**

4. **Copy the password:**
   - You'll see a 16-character password like: `abcd efgh ijkl mnop`
   - Copy it WITHOUT spaces: `abcdefghijklmnop`
   - This is what you put in `EMAIL_PASSWORD` in Render

5. **Add to Render:**
   - Go back to Render → Environment tab
   - Add/Update `EMAIL_PASSWORD` = `abcdefghijklmnop` (your actual password)
   - Click **"Save Changes"**

### Step 5: Wait for Redeploy

1. After saving, Render will automatically redeploy
2. Wait 2-3 minutes
3. Check logs - you should see:
   - `✅ Email server is ready to send messages` (success!)

### Step 6: Test

1. Visit: https://toll-website.onrender.com
2. Fill out the form
3. Submit
4. Check email at `navjot67singh@gmail.com`
5. Check Render logs for email status

---

## Troubleshooting

### Still Seeing Connection Timeout?

1. **Verify App Password is correct:**
   - Make sure you copied the full 16 characters
   - No spaces in the password
   - Using App Password, NOT regular password

2. **Check Environment Variables:**
   - Go to Render → Environment tab
   - Verify all variables are spelled correctly
   - No extra spaces before/after values

3. **Regenerate App Password:**
   - Delete the old one
   - Generate a new App Password
   - Update in Render

4. **Check Gmail Security:**
   - Go to: https://myaccount.google.com/security
   - Make sure 2-Step Verification is ON
   - Check "Recent security activity" for any blocks

5. **Try Again Later:**
   - Sometimes Gmail blocks connections temporarily
   - Wait 15-30 minutes and test again

### Alternative: Use Different Email Service

If Gmail continues to have issues, you can use:

**Outlook/Hotmail:**
- Change `EMAIL_SERVICE` = `outlook`
- Use Outlook App Password (similar process)

**SendGrid (Free tier):**
- Sign up at sendgrid.com
- Get API key
- Update server.js to use SendGrid (requires code changes)

---

## Current Behavior

**Even with the email timeout warning:**
- ✅ Website is fully functional
- ✅ Form submissions are accepted
- ⚠️ Emails may not send until environment variables are set correctly
- ✅ Server logs will show email attempts and errors

Once environment variables are set correctly, emails will work!


