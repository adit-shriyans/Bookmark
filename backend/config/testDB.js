import { query, connect } from './db.js';

const testConnection = async () => {
  try {
    const client = await connect(); // Get a client connection
    console.log("Connected to Supabase PostgreSQL! ✅");

    const result = await query('SELECT NOW();'); // Run a test query
    console.log("Current Timestamp:", result.rows[0]);

    client.release(); // Release the connection
  } catch (err) {
    console.error("Database connection error ❌:", err);
  }
};

testConnection();
