import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KanbanSquare, CheckCircle, Circle, AlertTriangle } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";
import { BoardTask } from "@/types/BoardTask";
import { BoardStore } from "@/types/BoardStore";
import { countTasksInBoard } from "@/lib/utils";

type TasksModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getPriorityBadge = (priority: BoardTask["priority"]) => {
  switch (priority) {
    case "low":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-500 border-green-500/20"
        >
          <Circle className="h-3 w-3 mr-1" />
          Low
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        >
          <KanbanSquare className="h-3 w-3 mr-1" />
          Medium
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="outline"
          className="bg-red-500/10 text-red-500 border-red-500/20"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          High
        </Badge>
      );
    case "urgent":
      return (
        <Badge
          variant="outline"
          className="bg-red-700/10 text-red-700 border-red-700/20"
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Urgent
        </Badge>
      );
    default:
      return null;
  }
};

export const TasksModal = ({ open, onOpenChange }: TasksModalProps) => {
  const { allBoards } = useBoardStore() as BoardStore;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <KanbanSquare className="h-5 w-5" />
            All Tasks
          </DialogTitle>
          <DialogDescription>
            View all tasks grouped by board.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <Accordion type="multiple" className="w-full">
            {allBoards.map((board) => (
              <AccordionItem
                key={board._id}
                value={board._id}
                className="border-b border-border/50"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <span className="font-medium">{board.title}</span>
                    <Badge variant="outline" className="ml-2 bg-background/30">
                      {countTasksInBoard(board)} tasks
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-2">
                    {countTasksInBoard(board) > 0 ? (
                      board.columns.flatMap((column) =>
                        column.tasks.map((task) => (
                          <div
                            key={task._id}
                            className="p-3 rounded-md bg-background/30 border border-border/50 hover:bg-background/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {task.title}
                              </h4>
                              {getPriorityBadge(task.priority)}
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No tasks in this board
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
