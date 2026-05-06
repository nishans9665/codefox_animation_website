const supabase = require('./supabase');

async function testConnection() {
    console.log("Testing connection to Supabase...");
    try {
        // Try to fetch 1 row from the users table. 
        // This will test if the URL and KEY are valid and if the network request goes through.
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .limit(1);

        if (error) {
            // If it's a 42P01 error (table doesn't exist), the connection works, but the SQL wasn't run yet.
            if (error.code === '42P01') {
                console.log("✅ Database is CONNECTED!");
                console.log("⚠️ However, the 'users' table does not exist yet. Please run the SQL script in your Supabase dashboard.");
            } else if (error.message && error.message.includes("violates row-level security policy")) {
               console.log("✅ Database is CONNECTED!");
               console.log("⚠️ However, Row Level Security (RLS) blocked the query. Please disable RLS in your Supabase dashboard.");
            } else {
                console.error("❌ Connection failed with a database error:", error.message || error);
            }
        } else {
            console.log("✅ Database is CONNECTED!");
            if (data && data.length > 0) {
                console.log("🎉 Successfully fetched data from the 'users' table.");
            } else {
                console.log("ℹ️ The connection is successful, but the 'users' table is currently empty.");
            }
        }
    } catch (err) {
        console.error("❌ Connection failed. Please check your internet or SUPABASE_URL.", err.message);
    }
}

testConnection();
