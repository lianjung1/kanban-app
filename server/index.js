import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import boardRoutes from "./routes/board.route.js";
import columnRoutes from "./routes/column.route.js";
import taskRoutes from "./routes/task.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const PORT = process.env.PORT || 5002;

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/column", columnRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/comment", commentRoutes);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
