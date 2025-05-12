import { Gamepad2 } from "lucide-react";

export function Header() {
  return (
    <>
      <div className="mb-2 flex flex-col items-center justify-center gap-2">
        <Gamepad2 className="text-primary size-12" />
        <h1 className="text-3xl font-bold">&mdash; Tic Tac Toe &mdash;</h1>
      </div>

      <div className="bg-secondary mb-8 h-px w-full opacity-25" />
    </>
  );
}
