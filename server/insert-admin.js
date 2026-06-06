const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertAdminUser() {
    try {
        console.log("Connecting to Database using Prisma to create the admin user...");
        
        // The password hash for "admin123"
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@codefoxit.com' },
            update: {
                password: hashedPassword,
                role: 'Admin'
            },
            create: {
                name: 'CodeFox Admin',
                email: 'admin@codefoxit.com',
                password: hashedPassword,
                role: 'Admin'
            }
        });
        
        console.log("Admin user created/updated successfully!");
        console.log("Email: admin@codefoxit.com");
        console.log("Password: admin123");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

insertAdminUser();
