import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Edit, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommentStore } from "@/store/useCommentStore";
import { useSocket } from "@/contexts/SocketContext";
import { useParams } from "react-router-dom";
import { Textarea } from "./ui/textarea";

interface TaskDiscussionProps {
  taskId: string;
}

export const TaskDiscussion = ({ taskId }: TaskDiscussionProps) => {
  const { boardId } = useParams();
  const { socket, emitCommentCreated, emitCommentUpdated, emitCommentDeleted } =
    useSocket();
  const {
    currentComments,
    getComments,
    createComment,
    updateComment,
    deleteComment,
  } = useCommentStore();
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !taskId) return;

    socket.on("comment-created", (taskId) => {
      getComments(taskId);
    });
    socket.on("comment-updated", (taskId) => {
      getComments(taskId);
    });
    socket.on("comment-deleted", (taskId) => {
      getComments(taskId);
    });

    return () => {
      socket.off("comment-created");
      socket.off("comment-updated");
      socket.off("comment-deleted");
    };
  }, [socket, currentComments, getComments]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentComments]);

  useEffect(() => {
    if (taskId) {
      getComments(taskId);
    }
  }, []);

  const handleSubmitComment = async (taskId: string, content: string) => {
    const comment = await createComment(taskId, content);
    emitCommentCreated(comment.taskId, boardId as string);
    setNewComment("");
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (commentId) {
      const comment = await updateComment(commentId, editedContent);
      emitCommentUpdated(comment.taskId, boardId as string);
      setEditingCommentId(null);
      setEditedContent("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (commentId) {
      const comment = await deleteComment(commentId);
      emitCommentDeleted(comment.taskId, boardId as string);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  return (
    <Card className="w-full max-w-2xl overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {currentComments
            ?.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{comment.user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.user?.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.updatedAt)
                          .toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          .replace(/^0/, "")}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleEditComment(comment._id, comment.content)
                          }
                          className="hover:bg-gray-100 hover:shadow-md transition duration-50 ease-in-out hover:text-black"
                        >
                          <Edit className="h-4 w-4 mr-2 hover:text-black" />
                          Edit Comment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-gray-100 hover:shadow-md transition duration-50 ease-in-out hover:text-black"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2 hover:text-black" />
                          Delete Comment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {editingCommentId === comment._id ? (
                    <div className="mt-2 flex gap-2">
                      <Textarea
                        id={`edit-comment-${comment._id}`}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="flex-1 min-h-[60px] text-sm p-3 resize-none"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(comment._id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
                <div ref={bottomRef} />
              </div>
            ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitComment(taskId, newComment);
          }}
          className="mt-4 flex gap-2"
        >
          <Textarea
            id="new-comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 min-h-[30px] text-sm resize-none"
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
