import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AnimatedShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animação dos círculos
      gsap.to(".circle", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-30, 30)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random",
        },
      });

      // Animação das linhas
      gsap.to(".line", {
        scaleX: "random(0.8, 1.2)",
        scaleY: "random(0.8, 1.2)",
        rotation: "random(-10, 10)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random",
        },
      });

      // Animação dos pontos
      gsap.to(".dot", {
        scale: "random(0.8, 1.2)",
        opacity: "random(0.3, 0.7)",
        duration: "random(1, 3)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      {/* Círculos */}
      <div className="circle bg-primary/10 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
      <div className="circle absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="circle absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="circle absolute top-1/3 right-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="circle absolute bottom-1/3 left-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Linhas */}
      <div className="line via-primary/20 absolute top-1/4 left-1/3 h-1 w-32 bg-gradient-to-r from-transparent to-transparent" />
      <div className="line absolute right-1/4 bottom-1/3 h-1 w-40 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="line absolute top-2/3 left-1/2 h-1 w-24 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Pontos */}
      <div className="dot bg-primary/30 absolute top-1/4 right-1/4 h-2 w-2 rounded-full" />
      <div className="dot absolute bottom-1/3 left-1/3 h-3 w-3 rounded-full bg-blue-500/30" />
      <div className="dot absolute top-2/3 right-1/3 h-2 w-2 rounded-full bg-violet-500/30" />
      <div className="dot absolute top-1/2 left-1/4 h-3 w-3 rounded-full bg-cyan-500/30" />
      <div className="dot absolute right-1/2 bottom-1/4 h-2 w-2 rounded-full bg-indigo-500/30" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
}
