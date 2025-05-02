import Board from "../models/Board.js";
import BoardColumn from "../models/BoardColumn.js";
import BoardTask from "../models/BoardTask.js";
import Comment from "../models/Comment.js";

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
    const { title, columnId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const column = await BoardColumn.findByIdAndUpdate(
      columnId,
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
    const { columnId } = req.body;

    const column = await BoardColumn.findByIdAndDelete(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    await Board.findOneAndUpdate(
      { columns: columnId },
      { $pull: { columns: columnId } }
    );

    await BoardTask.deleteMany({ _id: { $in: column.tasks } });

    await Comment.deleteMany({
      taskId: { $in: column.tasks },
    });

    res.status(200).json(column);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllTasks = async (req, res) => {
  try {
    const columnId = req.params.id;

    const column = await BoardColumn.findById(columnId);

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    await BoardTask.deleteMany({
      _id: { $in: column.tasks },
    });

    await BoardColumn.updateOne({ _id: columnId }, { $set: { tasks: [] } });

    await Comment.deleteMany({
      taskId: { $in: column.tasks },
    });

    res.status(200).json({ message: "All tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
