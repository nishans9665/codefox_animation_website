const bcrypt = require('bcrypt');
const supabase = require('./supabase');

async function insertAdminUser() {
    try {
        console.log("Connecting to Supabase to create the admin user...");
        
        // The password hash for "admin123"
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const { data, error } = await supabase
            .from('users')
            .upsert([
                { 
                    name: 'CodeFox Admin', 
                    email: 'admin@codefoxit.com', 
                    password: hashedPassword, 
                    role: 'Admin' 
                }
            ], { onConflict: 'email' })
            .select();

        if (error) {
            console.error("Error inserting admin user:", error);
            process.exit(1);
        }
        
        console.log("Admin user created successfully!");
        console.log("Email: admin@codefoxit.com");
        console.log("Password: admin123");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

insertAdminUser();
