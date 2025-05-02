import Comment from "../models/Comment.js";
import BoardTask from "../models/BoardTask.js";

export const getComments = async (req, res) => {
  const { taskId } = req.params;

  try {
    const comments = await Comment.find({ taskId: taskId })
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createComment = async (req, res) => {
  const user = req.user;
  const { taskId, content } = req.body;

  try {
    const newComment = new Comment({
      content,
      taskId,
      user,
    });

    await newComment.save();

    await BoardTask.findByIdAndUpdate(taskId, {
      $push: { comments: newComment },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (userId.toString() !== comment.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { content },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await BoardTask.findByIdAndUpdate(deletedComment.taskId, {
      $pull: { comments: commentId },
    });

    res.status(200).json(deletedComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
