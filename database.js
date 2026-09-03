const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.query("SELECT 1 AS connected");

        connection.release();

        console.log("✅ MySQL database connected successfully");
        console.log(rows);

        return true;
    } catch (error) {
        console.error("❌ MySQL connection failed:");
        console.error(error.message);

        return false;
    }
}

module.exports = {
    pool,
    testDatabaseConnection
};