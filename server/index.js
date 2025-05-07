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

const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
  path: "/socket.io/",
});

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/column", columnRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/comment", commentRoutes);

io.on("connection", (socket) => {
  // Board operations
  socket.on("join-board", (boardId) => {
    socket.join(boardId);
  });

  socket.on("leave-board", (boardId) => {
    socket.leave(boardId);
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
});

httpServer.listen(PORT, async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
