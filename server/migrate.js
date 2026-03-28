const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    console.log("Starting database migration to support rich content (UTF8MB4)...");
    
    let connection;
    try {
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '123456',
            database: process.env.DB_NAME || 'codefox_crm',
        };

        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL successfully.");

        // 1. Convert database charset
        const dbName = process.env.DB_NAME || 'codefox_crm';
        await connection.query(`ALTER DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`- Database '${dbName}' updated to utf8mb4.`);

        // 2. Convert posts table charset
        await connection.query("ALTER TABLE posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        console.log("- Table 'posts' updated to utf8mb4.");

        // 3. Try setting global max_allowed_packet (might fail if not root, but we'll try)
        try {
            await connection.query("SET GLOBAL max_allowed_packet=104857600;");
            console.log("- Global 'max_allowed_packet' set to 100MB (Success).");
        } catch (e) {
            console.warn("! Warning: Could not set GLOBAL max_allowed_packet (requires root). You may need to change this in your MySQL config file (my.ini/my.cnf).");
        }

        console.log("\nMigration completed successfully! You can now paste rich content into articles.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
