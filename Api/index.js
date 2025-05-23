const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const slotRoutes = require("./routes/slotRoutes");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
