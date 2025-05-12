import { motion } from "motion/react";

import { Player } from "../types";

import { Circle, X } from "lucide-react";

type SquareProps = {
  value: Player | null;
  isWinner: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const getSquareColor = (value: Player | null) =>
  value === "X"
    ? "bg-zinc-900 text-primary"
    : value === "O"
      ? "bg-zinc-900 text-secondary"
      : "";

const getSquareBorderColor = (value: Player | null, isWinner: boolean) => {
  if (isWinner && value === "X") return "border-primary";
  if (isWinner && value === "O") return "border-secondary";

  return "border-zinc-500";
};

export function Square({ value, onClick, disabled, isWinner }: SquareProps) {
  const isDisabledButNotWinner = disabled && !isWinner;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex size-32 items-center justify-center rounded-2xl border-4 font-bold ${getSquareColor(value)} ${getSquareBorderColor(value, isWinner)} ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:brightness-110"} ${isDisabledButNotWinner ? "opacity-50" : ""}`}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="block"
        >
          {value === "X" && <X className="size-28" />}
        </motion.span>
      )}

      {value === "O" && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="block"
        >
          {value === "O" && <Circle className="size-24" />}
        </motion.span>
      )}
    </motion.button>
  );
}
