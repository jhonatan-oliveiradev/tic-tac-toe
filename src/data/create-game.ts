import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase-config";

export const createGame = async (playerId: string) => {
  const gameId = `game-${Date.now()}`; // ID único para o jogo
  const gameRef = doc(db, "games", gameId);

  await setDoc(gameRef, {
    board: Array(9).fill(null),
    currentPlayer: "X", // Jogador X começa
    player1: playerId,
    player2: null, // Aguardando segundo jogador
    status: "waiting", // Aguardando o segundo jogador
    createdAt: Timestamp.now(),
  });

  return gameId;
};
