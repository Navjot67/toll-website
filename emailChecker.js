// Email Checker Service - Checks for new emails and runs automation
const Imap = require('imap');
const { simpleParser } = require('mailparser');
require('dotenv').config();

class EmailChecker {
    constructor() {
        this.imap = null;
        this.isChecking = false;
        this.lastCheckedDate = new Date();
        this.checkInterval = null;
    }

    // Initialize IMAP connection
    connect() {
        const emailUser = process.env.EMAIL_USER;
        const emailPassword = process.env.EMAIL_PASSWORD;

        if (!emailUser || !emailPassword) {
            console.error('❌ EMAIL_USER or EMAIL_PASSWORD not set in .env file');
            return false;
        }

        // IMAP configuration for Gmail
        this.imap = new Imap({
            user: emailUser,
            password: emailPassword,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

        this.imap.once('ready', () => {
            console.log('✅ Connected to email server');
            this.checkForNewEmails();
            // Check every 1 minute
            this.checkInterval = setInterval(() => {
                this.checkForNewEmails();
            }, 60 * 1000); // 1 minute
        });

        this.imap.once('error', (err) => {
            console.error('❌ IMAP connection error:', err.message);
            if (err.message.includes('Invalid credentials')) {
                console.error('   Make sure you are using Gmail App Password, not regular password');
            }
        });

        this.imap.once('end', () => {
            console.log('📧 IMAP connection ended');
        });

        this.imap.connect();
        return true;
    }

    // Check for new emails
    checkForNewEmails() {
        if (this.isChecking) {
            console.log('⏳ Email check already in progress, skipping...');
            return;
        }

        if (!this.imap || this.imap.state !== 'authenticated') {
            console.log('⚠️  IMAP not connected, attempting to connect...');
            this.connect();
            return;
        }

        this.isChecking = true;
        console.log(`📧 Checking for new emails since ${this.lastCheckedDate.toLocaleString()}...`);

        this.imap.openBox('INBOX', false, (err, box) => {
            if (err) {
                console.error('❌ Error opening INBOX:', err.message);
                this.isChecking = false;
                return;
            }

            // Search for unread emails since last check
            const searchCriteria = [
                'UNSEEN',
                ['SINCE', this.lastCheckedDate]
            ];

            this.imap.search(searchCriteria, (err, results) => {
                if (err) {
                    console.error('❌ Error searching emails:', err.message);
                    this.isChecking = false;
                    return;
                }

                if (!results || results.length === 0) {
                    console.log('✅ No new emails found');
                    this.isChecking = false;
                    return;
                }

                console.log(`📬 Found ${results.length} new email(s)`);
                
                const fetch = this.imap.fetch(results, {
                    bodies: '',
                    struct: true
                });

                fetch.on('message', (msg, seqno) => {
                    msg.on('body', (stream) => {
                        simpleParser(stream, async (err, parsed) => {
                            if (err) {
                                console.error(`❌ Error parsing email ${seqno}:`, err.message);
                                return;
                            }

                            await this.processEmail(parsed, seqno);
                        });
                    });
                });

                fetch.once('end', () => {
                    console.log('✅ Finished processing new emails');
                    this.lastCheckedDate = new Date();
                    this.isChecking = false;
                });
            });
        });
    }

    // Process individual email
    async processEmail(email, seqno) {
        try {
            console.log(`\n📧 Processing Email #${seqno}:`);
            console.log(`   From: ${email.from.text}`);
            console.log(`   Subject: ${email.subject}`);
            console.log(`   Date: ${email.date}`);

            // Extract email content
            const textContent = email.text || '';
            const htmlContent = email.html || '';

            // Check if email contains toll-related keywords
            const tollKeywords = ['toll', 'violation', 'account', 'plate', 'ny', 'nj', 'new york', 'new jersey'];
            const contentToCheck = (textContent + htmlContent).toLowerCase();

            const hasTollContent = tollKeywords.some(keyword => contentToCheck.includes(keyword));

            if (hasTollContent) {
                console.log('   ⚠️  Email contains toll-related content - Running automation...');
                await this.runAutomation(email);
            } else {
                console.log('   ℹ️  Email does not contain toll-related keywords');
            }

        } catch (error) {
            console.error(`❌ Error processing email ${seqno}:`, error.message);
        }
    }

    // Run automation based on email content
    async runAutomation(email) {
        try {
            console.log('   🤖 Running automation for toll-related email...');

            // Extract toll information from email
            const tollData = this.extractTollData(email);
            
            if (!tollData) {
                console.log('   ⚠️  Could not extract toll data from email');
                return;
            }

            console.log('   📋 Extracted toll data:');
            console.log('      Name:', tollData.name);
            console.log('      Email:', tollData.userEmail);
            console.log('      Toll Type:', tollData.tollType);
            console.log('      NY Account:', tollData.nyAccount || 'N/A');
            console.log('      NJ Violation:', tollData.njViolation || 'N/A');
            console.log('      Plate Number:', tollData.plateNumber);

            // Send email to user with their data
            await this.sendDataToUser(tollData);

            console.log('   ✅ Automation completed - Data sent to user');

        } catch (error) {
            console.error('❌ Automation error:', error.message);
            console.error('   Stack:', error.stack);
        }
    }

    // Extract toll data from email content
    extractTollData(email) {
        try {
            const text = email.text || '';
            const html = email.html || '';
            
            // Parse data from email text/HTML
            const nameMatch = text.match(/Name:\s*([^\n]+)/i) || html.match(/<strong>Name:<\/strong>\s*([^<\n]+)/i);
            const emailMatch = text.match(/Email Address.*?:\s*([^\s\n]+@[^\s\n]+)/i) || html.match(/Email Address.*?<\/strong>.*?<a[^>]*>([^<]+)<\/a>/i);
            const tollTypeMatch = text.match(/Toll Type Selected:\s*([^\n]+)/i) || html.match(/Toll Type Selected:<\/strong>\s*([^<\n]+)/i);
            const nyAccountMatch = text.match(/NY Toll Bill Account Number:\s*([^\n]+)/i) || html.match(/NY Toll Bill Account Number:<\/strong>\s*([^<\n]+)/i);
            const njViolationMatch = text.match(/NJ Toll Violation Number:\s*([^\n]+)/i) || html.match(/NJ Toll Violation Number:<\/strong>\s*([^<\n]+)/i);
            const plateMatch = text.match(/Plate Number:\s*([^\n]+)/i) || html.match(/Plate Number:<\/strong>\s*([^<\n]+)/i);

            const name = nameMatch ? nameMatch[1].trim() : null;
            const userEmail = emailMatch ? emailMatch[1].trim() : null;
            const tollType = tollTypeMatch ? tollTypeMatch[1].trim() : null;
            const nyAccount = nyAccountMatch ? nyAccountMatch[1].trim() : null;
            const njViolation = njViolationMatch ? njViolationMatch[1].trim() : null;
            const plateNumber = plateMatch ? plateMatch[1].trim() : null;

            if (!name || !userEmail) {
                console.log('   ⚠️  Missing required fields (name or email)');
                return null;
            }

            return {
                name,
                userEmail,
                tollType,
                nyAccount,
                njViolation,
                plateNumber,
                extractedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('   ❌ Error extracting toll data:', error.message);
            return null;
        }
    }

    // Send extracted data back to user
    async sendDataToUser(tollData) {
        try {
            const sgMail = require('@sendgrid/mail');
            require('dotenv').config();

            const sendgridApiKey = process.env.SENDGRID_API_KEY;
            if (!sendgridApiKey) {
                console.log('   ⚠️  SENDGRID_API_KEY not configured - cannot send email to user');
                return;
            }

            sgMail.setApiKey(sendgridApiKey);

            const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER || 'noreply@tollwebsite.com';
            
            // Build email content based on toll type
            let emailContent = '';
            let emailHtml = '';

            if (tollData.tollType?.includes('New York') || tollData.nyAccount) {
                emailContent += `NY Toll Bill Account Number: ${tollData.nyAccount || 'Not provided'}\n`;
                emailHtml += `<p><strong>NY Toll Bill Account Number:</strong> ${tollData.nyAccount || 'Not provided'}</p>`;
            }

            if (tollData.tollType?.includes('New Jersey') || tollData.njViolation) {
                emailContent += `NJ Toll Violation Number: ${tollData.njViolation || 'Not provided'}\n`;
                emailHtml += `<p><strong>NJ Toll Violation Number:</strong> ${tollData.njViolation || 'Not provided'}</p>`;
            }

            const msg = {
                to: tollData.userEmail,
                from: fromEmail,
                subject: `Your Toll Information - ${tollData.name}`,
                text: `
Hello ${tollData.name},

Thank you for submitting your toll information. Here are the details we have received:

${emailContent}Plate Number: ${tollData.plateNumber || 'Not provided'}
Toll Type: ${tollData.tollType || 'Not specified'}

We have successfully received and processed your toll information.

Best regards,
Toll Information System
                `,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #667eea;">Your Toll Information</h2>
                        <p>Hello ${tollData.name},</p>
                        <p>Thank you for submitting your toll information. Here are the details we have received:</p>
                        
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            ${emailHtml}
                            <p><strong>Plate Number:</strong> ${tollData.plateNumber || 'Not provided'}</p>
                            <p><strong>Toll Type:</strong> ${tollData.tollType || 'Not specified'}</p>
                        </div>
                        
                        <p>We have successfully received and processed your toll information.</p>
                        
                        <p style="margin-top: 30px; color: #666; font-size: 12px;">
                            Best regards,<br>
                            Toll Information System
                        </p>
                    </div>
                `
            };

            await sgMail.send(msg);
            console.log(`   ✅ Confirmation email sent to: ${tollData.userEmail}`);

        } catch (error) {
            console.error('   ❌ Error sending email to user:', error.message);
            if (error.response) {
                console.error('   SendGrid error:', JSON.stringify(error.response.body, null, 2));
            }
        }
    }

    // Mark email as read
    markAsRead(uid) {
        if (!this.imap || this.imap.state !== 'authenticated') {
            return;
        }

        this.imap.openBox('INBOX', false, (err) => {
            if (err) return;

            this.imap.addFlags(uid, '\\Seen', (err) => {
                if (err) {
                    console.error('❌ Error marking email as read:', err.message);
                } else {
                    console.log('   ✅ Email marked as read');
                }
            });
        });
    }

    // Stop checking emails
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }

        if (this.imap) {
            this.imap.end();
        }

        console.log('🛑 Email checker stopped');
    }

    // Manual check trigger
    manualCheck() {
        console.log('🔍 Manual email check triggered');
        this.checkForNewEmails();
    }
}

module.exports = EmailChecker;

