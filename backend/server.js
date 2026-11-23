const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
console.log("Pool type:", typeof pool);
console.log("Pool query:", typeof pool.query);
const hotelRoutes = require("./routes/hotelRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/hotels", hotelRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "NamlaTech Hotel API is running!"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});