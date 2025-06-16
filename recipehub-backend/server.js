// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app.use((req, res) => {
  console.warn("Unknown route:", req.originalUrl);
  res.status(404).send(`<h1>404 Not Found: ${req.originalUrl}</h1>`);
});

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/test-server", (req, res) => {
  res.send("✅ The backend server is connected and responding!");
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
