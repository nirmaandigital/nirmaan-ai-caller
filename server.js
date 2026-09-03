const express = require("express");
const cors = require("cors");

const { testDatabaseConnection } = require("./database");

const app = express();

app.use(cors());
app.use(express.json());


/*
|--------------------------------------------------------------------------
| Basic API
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Nirmaan AI Caller API is running 🚀",
        version: "1.0.0"
    });
});


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", async (req, res) => {

    const databaseConnected = await testDatabaseConnection();

    res.json({
        status: databaseConnected ? "healthy" : "unhealthy",
        api: "online",
        database: databaseConnected ? "connected" : "disconnected"
    });

});


/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("====================================");
    console.log("🚀 Nirmaan AI Caller API");
    console.log(`🌐 Port: ${PORT}`);
    console.log("====================================");

});