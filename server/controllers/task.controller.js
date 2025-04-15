import BoardTask from "../models/BoardTask.js";

export const createTask = async (req, res) => {
  const { title, description, priority, assignedTo, columnId } = req.body;

  try {
    const newTask = new BoardTask({
      title,
      description,
      priority,
      assignedTo,
      columnId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, assignedTo } = req.body;

  try {
    const updatedTask = await BoardTask.findByIdAndUpdate(
      id,
      { title, description, priority, assignedTo },
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
  const { id } = req.params;
  const { columnId } = req.body;

  try {
    const updatedTask = await BoardTask.findByIdAndUpdate(
      id,
      { columnId: columnId },
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

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await BoardTask.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
