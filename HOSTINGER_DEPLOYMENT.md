# Deploying to Hostinger - Step by Step Guide

Since you already have a domain with Hostinger, here are your deployment options:

## Option 1: Hostinger VPS/Cloud Hosting (Recommended for Node.js)

If you have Hostinger VPS or Cloud Hosting that supports Node.js:

### Step 1: Connect to Your Hostinger Server

1. **Get your server details:**
   - Login to Hostinger hPanel
   - Go to VPS section
   - Note your server IP address
   - Get SSH credentials (or create SSH access if not already set)

2. **Connect via SSH:**
   ```bash
   ssh root@your-server-ip
   # Or
   ssh username@your-server-ip
   ```

### Step 2: Install Node.js on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Upload Your Website Files

**Option A: Using Git (Recommended)**
```bash
# Install git if not installed
sudo apt install git -y

# Clone your repository (if on GitHub)
cd /home/your-username
git clone your-github-repo-url toll-website
cd toll-website
npm install
```

**Option B: Using SFTP/FTP**
1. Use FileZilla or Cyberduck
2. Connect to your Hostinger server via SFTP
3. Upload all project files to: `/home/your-username/toll-website/`
4. SSH into server and run: `cd toll-website && npm install`

### Step 4: Create Production .env File

```bash
cd /home/your-username/toll-website
nano .env
```

Add your configuration:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=navjot67singh@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
RECEIVING_EMAIL=navjot67singh@gmail.com
NODE_ENV=production
PORT=3001
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 5: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Start your application
cd /home/your-username/toll-website
pm2 start server.js --name toll-website

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
# Follow the command it outputs (usually requires sudo)
```

### Step 6: Install and Configure Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/toll-website
```

Add this configuration (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/toll-website /etc/nginx/sites-enabled/

# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 7: Install SSL Certificate (Let's Encrypt - Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

### Step 8: Configure DNS in Hostinger

1. **Login to Hostinger hPanel**
2. **Go to Domains → Your Domain → DNS Zone Editor**
3. **Set these DNS records:**

   **Remove any existing A records for @ and www, then add:**
   
   - **A Record:**
     - Name: `@` (or leave blank)
     - Points to: `your-server-ip-address`
     - TTL: 3600
   
   - **A Record:**
     - Name: `www`
     - Points to: `your-server-ip-address`
     - TTL: 3600

4. **Save changes**

DNS propagation can take 1-24 hours, but usually works within 1-2 hours.

### Step 9: Test Your Website

1. Wait 1-2 hours for DNS to propagate
2. Visit `https://yourdomain.com`
3. Test the form submission
4. Check that emails are received

---

## Option 2: Use Hostinger + Cloud Platform (Easier Alternative)

If Hostinger shared hosting doesn't support Node.js, deploy the app elsewhere and point your Hostinger domain to it:

### Step 1: Deploy to Render.com (Free)

1. Push your code to GitHub
2. Create account at [render.com](https://render.com)
3. Create new Web Service from GitHub
4. Add environment variables in Render
5. Deploy

### Step 2: Point Hostinger Domain to Render

1. **In Render Dashboard:**
   - Go to your service → Settings → Custom Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Render will provide you with DNS records

2. **In Hostinger hPanel:**
   - Go to Domains → Your Domain → DNS Zone Editor
   - Add CNAME record:
     - Name: `@` (or use A record if Render provides IP)
     - Points to: `your-app.onrender.com` (or IP if provided)
     - TTL: 3600
   - Add another for www:
     - Name: `www`
     - Points to: `your-app.onrender.com` (or IP)
     - TTL: 3600

3. Render will automatically provide free SSL certificate

---

## Option 3: Hostinger Shared Hosting (If Node.js is supported)

If Hostinger shared hosting supports Node.js:

1. **Login to Hostinger hPanel**
2. **Upload files via File Manager:**
   - Go to File Manager
   - Navigate to `public_html` or create subdomain
   - Upload all your website files

3. **Install Node.js via hPanel:**
   - Look for "Node.js" or "Node.js Selector" in hPanel
   - Install Node.js version 18 or 20
   - Set your project directory

4. **Configure environment variables:**
   - In hPanel, find environment variables section
   - Add all variables from `.env` file

5. **Start the application:**
   - Use Node.js selector or SSH to start: `node server.js`
   - Or configure it to auto-start via hPanel

6. **Configure domain:**
   - Domain should already be pointing to Hostinger
   - May need to configure .htaccess if using Apache

---

## Troubleshooting

### Can't SSH into Hostinger VPS?
- Check if SSH access is enabled in Hostinger hPanel
- Verify your IP is whitelisted (if required)
- Check if you're using the correct port (usually 22)

### Node.js not working?
- Make sure you're using VPS/Cloud hosting (shared hosting may not support it)
- Verify Node.js is installed: `node --version`
- Check PM2 is running: `pm2 status`

### Domain not resolving?
- Wait longer for DNS propagation (up to 48 hours)
- Use [whatsmydns.net](https://www.whatsmydns.net) to check DNS status
- Verify DNS records in Hostinger are correct
- Check Nginx is running: `sudo systemctl status nginx`

### Emails not sending?
- Verify `.env` file has correct Gmail App Password
- Check server logs: `pm2 logs toll-website`
- Test email configuration: `pm2 logs` and look for errors

### SSL Certificate issues?
- Make sure domain is pointing to your server first
- Check Nginx is running: `sudo systemctl status nginx`
- Renew certificate: `sudo certbot renew --dry-run`

---

## Quick Commands Reference

```bash
# Check server status
pm2 status

# View logs
pm2 logs toll-website

# Restart application
pm2 restart toll-website

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check if domain resolves
dig yourdomain.com

# View server resources
htop
```

---

## Next Steps

1. **Determine your Hostinger hosting type** (VPS/Cloud/Shared)
2. **Follow the appropriate option above**
3. **Test your website** once deployed
4. **Monitor logs** for any issues

Need help? Let me know what type of Hostinger hosting you have, and I can provide more specific guidance!

