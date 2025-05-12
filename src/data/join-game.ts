import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";

export const joinGame = async (gameId: string, playerId: string) => {
  const gameRef = doc(db, "games", gameId);

  // Verifica se o jogo ainda está aguardando um segundo jogador
  const gameSnap = await getDoc(gameRef);
  if (gameSnap.exists() && gameSnap.data().status === "waiting") {
    await updateDoc(gameRef, {
      player2: playerId,
      status: "started", // Jogo iniciado
    });
  } else {
    console.log("O jogo não está mais disponível ou já está em andamento.");
  }
};
