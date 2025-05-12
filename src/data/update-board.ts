import { ref, update } from "firebase/database";
import { rtdb } from "./firebase-config";
import { BoardState } from "../types";

export const updateBoard = async (
  gameId: string,
  newBoard: BoardState,
  currentPlayer: string,
) => {
  try {
    const gameRef = ref(rtdb, `games/${gameId}`);

    await update(gameRef, {
      board: newBoard,
      currentPlayer: currentPlayer === "X" ? "O" : "X",
      updatedAt: { ".sv": "timestamp" }, // Adiciona timestamp de atualização
    });
  } catch (error) {
    console.error("Erro ao atualizar tabuleiro:", error);
    throw new Error("Falha ao atualizar o jogo");
  }
};
