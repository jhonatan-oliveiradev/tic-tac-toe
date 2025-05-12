import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase-config";

export const listenGameState = (
  gameId: string,
  onChange: (gameData: any) => void,
) => {
  const gameRef = doc(db, "games", gameId);
  const unsubscribe = onSnapshot(gameRef, (docSnap) => {
    if (docSnap.exists()) {
      const gameData = docSnap.data();
      onChange(gameData);
    }
  });

  return unsubscribe;
};
