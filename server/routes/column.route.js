import express from "express";
import {
  createColumn,
  updateColumn,
  deleteColumn,
} from "../controllers/column.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticationMiddleware, createColumn);
router.patch("/:id", authenticationMiddleware, updateColumn);
router.delete("/:id", authenticationMiddleware, deleteColumn);

export default router;
