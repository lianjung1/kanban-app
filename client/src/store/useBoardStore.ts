import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Board } from "@/types/Board";
import { BoardColumn } from "@/types/BoardColumn";
import { BoardTask } from "@/types/BoardTask";
import { User } from "@/types/User";
import toast from "react-hot-toast";
import { BoardStore } from "@/types/BoardStore";

export const useBoardStore = create<BoardStore>((set, get) => ({
  allBoards: [] as Board[],
  setBoards: (boards: Board[]) => set({ allBoards: boards }),

  board: null,
  setBoard: (board: Board) => set({ board }),

  getBoards: async () => {
    try {
      const response = await axiosInstance.get(`/board`);
      set({ allBoards: response.data });
    } catch (error) {
      toast.error("Failed to fetch boards");
    }
  },

  getBoard: async (boardId: string) => {
    try {
      const response = await axiosInstance.get(`/board/${boardId}`);
      set({ board: response.data });
    } catch (error) {
      toast.error("Failed to fetch board");
    }
  },

  createBoard: async (title: string, description: string) => {
    try {
      const response = await axiosInstance.post("/board", {
        title,
        description,
      });
      set((state: { allBoards: Board[] }) => ({
        allBoards: [...state.allBoards, response.data],
      }));
    } catch (error) {
      toast.error("Failed to create board");
    }
  },

  updateBoard: async (
    title: string,
    description: string,
    shareeEmail: string,
    boardId: string
  ) => {
    try {
      const response = await axiosInstance.patch(`/board/${boardId}`, {
        title,
        description,
        shareeEmail,
      });

      const updatedBoard = response.data;

      set({ board: updatedBoard });

      await get().getBoard(boardId);
      toast.success("Board updated successfully");
    } catch (error) {
      toast.error("Failed to update board");
    }
  },

  deleteBoard: async (boardId: string) => {
    await axiosInstance.delete(`/board/${boardId}`);

    toast.success("Board deleted successfully");
  },

  addColumn: async (title: string, boardId: string) => {
    const response = await axiosInstance.post("/column", {
      title,
      boardId,
    });

    await get().getBoard(response.data.boardId);
  },

  deleteColumn: async (columnId: string) => {
    const response = await axiosInstance.delete(`/column`, {
      data: { columnId },
    });

    await get().getBoard(response.data.boardId);
  },

  deleteAllTasks: async (boardId: string, columnId: string) => {
    await axiosInstance.delete(`/column/${columnId}/tasks`);

    await get().getBoard(boardId);
  },

  updateColumn: async (title: string, columnId: string) => {
    const response = await axiosInstance.patch("/column", {
      title,
      columnId,
    });

    await get().getBoard(response.data.boardId);
  },

  createTask: async (
    title: string,
    description: string,
    priority: string,
    assignedTo: string,
    columnId: string,
    boardId: string
  ) => {
    await axiosInstance.post(`/task/${boardId}`, {
      title,
      description,
      priority,
      assignedTo,
      columnId,
    });

    await get().getBoard(boardId);
  },

  updateTask: async (
    title: string,
    description: string,
    priority: string,
    assignedTo: string,
    boardId: string,
    taskId: string
  ) => {
    await axiosInstance.patch(`/task/${taskId}`, {
      title,
      description,
      priority,
      assignedTo,
    });

    await get().getBoard(boardId);
  },

  moveTask: async (
    newColumnId: string,
    sourceColumnId: string,
    boardId: string,
    taskId: string
  ) => {
    await axiosInstance.patch(`/task/move/${taskId}`, {
      newColumnId,
      sourceColumnId,
    });

    await get().getBoard(boardId);
  },

  deleteTask: async (boardId: string, taskId: string) => {
    await axiosInstance.delete(`/task/${taskId}`);

    await get().getBoard(boardId);
  },
}));
