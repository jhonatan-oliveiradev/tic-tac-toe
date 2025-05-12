import { WINNING_COMBINATIONS } from "../helpers/game-logic";
import { BoardState, Player } from "../types";

import { Square } from "./Square";

type BoardProps = {
  board: BoardState;
  winner: Player | null;
  onClick: (index: number) => void;
  disabled: boolean;
};

export function Board({ board, winner, onClick, disabled }: BoardProps) {
  const isWinner = (index: number): boolean => {
    if (!winner) return false;

    return WINNING_COMBINATIONS.some(
      (combination) =>
        combination.includes(index) &&
        combination.every((i) => board[i] === winner),
    );
  };

  return (
    <div className="mx-auto grid max-w-[26rem] grid-cols-3 gap-4">
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onClick(index)}
          disabled={disabled || isWinner(index)}
          isWinner={isWinner(index)}
        />
      ))}
    </div>
  );
}
