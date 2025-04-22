import express from "express";
import {
  createColumn,
  updateColumn,
  deleteColumn,
  deleteAllTasks,
} from "../controllers/column.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticationMiddleware, createColumn);
router.patch("/", authenticationMiddleware, updateColumn);
router.delete("/", authenticationMiddleware, deleteColumn);
router.delete("/:id/tasks", authenticationMiddleware, deleteAllTasks);

export default router;
