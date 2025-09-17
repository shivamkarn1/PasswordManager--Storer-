import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/db.js";
import app from "./app.js";
// Connect to DB and start server
const PORT = process.env.PORT || 5000;

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("DB_NAME:", process.env.DB_NAME);

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error:", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    app.get("/", (req, res) => {
      res.send("<h1>Server is running nice.😉</h1>");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!!!", err);
  });
