# Deploy to Render.com - Step by Step Guide

This guide will walk you through deploying your toll website to Render.com (free tier available).

## Prerequisites
- GitHub account (free at github.com)
- Render.com account (free at render.com)

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Easiest)

1. **Go to [github.com](https://github.com) and login**

2. **Create a new repository:**
   - Click the "+" icon in top right → "New repository"
   - Repository name: `toll-website` (or any name you prefer)
   - Description: "Toll Information Submission Website"
   - Choose: **Public** (for free Render) or Private (if you have paid GitHub)
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

3. **GitHub will show you commands - use these:**

   Open Terminal in your project folder and run:
   
   ```bash
   cd "/Users/ghuman/TOLL WEBSITE"
   
   # Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/toll-website.git
   
   # Rename branch to main (if needed)
   git branch -M main
   
   # Commit all files
   git add .
   git commit -m "Initial commit - Toll website"
   
   # Push to GitHub
   git push -u origin main
   ```

   **Note:** You'll need to login to GitHub when pushing (use GitHub Personal Access Token if 2FA is enabled)

### Option B: Using GitHub CLI (if installed)

```bash
cd "/Users/ghuman/TOLL WEBSITE"
gh repo create toll-website --public --source=. --remote=origin --push
```

## Step 2: Deploy to Render.com

### 2.1 Create Render Account

1. **Go to [render.com](https://render.com)**
2. **Click "Get Started for Free"**
3. **Sign up** (can use GitHub account for easy connection)

### 2.2 Create New Web Service

1. **In Render Dashboard, click "New +" → "Web Service"**

2. **Connect your GitHub repository:**
   - If not connected, click "Connect GitHub" and authorize
   - Search for your repository: `toll-website`
   - Click "Connect" next to your repository

3. **Configure the service:**
   - **Name:** `toll-website` (or your preferred name)
   - **Region:** Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch:** `main` (or `master`)
   - **Root Directory:** Leave blank (your files are in root)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. **Scroll down to "Environment Variables" section**

5. **Add these environment variables** (click "Add Environment Variable" for each):
   
   ```
   Key: EMAIL_SERVICE
   Value: gmail
   ```
   
   ```
   Key: EMAIL_USER
   Value: navjot67singh@gmail.com
   ```
   
   ```
   Key: EMAIL_PASSWORD
   Value: your-gmail-app-password
   ```
   (Get App Password from: https://myaccount.google.com/apppasswords)
   
   ```
   Key: RECEIVING_EMAIL
   Value: navjot67singh@gmail.com
   ```
   
   ```
   Key: NODE_ENV
   Value: production
   ```
   
   ```
   Key: PORT
   Value: 3001
   ```
   (Render will automatically set PORT, but this is backup)

6. **Choose plan:**
   - Select **"Free"** plan
   - Note: Free tier may spin down after inactivity

7. **Click "Create Web Service"**

8. **Wait for deployment** (usually 2-5 minutes)
   - You'll see build logs
   - Once complete, you'll see: "Your service is live at https://toll-website.onrender.com"

## Step 3: Test Your Deployed Website

1. **Visit your Render URL:**
   - Example: `https://toll-website.onrender.com`
   - Test the form submission
   - Check that you receive emails at navjot67singh@gmail.com

## Step 4: Connect Your Hostinger Domain

### 4.1 In Render Dashboard

1. **Go to your Web Service** → Click on it
2. **Click "Settings"** tab
3. **Scroll to "Custom Domains"** section
4. **Click "Add Custom Domain"**
5. **Enter your domain:** `yourdomain.com` (replace with your actual domain)
6. **Click "Save"**
7. **Render will show you DNS configuration:**
   - You'll see either:
     - **CNAME record** to add, OR
     - **A record** with IP address to add
   - **Copy this information** (you'll need it for Hostinger)

### 4.2 In Hostinger hPanel

1. **Login to [hpanel.hostinger.com](https://hpanel.hostinger.com)**

2. **Go to Domains → Your Domain → DNS Zone Editor**

3. **Add DNS Records:**

   **If Render gave you CNAME:**
   - Click "Add Record"
   - Type: `CNAME`
   - Name: `@` (or leave blank)
   - Points to: `your-app-name.onrender.com` (exactly as Render shows)
   - TTL: `3600` (or default)
   - Click "Save"
   
   - Add another for www:
   - Type: `CNAME`
   - Name: `www`
   - Points to: `your-app-name.onrender.com`
   - TTL: `3600`
   - Click "Save"

   **If Render gave you A Record (IP address):**
   - Click "Add Record"
   - Type: `A`
   - Name: `@` (or leave blank)
   - Points to: `[IP address from Render]`
   - TTL: `3600`
   - Click "Save"
   
   - Add another for www:
   - Type: `A`
   - Name: `www`
   - Points to: `[IP address from Render]`
   - TTL: `3600`
   - Click "Save"

4. **Wait for DNS propagation:**
   - Usually 1-2 hours, can take up to 24-48 hours
   - You can check status at: [whatsmydns.net](https://www.whatsmydns.net)

### 4.3 Back in Render

1. **Render will automatically detect your DNS changes**
2. **It will automatically provision SSL certificate** (free HTTPS)
3. **Wait for SSL to activate** (usually a few minutes)
4. **Your site will be available at:** `https://yourdomain.com`

## Step 5: Verify Everything Works

1. **Visit `https://yourdomain.com`** (use https, not http)
2. **Test the form:**
   - Fill out all fields
   - Submit the form
   - Check that you receive email at navjot67singh@gmail.com
3. **Check Render logs** if something doesn't work:
   - Go to Render Dashboard → Your Service → "Logs" tab

## Troubleshooting

### Build Fails on Render

**Check build logs:**
- Go to Render Dashboard → Your Service → "Events" tab
- Look for error messages
- Common issues:
  - Missing dependencies (check package.json)
  - Wrong start command (should be `node server.js`)
  - Environment variables not set

### Domain Not Working

**Check DNS propagation:**
- Visit [whatsmydns.net](https://www.whatsmydns.net)
- Enter your domain
- Check if DNS records are correct

**Common issues:**
- DNS not propagated yet (wait longer)
- Wrong DNS records in Hostinger
- Render hasn't detected DNS changes yet

### SSL Certificate Not Working

- Make sure DNS is properly configured first
- Wait longer (can take 24-48 hours for SSL)
- Check Render logs for SSL errors
- Contact Render support if issues persist

### Emails Not Sending

**Check Render logs:**
- Go to Render Dashboard → Your Service → "Logs" tab
- Look for email-related errors

**Common issues:**
- Wrong Gmail App Password
- Gmail blocking access (check Google account security)
- EMAIL_PASSWORD environment variable not set correctly

### App Spinning Down (Free Tier)

**Free tier limitation:**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds

**Solutions:**
- Upgrade to paid plan ($7/month) for always-on
- Use a free uptime monitoring service (like UptimeRobot) to ping your site every 5 minutes

## Updating Your Website

When you make changes to your code:

```bash
cd "/Users/ghuman/TOLL WEBSITE"

# Make your changes to files

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push

# Render will automatically detect changes and redeploy
# Check Render dashboard for deployment status
```

## Render Free Tier Limits

- **512 MB RAM**
- **0.1 CPU**
- **Spins down after 15 min inactivity**
- **750 hours/month free** (enough for always-on if you keep it active)

## Need Help?

- **Render Support:** support@render.com
- **Render Docs:** https://render.com/docs
- **Check logs:** Render Dashboard → Your Service → Logs

---

## Quick Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created on Render
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Domain added in Render
- [ ] DNS records added in Hostinger
- [ ] SSL certificate activated
- [ ] Website tested and working
- [ ] Emails being received

Good luck with your deployment! 🚀


