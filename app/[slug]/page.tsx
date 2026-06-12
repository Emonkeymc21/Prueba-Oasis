"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getDynamicBySlug, validateDynamicPassword, DynamicConfig, lugaresEvangelio } from "@/lib/invitations";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function RetiroDynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [dynamic, setDynamic] = useState<DynamicConfig | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [videoFinished, setVideoFinished] = useState(false);

  const [slider1X, setSlider1X] = useState(0);
  const [slider2X, setSlider2X] = useState(0);

  const [ruletaTexto, setRuletaTexto] = useState("¿Qué lugar te tocará?");
  const [isSpinning, setIsSpinning] = useState(false);
  const [ruletaTerminada, setRuletaTerminada] = useState(false);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const consignaSectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (slug) {
      setDynamic(getDynamicBySlug(slug));
    }
  }, [slug]);

  useEffect(() => {
    if (currentStep === 2 && dynamic && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else if (currentStep === 2 && dynamic && window.YT) {
      initPlayer();
    }

    if (currentStep === 2) {
      const globalAudios = document.querySelectorAll("audio");
      globalAudios.forEach((audio) => audio.pause());
    }
  }, [currentStep, dynamic]);

  const initPlayer = () => {
    if (!dynamic || playerRef.current || !window.YT) return;
    
    playerRef.current = new window.YT.Player("player-iframe", {
      events: {
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            setVideoFinished(true);
          }
        },
      },
    });
  };

  if (!dynamic) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f1e8', fontFamily: 'serif', padding: '20px' }}>
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

  const handleSlider1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 90) {
      setSlider1X(100);
      setCurrentStep(2);
      setTimeout(() => {
        videoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    } else {
      setSlider1X(val);
    }
  };

  const handleSlider2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 90) {
      setSlider2X(100);
      setCurrentStep(3);
      setTimeout(() => {
        consignaSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
      startRuleta();
    } else {
      setSlider2X(val);
    }
  };

  const startRuleta = () => {
    setIsSpinning(true);
    let idx = 0;
    let ticks = 0;
    const interval = setInterval(() => {
      setRuletaTexto(lugaresEvangelio[idx]);
      idx = (idx + 1) % lugaresEvangelio.length;
      ticks++;

      if (ticks > 24) {
        clearInterval(interval);
        setRuletaTexto(dynamic.lugarEvangelioAsignado);
        setIsSpinning(false);
        setRuletaTerminada(true);
      }
    }, 80);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fdfbf7', color: '#2f2417', fontFamily: 'Georgia, serif', padding: '0 0 60px 0', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes customPulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        .shimmer-text {
          background: linear-gradient(to right, #7a6750 20%, #2f2417 50%, #7a6750 80%);
          background-size: 200px 100%;
          animation: shimmer 2.5s infinite linear;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .shimmer-green-text {
          background: linear-gradient(to right, #14532d 20%, #20663a 50%, #14532d 80%);
          background-size: 200px 100%;
          animation: shimmer 2.5s infinite linear;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .pulse-card {
          animation: customPulse 2s infinite ease-in-out;
        }
      `}} />

      {/* LOGIN */}
      {!isAuthenticated ? (
        <div style={{ minHeight: '100vh', backgroundColor: '#f6f1e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: '350px', backgroundColor: '#ffffff', borderRadius: '32px', padding: '36px 24px', boxShadow: '0 15px 35px rgba(47,36,23,0.06)', border: '1px solid rgba(138,107,47,0.1)', textAlign: 'center', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <img src="/image_ff6643.png" alt="Logo Oasis" style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
            </div>

            <h1 style={{ fontSize: '24px', color: '#2f2417', margin: '0 0 6px 0', fontWeight: 'bold' }}>Oasis 138</h1>
            <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#675744', margin: '0 0 28px 0', lineHeight: '1.4' }}>Ingresá tu clave personal para entrar en tu espacio</p>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="CONTRASEÑA"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ width: '100%', padding: '15px', borderRadius: '18px', border: '1px solid rgba(92,68,32,0.2)', backgroundColor: '#faf8f5', color: '#2f2417', fontSize: '16px', textAlign: 'center', letterSpacing: '3px', outline: 'none', boxSizing: 'border-box', fontWeight: 'bold' }}
              />
              {errorMsg && <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#b91c1c', margin: '0', fontWeight: '500' }}>{errorMsg}</p>}
              <button
                type="submit"
                style={{ width: '100%', padding: '15px', borderRadius: '18px', border: 'none', background: 'linear-gradient(180deg, #9d7a34 0%, #7e6128 100%)', color: '#ffffff', fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(126,97,40,0.25)' }}
              >
                INGRESAR
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* FASE 1: BIENVENIDA CON LA NUEVA INTRODUCCIÓN INTEGRADA EN LA TARJETA */}
          <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <img src="/image_ff6643.png" alt="Logo Oasis" style={{ height: '110px', width: 'auto', objectFit: 'contain' }} />
            </div>

            <span style={{ fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '4px', color: '#8a6b2f', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px', backgroundColor: 'rgba(138,107,47,0.08)', padding: '6px 16px', borderRadius: '999px' }}>
              Asistente
            </span>
            <h1 style={{ fontSize: '40px', margin: '0 0 20px 0', fontWeight: 'bold', color: '#2f2417', letterSpacing: '-0.02em' }}>{dynamic.nombre}</h1>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '28px 24px', border: '1px solid rgba(138,107,47,0.12)', boxShadow: '0 10px 30px rgba(64,44,17,0.04)', marginBottom: '44px', boxSizing: 'border-box', textAlign: 'left' }}>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3a2e2b', margin: '0', fontStyle: 'italic', whiteSpace: 'pre-line' }}>
                {dynamic.mensajeBienvenida}
              </p>
            </div>

            {currentStep === 1 && (
              <div style={{ width: '100%', maxWidth: '290px', position: 'relative', height: '58px', backgroundColor: '#eae3d5', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.08)' }}>
                <span className="shimmer-text" style={{ fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', pointerEvents: 'none', zIndex: 1, opacity: 1 - slider1X / 80 }}>
                  DESLIZÁ PARA SABER ➔
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider1X}
                  onChange={handleSlider1Change}
                  onTouchEnd={() => { if (slider1X < 90) setSlider1X(0); }}
                  onMouseUp={() => { if (slider1X < 90) setSlider1X(0); }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                />
                <div style={{ position: 'absolute', left: `calc(${slider1X}% * 0.82 + 5px)`, width: '48px', height: '48px', backgroundColor: '#8a6b2f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.18)', transition: slider1X === 0 ? 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none', pointerEvents: 'none' }}>
                  <span style={{ color: '#fff', fontSize: '16px' }}>✨</span>
                </div>
              </div>
            )}
          </section>

          {/* FASE 2: EL VIDEO COMPACTO DIRECTO */}
          {currentStep >= 2 && (
            <section ref={videoSectionRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '26px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#2f2417', letterSpacing: '-0.01em' }}>Un regalo para tu corazón...</h2>
              <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#675744', margin: '0 0 28px 0', lineHeight: '1.4' }}>
                Ponete los auriculares y disfrutá de este mensaje. El próximo paso aparecerá de forma automática cuando el video finalice.
              </p>

              <div style={{ width: '100%', maxWidth: '300px', aspectRatio: '9/16', backgroundColor: '#000000', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(47,36,23,0.18)', marginBottom: '32px', border: '4px solid #ffffff', boxSizing: 'border-box', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scale(1.28)', transformOrigin: 'center center' }}>
                  <iframe
                    id="player-iframe"
                    src={`https://www.youtube.com/embed/${dynamic.youtubeId}?enablejsapi=1&rel=0&modestbranding=1&controls=0&showinfo=0&iv_load_policy=3&autoplay=1`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>

              {!videoFinished && (
                <button 
                  onClick={() => setVideoFinished(true)} 
                  style={{ background: 'none', border: 'none', color: '#8a6b2f', fontSize: '11px', fontFamily: 'sans-serif', textDecoration: 'underline', opacity: 0.3, marginBottom: '20px' }}
                >
                  [Demo: Simular que el video terminó]
                </button>
              )}

              {videoFinished && currentStep === 2 && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                  <p style={{ fontFamily: 'sans-serif', fontSize: '14px', color: '#14532d', fontWeight: 'bold', marginBottom: '14px' }}>
                    ¡Es momento de que veas la dinámica que te va a tocar!
                  </p>
                  
                  <div style={{ width: '100%', maxWidth: '290px', position: 'relative', height: '58px', backgroundColor: '#d1e7dd', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)' }}>
                    <span className="shimmer-green-text" style={{ fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 'bold', color: '#14532d', letterSpacing: '1px', pointerEvents: 'none', zIndex: 1, opacity: 1 - slider2X / 80 }}>
                      DESLIZÁ PARA SABER ➔
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={slider2X}
                      onChange={handleSlider2Change}
                      onTouchEnd={() => { if (slider2X < 90) setSlider2X(0); }}
                      onMouseUp={() => { if (slider2X < 90) setSlider2X(0); }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                    />
                    <div style={{ position: 'absolute', left: `calc(${slider2X}% * 0.82 + 5px)`, width: '48px', height: '48px', backgroundColor: '#198754', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', transition: slider2X === 0 ? 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none', pointerEvents: 'none' }}>
                      <span style={{ color: '#fff', fontSize: '16px' }}>🧭</span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* FASE 3: LA RULETA Y CONSIGNA */}
          {currentStep === 3 && (
            <section ref={consignaSectionRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
              
              <div className={isSpinning ? "pulse-card" : ""} style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: '32px', padding: '32px 20px', border: '2px solid #e9dcc1', boxShadow: '0 15px 40px rgba(64,44,17,0.06)', marginBottom: '28px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '2px', color: '#675744', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  {isSpinning ? "🔄 RECORRIENDO LOS EVANGELIOS..." : "📍 DINÁMICA ENCONTRADA"}
                </span>

                <div style={{ fontSize: '30px', fontWeight: 'bold', color: isSpinning ? '#8a6b2f' : '#20663a', margin: '24px 0', minHeight: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.01em' }}>
                  {isSpinning ? `✨ ${ruletaTexto} ✨` : `⛪ ${ruletaTexto}`}
                </div>
              </div>

              {ruletaTerminada && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <div>
                    <span style={{ display: 'inline-block', padding: '6px 18px', backgroundColor: 'rgba(32,102,58,0.08)', color: '#20663a', borderRadius: '999px', fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {dynamic.esIndividual ? "🙌 Vas a estar a cargo vos de la dinámica" : "👥 EN PAREJA"}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '28px 24px', border: '1px solid rgba(138,107,47,0.1)', boxShadow: '0 10px 30px rgba(64,44,17,0.03)', textAlign: 'left', boxSizing: 'border-box' }}>
                    <h3 style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '1px', color: '#675744', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 14px 0' }}>
                      ¿Cuál es tu consigna?
                    </h3>
                    <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#2f2417', margin: '0', whiteSpace: 'pre-line' }}>
                      {dynamic.actividadEspecifica}
                    </p>
                  </div>

                  <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#675744', marginTop: '16px', lineHeight: '1.5' }}>
                    Que tengas un hermoso y bendecido Oasis. 🕊️
                  </p>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}