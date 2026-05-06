const bcrypt = require('bcrypt');
const supabase = require('./supabase');

async function checkUser() {
    try {
        console.log("Connecting to Supabase...");
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'admin@codefoxit.com')
            .single();

        if (error || !user) {
            console.log("User not found in Supabase! Perhaps the SQL INSERT wasn't run?");
            process.exit(0);
        }
        
        console.log("DB User found:", user.email);
        console.log("Stored Password Hash:", user.password);
        
        const match = await bcrypt.compare('admin123', user.password);
        console.log("Does 'admin123' match the hash?", match);

        if (!match) {
            console.log("Updating password hash to a fresh 'admin123' just in case...");
            const newHash = await bcrypt.hash('admin123', 10);
            const { error: updateError } = await supabase
                .from('users')
                .update({ password: newHash })
                .eq('email', 'admin@codefoxit.com');

            if (updateError) throw updateError;
            console.log("Password hash updated successfully! Run login again.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkUser();

