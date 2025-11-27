const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// For SendGrid REST API (more reliable than SMTP)
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// SendGrid REST API configuration (more reliable than SMTP on cloud platforms)
const sendgridApiKey = process.env.SENDGRID_API_KEY;

if (sendgridApiKey) {
    sgMail.setApiKey(sendgridApiKey);
    console.log('✅ SendGrid API configured');
} else {
    console.log('⚠️  SENDGRID_API_KEY not set in environment variables');
    console.log('⚠️  Please add SENDGRID_API_KEY to Render environment variables');
    console.log('⚠️  Emails will still be attempted when forms are submitted.');
}

// API endpoint to send email
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, tollType, nyTollAccount, plateNumber, njViolationNumber } = req.body;

        // Validate input - basic fields
        if (!name || !email || !tollType) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, and toll type are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email address format' 
            });
        }

        // Validate fields based on toll type
        if (tollType === 'NY' && (!nyTollAccount || !plateNumber)) {
            return res.status(400).json({ 
                error: 'Missing required fields for NY: NY Toll Account Number and Plate Number are required' 
            });
        }
        if (tollType === 'NJ' && (!njViolationNumber || !plateNumber)) {
            return res.status(400).json({ 
                error: 'Missing required fields for NJ: NJ Violation Number and Plate Number are required' 
            });
        }
        if (tollType === 'BOTH' && (!nyTollAccount || !njViolationNumber || !plateNumber)) {
            return res.status(400).json({ 
                error: 'Missing required fields for BOTH: NY Toll Account Number, NJ Violation Number, and Plate Number are required' 
            });
        }

        // Email content
        // Get email from environment variables (.env file) - Use EMAIL_USER as primary
        const emailUser = process.env.EMAIL_USER;
        const fromEmail = process.env.FROM_EMAIL || emailUser || 'noreply@tollwebsite.com';
        const receivingEmail = process.env.RECEIVING_EMAIL || emailUser || fromEmail;
        
        const mailOptions = {
            from: {
                name: 'Toll Information Form',
                address: fromEmail
            },
            to: receivingEmail,
            subject: `New Toll Information Submission - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                        New Toll Information Submission
                    </h2>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p style="margin-bottom: 15px;"><strong>Name:</strong> ${name}</p>
                        <p style="margin-bottom: 15px;"><strong>Email Address (for toll bill notifications):</strong> <a href="mailto:${email}">${email}</a></p>
                        <p style="margin-bottom: 15px;"><strong>NY Toll Bill Account Number:</strong> ${nyTollAccount}</p>
                        <p style="margin-bottom: 15px;"><strong>Plate Number:</strong> ${plateNumber}</p>
                        <p style="margin-bottom: 15px;"><strong>NJ Toll Violation Number:</strong> ${njViolationNumber}</p>
                    </div>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                        <p>This email was sent from your toll information submission form.</p>
                        <p>Submission Time: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `,
            text: `
New Toll Information Submission

Name: ${name}
Email Address (for toll bill notifications): ${email}
NY Toll Bill Account Number: ${nyTollAccount}
Plate Number: ${plateNumber}
NJ Toll Violation Number: ${njViolationNumber}

---
This email was sent from your toll information submission form.
Submission Time: ${new Date().toLocaleString()}
            `
        };

        // Send email using SendGrid REST API (more reliable than SMTP)
        if (!sendgridApiKey) {
            console.error('❌ Cannot send email: SENDGRID_API_KEY not configured');
            console.error('   Please set SENDGRID_API_KEY in Render environment variables');
            // Log submission details for manual follow-up
            console.log('   Submission details:', {
                name,
                email,
                nyTollAccount,
                plateNumber,
                njViolationNumber,
                timestamp: new Date().toISOString()
            });
        } else {
            try {
                // Use SendGrid REST API instead of SMTP
                const msg = {
                    to: receivingEmail,
                    from: fromEmail,
                    subject: `New Toll Information Submission - ${name}`,
                    text: `
New Toll Information Submission

Name: ${name}
Email Address (for toll bill notifications): ${email}
Toll Type Selected: ${tollType === 'NY' ? 'New York Only' : tollType === 'NJ' ? 'New Jersey Only' : 'Both NY and NJ'}
${tollType === 'NY' || tollType === 'BOTH' ? `NY Toll Bill Account Number: ${nyTollAccount}\n` : ''}${tollType === 'NJ' || tollType === 'BOTH' ? `NJ Toll Violation Number: ${njViolationNumber}\n` : ''}Plate Number: ${plateNumber}

---
This email was sent from your toll information submission form.
Submission Time: ${new Date().toLocaleString()}
                    `,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                New Toll Information Submission
                            </h2>
                            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                                <p style="margin-bottom: 15px;"><strong>Name:</strong> ${name}</p>
                                <p style="margin-bottom: 15px;"><strong>Email Address (for toll bill notifications):</strong> <a href="mailto:${email}">${email}</a></p>
                                <p style="margin-bottom: 15px;"><strong>Toll Type Selected:</strong> ${tollType === 'NY' ? 'New York Only' : tollType === 'NJ' ? 'New Jersey Only' : 'Both NY and NJ'}</p>
                                ${tollType === 'NY' || tollType === 'BOTH' ? `<p style="margin-bottom: 15px;"><strong>NY Toll Bill Account Number:</strong> ${nyTollAccount}</p>` : ''}
                                ${tollType === 'NJ' || tollType === 'BOTH' ? `<p style="margin-bottom: 15px;"><strong>NJ Toll Violation Number:</strong> ${njViolationNumber}</p>` : ''}
                                <p style="margin-bottom: 15px;"><strong>Plate Number:</strong> ${plateNumber}</p>
                            </div>
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                                <p>This email was sent from your toll information submission form.</p>
                                <p>Submission Time: ${new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    `
                };

                await sgMail.send(msg);
                console.log(`✅ Email sent successfully via SendGrid API for submission from: ${name} (${email})`);
            } catch (emailError) {
                console.error('❌ Error sending email via SendGrid API:', emailError.message);
                if (emailError.response) {
                    console.error('   SendGrid error details:', JSON.stringify(emailError.response.body, null, 2));
                }
                console.error('   This could be due to:');
                console.error('   1. Invalid SENDGRID_API_KEY');
                console.error('   2. Sender email not verified in SendGrid');
                console.error('   3. SendGrid rate limits reached');
                console.error('   4. Network issues');
                console.error('   Form submission was successful, but email notification failed.');
                // Log submission details for manual follow-up
                console.log('   Submission details:', {
                    name,
                    email,
                    tollType,
                    nyTollAccount: tollType === 'NY' || tollType === 'BOTH' ? nyTollAccount : 'N/A',
                    njViolationNumber: tollType === 'NJ' || tollType === 'BOTH' ? njViolationNumber : 'N/A',
                    plateNumber,
                    timestamp: new Date().toISOString()
                });
            }
        }

        res.json({ 
            message: 'Your information has been submitted successfully! Thank you.' 
        });
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ 
            error: 'Failed to process your submission. Please try again later or contact us directly.' 
        });
    }
});

// Test email endpoint
app.get('/test-email', async (req, res) => {
    try {
        if (!sendgridApiKey) {
            return res.status(500).json({ 
                error: 'SENDGRID_API_KEY not configured',
                message: 'Please set SENDGRID_API_KEY in Render environment variables'
            });
        }

        // Get email from environment variables (from .env file) - Use EMAIL_USER as primary
        const emailUser = process.env.EMAIL_USER;
        const fromEmail = process.env.FROM_EMAIL || emailUser || 'noreply@tollwebsite.com';
        const receivingEmail = process.env.RECEIVING_EMAIL || emailUser || fromEmail;

        if (!emailUser) {
            return res.status(500).json({ 
                error: 'EMAIL_USER not configured',
                message: 'Please set EMAIL_USER in your .env file or Render environment variables'
            });
        }

        if (!receivingEmail || receivingEmail === 'noreply@tollwebsite.com') {
            return res.status(500).json({ 
                error: 'Receiving email not configured',
                message: 'Please set RECEIVING_EMAIL or EMAIL_USER in your .env file or Render environment variables'
            });
        }

        const testMsg = {
            to: receivingEmail,
            from: fromEmail,
            subject: 'Test Email from Toll Website',
            text: 'This is a test email from your toll information website. If you receive this, email is working correctly!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #667eea;">✅ Email Test Successful!</h2>
                    <p>This is a test email from your toll information website.</p>
                    <p>If you receive this email, your SendGrid configuration is working correctly!</p>
                    <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                        Test Time: ${new Date().toLocaleString()}
                    </p>
                </div>
            `
        };

        await sgMail.send(testMsg);
        
        res.json({ 
            success: true,
            message: `Test email sent successfully to ${receivingEmail}`,
            from: fromEmail,
            to: receivingEmail,
            timestamp: new Date().toISOString(),
            note: 'Check your inbox (and spam folder) for the test email'
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ 
            error: 'Failed to send test email',
            message: error.message,
            details: error.response?.body || 'Check server logs for more details'
        });
    }
});

