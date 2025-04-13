import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Layout, Plus } from "lucide-react";

const boards = [
  { id: "1", name: "Product Roadmap" },
  { id: "2", name: "Marketing Campaign" },
  { id: "3", name: "Development Sprint" },
];

export const BoardSelector = () => {
  const [selectedBoard, setSelectedBoard] = useState(boards[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-background/20 border-border/50 hover:bg-background/30"
        >
          <Layout className="h-4 w-4" />
          <span className="font-medium">{selectedBoard.name}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background/95 backdrop-blur-sm border-border/50">
        <DropdownMenuLabel>Your Boards</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        {boards.map((board) => (
          <DropdownMenuItem
            key={board.id}
            onClick={() => setSelectedBoard(board)}
            className={board.id === selectedBoard.id ? "bg-primary/10" : ""}
          >
            <Layout className="mr-2 h-4 w-4" />
            <span>{board.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          <span>Create New Board</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
