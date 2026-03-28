const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixViews() {
    console.log("Fixing view counts for existing articles...");
    
    let connection;
    try {
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '123456',
            database: process.env.DB_NAME || 'codefox_crm',
        };

        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL.");

        // 1. Initialize any NULL views to 0
        await connection.query("UPDATE posts SET views = 0 WHERE views IS NULL;");
        console.log("- All empty (NULL) views converted to 0.");

        // 2. Ensure the column itself defaults to 0 and is NOT NULL
        await connection.query("ALTER TABLE posts MODIFY COLUMN views INT NOT NULL DEFAULT 0;");
        console.log("- Database column 'views' updated to NOT NULL DEFAULT 0.");

        console.log("\nSuccess! Views will now count correctly.");
        process.exit(0);
    } catch (error) {
        console.error("\nFailed to fix views:", error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

fixViews();
