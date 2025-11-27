# SendGrid Setup Guide for Render

## Quick Setup Steps

### Step 1: Create SendGrid Account

1. **Go to:** https://sendgrid.com
2. **Click "Start for Free"**
3. **Sign up** with your email address
4. **Verify your email** (check your inbox)

### Step 2: Create API Key

1. **Login to SendGrid Dashboard**
2. **Click:** Settings (left sidebar) → API Keys
3. **Click:** "Create API Key" button
4. **Configure API Key:**
   - **Name:** `Render Toll Website` (or any name)
   - **Permissions:** Select "Full Access" (or "Mail Send" only for security)
   - Click **"Create & View"**
5. **⚠️ IMPORTANT: Copy the API Key immediately**
   - You'll see it only once!
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Copy this entire key

### Step 3: Verify Sender (Required for Production)

1. **In SendGrid Dashboard:**
   - Go to: **Settings** → **Sender Authentication**
   - Click **"Verify a Single Sender"**
   - Enter your email: `navjot67singh@gmail.com`
   - Fill in the form
   - Check your email and click the verification link
   - **This is required for emails to work!**

### Step 4: Update Render Environment Variables

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Click on your `toll-website` service

2. **Go to Environment Tab:**
   - Click **"Environment"** tab (or **"Settings"** → **"Environment"**)

3. **Remove old Gmail variables:**
   - Remove `EMAIL_PASSWORD` (if exists)
   - Remove `EMAIL_SERVICE` (if exists)

4. **Add/Update these variables:**
   - **`SENDGRID_API_KEY`** = `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (your actual API key)
   - **`RECEIVING_EMAIL`** = `navjot67singh@gmail.com`
   - **`FROM_EMAIL`** = `navjot67singh@gmail.com` (the verified sender email)
   - **`EMAIL_USER`** = `navjot67singh@gmail.com` (optional, for fallback)
   - **`NODE_ENV`** = `production` (should already be set)

5. **Save Changes:**
   - Render will automatically redeploy (takes 2-3 minutes)

### Step 5: Test

1. **Wait for redeploy** (check Render logs)
2. **Visit:** https://toll-website.onrender.com
3. **Fill out the form and submit**
4. **Check email at:** navjot67singh@gmail.com
5. **Check Render logs** for email status

## Expected Logs

**Success:**
```
✅ SendGrid email server is ready to send messages
✅ Email sent successfully via SendGrid for submission from: [name] ([email])
```

**Failure:**
```
⚠️  SENDGRID_API_KEY not set in environment variables
❌ Error sending email via SendGrid: [error message]
```

## Troubleshooting

### Issue: "Invalid API Key"
- **Solution:** Double-check the API key in Render environment variables
- Make sure you copied the entire key (starts with `SG.`)
- Regenerate API key in SendGrid if needed

### Issue: "Sender not verified"
- **Solution:** Complete sender verification in SendGrid dashboard
- Go to: Settings → Sender Authentication → Verify a Single Sender
- Check your email and click verification link

### Issue: "Email not received"
- **Check spam folder** in your email
- **Check SendGrid Activity:** Dashboard → Activity (see if email was sent)
- **Check Render logs** for error messages

### Issue: "Rate limit exceeded"
- SendGrid free tier: 100 emails/day
- **Solution:** Wait until next day or upgrade SendGrid plan

## SendGrid Free Tier Limits

- ✅ **100 emails per day** (free forever)
- ✅ **Unlimited contacts**
- ✅ **Email API access**
- ✅ **Webhooks**
- ❌ No dedicated IP (upgrade for better deliverability)

## Cost

- **Free tier:** 100 emails/day (plenty for most websites)
- **Paid plans:** Start at $19.95/month for 50,000 emails/month

## Support

- **SendGrid Docs:** https://docs.sendgrid.com
- **SendGrid Support:** https://support.sendgrid.com

---

## Quick Checklist

- [ ] SendGrid account created
- [ ] Email verified in SendGrid
- [ ] API key created and copied
- [ ] Sender verified in SendGrid
- [ ] `SENDGRID_API_KEY` added to Render
- [ ] `RECEIVING_EMAIL` added to Render
- [ ] `FROM_EMAIL` added to Render
- [ ] Render redeployed
- [ ] Tested form submission
- [ ] Received email notification

Once all checked, your emails should work! 🎉



