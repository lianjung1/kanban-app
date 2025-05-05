import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, GripVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BoardTask } from "@/types/BoardTask";
import { useBoardStore } from "@/store/useBoardStore";
import { BoardStore } from "@/types/BoardStore";
import { Label } from "./ui/label";
import { useSocket } from "@/contexts/SocketContext";
import { emit } from "process";

interface KanbanTaskProps {
  task: BoardTask;
  columnId: string;
  setSelectedTask: (task: BoardTask | null) => void;
  setIsTaskSheetOpen: (isOpen: boolean) => void;
}

export const Task = ({
  task,
  columnId,
  setSelectedTask,
  setIsTaskSheetOpen,
}: KanbanTaskProps) => {
  const { socket, emitTaskUpdated, emitTaskDeleted } = useSocket();
  const { board, updateTask, deleteTask, getBoard } =
    useBoardStore() as BoardStore;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedAssignee, setEditedAssignee] = useState(task.assignee?.fullName);
  const [editedPriority, setEditedPriority] = useState(task.priority);

  useEffect(() => {
    if (!socket || !board?._id) return;

    socket.on("task-updated", (boardId) => {
      getBoard(boardId);
    });
    socket.on("task-deleted", (boardId) => {
      getBoard(boardId);
    });

    return () => {
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, [socket, board?._id, getBoard]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">Medium</Badge>;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        taskId: task._id,
        sourceColumnId: columnId,
      })
    );
    e.dataTransfer.effectAllowed = "move";

    // Add a dragging class to style the task while dragging
    const element = e.currentTarget as HTMLElement;
    setTimeout(() => {
      element.classList.add("opacity-50");
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove("opacity-50");
  };

  const handleEditTask = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (task._id && board?._id) {
      await updateTask(
        editedTitle,
        editedDescription,
        editedPriority,
        editedAssignee || "",
        board._id,
        task._id
      );

      if (socket) {
        emitTaskUpdated(board._id);
      }
    }

    setIsEditDialogOpen(false);
  };

  const handleDeleteTask = async () => {
    if (board?._id && task._id) {
      await deleteTask(board._id, task._id);

      if (socket) {
        emitTaskDeleted(board._id);
      }
    }
  };

  const taskAssigneeName = task.assignee?.fullName || "Unassigned";

  return (
    <>
      <Card
        className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 cursor-grab active:cursor-grabbing"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => {
          setSelectedTask(task);
          setIsTaskSheetOpen(true);
        }}
      >
        <div className="px-2 py-1.5 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-3 w-3" />
            </Button>
            <div className="flex gap-1 items-center">
              {getPriorityBadge(task.priority)}
              <Badge className="text-xs bg-blue-500">{taskAssigneeName}</Badge>
            </div>
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-600 hover:bg-gray-200"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-gray-200 shadow-md"
            >
              <DropdownMenuLabel className="text-black">
                Task Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem
                className="text-black hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTask();
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask();
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="px-2 pt-1 pb-2">
          <h3 className="font-medium text-sm text-gray-800 leading-tight">
            {task.title}
          </h3>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Edit the task details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Task title"
                className="bg-input/10 border-input/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Task description"
                className="bg-input/10 border-input/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assignee">Assignee</Label>
              <Select value={editedAssignee} onValueChange={setEditedAssignee}>
                <SelectTrigger
                  className="bg-input/10 border-input/20"
                  id="edit-assignee"
                >
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {board?.members.map((member) => (
                    <SelectItem key={member._id} value={member.fullName}>
                      {member.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={editedPriority} onValueChange={setEditedPriority}>
                <SelectTrigger
                  className="bg-input/10 border-input/20"
                  id="edit-priority"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
