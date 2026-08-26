import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "../assets/ruckus-games-untitled-game-arcade.png";

const JUEGOS = ["Bolos", "Pool", "Futbolín", "PlayStation"];

export function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[180vh] bg-black text-white overflow-hidden">

      {/* Fondo fijo con imagen */}
      <div className="fixed inset-0 w-full h-[90%] z-0 overflow-hidden pointer-events-none">
        <div
          style={{
            transform: `scale(${Math.max(1, 1.25 - scrollY * 0.0005)})`,
            filter: `blur(${Math.min(scrollY * 0.01, 10)}px)`,
          }}
          className="w-full h-full transition-transform duration-75 ease-out"
        >
          <img
            src={heroImage}
            alt="arcade image"
            className="w-full h-full object-cover [animation:kenBurns_18s_ease-in-out_infinite]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
      </div>

      {/* Círculos decorativos*/}
      <div
        style={{
          transform: `translate3d(0, -${scrollY * 0.4}px, 0)`,
        }}
        className="hidden sm:block fixed top-[15%] left-[5%] z-10 pointer-events-none w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full bg-pink-500 border-4 border-pink-500 shadow-[0_0_50px_#ec4899,0_0_100px_#ec4899]"
      />

      <div
        style={{
          transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
        }}
        className="hidden sm:block fixed top-[45%] right-[8%] z-10 pointer-events-none w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-accent border-4 border-accent shadow-[0_0_40px_var(--color-accent,#8b5cf6),0_0_80px_var(--color-accent,#8b5cf6)]"
      />

      <div
        style={{
          transform: `translate3d(${scrollY * 0.1}px, -${scrollY * 0.5}px, 0)`,
        }}
        className="hidden md:block fixed bottom-[20%] left-[25%] z-10 pointer-events-none w-24 h-24 rounded-full bg-[rgba(138,43,226)] border-4 border-[#8a2be2] shadow-[0_0_30px_#8a2be2]"
      />

      {/* Hero */}
      <section className="w-full min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 relative z-20">
        <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-accent bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.6)] bg-[length:200%_auto] [animation:shimmer_4s_ease-in-out_infinite] will-change-[background-position]">
          Zona de Ataque
        </h1>

        <p className="text-base sm:text-xl md:text-2xl font-bold tracking-widest uppercase text-pink-200 pt-6 max-w-xs sm:max-w-xl md:max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Bolos • Pool • Futbolín • PlayStation. Elige tu juego y domina la sala.
        </p>

        <div className="flex gap-2 sm:gap-3 flex-wrap justify-center pt-8">
          {JUEGOS.map((juego) => (
            <Badge key={juego} variant="info">
              {juego}
            </Badge>
          ))}
        </div>

        <div className="pt-10 sm:pt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center relative z-20 w-full sm:w-auto px-6 sm:px-0">
          <Link to="/service" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Ver juegos</Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </section>

      {/* Modos de juego */}
      <section className="w-full min-h-screen relative z-30 flex flex-col justify-center items-center px-4 sm:px-6 py-24 sm:py-32 bg-transparent">
        <h2
          className="scroll-reveal text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_20px_#22d3ee] text-center mb-10 sm:mb-14"
          style={{
            transform: `translate3d(0, -${scrollY * 0.2}px, 0)`,
          }}
        >
          MODOS DE JUEGO DISPONIBLES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-7xl w-full">
          {JUEGOS.map((juego, idx) => (
            <div
              key={juego}
              className="h-52 sm:h-60 md:h-64 bg-neutral-900/90 border-2 border-pink-500/50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.7)] hover:border-pink-500 relative overflow-hidden group"
            >
              <span className="text-6xl sm:text-7xl font-black text-white/5 absolute -right-2 -bottom-2 select-none">
                0{idx + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wider group-hover:text-pink-400 transition-colors">
                {juego}
              </h3>
              <p className="text-neutral-400 text-xs uppercase tracking-widest">
                Reserva inmediata • Zona Arcade
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}