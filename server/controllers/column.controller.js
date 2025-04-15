import Board from "../models/Board.js";
import BoardColumn from "../models/BoardColumn.js";

export const createColumn = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    if (!title || !boardId) {
      return res
        .status(400)
        .json({ message: "Title and Board ID are required" });
    }

    const newColumn = new BoardColumn({ title, boardId, tasks: [] });
    await newColumn.save();

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    board.columns.push(newColumn._id);
    await board.save();

    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const column = await BoardColumn.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.status(200).json(column);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await BoardColumn.findByIdAndDelete(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
