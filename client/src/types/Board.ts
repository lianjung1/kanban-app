import { BoardColumn } from "./BoardColumn";
import { User } from "./User";

export type Board = {
  _id: string;
  title: string;
  description: string;
  columns: BoardColumn[];
  members: User[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
};
