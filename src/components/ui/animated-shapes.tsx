import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AnimatedShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuração segura de animações
  useGSAP(() => {
    // Contexto seguro para animações
    const ctx = gsap.context(() => {
      // Animação otimizada para círculos
      gsap.to(".circle", {
        y: () => gsap.utils.random(-20, 20),
        x: () => gsap.utils.random(-20, 20),
        rotation: () => gsap.utils.random(-30, 30),
        duration: () => gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      // Animação otimizada para linhas
      gsap.to(".line", {
        scaleX: () => gsap.utils.random(0.8, 1.2),
        scaleY: () => gsap.utils.random(0.8, 1.2),
        rotation: () => gsap.utils.random(-10, 10),
        duration: () => gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      // Animação otimizada para pontos
      gsap.to(".dot", {
        scale: () => gsap.utils.random(0.8, 1.2),
        opacity: () => gsap.utils.random(0.3, 0.7),
        duration: () => gsap.utils.random(1, 3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef); // Escopo limitado ao container

    return () => ctx.revert(); // Limpeza segura
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Círculos com fallback de opacidade */}
      <div className="circle absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-xl" />
      <div className="circle absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-xl" />
      <div className="circle absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-xl" />
      <div className="circle absolute top-1/3 right-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-xl" />
      <div className="circle absolute bottom-1/3 left-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-xl" />

      {/* Linhas simplificadas */}
      <div className="line absolute top-1/4 left-1/3 h-px w-32 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="line absolute right-1/4 bottom-1/3 h-px w-40 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="line absolute top-2/3 left-1/2 h-px w-24 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Pontos com tamanho fixo */}
      <div className="dot absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-blue-500/30" />
      <div className="dot absolute bottom-1/3 left-1/3 h-2 w-2 rounded-full bg-blue-500/30" />
      <div className="dot absolute top-2/3 right-1/3 h-2 w-2 rounded-full bg-purple-500/30" />
      <div className="dot absolute top-1/2 left-1/4 h-2 w-2 rounded-full bg-cyan-500/30" />
      <div className="dot absolute right-1/2 bottom-1/4 h-2 w-2 rounded-full bg-indigo-500/30" />

      {/* Grid Pattern mais suave */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
}
