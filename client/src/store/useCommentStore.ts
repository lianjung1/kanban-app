import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { CommentStore } from "@/types/CommentStore";
import toast from "react-hot-toast";
import { BoardTask } from "@/types/BoardTask";

export const useCommentStore = create<CommentStore>((set, get) => ({
  currentComments: null,
  setCurrentComments: (currentComments) => set({ currentComments }),

  getComments: async (taskId: string) => {
    const response = await axiosInstance.get(`/comment/${taskId}`);

    await set({ currentComments: response.data });
  },

  createComment: async (taskId: string, content: string) => {
    const response = await axiosInstance.post(`/comment`, {
      taskId,
      content,
    });

    await get().getComments(taskId);

    return response.data;
  },

  updateComment: async (commentId: string, content: string) => {
    try {
      const response = await axiosInstance.patch(`/comment/${commentId}`, {
        content,
      });

      await get().getComments(response.data.taskId);

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update comment";
      toast.error(message);
    }
  },

  deleteComment: async (commentId: string) => {
    const response = await axiosInstance.delete(`/comment/${commentId}`);

    await get().getComments(response.data.taskId);

    return response.data;
  },
}));
