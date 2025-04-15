import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { BoardCard } from "@/components/BoardCard";
import { BoardSelector } from "@/components/BoardSelector";
import { PlusCircle, KanbanSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthStore } from "@/types/AuthStore";

// Mock data for the boards
const MOCK_BOARDS = [
  {
    id: "1",
    name: "Product Roadmap",
    description: "Q2 2025 Product Development Plan",
    updatedAt: "2025-04-10T10:30:00Z",
    columns: 4,
    tasks: 24,
  },
  {
    id: "2",
    name: "Marketing Campaign",
    description: "Summer 2025 Marketing Initiative",
    updatedAt: "2025-04-08T14:20:00Z",
    columns: 3,
    tasks: 15,
  },
  {
    id: "3",
    name: "Development Sprint",
    description: "Sprint #23 - Backend Refactoring",
    updatedAt: "2025-04-11T09:15:00Z",
    columns: 5,
    tasks: 32,
  },
];

const Dashboard = () => {
  const { user } = useAuthStore() as AuthStore;

  const [boards, setBoards] = useState(MOCK_BOARDS);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    const newBoard = {
      id: `board-${Date.now()}`,
      name: newBoardName,
      description: newBoardDescription || "No description",
      updatedAt: new Date().toISOString(),
      columns: 3,
      tasks: 0,
    };

    setBoards([...boards, newBoard]);
    setNewBoardName("");
    setNewBoardDescription("");
    setIsCreateDialogOpen(false);
    toast.success("Board created successfully!");
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="min-h-screen bg-sidebar flex flex-col">
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-sidebar-foreground">
            {user?.fullName
              ? `Welcome back, ${user.fullName.split(" ")[0]}`
              : "Welcome to your Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects and track your progress with Kano
          </p>
        </div>

        {/* Quick Access */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-sidebar-foreground">
              Quick Access
            </h2>
            <BoardSelector />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card bg-sidebar/80 border border-sidebar-border backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-sidebar-foreground">
                  Recent Board
                </CardTitle>
                <CardDescription>
                  {boards[0]?.name || "No recent boards"}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => boards[0] && handleBoardClick(boards[0].id)}
                >
                  Open Board
                </Button>
              </CardFooter>
            </Card>

            <Card className="glass-card bg-sidebar/80 border border-sidebar-border backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-sidebar-foreground">
                  Task Summary
                </CardTitle>
                <CardDescription>
                  {boards.reduce((acc, board) => acc + board.tasks, 0)} tasks
                  across {boards.length} boards
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="secondary" className="w-full">
                  View All Tasks
                </Button>
              </CardFooter>
            </Card>

            <Card className="glass-card bg-sidebar/80 border border-sidebar-border backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-sidebar-foreground">
                  Create New Board
                </CardTitle>
                <CardDescription>
                  Start a new project or workflow
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Board
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-sidebar border border-sidebar-border">
                    <DialogHeader>
                      <DialogTitle className="text-sidebar-foreground">
                        Create New Board
                      </DialogTitle>
                      <DialogDescription>
                        Add a new board to organize your tasks and projects
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Board Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter board name"
                          value={newBoardName}
                          onChange={(e) => setNewBoardName(e.target.value)}
                          className="bg-input/10 border-input/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Description (optional)
                        </Label>
                        <Input
                          id="description"
                          placeholder="Enter description"
                          value={newBoardDescription}
                          onChange={(e) =>
                            setNewBoardDescription(e.target.value)
                          }
                          className="bg-input/10 border-input/20"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateBoard}>Create Board</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Your Boards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-sidebar-foreground">
              Your Boards
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Board
            </Button>
          </div>

          {boards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onClick={() => handleBoardClick(board.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="glass-card p-8 text-center bg-sidebar/80 border border-sidebar-border backdrop-blur">
              <KanbanSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2 text-sidebar-foreground">
                No boards yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first board to get started organizing your projects
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a Board
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
