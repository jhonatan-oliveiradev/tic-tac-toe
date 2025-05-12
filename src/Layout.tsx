import { Outlet } from "react-router-dom";
import AnimatedShapes from "./components/ui/AnimatedShapes";

export default function Layout() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <AnimatedShapes />
      <Outlet />
    </main>
  );
}
