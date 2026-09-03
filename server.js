const express = require("express");
const cors = require("cors");

const { pool, testDatabaseConnection } = require("./database");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// ROOT API
// ==========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Nirmaan AI Caller API is running 🚀",
        version: "1.0.0"
    });
});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", async (req, res) => {
    const databaseConnected = await testDatabaseConnection();

    res.json({
        status: databaseConnected ? "healthy" : "unhealthy",
        api: "online",
        database: databaseConnected ? "connected" : "disconnected"
    });
});


// ==========================================
// GET ALL BUSINESSES
// ==========================================

app.get("/api/businesses", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM businesses
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            count: rows.length,
            businesses: rows
        });

    } catch (error) {
        console.error("❌ Failed to fetch businesses:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch businesses",
            details: error.message
        });
    }
});


// ==========================================
// GET SINGLE BUSINESS
// ==========================================

app.get("/api/businesses/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `
            SELECT *
            FROM businesses
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Business not found"
            });
        }

        res.json({
            success: true,
            business: rows[0]
        });

    } catch (error) {
        console.error("❌ Failed to fetch business:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch business",
            details: error.message
        });
    }
});


// ==========================================
// ADD NEW BUSINESS
// ==========================================

app.post("/api/businesses", async (req, res) => {
    try {
        const {
            business_name,
            owner_name,
            phone,
            alternate_phone,
            email,
            category,
            sub_category,
            city,
            district,
            state,
            pincode,
            address,
            google_maps_url,
            google_place_id,
            website,
            instagram,
            facebook,
            whatsapp,
            has_website,
            website_quality,
            source
        } = req.body;

        // Required field validation
        if (!business_name || !phone) {
            return res.status(400).json({
                success: false,
                error: "business_name and phone are required"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO businesses (
                business_name,
                owner_name,
                phone,
                alternate_phone,
                email,
                category,
                sub_category,
                city,
                district,
                state,
                pincode,
                address,
                google_maps_url,
                google_place_id,
                website,
                instagram,
                facebook,
                whatsapp,
                has_website,
                website_quality,
                source
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                business_name,
                owner_name || null,
                phone,
                alternate_phone || null,
                email || null,
                category || null,
                sub_category || null,
                city || null,
                district || null,
                state || null,
                pincode || null,
                address || null,
                google_maps_url || null,
                google_place_id || null,
                website || null,
                instagram || null,
                facebook || null,
                whatsapp || null,
                has_website ?? 0,
                website_quality || null,
                source || "manual"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Business added successfully",
            business_id: result.insertId
        });

    } catch (error) {
        console.error("❌ Failed to add business:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to add business",
            details: error.message
        });
    }
});


// ==========================================
// DELETE BUSINESS
// ==========================================

app.delete("/api/businesses/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `
            DELETE FROM businesses
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "Business not found"
            });
        }

        res.json({
            success: true,
            message: "Business deleted successfully"
        });

    } catch (error) {
        console.error("❌ Failed to delete business:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to delete business",
            details: error.message
        });
    }
});


// ==========================================
// GET LEADS
// ==========================================

app.get("/api/leads", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM leads
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            count: rows.length,
            leads: rows
        });

    } catch (error) {
        console.error("❌ Failed to fetch leads:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch leads",
            details: error.message
        });
    }
});


// ==========================================
// GET CALLS
// ==========================================

app.get("/api/calls", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM calls
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            count: rows.length,
            calls: rows
        });

    } catch (error) {
        console.error("❌ Failed to fetch calls:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch calls",
            details: error.message
        });
    }
});


// ==========================================
// GET CALL MESSAGES
// ==========================================

app.get("/api/calls/:callId/messages", async (req, res) => {
    try {
        const { callId } = req.params;

        const [rows] = await pool.query(
            `
            SELECT *
            FROM call_messages
            WHERE call_id = ?
            ORDER BY id ASC
            `,
            [callId]
        );

        res.json({
            success: true,
            count: rows.length,
            messages: rows
        });

    } catch (error) {
        console.error("❌ Failed to fetch call messages:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch call messages",
            details: error.message
        });
    }
});


// ==========================================
// GET CAMPAIGNS
// ==========================================

app.get("/api/campaigns", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM campaigns
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            count: rows.length,
            campaigns: rows
        });

    } catch (error) {
        console.error("❌ Failed to fetch campaigns:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch campaigns",
            details: error.message
        });
    }
});


// ==========================================
// GET FOLLOW-UPS
// ==========================================

app.get("/api/followups", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM followups
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            count: rows.length,
            followups: rows
        });

    } catch (error) {
        console.error("❌ Failed to fetch followups:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch followups",
            details: error.message
        });
    }
});


// ==========================================
// GET SYSTEM SETTINGS
// ==========================================

app.get("/api/settings", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM system_settings
            ORDER BY id ASC
        `);

        res.json({
            success: true,
            settings: rows
        });

    } catch (error) {
        console.error("❌ Failed to fetch settings:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch settings",
            details: error.message
        });
    }
});


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        path: req.originalUrl
    });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error("❌ Server error:");
    console.error(err);

    res.status(500).json({
        success: false,
        error: "Internal server error",
        details: err.message
    });
});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("====================================");
    console.log("🚀 Nirmaan AI Caller API");
    console.log(`🌐 Port: ${PORT}`);
    console.log("====================================");
});