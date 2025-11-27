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

            // Extract information from email
            const emailData = {
                from: email.from.text,
                subject: email.subject,
                date: email.date,
                text: email.text,
                html: email.html,
                receivedAt: new Date().toISOString()
            };

            // TODO: Add your automation logic here
            // Examples:
            // - Extract toll information from email
            // - Save to database
            // - Send notifications
            // - Process toll data
            // - Update records

            console.log('   ✅ Automation completed');
            console.log('   📝 Email data:', JSON.stringify(emailData, null, 2));

            // Mark email as read (optional)
            // this.markAsRead(email.uid);

        } catch (error) {
            console.error('❌ Automation error:', error.message);
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

