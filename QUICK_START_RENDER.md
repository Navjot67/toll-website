# 🚀 Quick Start: Deploy to Render.com

## Step 1: Create GitHub Repository (5 minutes)

1. **Go to [github.com](https://github.com) and login**
2. **Click "+" icon → "New repository"**
3. **Repository settings:**
   - Name: `toll-website`
   - Description: "Toll Information Submission Website"
   - Choose **Public** (needed for free Render)
   - **DO NOT** check any boxes (no README, .gitignore, license)
   - Click **"Create repository"**

4. **In your Terminal, run these commands:**

```bash
cd "/Users/ghuman/TOLL WEBSITE"

# Add GitHub remote (REPLACE YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/toll-website.git

# Push to GitHub
git push -u origin main
```

**Note:** When pushing, GitHub will ask for login:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Get token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Select scope: `repo`
  - Copy the token and use it as password

---

## Step 2: Deploy to Render.com (10 minutes)

1. **Go to [render.com](https://render.com)**
2. **Click "Get Started for Free" → Sign up** (can use GitHub account)
3. **Click "New +" → "Web Service"**
4. **Connect GitHub:**
   - Click "Connect GitHub" (if not connected)
   - Authorize Render
   - Search for `toll-website`
   - Click **"Connect"**

5. **Configure Service:**
   - **Name:** `toll-website`
   - **Region:** Choose closest (e.g., Oregon)
   - **Branch:** `main`
   - **Root Directory:** Leave blank
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

6. **Add Environment Variables** (click "Add Environment Variable" for each):

   | Key | Value |
   |-----|-------|
   | `EMAIL_SERVICE` | `gmail` |
   | `EMAIL_USER` | `navjot67singh@gmail.com` |
   | `EMAIL_PASSWORD` | `your-gmail-app-password` |
   | `RECEIVING_EMAIL` | `navjot67singh@gmail.com` |
   | `NODE_ENV` | `production` |

   **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Generate password for "Mail"
   - Copy and paste into `EMAIL_PASSWORD`

7. **Plan:** Select **"Free"**

8. **Click "Create Web Service"**

9. **Wait 2-5 minutes** for deployment
   - You'll see build logs
   - When done: "Your service is live at https://toll-website.onrender.com"

---

## Step 3: Connect Your Hostinger Domain (15 minutes)

### In Render:

1. **Go to your service → "Settings" tab**
2. **Scroll to "Custom Domains" → "Add Custom Domain"**
3. **Enter your domain:** `yourdomain.com` (your actual domain)
4. **Click "Save"**
5. **Render will show DNS configuration** - copy this!

### In Hostinger:

1. **Login to [hpanel.hostinger.com](https://hpanel.hostinger.com)**
2. **Go to: Domains → [Your Domain] → DNS Zone Editor**
3. **Remove old A records** for @ and www (if any)
4. **Add new records** (use what Render provides):

   **If Render shows CNAME:**
   - Add CNAME:
     - Name: `@` (or blank)
     - Points to: `toll-website.onrender.com` (exactly as Render shows)
   - Add another CNAME:
     - Name: `www`
     - Points to: `toll-website.onrender.com`

   **If Render shows A Record (IP):**
   - Add A Record:
     - Name: `@` (or blank)
     - Points to: `[IP address from Render]`
   - Add another A Record:
     - Name: `www`
     - Points to: `[IP address from Render]`

5. **Save changes**

6. **Wait 1-24 hours** for DNS to propagate
   - Usually works within 1-2 hours
   - Check status: [whatsmydns.net](https://www.whatsmydns.net)

7. **Render will automatically add SSL** (free HTTPS)
   - Takes a few minutes after DNS is active
   - Your site will work at: `https://yourdomain.com`

---

## Step 4: Test Everything ✅

1. **Visit your domain:** `https://yourdomain.com`
2. **Test the form:**
   - Fill all fields
   - Submit
   - Check email at navjot67singh@gmail.com
3. **Done! 🎉**

---

## Troubleshooting

**Build fails?**
- Check Render logs: Dashboard → Your Service → Logs
- Make sure all files are pushed to GitHub

**Domain not working?**
- Wait longer (DNS can take 24-48 hours)
- Check DNS at [whatsmydns.net](https://www.whatsmydns.net)
- Verify DNS records match Render's instructions

**Emails not sending?**
- Check Render logs for errors
- Verify Gmail App Password is correct
- Make sure EMAIL_PASSWORD is set correctly in Render

---

## Need More Help?

See detailed guide: `RENDER_DEPLOYMENT.md`

