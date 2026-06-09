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

  // Control de fases
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [videoFinished, setVideoFinished] = useState(false);

  // Estados de los Sliders táctiles (Deslizadores)
  const [slider1X, setSlider1X] = useState(0);
  const [slider2X, setSlider2X] = useState(0);
  const isUnlocked1 = slider1X >= 100;
  const isUnlocked2 = slider2X >= 100;

  // Estados de la Ruleta interactiva
  const [ruletaTexto, setRuletaTexto] = useState("¿Qué lugar te tocará?");
  const [isSpinning, setIsSpinning] = useState(false);
  const [ruletaTerminada, setRuletaTerminada] = useState(false);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const consignaSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (slug) {
      setDynamic(getDynamicBySlug(slug));
    }
  }, [slug]);

  // Apagar música global al ingresar a la fase del video
  useEffect(() => {
    if (currentStep === 2) {
      const globalAudios = document.querySelectorAll("audio");
      globalAudios.forEach((audio) => audio.pause());
      
      const musicButtons = document.querySelectorAll(".music-fab, button");
      musicButtons.forEach((btn) => {
        if (btn.textContent?.toLowerCase().includes("mú") || btn.textContent?.toLowerCase().includes("mus")) {
          (btn as HTMLElement).click();
        }
      });
    }
  }, [currentStep]);

  if (!dynamic) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f1e8', fontFamily: 'serif', p: '20px' }}>
        <p style={{ fontSize: '18px', color: '#2f2417' }}>Participante no encontrado.</p>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDynamicPassword(slug, passwordInput)) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Clave incorrecta. Intentá de nuevo.");
    }
  };

  // Manejo del deslizamiento táctil (Slider 1)
  const handleSlider1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 90) {
      setSlider1X(100);
      setCurrentStep(2);
      setTimeout(() => {
        videoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        if (videoRef.current) videoRef.current.play().catch(() => {});
      }, 200);
    } else {
      setSlider1X(val);
    }
  };

  const resetSlider1 = () => { if (!isUnlocked1) setSlider1X(0); };

  // Manejo del deslizamiento táctil (Slider 2)
  const handleSlider2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 90) {
      setSlider2X(100);
      setCurrentStep(3);
      setTimeout(() => {
        consignaSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
      startRuleta();
    } else {
      setSlider2X(val);
    }
  };

  const resetSlider2 = () => { if (!isUnlocked2) setSlider2X(0); };

  // Animación mecánica de la Ruleta de lugares
  const startRuleta = () => {
    setIsSpinning(true);
    let idx = 0;
    let vueltas = 0;
    const interval = setInterval(() => {
      setRuletaTexto(lugaresEvangelio[idx]);
      idx = (idx + 1) % lugaresEvangelio.length;
      vueltas++;

      if (vueltas > 22) {
        clearInterval(interval);
        setRuletaTexto(dynamic.lugarEvangelioAsignado);
        setIsSpinning(false);
        setRuletaTerminada(true);
      }
    }, 75);
  };

  // PANTALLA DE LOG-IN ESTILIZADA PARA MOBILE
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f6f1e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '360px', backgroundColor: '#ffffff', borderRadius: '28px', padding: '32px 24px', boxShadow: '0 12px 40px rgba(47,36,23,0.08)', border: '1px solid rgba(138,107,47,0.1)', textCenter: 'center', textAlign: 'center', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🕊️</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#2f2417', margin: '0 0 8px 0', fontWeight: 'bold' }}>Tu Espacio de Retiro</h1>
          <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#675744', margin: '0 0 24px 0', lineHeight: '1.4' }}>Ingresá tu contraseña para iniciar la experiencia interactiva</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="CONTRASEÑA"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid rgba(92,68,32,0.25)', backgroundColor: '#faf8f5', color: '#2f2417', fontSize: '16px', textAlign: 'center', letterSpacing: '2px', outline: 'none', boxSizing: 'border-box' }}
            />
            {errorMsg && <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#b91c1c', margin: '0', fontWeight: '500' }}>{errorMsg}</p>}
            <button
              type="submit"
              style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', background: 'linear-gradient(180deg, #9d7a34 0%, #7e6128 100%)', color: '#ffffff', fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(126,97,40,0.2)' }}
            >
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fdfbf7', color: '#2f2417', fontFamily: 'Georgia, serif', padding: '0 0 60px 0', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* SECCIÓN 1: BIENVENIDA */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '3px', color: '#8a6b2f', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px', backgroundColor: 'rgba(138,107,47,0.09)', padding: '6px 16px', borderRadius: '999px' }}>
          UN MOMENTO PARA VOS
        </span>
        <h1 style={{ fontSize: '38px', margin: '0 0 24px 0', fontWeight: 'bold', color: '#2f2417', tracking: '-0.02em' }}>{dynamic.nombre}</h1>
        
        <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(138,107,47,0.12)', boxShadow: '0 10px 30px rgba(64,44,17,0.04)', marginBottom: '40px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#3a2e2b', margin: '0', fontStyle: 'italic' }}>
            "{dynamic.mensajeBienvenida}"
          </p>
        </div>

        {currentStep === 1 && (
          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            {/* COMPONENTE INTERACTIVO: SLIDER DESLIZABLE IPHONE STYLE */}
            <div style={{ position: 'relative', width: '100%', height: '56px', backgroundColor: '#e9e2d5', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)' }}>
              <span style={{ fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 'bold', color: '#7a6750', letterSpacing: '1px', pointerEvents: 'none', zIndex: 1, opacity: 1 - slider1X / 80 }}>
                DESLIZÁ PARA CONTINUAR ➔
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={slider1X}
                onChange={handleSlider1Change}
                onTouchEnd={resetSlider1}
                onMouseUp={resetSlider1}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
              />
              <div style={{ position: 'absolute', left: `calc(${slider1X}% * 0.84 + 4px)`, width: '48px', height: '48px', backgroundColor: '#8a6b2f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.2)', transition: slider1X === 0 ? 'left 0.2s ease' : 'none', pointerEvents: 'none' }}>
                <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>✨</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: VIDEO */}
      {currentStep >= 2 && (
        <section ref={videoSectionRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#2f2417' }}>Un regalo directo al corazón...</h2>
          <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#675744', margin: '0 0 24px 0', padding: '0 12px', lineHeight: '1.4' }}>
            Colocate los auriculares, poné el celular en pantalla completa si lo preferís, y dale play al video.
          </p>

          {/* CONTENEDOR DE VIDEO MEJORADO */}
          <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000000', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(47,36,23,0.18)', marginBottom: '24px', border: '3px solid #ffffff' }}>
            <video
              ref={videoRef}
              src={dynamic.driveVideoUrl}
              controls
              playsInline
              onEnded={() => setVideoFinished(true)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {!videoFinished && (
            <button 
              onClick={() => setVideoFinished(true)} 
              style={{ background: 'none', border: 'none', color: '#8a6b2f', fontSize: '11px', fontFamily: 'sans-serif', textDecoration: 'underline', opacity: 0.35, marginBottom: '20px' }}
            >
              [Simular fin del video]
            </button>
          )}

          {/* EL SLIDER DE CONFIGURACIÓN DE ETAPA SOLO APARECE CUANDO TERMINA EL VIDEO */}
          {videoFinished && currentStep === 2 && (
            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
              <div style={{ position: 'relative', width: '100%', height: '56px', backgroundColor: '#d1e7dd', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 'bold', color: '#14532d', letterSpacing: '1px', pointerEvents: 'none', zIndex: 1, opacity: 1 - slider2X / 80 }}>
                  DESLIZÁ PARA TU CONSIGNA ➔
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider2X}
                  onChange={handleSlider2Change}
                  onTouchEnd={resetSlider2}
                  onMouseUp={resetSlider2}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                />
                <div style={{ position: 'absolute', left: `calc(${slider2X}% * 0.84 + 4px)`, width: '48px', height: '48px', backgroundColor: '#198754', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', transition: slider2X === 0 ? 'left 0.2s ease' : 'none', pointerEvents: 'none' }}>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>🧭</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN 3: LA RULETA DEL EVANGELIO Y REVELACIÓN DE LA CONSIGNA */}
      {currentStep === 3 && (
        <section ref={consignaSectionRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* CONTENEDOR RULETA */}
          <div style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: '28px', padding: '28px 20px', border: '2px solid #e9dcc1', boxShadow: '0 15px 35px rgba(64,44,17,0.08)', marginBottom: '24px', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '2px', color: '#675744', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              {isSpinning ? "🔄 RECORRIENDO EL EVANGELIO..." : "📍 TU LUGAR ENCONTRADO"}
            </span>

            <div style={{ fontSize: '28px', fontWeight: 'bold', color: isSpinning ? '#8a6b2f' : '#20663a', margin: '20px 0', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isSpinning ? `✨ ${ruletaTexto} ✨` : `⛪ ${ruletaTexto}`}
            </div>

            {isSpinning && (
              <div style={{ width: '100%', height: '4px', backgroundColor: '#f1ebd9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', backgroundColor: '#8a6b2f', borderRadius: '999px', animation: 'pulse 1s infinite' }}></div>
              </div>
            )}
          </div>

          {/* CONSIGNA TEXTUAL FINAL */}
          {ruletaTerminada && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.6s ease-out' }}>
              <div style={{ display: 'inline-block', margin: '0 auto', padding: '6px 18px', backgroundColor: 'rgba(32,102,58,0.1)', color: '#20663a', borderRadius: '999px', fontSize: '12px', fontFamily: 'sans-serif', fontWeight: 'bold', uppercase: 'true', letterSpacing: '0.5px' }}>
                {dynamic.esIndividual ? "🙌 TRABAJO PERSONAL / INDIVIDUAL" : "👥 DINÁMICA ACOMPAÑADA"}
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(138,107,47,0.12)', boxShadow: '0 10px 30px rgba(64,44,17,0.04)', textAlign: 'left' }}>
                <h3 style={{ fontSize: '12px', fontFamily: 'sans-serif', letterSpacing: '1px', color: '#675744', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                  ¿Qué tenés que hacer ahora?
                </h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#2f2417', margin: '0', whiteSpace: 'pre-line' }}>
                  {dynamic.actividadEspecifica}
                </p>
              </div>

              <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#675744', marginTop: '16px', lineHeight: '1.5' }}>
                "Caminante, no hay camino, se hace camino al andar." <br /> ¡Que tengas un bendecido momento! 🕊️
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}