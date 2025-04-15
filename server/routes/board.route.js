import express from "express";
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/board.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticationMiddleware, getBoards);
router.get("/:id", authenticationMiddleware, getBoard);
router.post("/", authenticationMiddleware, createBoard);
router.patch("/:id", authenticationMiddleware, updateBoard);
router.delete("/:id", authenticationMiddleware, deleteBoard);

export default router;
