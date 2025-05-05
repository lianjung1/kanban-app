import { Comment } from "./Comment";

export type CommentStore = {
  currentComments: Comment[] | null;
  setCurrentComments: (currentComments: Comment[]) => void;
  getComments: (taskId: string) => Promise<void>;
  createComment: (taskId: string, content: string) => Promise<Comment>;
  updateComment: (commentId: string, content: string) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<Comment>;
};
