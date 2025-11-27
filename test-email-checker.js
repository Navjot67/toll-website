// Test script for email checker
const EmailChecker = require('./emailChecker');

console.log('🧪 Testing Email Checker Service...\n');

const checker = new EmailChecker();

// Test connection
console.log('1. Testing connection...');
const connected = checker.connect();

if (connected) {
    console.log('✅ Email checker initialized\n');
    
    // Test manual check after 3 seconds
    setTimeout(() => {
        console.log('2. Testing manual email check...');
        checker.manualCheck();
        
        // Stop after 10 seconds
        setTimeout(() => {
            console.log('\n3. Stopping email checker...');
            checker.stop();
            console.log('✅ Test completed');
            process.exit(0);
        }, 10000);
    }, 3000);
} else {
    console.log('❌ Email checker failed to initialize');
    console.log('   Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env file');
    process.exit(1);
}

