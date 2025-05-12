import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { BoardState } from "../types";

import { checkWinner, isBoardFull } from "../helpers/game-logic";
import { getAIMove, Difficulty } from "../helpers/ai";

import { Header } from "./Header";
import { Board } from "./Board";

import { ChevronLeft, RefreshCcw } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Game() {
  const query = useQuery();
  const difficultyParam = query.get("difficulty") as Difficulty;
  const [difficulty] = useState<Difficulty>(difficultyParam || "medium");

  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isAITurn, setIsAITurn] = useState(false);

  const currentPlayer = board.filter(Boolean).length % 2 === 0 ? "X" : "O";
  const winner = checkWinner(board);
  const isDraw = !winner && isBoardFull(board);

  const victorySound = useRef<HTMLAudioElement | null>(null);
  const whileGamingSound = useRef<HTMLAudioElement | null>(null);
  const chooseXSound = useRef<HTMLAudioElement | null>(null);
  const chooseOSound = useRef<HTMLAudioElement | null>(null);
  const drawSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    victorySound.current = new Audio("/sounds/game-start.mp3");
    whileGamingSound.current = new Audio("/sounds/while-gaming.mp3");
    chooseXSound.current = new Audio("/sounds/choose-x.mp3");
    chooseOSound.current = new Audio("/sounds/choose-o.mp3");
    drawSound.current = new Audio("/sounds/game-over.wav");

    whileGamingSound.current.loop = true;
    whileGamingSound.current.play();

    return () => {
      whileGamingSound.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (winner) {
      whileGamingSound.current?.pause();
      victorySound.current?.play();
    } else if (isDraw) {
      whileGamingSound.current?.pause();
      drawSound.current?.play();
    }
  }, [winner, isDraw]);

  useEffect(() => {
    if (currentPlayer === "O" && !winner && !isDraw) {
      setIsAITurn(true);
      const timeout = setTimeout(() => {
        makeAIMove();
        setIsAITurn(false);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [board]);

  const makeAIMove = () => {
    const aiIndex = getAIMove(board, difficulty);
    if (aiIndex !== undefined) {
      const newBoard = board.map((cell, i) => (i === aiIndex ? "O" : cell));
      setBoard(newBoard);
      chooseOSound.current?.play();
    }
  };

  const handleClick = (index: number) => {
    if (winner || board[index] || isAITurn) return;

    const newBoard = board.map((square, i) => (index === i ? "X" : square));
    setBoard(newBoard);
    chooseXSound.current?.play();
  };

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null));
    setIsAITurn(false);
    if (whileGamingSound.current) {
      whileGamingSound.current.currentTime = 0;
    }
    whileGamingSound.current?.play();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-black p-8 shadow-lg">
        <Header />

        <div className="my-6 flex flex-col items-center justify-center text-center">
          {winner ? (
            <p className="text-xl font-medium text-zinc-300">
              Player{" "}
              <span
                className={`${
                  winner === "X" ? "text-primary" : "text-secondary"
                }`}
              >
                {winner}
              </span>{" "}
              wins!
            </p>
          ) : isDraw ? (
            <p className="text-xl font-medium text-zinc-300">
              It&apos;s a draw!
            </p>
          ) : (
            <p className="text-xl font-medium text-zinc-400">
              {currentPlayer === "X" ? "Your turn" : "AI is thinking..."}
            </p>
          )}
        </div>

        <Board
          board={board}
          onClick={handleClick}
          disabled={Boolean(winner || isDraw || isAITurn)}
          winner={winner}
        />
      </div>

      <div className="mt-8 min-h-12 w-full">
        {(winner || isDraw) && (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePlayAgain}
              className="group bg-secondary flex items-center gap-2 rounded-lg p-2 font-medium text-black transition-all hover:brightness-90"
            >
              <span>Play again</span>
              <RefreshCcw className="size-4 transition-all duration-300 group-hover:-rotate-90" />
            </button>
            <button className="group bg-primary rounded-lg font-medium text-black transition-all hover:brightness-90">
              <Link to="/" className="flex items-center gap-2 p-2">
                <ChevronLeft className="size-4 transition-all duration-300 group-hover:-translate-x-1" />
                Back to home
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
