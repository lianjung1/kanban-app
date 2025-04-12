import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.PORT || 5002;

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
