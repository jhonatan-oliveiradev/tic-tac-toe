export type Player = "X" | "O";

export type BoardState = (Player | null)[];

export interface GameData {
  board: BoardState;
  currentPlayer: "X" | "O";
  player1: string;
  player2: string | null;
  status: "waiting" | "in_progress" | "finished";
  createdAt: number;
  updatedAt: number;
}
