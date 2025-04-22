import express from "express";
import {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:id", authenticationMiddleware, createTask);
router.patch("/:id", authenticationMiddleware, updateTask);
router.patch("/move/:id", authenticationMiddleware, moveTask);
router.delete("/:id", authenticationMiddleware, deleteTask);

export default router;
