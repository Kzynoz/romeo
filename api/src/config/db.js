import mysql from "mysql2/promise";

// Create a connection pool with the database credentials from environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Define an asynchronous function to attempt a database connection
async function connectToDatabase() {
  
  try {
     // Try to get a connection from the pool
    const connection = await pool.getConnection();
    
    // Release the connection back to the pool after use (if necessary)
    connection.release();
  } catch (err) {
  }
}

// Call the function to attempt the connection
connectToDatabase();

export default pool;
