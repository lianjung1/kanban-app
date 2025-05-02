import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Column } from "@/components/BoardColumn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Settings, ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useBoardStore } from "@/store/useBoardStore";
import { BoardStore } from "@/types/BoardStore";
import { BoardColumn } from "@/types/BoardColumn";
import { BoardTask } from "@/types/BoardTask";
import { countTasksInBoard } from "@/lib/utils";
import { Board } from "@/types/Board";
import { set } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TaskDiscussion } from "@/components/TaskDiscussion";

const BoardDetail = () => {
  const {
    board,
    getBoard,
    updateBoard,
    addColumn,
    deleteBoard,
    createTask,
    moveTask,
  } = useBoardStore() as BoardStore;
  const { boardId } = useParams();
  const [newColumnName, setNewColumnName] = useState("");
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isBoardSettingsOpen, setIsBoardSettingsOpen] = useState(false);
  const [editedBoardName, setEditedBoardName] = useState(board?.title || "");
  const [editedBoardDescription, setEditedBoardDescription] = useState(
    board?.description || ""
  );
  const [editedShareeEmail, setEditedShareeEmail] = useState("");
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const navigate = useNavigate();

  const boardMembers = board?.members || [];

  useEffect(() => {
    if (boardId) {
      getBoard(boardId);
    }
  }, []);

  const handleAddColumn = () => {
    if (boardId && newColumnName.trim()) {
      addColumn(newColumnName, boardId);
    }

    setIsAddColumnDialogOpen(false);
  };

  const handleDeleteBoard = () => {
    if (boardId) {
      deleteBoard(boardId);
      navigate("/dashboard");
    }
  };

  const handleAddTask = () => {
    if (activeColumnId && boardId) {
      createTask(
        newTaskTitle,
        newTaskDescription,
        newTaskPriority,
        newTaskAssignee,
        activeColumnId,
        boardId
      );
      setIsAddTaskDialogOpen(false);
    }
  };

  const handleTaskDrop = (
    taskId: string,
    sourceColumnId: string,
    newColumnId: string
  ) => {
    if (boardId && taskId && newColumnId && sourceColumnId) {
      moveTask(newColumnId, sourceColumnId, boardId, taskId);
    }
  };

  const handleSaveBoardSettings = () => {
    if (board) {
      updateBoard(
        editedBoardName,
        editedBoardDescription,
        editedShareeEmail,
        board._id
      );

      setEditedBoardName("");
      setEditedBoardDescription("");
      setEditedShareeEmail("");
      setIsBoardSettingsOpen(false);
    }
  };

  const openAddTaskDialog = (columnId: string) => {
    setActiveColumnId(columnId);
    setIsAddTaskDialogOpen(true);
  };

  if (!board) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {board.title}
            </h1>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  Members
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b">
                  <h4 className="font-medium">Board Members</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This board is shared with {board?.members.length} members.
                  </p>
                </div>
                <div className="p-4 max-h-80 overflow-y-auto">
                  <div className="flex flex-col space-y-3">
                    {board?.members?.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {member?.fullName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {member?.fullName}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Dialog
              open={isBoardSettingsOpen}
              onOpenChange={setIsBoardSettingsOpen}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border border-border">
                <DialogHeader>
                  <DialogTitle>Board Settings</DialogTitle>
                  <DialogDescription>
                    Update your board information
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="board-name">Board Name</Label>
                    <Input
                      id="board-name"
                      placeholder="Enter board name"
                      value={editedBoardName ?? ""}
                      onChange={(e) => setEditedBoardName(e.target.value)}
                      className="bg-input/10 border-input/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board-description">Description</Label>
                    <Input
                      id="board-description"
                      placeholder="Enter description"
                      value={editedBoardDescription ?? ""}
                      onChange={(e) =>
                        setEditedBoardDescription(e.target.value)
                      }
                      className="bg-input/10 border-input/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sharee-email">Share</Label>
                    <Input
                      id="sharee-email"
                      placeholder="name@example.com"
                      value={editedShareeEmail ?? ""}
                      onChange={(e) => setEditedShareeEmail(e.target.value)}
                      className="bg-input/10 border-input/20"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleSaveBoardSettings}>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>

                  <Button variant="destructive" onClick={handleDeleteBoard}>
                    Delete Board
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">{board.description}</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {board?.columns?.length} columns · {countTasksInBoard(board)} tasks
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isAddColumnDialogOpen}
              onOpenChange={setIsAddColumnDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Column
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border">
                <DialogHeader>
                  <DialogTitle>Add New Column</DialogTitle>
                  <DialogDescription>
                    Create a new column to organize your tasks
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="column-name">Column Name</Label>
                    <Input
                      id="column-name"
                      placeholder="e.g., To Do, In Progress, Done"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      className="bg-input/10 border-input/20"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddColumn}>Add Column</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: "max-content" }}>
            {board?.columns?.map((column) => {
              return (
                <Column
                  key={column._id}
                  column={column}
                  onAddTask={() => openAddTaskDialog(column._id)}
                  onTaskDrop={handleTaskDrop}
                  setSelectedTask={setSelectedTask}
                  setIsTaskSheetOpen={setIsTaskSheetOpen}
                />
              );
            })}

            <div className="w-[280px] shrink-0 rounded-lg border border-dashed border-slate-800 bg-slate-950/50 p-4 flex flex-col items-center justify-center">
              <Button
                variant="ghost"
                className="h-20 w-full border-2 border-dashed border-slate-800 text-muted-foreground hover:border-slate-700 hover:text-foreground"
                onClick={() => setIsAddColumnDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Column
              </Button>
            </div>
          </div>
        </div>

        <Dialog
          open={isAddTaskDialogOpen}
          onOpenChange={setIsAddTaskDialogOpen}
        >
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task in{" "}
                {activeColumnId &&
                  board.columns?.find((col) => col._id === activeColumnId)
                    ?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-input/10 border-input/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Input
                  id="task-description"
                  placeholder="Enter description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="bg-input/10 border-input/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assign-task">Assignee</Label>
                <Select
                  value={newTaskAssignee}
                  onValueChange={setNewTaskAssignee}
                >
                  <SelectTrigger
                    className="bg-input/10 border-input/20"
                    id="assign-task"
                  >
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {boardMembers.map((member) => (
                      <SelectItem key={member._id} value={member.fullName}>
                        {member.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={newTaskPriority}
                  onValueChange={setNewTaskPriority}
                >
                  <SelectTrigger
                    className="bg-input/10 border-input/20"
                    id="task-priority"
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
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={isTaskSheetOpen} onOpenChange={setIsTaskSheetOpen}>
          <SheetContent className="w-full max-w-lg p-6 space-y-6">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-semibold text-foreground">
                {selectedTask?.title || "Untitled Task"}
              </SheetTitle>
              <SheetDescription>
                Priority:{" "}
                {selectedTask?.priority
                  ? selectedTask.priority.charAt(0).toUpperCase() +
                    selectedTask.priority.slice(1)
                  : "N/A"}
              </SheetDescription>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">
                Description
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedTask?.description || "No description provided."}
              </p>
            </div>

            <div className="border-t border-border"></div>

            {selectedTask && <TaskDiscussion taskId={selectedTask._id} />}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default BoardDetail;