// Email checker service
let emailChecker = null;

// Initialize email checker if configured
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

if (emailUser && emailPassword) {
    try {
        const EmailChecker = require('./emailChecker');
        emailChecker = new EmailChecker();
        
        // Start checking emails
        console.log('📧 Starting email checker service...');
        emailChecker.connect();
        
        // Graceful shutdown
        process.on('SIGINT', () => {
            if (emailChecker) {
                emailChecker.stop();
            }
            process.exit(0);
        });
    } catch (error) {
        console.log('⚠️  Email checker not available:', error.message);
        console.log('   Install dependencies: npm install imap mailparser');
    }
} else {
    console.log('⚠️  Email checker not configured - EMAIL_USER or EMAIL_PASSWORD not set');
}

// Manual email check endpoint
app.get('/check-emails', (req, res) => {
    if (!emailChecker) {
        return res.status(503).json({ 
            error: 'Email checker not available',
            message: 'Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env file'
        });
    }

    emailChecker.manualCheck();
    
    res.json({ 
        success: true,
        message: 'Email check triggered manually',
        timestamp: new Date().toISOString()
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    if (NODE_ENV === 'development') {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`\nTo use this application:`);
        console.log(`1. Create a .env file in the root directory`);
        console.log(`2. Add your email credentials (see README.md for details)`);
        console.log(`3. Visit http://localhost:${PORT} in your browser\n`);
    } else {
        console.log(`Server is running on port ${PORT} (Production mode)`);
    }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

