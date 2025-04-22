import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardColumn",
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  { timestamps: true }
);

const BoardTask = mongoose.model("BoardTask", taskSchema);

export default BoardTask;
