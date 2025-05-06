import BoardTask from "../models/BoardTask.js";
import BoardColumn from "../models/BoardColumn.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const createTask = async (req, res) => {
  const { title, description, priority, assignedTo, columnId } = req.body;
  const boardId = req.params.id;

  const userAssignedTo = await User.findOne({ fullName: assignedTo });

  try {
    const newTask = new BoardTask({
      title,
      description,
      priority,
      assignee: userAssignedTo,
      columnId,
      boardId,
    });

    await newTask.save();

    await BoardColumn.findByIdAndUpdate(
      columnId,
      { $push: { tasks: newTask } },
      { new: true }
    );

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, priority, assignedTo } = req.body;

  const userAssignedTo = await User.findOne({ fullName: assignedTo });

  try {
    const updatedTask = await BoardTask.findByIdAndUpdate(
      taskId,
      { title, description, priority, assignee: userAssignedTo },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const moveTask = async (req, res) => {
  const taskId = req.params.id;
  const { newColumnId, sourceColumnId } = req.body;

  try {
    const task = await BoardTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await BoardColumn.findByIdAndUpdate(newColumnId, {
      $push: { tasks: taskId },
    });

    await BoardColumn.findByIdAndUpdate(sourceColumnId, {
      $pull: { tasks: taskId },
    });

    const newTask = await BoardTask.findByIdAndUpdate(taskId, {
      columnId: newColumnId,
    });

    res.status(200).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await BoardTask.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await BoardColumn.findByIdAndUpdate(
      deletedTask.columnId,
      { $pull: { tasks: taskId } },
      { new: true }
    );

    await Comment.deleteMany({ taskId: taskId });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
