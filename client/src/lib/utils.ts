import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Board } from "@/types/Board";
import { BoardColumn } from "@/types/BoardColumn";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const countTasksInBoard = (board: Board): number => {
  return board?.columns?.reduce((acc, column) => {
    return acc + column.tasks?.length;
  }, 0);
};

export const countTasksInColumns = (columns: BoardColumn[]): number => {
  return columns?.reduce((acc, column) => {
    return acc + column.tasks?.length;
  }, 0);
};
