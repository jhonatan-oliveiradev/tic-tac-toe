import { ref, set } from "firebase/database";
import { rtdb } from "./firebase-config";
import { v4 as uuidv4 } from "uuid";

export const createGame = async (playerId: string) => {
  const gameId = `game-${uuidv4()}`;
  const gameRef = ref(rtdb, `games/${gameId}`);

  await set(gameRef, {
    board: Array(9).fill(null),
    currentPlayer: "X",
    player1: playerId,
    player2: null,
    status: "waiting",
    createdAt: { ".sv": "timestamp" },
  });

  return gameId;
};
