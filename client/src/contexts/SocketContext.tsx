import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  // Board operations
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
  emitBoardCreated: () => void;
  emitBoardUpdated: () => void;
  emitBoardDeleted: (boardId: string) => void;
  // Column operations
  emitColumnCreated: (boardId: string) => void;
  emitColumnUpdated: (boardId: string) => void;
  emitColumnDeleted: (boardId: string) => void;
  emitColumnClear: (boardId: string) => void;
  // Task operations
  emitTaskCreated: (data: any) => void;
  emitTaskUpdated: (data: any) => void;
  emitTaskDeleted: (data: any) => void;
  emitTaskMoved: (boardId: string) => void;
  // Comment operations
  emitCommentCreated: (taskId: string, boardId: string) => void;
  emitCommentUpdated: (taskId: string, boardId: string) => void;
  emitCommentDeleted: (taskId: string, boardId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_API_URL || "http://localhost:5001",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
      }
    );

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Board operations
  const joinBoard = (boardId: string) => {
    if (socket) {
      socket.emit("join-board", boardId);
    }
  };

  const leaveBoard = (boardId: string) => {
    if (socket) {
      socket.emit("leave-board", boardId);
    }
  };

  const emitBoardCreated = () => {
    if (socket) {
      socket.emit("board-created");
    }
  };

  const emitBoardUpdated = () => {
    if (socket) {
      socket.emit("board-updated");
    }
  };

  const emitBoardDeleted = (boardId: string) => {
    if (socket) {
      socket.emit("board-deleted", boardId);
    }
  };

  // Column operations
  const emitColumnCreated = (boardId: string) => {
    if (socket) {
      socket.emit("column-created", boardId);
    }
  };

  const emitColumnUpdated = (boardId: string) => {
    if (socket) {
      socket.emit("column-updated", boardId);
    }
  };

  const emitColumnDeleted = (boardId: string) => {
    if (socket) {
      socket.emit("column-deleted", boardId);
    }
  };

  const emitColumnClear = (boardId: string) => {
    if (socket) {
      socket.emit("column-clear", boardId);
    }
  };

  // Task operations
  const emitTaskCreated = (boardId: string) => {
    if (socket) {
      socket.emit("task-created", boardId);
    }
  };

  const emitTaskUpdated = (boardId: string) => {
    if (socket) {
      socket.emit("task-updated", boardId);
    }
  };

  const emitTaskDeleted = (boardId: string) => {
    if (socket) {
      socket.emit("task-deleted", boardId);
    }
  };

  const emitTaskMoved = (boardId: string) => {
    if (socket) {
      socket.emit("task-moved", boardId);
    }
  };

  // Comment operations
  const emitCommentCreated = (taskId: string, boardId: string) => {
    if (socket) {
      socket.emit("comment-created", taskId, boardId);
    }
  };

  const emitCommentUpdated = (taskId: string, boardId: string) => {
    if (socket) {
      socket.emit("comment-updated", taskId, boardId);
    }
  };

  const emitCommentDeleted = (taskId: string, boardId: string) => {
    if (socket) {
      socket.emit("comment-deleted", taskId, boardId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinBoard,
        leaveBoard,
        emitBoardCreated,
        emitBoardUpdated,
        emitBoardDeleted,
        emitColumnCreated,
        emitColumnUpdated,
        emitColumnDeleted,
        emitColumnClear,
        emitTaskCreated,
        emitTaskUpdated,
        emitTaskDeleted,
        emitTaskMoved,
        emitCommentCreated,
        emitCommentUpdated,
        emitCommentDeleted,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
