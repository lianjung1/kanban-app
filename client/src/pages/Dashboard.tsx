import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useAuthStore } from "@/store/useAuthStore";
import { AuthStore } from "@/types/AuthStore";
import { BoardStore } from "@/types/BoardStore";
import { useBoardStore } from "@/store/useBoardStore";
import { TasksModal } from "@/components/TasksModal";

const Dashboard = () => {
  const { user } = useAuthStore() as AuthStore;
  const { allBoards, getBoards, createBoard } = useBoardStore() as BoardStore;

  useEffect(() => {
    getBoards();
  }, []);

  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const navigate = useNavigate();

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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card bg-sidebar/80 border border-sidebar-border backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-sidebar-foreground">
                  Recent Board
                </CardTitle>
                <CardDescription>
                  {allBoards[0]?.title || "No recent boards"}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    allBoards[0] && handleBoardClick(allBoards[0]._id)
                  }
                >
                  Open Board
                </Button>
              </CardFooter>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Task Summary</CardTitle>
                <CardDescription>
                  {allBoards.reduce((acc, board) => {
                    const tasksInBoard = board.columns.reduce(
                      (colAcc, column) => colAcc + column.tasks?.length,
                      0
                    );
                    return acc + tasksInBoard;
                  }, 0)}{" "}
                  tasks across {allBoards.length} boards
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsTasksModalOpen(true)}
                >
                  View All Tasks
                </Button>
              </CardFooter>
            </Card>

            {/* Board Selector Section */}
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Select Board</CardTitle>
                <CardDescription>Choose a board to work on</CardDescription>
              </CardHeader>
              <CardContent>
                <BoardSelector />
              </CardContent>
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
                        <Label htmlFor="description">Description</Label>
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
                      <Button
                        onClick={() => {
                          createBoard(newBoardName, newBoardDescription);
                          setIsCreateDialogOpen(false);
                          setNewBoardName("");
                          setNewBoardDescription("");
                        }}
                      >
                        Create Board
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Tasks Modal */}
        <TasksModal
          open={isTasksModalOpen}
          onOpenChange={setIsTasksModalOpen}
        />

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

          {allBoards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBoards.map((board) => (
                <BoardCard
                  key={board._id}
                  board={board}
                  onClick={() => handleBoardClick(board._id)}
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
