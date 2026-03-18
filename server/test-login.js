const bcrypt = require('bcrypt');
const pool = require('./db');

async function checkUser() {
    try {
        console.log("Connecting to database...");
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', ['admin@codefoxit.com']);
        if (users.length === 0) {
            console.log("User not found in DB! Perhaps the INSERT query wasn't run?");
            process.exit(0);
        }
        const user = users[0];
        console.log("DB User found:", user.email);
        console.log("Stored Password Hash:", user.password);
        
        const match = await bcrypt.compare('admin123', user.password);
        console.log("Does 'admin123' match the hash?", match);

        if (!match) {
            console.log("Updating password hash to a fresh 'admin123' just in case...");
            const newHash = await bcrypt.hash('admin123', 10);
            await pool.query('UPDATE users SET password = ? WHERE email = ?', [newHash, 'admin@codefoxit.com']);
            console.log("Password hash updated successfully! Run login again.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkUser();
