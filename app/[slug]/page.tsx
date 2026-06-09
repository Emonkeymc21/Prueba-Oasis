"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getDynamicBySlug, validateDynamicPassword, DynamicConfig, lugaresEvangelio } from "@/lib/invitations";

export default function RetiroDynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [dynamic, setDynamic] = useState<DynamicConfig | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados de etapas
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Estados de la Ruleta
  const [ruletaTexto, setRuletaTexto] = useState("¿Qué lugar te tocará?");
  const [isSpinning, setIsSpinning] = useState(false);
  const [ruletaTerminada, setRuletaTerminada] = useState(false);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const consignaSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (slug) {
      const data = getDynamicBySlug(slug);
      setDynamic(data);
    }
  }, [slug]);

  // Efecto para apagar la música global cuando el video se empiece a reproducir
  useEffect(() => {
    if (isPlaying) {
      // Buscamos cualquier etiqueta de audio global que haya iniciado la app original
      const globalAudios = document.querySelectorAll("audio");
      globalAudios.forEach((audio) => {
        audio.pause();
      });
      
      // Intentamos interactuar con posibles botones de mute de la app original
      const musicButtons = document.querySelectorAll(".music-fab, button");
      musicButtons.forEach((btn) => {
        if (btn.textContent?.toLowerCase().includes("música") || btn.textContent?.toLowerCase().includes("music")) {
          (btn as HTMLElement).click();
        }
      });
    }
  }, [isPlaying]);

  if (!dynamic) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-[#f6f1e8]">
        <p className="text-xl font-serif text-[#2f2417]">Participante no encontrado.</p>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDynamicPassword(slug, passwordInput)) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Contraseña incorrecta. Intentá de nuevo.");
    }
  };

  const handleGoToVideo = () => {
    setCurrentStep(2);
    setTimeout(() => {
      videoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log("El navegador bloqueó el autoplay, requiere interacción directa.");
      });
    }
  };

  const handleVideoEnded = () => {
    setVideoFinished(true);
    setIsPlaying(false);
  };

  const handleGoToConsigna = () => {
    setCurrentStep(3);
    setTimeout(() => {
      consignaSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
    startRuleta();
  };

  // Lógica de animación de la Ruleta del Evangelio
  const startRuleta = () => {
    setIsSpinning(true);
    let index = 0;
    let velocidad = 60; // milisegundos entre cambios
    let vueltas = 0;

    const interval = setInterval(() => {
      setRuletaTexto(lugaresEvangelio[index]);
      index = (index + 1) % lugaresEvangelio.length;
      vueltas++;

      // Simular desaceleración paulatina
      if (vueltas > 25) {
        clearInterval(interval);
        // Forzar que el resultado final sea exactamente el asignado (Jerusalén)
        setRuletaTexto(dynamic.lugarEvangelioAsignado);
        setIsSpinning(false);
        setRuletaTerminada(true);
      }
    }, velocidad);
  };

  // 1. PANTALLA LOGIN (CELULAR FRIENDLY)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f1e8] px-6 py-12">
        <div className="w-full max-w-sm bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[28px] shadow-xl border border-amber-900/10 text-center">
          <div className="w-12 h-12 bg-[#8a6b2f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">🕊️</span>
          </div>
          <h1 className="text-2xl font-serif text-[#2f2417] mb-1 font-bold">Bienvenido al Retiro</h1>
          <p className="text-xs text-[#675744] font-sans mb-6">Ingresá la clave provista por tus animadores</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-950/20 bg-white text-[#2f2417] text-center font-sans uppercase tracking-widest text-lg focus:ring-2 focus:ring-[#8a6b2f] focus:outline-none transition-all"
            />
            {errorMsg && <p className="text-xs text-red-600 font-sans font-medium">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#9d7a34] to-[#7e6128] text-white font-sans font-bold rounded-xl shadow-md active:scale-95 transition-transform tracking-wider text-sm"
            >
              INGRESAR AL RETIRO
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#efe6d5] via-[#f8f5ef] to-[#f3ede2] text-[#2f2417] font-serif pb-20 selection:bg-[#e9dcc1] overflow-x-hidden">
      
      {/* ETAPA 1: BIENVENIDA */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 max-w-xl mx-auto text-center py-8">
        <span className="text-[10px] tracking-[0.25em] font-sans text-[#8a6b2f] uppercase font-bold mb-3 bg-[#8a6b2f]/10 px-3 py-1 rounded-full">
          UN MOMENTO PARA VOS
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#2f2417] tracking-tight">{dynamic.nombre}</h1>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-[24px] border border-amber-900/10 shadow-md mb-8 transform transition-all">
          <p className="text-base md:text-lg text-[#2f2417] leading-relaxed italic">
            "{dynamic.mensajeBienvenida}"
          </p>
        </div>

        {currentStep === 1 && (
          <button
            onClick={handleGoToVideo}
            className="w-full sm:w-auto py-4 px-8 bg-gradient-to-b from-[#9d7a34] to-[#7e6128] text-white font-sans font-bold rounded-full transition-all tracking-wider shadow-lg active:scale-95 hover:opacity-95 animate-pulse text-sm"
          >
            DESCUBRIR MI MENSAJE ✨
          </button>
        )}
      </section>

      {/* ETAPA 2: VIDEO */}
      {currentStep >= 2 && (
        <section 
          ref={videoSectionRef}
          className="min-h-screen flex flex-col items-center justify-center px-6 max-w-xl mx-auto text-center py-10 transition-opacity duration-700"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#2f2417]">Un regalo directo al corazón...</h2>
          <p className="text-xs font-sans text-[#675744] max-w-xs mb-6 leading-relaxed">
            Colocate los auriculares, acomodate en tu lugar y dale reproducir al video.
          </p>

          {/* Reproductor Nativo Mobile de Google Drive */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white mb-6 relative group">
            <video
              ref={videoRef}
              src={dynamic.driveVideoUrl}
              controls
              playsInline
              onPlay={handlePlayVideo}
              onEnded={handleVideoEnded}
              className="w-full h-full object-contain"
            />
            
            {!isPlaying && !videoFinished && (
              <button 
                onClick={handlePlayVideo}
                className="absolute inset-0 m-auto w-16 h-16 bg-[#8a6b2f] hover:bg-[#675744] text-white rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 z-10"
              >
                <span className="text-2xl ml-1">▶️</span>
              </button>
            )}
          </div>

          {/* SIMULADOR DE FINALIZACIÓN EN CASO DE ERROR DE ENLACE DE DRIVE */}
          {!videoFinished && (
            <div className="mb-4">
              <button 
                onClick={handleVideoEnded}
                className="text-[11px] font-sans text-[#8a6b2f] underline opacity-40 active:opacity-100"
              >
                [Simular fin del video]
              </button>
            </div>
          )}

          {/* Botón dinámico habilitado SÓLO al terminar el video */}
          {videoFinished && currentStep === 2 && (
            <button
              onClick={handleGoToConsigna}
              className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-[#20663a] to-[#297b46] text-white font-sans font-bold rounded-full transition-all tracking-wider shadow-lg active:scale-95 animate-bounce text-sm"
            >
              DESCUBRIR MI DINÁMICA 🧭
            </button>
          )}
        </section>
      )}

      {/* ETAPA 3: LA RULETA Y CONSIGNA FINAL */}
      {currentStep === 3 && (
        <section 
          ref={consignaSectionRef}
          className="min-h-screen flex flex-col items-center justify-center px-6 max-w-xl mx-auto text-center py-8"
        >
          {/* TARJETA INTERACTIVA DE LA RULETA */}
          <div className="w-full bg-white p-6 md:p-8 rounded-[32px] border-2 border-[#e9dcc1] shadow-xl mb-6 relative overflow-hidden">
            <span className="text-[10px] tracking-[0.2em] font-sans text-[#675744] uppercase font-bold block mb-4">
              {isSpinning ? "🔄 BUSCANDO TU ESPACIO..." : "📍 TU LUGAR ASIGNADO"}
            </span>

            {/* Efecto visual de Ruleta */}
            <div className={`text-3xl md:text-4xl font-bold font-serif my-6 transition-all duration-100 ${isSpinning ? 'text-[#8a6b2f] scale-105 opacity-80' : 'text-[#20663a] scale-100'}`}>
              {isSpinning ? `✨ ${ruletaTexto} ✨` : `⛪ ${ruletaTexto}`}
            </div>

            {isSpinning && (
              <div className="w-full bg-amber-100 h-1 rounded-full overflow-hidden">
                <div className="bg-[#8a6b2f] h-full w-2/3 animate-infinite-scroll rounded-full"></div>
              </div>
            )}
          </div>

          {/* CONTENIDO REVELADO DESPUÉS DE LA RULETA */}
          {ruletaTerminada && (
            <div className="w-full space-y-6 animate-fade-in">
              <div className="inline-flex py-1 px-4 bg-[#20663a]/10 rounded-full text-[#20663a] font-sans text-xs font-bold uppercase tracking-wider">
                {dynamic.esIndividual ? "🙌 Trabajo Personal / Individual" : "👥 Trabajo Acompañado"}
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-amber-900/10 text-left shadow-sm">
                <h3 className="text-xs tracking-wider font-sans text-[#675744] font-bold uppercase mb-3">
                  Consigna de la Actividad:
                </h3>
                <p className="text-sm md:text-base text-[#2f2417] leading-relaxed whitespace-pre-line font-serif">
                  {dynamic.actividadEspecifica}
                </p>
              </div>

              <p className="text-xs font-sans text-[#675744] italic pt-4">
                "Caminante, no hay camino, se hace camino al andar." ¡Buen momento de retiro! 🕊️
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}