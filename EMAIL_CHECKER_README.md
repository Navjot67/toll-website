# Email Checker & Automation Service

## Overview

The email checker service automatically monitors your email inbox for new emails and runs automation when toll-related emails are detected.

## Features

✅ **Automatic Email Checking** - Checks for new emails every 5 minutes  
✅ **Toll Keyword Detection** - Identifies emails related to tolls/violations  
✅ **Automation Ready** - Extensible system for processing emails  
✅ **Manual Trigger** - API endpoint to manually check emails  
✅ **IMAP Support** - Uses Gmail IMAP for reliable email access

## Configuration

The service reads from your `.env` file:

```env
EMAIL_USER=myezpassdata@gmail.com          # Your Gmail address
EMAIL_PASSWORD=onpamejlizpavpqh            # Gmail App Password (not regular password)
```

**Important:** Use Gmail App Password, not your regular password!

## How It Works

1. **Connects to Gmail IMAP** server
2. **Checks for new emails** every 5 minutes automatically
3. **Scans email content** for toll-related keywords
4. **Runs automation** when toll emails are detected
5. **Logs all activity** for monitoring

## Toll Keywords Detected

The service looks for these keywords in email content:
- `toll`
- `violation`
- `account`
- `plate`
- `ny` / `new york`
- `nj` / `new jersey`

## Manual Email Check

### Via API Endpoint

**Local:**
```
GET http://localhost:3001/check-emails
```

**Render:**
```
GET https://toll-website.onrender.com/check-emails
```

**Response:**
```json
{
  "success": true,
  "message": "Email check triggered manually",
  "timestamp": "2025-11-24T..."
}
```

### Via cURL
```bash
curl http://localhost:3001/check-emails
```

## Automation Customization

Edit `emailChecker.js` to customize automation logic:

```javascript
async runAutomation(email) {
    // Extract information from email
    const emailData = {
        from: email.from.text,
        subject: email.subject,
        date: email.date,
        text: email.text,
        html: email.html
    };

    // Add your custom automation here:
    // - Extract toll data from email
    // - Save to database
    // - Send notifications
    // - Process toll information
    // - Update records
}
```

## Email Processing Flow

1. **Email Received** → Detected by checker
2. **Content Analysis** → Scanned for keywords
3. **Automation Triggered** → If toll-related
4. **Data Extraction** → Extract relevant info
5. **Processing** → Run your custom logic
6. **Logging** → All actions logged

## Logs & Monitoring

The service logs all activity:

```
📧 Starting email checker service...
✅ Connected to email server
📧 Checking for new emails since...
📬 Found 2 new email(s)
📧 Processing Email #1:
   From: example@domain.com
   Subject: Toll Violation Notice
   ⚠️  Email contains toll-related content - Running automation...
   🤖 Running automation for toll-related email...
   ✅ Automation completed
```

## Troubleshooting

### "IMAP connection error: Invalid credentials"

**Solution:**
1. Make sure you're using Gmail App Password (not regular password)
2. Get App Password: https://myaccount.google.com/apppasswords
3. Update `EMAIL_PASSWORD` in `.env` file

### "Email checker not available"

**Solution:**
1. Install dependencies: `npm install imap mailparser`
2. Make sure `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`
3. Restart the server

### "No new emails found"

**Solution:**
- This is normal if there are no new emails
- Service checks every 5 minutes automatically
- Use `/check-emails` endpoint for manual check

## Security Notes

⚠️ **Important Security:**
- Never commit `.env` file to git
- Use Gmail App Password (not regular password)
- Keep your API keys secure
- Monitor logs for suspicious activity

## Customization Examples

### Example 1: Save to Database
```javascript
async runAutomation(email) {
    // Extract toll info
    const tollData = extractTollInfo(email.text);
    
    // Save to database
    await db.save('toll_submissions', tollData);
}
```

### Example 2: Send Notification
```javascript
async runAutomation(email) {
    // Extract info
    const info = extractInfo(email);
    
    // Send notification
    await sendNotification('New toll email received', info);
}
```

### Example 3: Extract Specific Data
```javascript
async runAutomation(email) {
    // Extract account numbers, plate numbers, etc.
    const accountNum = extractAccountNumber(email.text);
    const plateNum = extractPlateNumber(email.text);
    
    // Process extracted data
    processTollData(accountNum, plateNum);
}
```

## Status Endpoints

Check service status:

**Get Email Checker Status:**
```bash
curl http://localhost:3001/check-emails
```

## Next Steps

1. ✅ Service is running automatically
2. ✅ Checks emails every 5 minutes
3. ⚙️ Customize `runAutomation()` function with your logic
4. 📊 Monitor logs for email processing
5. 🔧 Add database storage if needed
6. 📧 Configure notification system

## Support

- Check server logs for detailed error messages
- Verify Gmail App Password is correct
- Test with `/check-emails` endpoint
- Review email content for keyword matching


