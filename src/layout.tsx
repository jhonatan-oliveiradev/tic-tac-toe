import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AnimatedShapes from "./components/ui/animated-shapes";

export default function Layout() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <AnimatedShapes />
      <div className="relative z-10 w-full max-w-7xl px-4">
        <Outlet />
      </div>
      <Toaster position="top-center" />
    </main>
  );
}
