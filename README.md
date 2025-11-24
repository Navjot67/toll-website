# Contact Form Website

A beautiful, modern contact form website that allows users to submit their information and sends it via email.

## Features

- ✨ Modern and responsive UI design
- 📧 Email notifications for form submissions
- ✅ Form validation
- 🎨 Beautiful gradient design
- 📱 Mobile-friendly

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email Settings

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file with your email credentials:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECEIVING_EMAIL=your-receiving-email@gmail.com
PORT=3000
```

### 3. Gmail Setup (Recommended)

If you're using Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this app password (not your regular Gmail password) in the `.env` file

**Note:** Using your regular Gmail password will not work. You must use an App Password.

### 4. Alternative Email Services

You can use other email services by changing the `EMAIL_SERVICE` in your `.env` file:

- **Outlook/Hotmail:** `EMAIL_SERVICE=outlook`
- **Yahoo:** `EMAIL_SERVICE=yahoo`
- **Custom SMTP:** Configure manually in `server.js` using SMTP settings

### 5. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### 6. Access the Website

Open your browser and navigate to:

```
http://localhost:3000
```

## Usage

1. Fill out the contact form with:
   - Full Name (required)
   - Email Address (required)
   - Phone Number (optional)
   - Subject (required)
   - Message (required)

2. Click "Send Message"

3. You will receive an email with the submitted information

## Project Structure

```
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # Frontend JavaScript
├── server.js       # Backend Express server
├── package.json    # Node.js dependencies
├── .env            # Environment variables (create from .env.example)
└── README.md       # This file
```

## Troubleshooting

### Email Not Sending

1. **Check your `.env` file** - Make sure all credentials are correct
2. **Gmail Users** - Use App Password, not your regular password
3. **Check spam folder** - Sometimes emails go to spam
4. **Verify transporter** - Check the console for error messages when starting the server

### Port Already in Use

If port 3000 is already in use, change the `PORT` in your `.env` file to a different number (e.g., 3001, 8080, etc.)

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords for Gmail instead of your main password
- Consider using environment-specific email services for production

## License

MIT

