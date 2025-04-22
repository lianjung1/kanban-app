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
import { ChevronDown, Layout } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";
import { BoardStore } from "@/types/BoardStore";
import { useNavigate } from "react-router-dom";

export const BoardSelector = () => {
  const { allBoards } = useBoardStore() as BoardStore;
  const [selectedBoard, setSelectedBoard] = useState(allBoards[0]);
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-background/20 border-border/50 hover:bg-background/30"
        >
          <Layout className="h-4 w-4" />
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background/95 backdrop-blur-sm border-border/50">
        <DropdownMenuLabel>Your Boards</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        {allBoards.map((board) => (
          <DropdownMenuItem
            key={board._id}
            onClick={() => {
              setSelectedBoard(board);
              navigate(`/board/${board._id}`);
            }}
            className={board?._id === selectedBoard?._id ? "bg-primary/10" : ""}
          >
            <Layout className="mr-2 h-4 w-4" />
            <span>{board?.title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
