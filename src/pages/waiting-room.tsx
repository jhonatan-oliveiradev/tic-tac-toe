import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";
import { motion } from "motion/react";
import { nanoid } from "nanoid";

import { ref, onValue, set } from "firebase/database";

import { rtdb as db } from "../data/firebase-config";

export default function WaitingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [playerId] = useState(() => nanoid());

  // Monitorar sala
  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}/players`);

    const unsub = onValue(roomRef, (snapshot) => {
      const players = snapshot.val() || {};
      const readyCount = Object.values(players).filter(
        (p: any) => p.ready,
      ).length;
      setPlayersReady(readyCount);

      if (readyCount === 2) {
        navigate(`/game?mode=multiplayer&roomId=${roomId}`);
      }
    });

    return () => unsub();
  }, [roomId, navigate]);

  // Marcar jogador como pronto
  const handleReady = async () => {
    if (!roomId || ready) return;

    setReady(true);
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);

    try {
      await set(playerRef, { ready: true });
    } catch (error) {
      console.error("Error setting player ready state:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <div className="flex h-auto min-h-[40vh] flex-col items-center justify-center gap-4 rounded-4xl bg-zinc-950/50 px-12 shadow-lg">
      <h1 className="text-3xl font-bold text-white">Waiting Room</h1>
      <p className="text-zinc-400">
        Room ID: <span className="font-mono text-zinc-300">{roomId}</span>
      </p>

      <motion.div
        className="text-lg text-zinc-400"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        Waiting for second player
        <span className="inline-block animate-pulse">...</span>
      </motion.div>

      <button
        onClick={handleCopyLink}
        className="bg-secondary rounded px-4 py-2 font-medium text-black hover:brightness-90"
      >
        Copy link to invite friend
      </button>

      <button
        disabled={ready}
        onClick={handleReady}
        className={`rounded px-4 py-2 font-medium transition-all ${
          ready
            ? "cursor-not-allowed bg-gray-400"
            : "bg-primary hover:brightness-90"
        }`}
      >
        {ready ? "Waiting..." : "Ready!"}
      </button>

      <p className="text-sm text-zinc-400">{playersReady}/2 players ready</p>
    </div>
  );
}
