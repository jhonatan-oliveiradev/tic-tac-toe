import { ref, onValue } from "firebase/database";
import { rtdb } from "./firebase-config";

export const listenGameState = (
  gameId: string,
  onChange: (gameData: any) => void,
) => {
  const gameRef = ref(rtdb, `games/${gameId}`);

  const unsubscribe = onValue(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      const gameData = snapshot.val();
      onChange(gameData);
    }
  });

  return () => unsubscribe(); // Retorna função para desinscrever
};
