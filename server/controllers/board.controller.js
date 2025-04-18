import User from "../models/User.js";
import Board from "../models/Board.js";
import BoardColumn from "../models/BoardColumn.js";
import BoardTask from "../models/BoardTask.js";

export const getBoards = async (req, res) => {
  try {
    const userId = req.user._id;
    const boards = await Board.find({ owner: userId })
      .populate("columns")
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          model: "BoardTask",
        },
      });
    return res.status(200).json(boards);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const board = await Board.findOne({ _id: boardId })
      .populate("columns")
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          model: "BoardTask",
        },
      });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    return res.status(200).json(board);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const user = User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBoard = new Board({
      title,
      description: description,
      owner: userId,
      members: [userId],
    });
    await newBoard.save();

    await User.updateOne({ _id: userId }, { $push: { boards: newBoard._id } });

    return res.status(201).json(newBoard);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const boardId = req.params.id;

    const board = await Board.findOne({ _id: boardId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const newBoard = await Board.findOneAndUpdate(
      board,
      {
        title,
        description,
      },
      { new: true }
    );

    return res.status(200).json(newBoard);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;

    const board = await Board.findOne({ _id: boardId });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await Board.findOneAndDelete({ _id: boardId });

    return res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
