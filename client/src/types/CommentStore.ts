import { Comment } from "./Comment";

export type CommentStore = {
  currentComments: Comment[] | null;
  setCurrentComments: (currentComments: Comment[]) => void;
  getComments: (taskId: string) => Promise<void>;
  createComment: (taskId: string, content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
};
