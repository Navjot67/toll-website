# Deployment Guide - Connecting to Domain

This guide will help you deploy your toll information website and connect it to a custom domain.

## Option 1: Deploy to Cloud Platform (Easiest - Recommended)

### A. Deploy to Render (Free tier available)

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or create one if needed)
   - Select your repository

3. **Configure the service:**
   - **Name:** toll-website (or your preferred name)
   - **Region:** Choose closest to you
   - **Branch:** main (or master)
   - **Root Directory:** Leave blank (or `/` if your files are in root)
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:** Click "Advanced" and add:
     ```
     EMAIL_SERVICE=gmail
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-password
     RECEIVING_EMAIL=your-receiving-email@gmail.com
     NODE_ENV=production
     ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your site will be available at: `https://your-app-name.onrender.com`

5. **Connect Custom Domain:**
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain (e.g., `tollinfo.com`)
   - Render will provide DNS records to add to your domain registrar

### B. Deploy to Railway (Simple alternative)

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js and deploys
5. Add environment variables in the Variables tab
6. Add custom domain in the Settings tab

### C. Deploy to Heroku

1. Install Heroku CLI: `brew install heroku/brew/heroku` (Mac)
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set EMAIL_SERVICE=gmail
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set RECEIVING_EMAIL=your-receiving-email@gmail.com
   ```
5. Deploy: `git push heroku main`
6. Add domain: `heroku domains:add yourdomain.com`

## Option 2: Deploy to VPS (More Control)

### Using DigitalOcean, AWS EC2, or Linode

1. **Create a VPS:**
   - Choose Ubuntu 22.04 LTS
   - Minimum: 1GB RAM, 1 CPU

2. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2 (Process Manager):**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone your project:**
   ```bash
   cd /var/www
   git clone your-repo-url toll-website
   cd toll-website
   npm install
   ```

6. **Create production .env file:**
   ```bash
   nano .env
   # Add your environment variables
   ```

7. **Start with PM2:**
   ```bash
   pm2 start server.js --name toll-website
   pm2 save
   pm2 startup
   ```

8. **Install Nginx (Web Server):**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

9. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/toll-website
   ```
   
   Add this configuration:
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

10. **Enable the site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/toll-website /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Install SSL with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```

12. **Update DNS:**
    - Go to your domain registrar (GoDaddy, Namecheap, etc.)
    - Add an A record pointing to your server IP:
      - Type: A
      - Host: @ (or leave blank)
      - Value: your-server-ip-address
      - TTL: 3600 (or default)
    - Add another A record for www:
      - Type: A
      - Host: www
      - Value: your-server-ip-address

## Option 3: Traditional Web Hosting

If you have shared hosting (like Bluehost, HostGator) with Node.js support:

1. Upload your files via FTP/SFTP
2. Set environment variables in hosting control panel
3. Configure the domain in hosting panel
4. Contact support for Node.js startup configuration

## DNS Configuration (After Deployment)

### For Cloud Platforms (Render, Railway, Heroku):
They'll provide you with:
- CNAME record: `yourdomain.com` → `your-app.onrender.com`
- Or instructions to point A record to their IP

### For VPS:
- A record: `@` → `your-server-ip`
- A record: `www` → `your-server-ip`

## Testing Your Deployment

1. **Check if server is running:**
   - Visit your deployed URL
   - Submit a test form

2. **Check email:**
   - Ensure emails are being sent
   - Check spam folder

3. **Test domain:**
   - After DNS propagation (can take 24-48 hours)
   - Visit `https://yourdomain.com`

## Troubleshooting

### Server not starting:
- Check environment variables are set
- Check logs: `pm2 logs` (VPS) or platform logs (cloud)
- Verify port configuration

### Email not sending:
- Double-check EMAIL_USER and EMAIL_PASSWORD
- For Gmail, ensure App Password is used
- Check spam folder

### Domain not working:
- Wait for DNS propagation (up to 48 hours)
- Use `dig yourdomain.com` to check DNS
- Verify DNS records are correct

## Security Checklist

- [ ] Use strong passwords for email
- [ ] Enable HTTPS/SSL
- [ ] Keep Node.js updated
- [ ] Use environment variables (never commit .env)
- [ ] Set up regular backups
- [ ] Monitor server logs

## Quick Start Commands (VPS)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
cd /var/www
git clone your-repo-url toll-website
cd toll-website
npm install

# Create .env
nano .env

# Start with PM2
pm2 start server.js --name toll-website
pm2 save
pm2 startup

# Install and configure Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/toll-website
# (paste nginx config above)
sudo ln -s /etc/nginx/sites-available/toll-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

