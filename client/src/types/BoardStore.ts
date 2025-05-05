import { User } from "./User";
import { Board } from "./Board";
import { BoardColumn } from "./BoardColumn";
import { BoardTask } from "./BoardTask";

export interface BoardStore {
  allBoards: Board[];
  setBoards: (boards: Board[]) => void;
  board: Board | null;
  setBoard: (board: Board) => void;
  getBoards: () => Promise<void>;
  getBoard: (boardId: string) => Promise<void>;
  createBoard: (
    title: string,
    description: string
  ) => Promise<Board | undefined>;
  updateBoard: (
    title: string,
    description: string,
    shareeEmail: string,
    boardId: string
  ) => Promise<Board | undefined>;
  deleteBoard: (boardId: string) => Promise<{ boardId: string } | undefined>;
  addColumn: (title: string, boardId: string) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  deleteAllTasks: (boardId: string, columnId: string) => Promise<void>;
  updateColumn: (title: string, columnId: string) => Promise<void>;
  createTask: (
    title: string,
    description: string,
    priority: string,
    assignedTo: string,
    columnId: string,
    boardId: string
  ) => Promise<void>;
  updateTask: (
    title: string,
    description: string,
    priority: string,
    assignedTo: string,
    boardId: string,
    taskId: string
  ) => Promise<void>;
  moveTask: (
    newColumnId: string,
    sourceColumnId: string,
    boardId: string,
    taskId: string
  ) => Promise<void>;
  deleteTask: (boardId: string, taskId: string) => Promise<void>;
}
