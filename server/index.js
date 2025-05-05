import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import boardRoutes from "./routes/board.route.js";
import columnRoutes from "./routes/column.route.js";
import taskRoutes from "./routes/task.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/column", columnRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/comment", commentRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Board operations
  socket.on("join-board", (boardId) => {
    socket.join(boardId);
    console.log(`User joined board: ${boardId}`);
  });

  socket.on("leave-board", (boardId) => {
    socket.leave(boardId);
    console.log(`User left board: ${boardId}`);
  });

  socket.on("board-created", () => {
    io.emit("board-created");
  });

  socket.on("board-updated", () => {
    io.emit("board-updated");
  });

  socket.on("board-deleted", (deletedBoardId) => {
    io.to(deletedBoardId).emit("board-deleted", deletedBoardId);
  });

  // Column operations
  socket.on("column-created", (boardId) => {
    io.to(boardId).emit("column-created", boardId);
  });

  socket.on("column-updated", (boardId) => {
    io.to(boardId).emit("column-updated", boardId);
  });

  socket.on("column-deleted", (boardId) => {
    io.to(boardId).emit("column-deleted", boardId);
  });

  socket.on("column-clear", (boardId) => {
    io.to(boardId).emit("column-clear", boardId);
  });

  // Task operations
  socket.on("task-created", (boardId) => {
    io.to(boardId).emit("task-created", boardId);
  });

  socket.on("task-updated", (boardId) => {
    io.to(boardId).emit("task-updated", boardId);
  });

  socket.on("task-deleted", (boardId) => {
    io.to(boardId).emit("task-deleted", boardId);
  });

  socket.on("task-moved", (boardId) => {
    io.to(boardId).emit("task-moved", boardId);
  });

  // Comment operations
  socket.on("comment-created", (taskId, boardId) => {
    io.to(boardId).emit("comment-created", taskId);
  });

  socket.on("comment-updated", (taskId, boardId) => {
    io.to(boardId).emit("comment-updated", taskId);
  });

  socket.on("comment-deleted", (taskId, boardId) => {
    io.to(boardId).emit("comment-deleted", taskId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
