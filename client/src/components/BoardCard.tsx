import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KanbanSquare, LayoutGrid, ListTodo } from "lucide-react";

interface Board {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  columns: number;
  tasks: number;
}

interface BoardCardProps {
  board: Board;
  onClick: () => void;
}

export const BoardCard = ({ board, onClick }: BoardCardProps) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{board.name}</CardTitle>
          <KanbanSquare className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="line-clamp-2">
          {board.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full">
            <LayoutGrid className="h-3 w-3" />
            <span>{board.columns} columns</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full">
            <ListTodo className="h-3 w-3" />
            <span>{board.tasks} tasks</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t border-slate-800 pt-2">
        Last updated {formatDate(board.updatedAt)}
      </CardFooter>
    </Card>
  );
};
