import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import { Header } from "../components/Header";

import { Sword, Swords } from "lucide-react";

export default function Home() {
  const [showDifficulty, setShowDifficulty] = useState(false);
  const navigate = useNavigate();

  const handleSinglePlayerClick = () => {
    setShowDifficulty(true);
  };

  const handleMultiplayerClick = () => {
    const roomId = uuidv4();

    navigate(`/waiting-room/${roomId}`);
  };

  const startGame = (difficulty: "easy" | "medium" | "hard" | "impossible") => {
    navigate(`/game?difficulty=${difficulty}&mode=single`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Header />

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Welcome!</h1>
        <p className="text-zinc-400">
          Please, choose the game mode you want to play!
        </p>

        {!showDifficulty ? (
          <div className="flex items-center gap-2">
            <button
              className="bg-primary text-secondary flex items-center gap-2 rounded-lg p-2 font-medium transition-all hover:brightness-90"
              onClick={handleSinglePlayerClick}
            >
              <Sword className="size-4" /> Singleplayer
            </button>
            <button
              className="bg-primary text-secondary flex items-center gap-2 rounded-lg p-2 font-medium transition-all hover:brightness-90"
              onClick={handleMultiplayerClick}
            >
              <Swords className="size-4" /> Multiplayer
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => startGame("easy")}
              className="rounded-lg bg-emerald-500 p-2 text-white hover:brightness-90"
            >
              Easy
            </button>
            <button
              onClick={() => startGame("medium")}
              className="rounded-lg bg-amber-500 p-2 text-white hover:brightness-90"
            >
              Medium
            </button>
            <button
              onClick={() => startGame("hard")}
              className="rounded-lg bg-rose-600 p-2 text-white hover:brightness-90"
            >
              Hard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
