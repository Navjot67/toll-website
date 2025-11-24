# Quick Domain Setup Guide

## Step 1: Choose a Hosting Option

### Easiest Option: Use Cloud Platform (Recommended)

**Render.com** (Free tier available):
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → Web Service"
3. Connect your GitHub repository (or create one)
4. Add these environment variables:
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_PASSWORD=your-gmail-app-password`
   - `RECEIVING_EMAIL=where-to-receive-emails@gmail.com`
5. Set Build Command: `npm install`
6. Set Start Command: `node server.js`
7. Click "Create Web Service"
8. Your site will be at: `https://your-app-name.onrender.com`

**Add Custom Domain:**
1. In Render dashboard, go to your service → Settings → Custom Domains
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `tollinfo.com`)
4. Render will provide DNS records to add to your domain registrar

### Alternative: Railway.app or Heroku
Same process - they'll provide you with a URL and instructions for custom domains.

## Step 2: Configure Your Domain DNS

Go to where you bought your domain (GoDaddy, Namecheap, Cloudflare, etc.):

### For Cloud Platforms (Render, Railway, Heroku):

**Option A: CNAME (if platform supports it)**
- Type: CNAME
- Name: @ (or leave blank)
- Value: `your-app-name.onrender.com` (or platform's URL)
- TTL: 3600

**Option B: A Record (if provided by platform)**
- Type: A
- Name: @ (or leave blank)
- Value: [IP address provided by platform]
- TTL: 3600

### For VPS (DigitalOcean, AWS, etc.):

**A Records:**
- Type: A
- Name: @ (or leave blank)
- Value: [Your server IP address]
- TTL: 3600

- Type: A
- Name: www
- Value: [Your server IP address]
- TTL: 3600

## Step 3: Wait for DNS Propagation

DNS changes can take 24-48 hours to propagate, but usually work within 1-2 hours.

Check if your DNS is working:
- Visit [whatsmydns.net](https://www.whatsmydns.net)
- Enter your domain
- See if it's pointing to the correct IP/server

## Step 4: SSL/HTTPS Setup

### Cloud Platforms:
Most platforms (Render, Railway, Heroku) automatically provide free SSL certificates. No action needed!

### VPS:
Use Let's Encrypt (free):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Common Domain Providers Setup

### GoDaddy:
1. Login → My Products → DNS Management
2. Add/Edit records as above
3. Save changes

### Namecheap:
1. Login → Domain List → Manage → Advanced DNS
2. Add/Edit records as above
3. Save changes

### Cloudflare:
1. Login → Select your domain → DNS → Records
2. Add/Edit records as above
3. Make sure proxy is enabled (orange cloud icon) for automatic HTTPS

## Testing After Setup

1. **Wait 1-2 hours** for DNS to propagate
2. Visit `https://yourdomain.com` (use https, not http)
3. Test the form submission
4. Check that emails are received

## Troubleshooting

**Domain not working?**
- Check DNS records are correct
- Wait longer (up to 48 hours)
- Verify with `dig yourdomain.com` or [whatsmydns.net](https://www.whatsmydns.net)

**SSL/HTTPS not working?**
- Cloud platforms: Usually automatic, check platform docs
- VPS: Make sure Let's Encrypt certificate is installed and Nginx is configured

**Emails not sending?**
- Double-check EMAIL_USER and EMAIL_PASSWORD in environment variables
- For Gmail, make sure you're using an App Password, not regular password

## Need Help?

Check the full `DEPLOYMENT.md` guide for detailed instructions for each platform.

