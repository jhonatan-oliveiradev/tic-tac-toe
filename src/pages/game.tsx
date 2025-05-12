import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BoardState } from "../types";
import { checkWinner, isBoardFull } from "../helpers/game-logic";
import { getAIMove, Difficulty } from "../helpers/ai";

import { listenGameState } from "../data/listen-game-state";
import { updateBoard } from "../data/update-board";
import { createGame } from "../data/create-game";
import { joinGame } from "../data/join-game";

import { Header } from "../components/Header";
import { Board } from "../components/Board";

import { ChevronLeft, RefreshCcw, Copy } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Game() {
  const query = useQuery();
  const navigate = useNavigate();

  const mode = query.get("mode") || "single";
  const difficultyParam = query.get("difficulty") as Difficulty;
  const playerId = query.get("playerId")!;
  const existingGameId = query.get("gameId");

  const [difficulty] = useState<Difficulty>(difficultyParam || "medium");
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [isAITurn, setIsAITurn] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const victorySound = useRef<HTMLAudioElement | null>(null);
  const whileGamingSound = useRef<HTMLAudioElement | null>(null);
  const chooseXSound = useRef<HTMLAudioElement | null>(null);
  const chooseOSound = useRef<HTMLAudioElement | null>(null);
  const drawSound = useRef<HTMLAudioElement | null>(null);

  const winner = checkWinner(board);
  const isDraw = !winner && isBoardFull(board);

  // Setup sounds on mount
  useEffect(() => {
    victorySound.current = new Audio("/sounds/game-start.mp3");
    whileGamingSound.current = new Audio("/sounds/while-gaming.mp3");
    chooseXSound.current = new Audio("/sounds/choose-x.mp3");
    chooseOSound.current = new Audio("/sounds/choose-o.mp3");
    drawSound.current = new Audio("/sounds/draw.wav");

    whileGamingSound.current.loop = true;
    void whileGamingSound.current.play().catch(() => {
      // Somente será tocado após interação do usuário (evitar autoplay block)
    });

    return () => {
      whileGamingSound.current?.pause();
    };
  }, []);

  // Reage ao fim do jogo
  useEffect(() => {
    if (winner || isDraw) {
      whileGamingSound.current?.pause();
      (winner ? victorySound : drawSound).current?.play();
    }
  }, [winner, isDraw]);

  // AI jogando (modo single player)
  useEffect(() => {
    if (mode === "single" && currentPlayer === "O" && !winner && !isDraw) {
      setIsAITurn(true);
      const timeout = setTimeout(() => {
        const aiIndex = getAIMove(board, difficulty);
        if (aiIndex !== undefined) {
          const newBoard = board.map((cell, i) => (i === aiIndex ? "O" : cell));
          setBoard(newBoard);
          setCurrentPlayer("X");
          chooseOSound.current?.play();
        }
        setIsAITurn(false);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [board, currentPlayer, difficulty, isDraw, mode, winner]);

  // Configura partida multiplayer
  useEffect(() => {
    if (mode === "multi" && playerId) {
      if (existingGameId) {
        joinGame(existingGameId, playerId).then(() =>
          setGameId(existingGameId),
        );
      } else {
        createGame(playerId).then((newGameId) => {
          setGameId(newGameId);
          setWaiting(true);
          setShowLinkModal(true);
        });
      }
    }
  }, [mode, playerId, existingGameId]);

  // Escuta o estado do jogo em tempo real
  useEffect(() => {
    if (mode === "multi" && gameId) {
      const unsubscribe = listenGameState(gameId, (gameData) => {
        setBoard(gameData.board);
        setCurrentPlayer(gameData.currentPlayer);
        setWaiting(gameData.status === "waiting" || !gameData.player2);

        if (gameData.status !== "waiting") {
          setShowLinkModal(false);
        }
      });
      return () => unsubscribe();
    }
  }, [gameId, mode]);

  const handleClick = (index: number) => {
    if (winner || board[index] || isAITurn) return;

    if (mode === "single") {
      const newBoard = board.map((square, i) => (i === index ? "X" : square));
      setBoard(newBoard);
      setCurrentPlayer("O");
      chooseXSound.current?.play();
    }

    if (mode === "multi" && playerId && gameId) {
      const isMyTurn =
        (currentPlayer === "X" && playerId === query.get("player1")) ||
        (currentPlayer === "O" && playerId === query.get("player2"));
      if (!isMyTurn) return;

      const newBoard = board.map((square, i) =>
        i === index ? currentPlayer : square,
      );
      updateBoard(gameId, newBoard, currentPlayer);
    }
  };

  const handlePlayAgain = () => {
    if (mode === "single") {
      setBoard(Array(9).fill(null));
      setCurrentPlayer("X");
      setIsAITurn(false);
      if (whileGamingSound.current) {
        whileGamingSound.current.currentTime = 0;
        void whileGamingSound.current.play();
      }
    } else {
      navigate("/");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/game?mode=multi&gameId=${gameId}&playerId=PLAYER_TWO_ID`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {mode === "multi" && waiting && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 p-4 text-center">
          <p className="mb-4 text-lg text-white">Aguardando outro jogador...</p>
          {showLinkModal && (
            <div className="rounded-lg bg-zinc-900 p-4 text-left text-white shadow-lg">
              <p className="text-sm">Envie este link para seu amigo:</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}/game?mode=multi&gameId=${gameId}&playerId=PLAYER_TWO_ID`}
                  className="w-full rounded bg-zinc-800 px-2 py-1 text-xs text-white"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={copyLink}
                  className="rounded bg-zinc-700 p-2 text-xs hover:bg-zinc-600"
                >
                  <Copy className="size-4" />
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-xs text-green-400">Link copiado!</p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                Certifique-se de que o outro jogador use um playerId diferente.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="z-10 w-full max-w-lg rounded-2xl bg-black p-8 shadow-lg">
        <Header />
        <div className="my-6 flex flex-col items-center justify-center text-center">
          {winner ? (
            <p className="text-xl font-medium text-zinc-300">
              Player{" "}
              <span
                className={winner === "X" ? "text-primary" : "text-secondary"}
              >
                {winner}
              </span>{" "}
              wins!
            </p>
          ) : isDraw ? (
            <p className="text-xl font-medium text-zinc-300">It's a draw!</p>
          ) : (
            <p className="text-xl font-medium text-zinc-400">
              {mode === "single"
                ? currentPlayer === "X"
                  ? "Your turn"
                  : "AI is thinking..."
                : `Turn: ${currentPlayer}`}
            </p>
          )}
        </div>

        <Board
          board={board}
          onClick={handleClick}
          disabled={
            !!winner ||
            isDraw ||
            (mode === "single" && isAITurn) ||
            (mode === "multi" && waiting)
          }
          winner={winner}
        />
      </div>

      <div className="z-10 mt-8 min-h-12 w-full">
        {(winner || isDraw) && (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePlayAgain}
              className="group bg-secondary flex items-center gap-2 rounded-lg p-2 font-medium text-black transition-all hover:brightness-90"
            >
              <span>{mode === "single" ? "Play again" : "Back to home"}</span>
              <RefreshCcw className="size-4 transition-all duration-300 group-hover:-rotate-90" />
            </button>
            <Link
              to="/"
              className="group bg-primary flex items-center gap-2 rounded-lg p-2 font-medium text-black transition-all hover:brightness-90"
            >
              <ChevronLeft className="size-4 transition-all duration-300 group-hover:-translate-x-1" />
              Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
