import { BoardState } from "../types";
import { checkWinner, isBoardFull } from "./game-logic";

export type Difficulty = "easy" | "medium" | "hard" | "impossible";

export function getAIMove(
  board: BoardState,
  difficulty: Difficulty,
): number | undefined {
  switch (difficulty) {
    case "easy":
      return getEasyMove(board);
    case "medium":
      return getMediumMove(board);
    case "hard":
      return getHardMove(board);
    case "impossible":
      return getBestMoveMinimax(board, "O")?.index;
    default:
      return getEasyMove(board);
  }
}

function getEasyMove(board: BoardState): number | undefined {
  const empty = board
    .map((val, i) => (val === null ? i : null))
    .filter((i): i is number => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getMediumMove(board: BoardState): number | undefined {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const newBoard = [...board];
      newBoard[i] = "O";
      if (checkWinner(newBoard) === "O") return i;
    }
  }
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const newBoard = [...board];
      newBoard[i] = "X";
      if (checkWinner(newBoard) === "X") return i;
    }
  }
  return getEasyMove(board);
}

function getHardMove(board: BoardState): number | undefined {
  const move = getMediumMove(board);
  if (move !== undefined) return move;

  const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  return preferred.find((i) => board[i] === null);
}

function getBestMoveMinimax(
  board: BoardState,
  player: "X" | "O",
): { index: number; score: number } | undefined {
  const opponent = player === "X" ? "O" : "X";
  const winner = checkWinner(board);

  if (winner === "O") return { score: 1, index: -1 };
  if (winner === "X") return { score: -1, index: -1 };
  if (isBoardFull(board)) return { score: 0, index: -1 };

  const moves: { index: number; score: number }[] = [];

  board.forEach((cell, i) => {
    if (cell === null) {
      const newBoard = [...board];
      newBoard[i] = player;
      const result = getBestMoveMinimax(newBoard, opponent);
      moves.push({ index: i, score: result?.score ?? 0 });
    }
  });

  return player === "O"
    ? moves.reduce((best, move) => (move.score > best.score ? move : best))
    : moves.reduce((best, move) => (move.score < best.score ? move : best));
}
