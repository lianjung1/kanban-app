import mongoose from "mongoose";

const boardColumnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoardTask",
      },
    ],
  },
  { timestamps: true }
);

const BoardColumn = mongoose.model("BoardColumn", boardColumnSchema);

export default BoardColumn;
