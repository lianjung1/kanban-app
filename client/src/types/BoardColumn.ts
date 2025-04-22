import { BoardTask } from "./BoardTask";

export type BoardColumn = {
  _id: string;
  title: string;
  boardId: string;
  tasks: BoardTask[];
};
