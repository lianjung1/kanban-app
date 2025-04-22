import { User } from "./User";

export type BoardTask = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  columnId: string;
  assignee: User | null;
};
