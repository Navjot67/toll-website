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
// Try multiple configurations for better compatibility with cloud platforms
const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPass) {
        console.log('⚠️  EMAIL_USER or EMAIL_PASSWORD not set in environment variables');
        return null;
    }

    // Try port 465 (SSL) first, fallback to 587 (TLS)
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // SSL port - more reliable for cloud platforms
        secure: true, // true for 465, false for other ports
        auth: {
            user: emailUser,
            pass: emailPass
        },
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 20000,
        socketTimeout: 20000,
        // TLS options
        tls: {
            rejectUnauthorized: false, // Accept self-signed certificates
            ciphers: 'SSLv3'
        },
        // Pool connections for better performance
        pool: true,
        maxConnections: 1,
        maxMessages: 3
    });
};

const transporter = createTransporter();

// Verify transporter configuration (non-blocking)
// This won't block server startup if email fails
if (transporter) {
    transporter.verify(function(error, success) {
        if (error) {
            console.log('⚠️  Email transporter warning:', error.message);
            console.log('⚠️  Email verification failed, but server will still start.');
            console.log('⚠️  Please verify EMAIL_USER and EMAIL_PASSWORD in Render environment variables.');
            console.log('⚠️  Emails will still be attempted when forms are submitted.');
            console.log('⚠️  Note: Render free tier may have network restrictions affecting Gmail connections.');
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });
} else {
    console.log('⚠️  Email transporter not configured - EMAIL_USER or EMAIL_PASSWORD missing');
}

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

        // Send email with timeout handling and retry logic
        if (!transporter) {
            console.error('❌ Cannot send email: Email transporter not configured');
            console.error('   Please set EMAIL_USER and EMAIL_PASSWORD in Render environment variables');
        } else {
            try {
                // Try sending with timeout
                const emailResult = await Promise.race([
                    transporter.sendMail(mailOptions),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Email send timeout after 15 seconds')), 15000)
                    )
                ]);
                console.log(`✅ Email sent successfully for submission from: ${name} (${email})`);
            } catch (emailError) {
                console.error('❌ Error sending email:', emailError.message);
                console.error('   This could be due to:');
                console.error('   1. Network restrictions on Render free tier');
                console.error('   2. Gmail blocking connections from cloud IPs');
                console.error('   3. Incorrect EMAIL_PASSWORD (must be Gmail App Password)');
                console.error('   4. Gmail security settings blocking the connection');
                console.error('   Form submission was successful, but email notification failed.');
                // Log submission details for manual follow-up
                console.log('   Submission details:', {
                    name,
                    email,
                    nyTollAccount,
                    plateNumber,
                    njViolationNumber,
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

