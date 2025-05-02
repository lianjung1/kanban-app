import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:taskId", authenticationMiddleware, getComments);
router.post("/", authenticationMiddleware, createComment);
router.patch("/:commentId", authenticationMiddleware, updateComment);
router.delete("/:commentId", authenticationMiddleware, deleteComment);

export default router;
