const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Email transporter configuration
// Using direct SMTP for Gmail to avoid connection timeout issues
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // Allow connections to untrusted servers (needed for some environments)
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration (non-blocking)
// This won't block server startup if email fails
transporter.verify(function(error, success) {
    if (error) {
        console.log('⚠️  Email transporter warning:', error.message);
        console.log('⚠️  Email verification failed, but server will still start.');
        console.log('⚠️  Please verify EMAIL_USER and EMAIL_PASSWORD in Render environment variables.');
        console.log('⚠️  Emails may fail to send until this is resolved.');
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// API endpoint to send email
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, nyTollAccount, plateNumber, njViolationNumber } = req.body;

        // Validate input
        if (!name || !email || !nyTollAccount || !plateNumber || !njViolationNumber) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, NY toll account, plate number, and NJ violation number are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email address format' 
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVING_EMAIL || process.env.EMAIL_USER,
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

        // Send email with timeout handling
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully for submission from: ${name}`);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Don't fail the request if email fails, but log it
            // You can check logs to see failed email attempts
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

