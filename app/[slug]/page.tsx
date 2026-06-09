"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getDynamicBySlug, validateDynamicPassword, DynamicConfig } from "@/lib/invitations";

export default function RetiroDynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [dynamic, setDynamic] = useState<DynamicConfig | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Control de etapas de la dinámica
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [videoFinished, setVideoFinished] = useState(false);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const consignaSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      const data = getDynamicBySlug(slug);
      setDynamic(data);
    }
  }, [slug]);

  if (!dynamic) {
    return (
      <div className="flex min-height-screen items-center justify-center p-8 bg-amber-50">
        <p className="text-xl font-serif text-amber-950">Participante no encontrado.</p>
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

  // Ir a la Etapa 2 (Video) y hacer scroll suave
  const handleGoToVideo = () => {
    setCurrentStep(2);
    setTimeout(() => {
      videoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Ir a la Etapa 3 (Consigna) y hacer scroll suave
  const handleGoToConsigna = () => {
    setCurrentStep(3);
    setTimeout(() => {
      consignaSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Simulación para la demo o si falla la API de YouTube: botón para saltear/marcar como visto
  const forzarVideoTerminado = () => {
    setVideoFinished(true);
  };

  // Pantalla de Login / Contraseña
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f1e8] px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-amber-900/10 text-center">
          <h1 className="text-2xl font-serif text-[#2f2417] mb-2">Retiro Espiritual</h1>
          <p className="text-sm text-[#675744] mb-6 font-sans">Ingresá tu clave personal para comenzar la actividad</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-amber-950/20 bg-white text-[#2f2417] focus:outline-none focus:ring-2 focus:ring-[#8a6b2f] text-center font-sans uppercase tracking-widest"
            />
            {errorMsg && <p className="text-sm text-red-600 font-sans">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#8a6b2f] hover:bg-[#675744] text-white font-sans font-semibold rounded-xl transition-all shadow-md"
            >
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#efe6d5] via-[#f8f5ef] to-[#f3ede2] text-[#2f2417] font-serif pb-24 selection:bg-[#e9dcc1]">
      
      {/* SECCIÓN 1: BIENVENIDA */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 max-w-2xl mx-auto text-center">
        <span className="text-xs tracking-[0.2em] font-sans text-[#8a6b2f] uppercase font-bold mb-3">BIENVENIDO/A</span>
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-[#2f2417]">{dynamic.nombre}</h1>
        
        <div className="bg-white/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-amber-900/10 shadow-sm mb-10">
          <p className="text-lg text-[#2f2417] leading-relaxed italic">
            "{dynamic.mensajeBienvenida}"
          </p>
        </div>

        {currentStep === 1 && (
          <button
            onClick={handleGoToVideo}
            className="py-4 px-8 bg-[#8a6b2f] hover:bg-[#675744] text-white font-sans font-medium rounded-full transition-all tracking-wider shadow-lg animate-bounce"
          >
            DESCUBRIR MI MENSAJE
          </button>
        )}
      </section>

      {/* SECCIÓN 2: EL VIDEO (Aparece o se desbloquea en el paso 2) */}
      {currentStep >= 2 && (
        <section 
          ref={videoSectionRef}
          className="min-h-screen flex flex-col items-center justify-center px-4 max-w-3xl mx-auto text-center py-12"
        >
          <h2 className="text-2xl md:text-3xl mb-6 text-[#2f2417]">Un regalo para tu corazón...</h2>
          <p className="text-sm font-sans text-[#675744] max-w-md mb-8">
            Personas importantes para tu vida prepararon esto. Ponete los auriculares y escuchá con atención.
          </p>

          {/* Contenedor del reproductor de Video de YouTube */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 mb-8">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${dynamic.youtubeVideoId}?autoplay=1&rel=0`}
              title="Video personalizado"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          {/* FALSO DETECTOR DE FINALIZACIÓN PARA LA DEMO */}
          {!videoFinished && (
            <div className="mb-4">
              <button 
                onClick={forzarVideoTerminado}
                className="text-xs font-sans text-[#8a6b2f] underline opacity-60 hover:opacity-100"
              >
                [Demo: Simular que terminó el video]
              </button>
            </div>
          )}

          {/* El botón de continuar SOLO aparece cuando el video termina */}
          {videoFinished && currentStep === 2 && (
            <button
              onClick={handleGoToConsigna}
              className="py-4 px-8 bg-[#8a6b2f] hover:bg-[#675744] text-white font-sans font-medium rounded-full transition-all tracking-wider shadow-lg scale-up-animation"
            >
              CONTINUAR A LA ACTIVIDAD
            </button>
          )}
        </section>
      )}

      {/* SECCIÓN 3: LA CONSIGNA (Paso final) */}
      {currentStep === 3 && (
        <section 
          ref={consignaSectionRef}
          className="min-h-screen flex flex-col items-center justify-center px-4 max-w-2xl mx-auto text-center py-12"
        >
          <span className="text-xs tracking-[0.2em] font-sans text-[#8a6b2f] uppercase font-bold mb-3">
            TU MODALIDAD DE TRABAJO
          </span>
          
          <h2 className="text-3xl font-serif mb-6">
            {dynamic.esIndividual ? "🙌 Dinámica Individual" : "👥 Dinámica en Pareja"}
          </h2>

          {!dynamic.esIndividual && dynamic.companero && (
            <p className="text-xl font-sans text-[#8a6b2f] mb-8 font-medium">
              Tu compañero/a para este momento es: <span className="underline">{dynamic.companero}</span>
            </p>
          )}

          <div className="bg-white p-8 md:p-10 rounded-2xl border-2 border-[#e9dcc1] shadow-xl text-left">
            <h3 className="text-xs tracking-wider font-sans text-[#675744] font-bold uppercase mb-4">
              ¿Qué tenés que hacer ahora?
            </h3>
            <p className="text-base text-[#2f2417] leading-relaxed whitespace-pre-line font-serif">
              {dynamic.actividadEspecifica}
            </p>
          </div>

          <p className="mt-12 text-sm font-sans text-[#675744] italic">
            Que tengas un bendecido momento de encuentro.
          </p>
        </section>
      )}
    </div>
  );
}