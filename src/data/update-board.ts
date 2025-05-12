import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { BoardState } from "../types";

export const updateBoard = async (
  gameId: string,
  newBoard: BoardState,
  currentPlayer: string,
) => {
  const gameRef = doc(db, "games", gameId);

  await updateDoc(gameRef, {
    board: newBoard,
    currentPlayer: currentPlayer === "X" ? "O" : "X",
  });
};
