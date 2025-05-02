import React, { useState } from "react";
import { Task } from "@/components/BoardTask";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BoardColumn } from "@/types/BoardColumn";
import { BoardTask } from "@/types/BoardTask";
import { useBoardStore } from "@/store/useBoardStore";
import { BoardStore } from "@/types/BoardStore";

interface BoardColumnProps {
  column: BoardColumn;
  onAddTask: () => void;
  onTaskDrop: (
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => void;
  setSelectedTask: (task: BoardTask | null) => void;
  setIsTaskSheetOpen: (isOpen: boolean) => void;
}

export const Column = ({
  column,
  onAddTask,
  onTaskDrop,
  setSelectedTask,
  setIsTaskSheetOpen,
}: BoardColumnProps) => {
  const { board, deleteColumn, updateColumn, deleteAllTasks } =
    useBoardStore() as BoardStore;
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState(column.title);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const element = e.currentTarget as HTMLElement;
    element.classList.add("bg-slate-900/80", "border-primary/50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove("bg-slate-900/80", "border-primary/50");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const element = e.currentTarget as HTMLElement;
    element.classList.remove("bg-slate-900/80", "border-primary/50");

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { taskId, sourceColumnId } = data;

      if (sourceColumnId !== column._id) {
        onTaskDrop(taskId, sourceColumnId, column._id);
      }
    } catch (error) {
      console.error("Error processing drop:", error);
    }
  };

  const handleRenameColumn = () => {
    if (column._id) {
      updateColumn(newColumnName, column._id);
      setIsRenameDialogOpen(false);
    }
  };

  const handleClearTasks = () => {
    if (column._id && board?._id) {
      deleteAllTasks(board._id, column._id);
    }
  };

  const handleDeleteColumn = () => {
    if (column._id && board) {
      deleteColumn(column._id);
    }
  };

  return (
    <div
      className="w-[280px] shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-3 font-medium flex justify-between items-center bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-800">{column.title}</span>
          <span className="text-xs text-gray-600 bg-gray-200 rounded-full px-2 py-0.5">
            {column.tasks?.length}
          </span>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-700 hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border border-gray-300 shadow-md"
          >
            <DropdownMenuLabel className="text-gray-800">
              Column Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem
              className="text-gray-700 hover:bg-gray-100"
              onClick={() => setIsRenameDialogOpen(true)}
            >
              Rename Column
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-700 hover:bg-gray-100"
              onClick={onAddTask}
            >
              Add Task
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-700 hover:bg-gray-100"
              onClick={handleClearTasks}
            >
              Clear All Tasks
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem
              className="text-red-600 hover:bg-red-50"
              onClick={handleDeleteColumn}
            >
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-3 py-2 space-y-3 h-[calc(100vh-280px)] overflow-y-auto">
        {column.tasks?.map((task) => {
          return (
            <Task
              key={task._id}
              task={task}
              columnId={column._id}
              setSelectedTask={setSelectedTask}
              setIsTaskSheetOpen={setIsTaskSheetOpen}
            />
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 text-sm hover:text-gray-900 hover:bg-gray-100"
          onClick={onAddTask}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Rename Column</DialogTitle>
            <DialogDescription>
              Update the name of this column
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Enter new column name"
            className="bg-input/10 border-input/20"
          />
          <DialogFooter>
            <Button onClick={handleRenameColumn}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
