import { ref, get, update } from "firebase/database";
import { rtdb } from "./firebase-config";

export const joinGame = async (gameId: string, playerId: string) => {
  try {
    const gameRef = ref(rtdb, `games/${gameId}`);

    // Obtém o snapshot do jogo
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error("Jogo não encontrado");
    }

    const gameData = snapshot.val();

    if (gameData.status !== "waiting") {
      throw new Error("O jogo não está mais disponível para entrada");
    }

    if (gameData.player1 === playerId) {
      throw new Error("Você já é o jogador 1 neste jogo");
    }

    // Atualiza o jogo no RTDB
    await update(gameRef, {
      player2: playerId,
      status: "in_progress",
      updatedAt: { ".sv": "timestamp" }, // Formato especial para timestamp no RTDB
    });

    return { success: true, gameId };
  } catch (error) {
    console.error("Erro ao entrar no jogo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};
