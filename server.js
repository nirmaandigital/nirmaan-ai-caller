const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Nirmaan AI Caller API is running 🚀"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "nirmaan-ai-caller"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Nirmaan AI Caller running on port ${PORT}`);
});