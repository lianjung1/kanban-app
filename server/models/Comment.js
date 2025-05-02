import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BoardTask",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
