import { User } from "./User";

export type Comment = {
  _id: string;
  content: string;
  taskId: string;
  user: User;
  updatedAt: string;
  createdAt: string;
};
