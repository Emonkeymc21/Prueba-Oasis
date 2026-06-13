"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getDynamicBySlug, validateDynamicPassword, DynamicConfig } from "@/lib/invitations";

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

  // Flujo de 5 pantallas consecutivas y limpias
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [videoFinished, setVideoFinished] = useState(false);

  const [slider1X, setSlider1X] = useState(0);
  const [slider2X, setSlider2X] = useState(0);
  const [slider3X, setSlider3X] = useState(0);

  const screen2Ref = useRef<HTMLDivElement>(null);
  const screen3Ref = useRef<HTMLDivElement>(null);
  const screen4Ref = useRef<HTMLDivElement>(null);
  const screen5Ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (slug) {
      setDynamic(getDynamicBySlug(slug));
    }
  }, [slug]);

  // Conexión con la API de YouTube para detectar el final de forma real e infalible
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
        screen2Ref.current?.scrollIntoView({ behavior: "smooth" });
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
        screen3Ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    } else {
      setSlider2X(val);
    }
  };

  const handleSlider3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 90) {
      setSlider3X(100);
      setCurrentStep(4);
      setTimeout(() => {
        screen4Ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    } else {
      setSlider3X(val);
    }
  };

  const handleBtnDescubrir = () => {
    setCurrentStep(5);
    setTimeout(() => {
      screen5Ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
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
                type="password"
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
          {/* 🌿 PANTALLA 1 – BIENVENIDA */}
          <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <img src="/image_ff6643.png" alt="Logo Oasis" style={{ height: '110px', width: 'auto', objectFit: 'contain' }} />
            </div>

            <span style={{ fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '4px', color: '#8a6b2f', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '14px', backgroundColor: 'rgba(138,107,47,0.08)', padding: '6px 16px', borderRadius: '999px' }}>
              Asistente
            </span>
            <h1 style={{ fontSize: '40px', margin: '0 0 24px 0', fontWeight: 'bold', color: '#2f2417', letterSpacing: '-0.02em' }}>{dynamic.nombre}</h1>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '28px 24px', border: '1px solid rgba(138,107,47,0.12)', boxShadow: '0 10px 30px rgba(64,44,17,0.04)', marginBottom: '32px', boxSizing: 'border-box', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#3a2e2b', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontWeight: 'bold', color: '#8a6b2f', fontSize: '18px', textAlign: 'center', margin: '0' }}>Ya falta muy poco.</p>
                <p>Durante este tiempo te preparaste, rezaste, compartiste, te animaste a decir que sí y a confiar una vez más en Jesús.</p>
                <p>Quizás hoy tengas expectativas, emociones, nervios o incluso algunas dudas. Y está bien.</p>
                <p style={{ fontWeight: 'bold', color: '#2f2417', textAlign: 'center' }}>Porque Dios no llama personas perfectas. Llama corazones dispuestos.</p>
                <p>Y si llegaste hasta acá, es porque Él sigue confiando en vos.</p>
                <p>Antes de descubrir la misión que te espera en este Oasis, queremos regalarte algo muy especial.</p>
                <p>Hay alguien que conoce muy bien ese lugar que hoy estás ocupando. Alguien que caminó con vos, te acompañó y vio crecer la obra de Dios en tu vida.</p>
                <p style={{ fontWeight: 'bold', textAlign: 'center', color: '#8a6b2f' }}>Tomate unos minutos para recibir este regalo. ❤️</p>
              </div>
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

          {/* 🎥 PANTALLA 2 – VIDEO */}
          {currentStep >= 2 && (
            <section ref={screen2Ref} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '26px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#2f2417', letterSpacing: '-0.01em' }}>Un regalo para tu corazón...</h2>
              <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#675744', margin: '0 0 28px 0', lineHeight: '1.4' }}>
                Ponete los auriculares y disfrutá de este mensaje especial. El próximo paso aparecerá automáticamente cuando el video finalice.
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

              {videoFinished && currentStep === 2 && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s ease-out' }}>
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

          {/* 🌿 PANTALLA 3 – MENSAJE DE CONFIANZA */}
          {currentStep >= 3 && (
            <section ref={screen3Ref} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '32px 24px', border: '1px solid rgba(138,107,47,0.1)', boxShadow: '0 10px 30px rgba(64,44,17,0.03)', textAlign: 'left', marginBottom: '32px', boxSizing: 'border-box' }}>
                <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#2f2417', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p>Quizás al llegar hasta acá te preguntaste si vas a estar a la altura.</p>
                  <p>Quizás te preguntaste si vas a saber qué decir, qué hacer o cómo acompañar.</p>
                  <p style={{ fontWeight: 'bold', color: '#8a6b2f' }}>But Jesús nunca eligió personas porque lo supieran todo.</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>Las eligió porque confiaba en ellas.</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', color: '#8a6b2f' }}>Y hoy también confía en vos.</p>
                  <p>La misión que vas a recibir no es una prueba que tengas que aprobar. Es una oportunidad para amar, escuchar, acompañar y dejar que Dios actúe a través tuyo.</p>
                  <p>Algunas veces caminarás acompañado. Otras veces te tocará sostener algo por tu cuenta.</p>
                  <p style={{ fontWeight: 'bold', textAlign: 'center', color: '#2f2417' }}>Pero nunca estarás solo.</p>
                  <p>Porque detrás tuyo está este equipo para sostenerte, estos compañeros para caminar con vos y Jesús, que irá delante tuyo preparando el camino.</p>
                  <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '16px', margin: '4px 0' }}>Respirá profundo.<br/>Confiá.</p>
                  <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#8a6b2f' }}>Y recordá que Dios hace nuevas y perfectas todas las cosas.</p>
                  <p style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#faf6ee', padding: '12px', borderRadius: '16px', margin: '4px 0' }}>Confiamos en vos porque hemos visto lo que Él ya viene haciendo en tu corazón. 💛</p>
                </div>
              </div>

              {currentStep === 3 && (
                <div style={{ width: '100%', maxWidth: '290px', position: 'relative', height: '58px', backgroundColor: '#eae3d5', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.08)' }}>
                  <span className="shimmer-text" style={{ fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', pointerEvents: 'none', zIndex: 1, opacity: 1 - slider3X / 80 }}>
                    DESLIZÁ PARA SABER ➔
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={slider3X}
                    onChange={handleSlider3Change}
                    onTouchEnd={() => { if (slider3X < 90) setSlider3X(0); }}
                    onMouseUp={() => { if (slider3X < 90) setSlider3X(0); }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <div style={{ position: 'absolute', left: `calc(${slider3X}% * 0.82 + 5px)`, width: '48px', height: '48px', backgroundColor: '#8a6b2f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.18)', transition: slider3X === 0 ? 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none', pointerEvents: 'none' }}>
                    <span style={{ color: '#fff', fontSize: '16px' }}>✨</span>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 🌿 PANTALLA 4 – TRANSICIÓN */}
          {currentStep >= 4 && (
            <section ref={screen4Ref} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '32px 24px', border: '1px solid rgba(138,107,47,0.1)', boxShadow: '0 10px 30px rgba(64,44,17,0.03)', textAlign: 'center', marginBottom: '36px', boxSizing: 'border-box' }}>
                <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#3a2e2b', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p>Hay corazones que Dios quiere alcanzar en este Oasis.</p>
                  <p>Corazones con historias, preguntas, alegrías, heridas y sueños.</p>
                  <p style={{ fontWeight: 'bold', color: '#2f2417' }}>Y de alguna manera, quiso contar con vos para acompañarlos en ese camino.</p>
                  <p>Lo que vas a descubrir a continuación es una pequeña parte de la misión que fue rezada, pensada y confiada para vos.</p>
                  <p style={{ fontStyle: 'italic', margin: '4px 0' }}>Respirá profundo.<br/>Confiá.</p>
                  <p style={{ fontWeight: 'bold', color: '#8a6b2f', fontSize: '16px' }}>Y descubrí dónde Dios te invita a servir en este Oasis. 💛</p>
                </div>
              </div>

              {currentStep === 4 && (
                <button
                  onClick={handleBtnDescubrir}
                  style={{ width: '100%', maxWidth: '290px', padding: '16px', borderRadius: '999px', border: 'none', background: 'linear-gradient(180deg, #9d7a34 0%, #7e6128 100%)', color: '#ffffff', fontSize: '13px', fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(126,97,40,0.3)' }}
                >
                  DESCUBRIR MI MISIÓN
                </button>
              )}
            </section>
          )}

          {/* 🌿 PANTALLA 5 – REVELACIÓN COMPAÑEROS / SOLO */}
          {currentStep === 5 && (
            <section ref={screen5Ref} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box', maxWidth: '440px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.6s ease-out' }}>
              
              {!dynamic.esIndividual && dynamic.companero ? (
                /* 🌿 PANTALLA 5A – SI TIENE COEQUIPER */
                <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '28px 24px', border: '1px solid rgba(138,107,47,0.1)', boxShadow: '0 10px 30px rgba(64,44,17,0.03)', textAlign: 'center', boxSizing: 'border-box', width: '100%' }}>
                  <p style={{ fontSize: '15px', color: '#675744', margin: '0 0 10px 0' }}>Tu coequiper en esta misión será:</p>
                  <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#b91c1c', margin: '0 0 20px 0' }}>❤️ {dynamic.companero}</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#3a2e2b', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                    <p>Que juntos puedan escuchar, acompañar, sostener y dejarse sorprender por todo lo que Dios tiene preparado para este Oasis.</p>
                    <p style={{ fontWeight: 'bold', textAlign: 'center', color: '#8a6b2f' }}>Confiamos en ustedes.</p>
                    <p>Que puedan apoyarse mutuamente, complementarse y recordar siempre que Jesús será el verdadero protagonista de cada encuentro.</p>
                    <p style={{ fontWeight: 'bold', textAlign: 'center', color: '#20663a', fontSize: '15px', marginTop: '4px' }}>¡Que disfruten esta hermosa misión! ✨</p>
                  </div>
                </div>
              ) : (
                /* 🌿 PANTALLA 5B – SI ACOMPAÑA SOLO */
                <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '28px 24px', border: '1px solid rgba(138,107,47,0.1)', boxShadow: '0 10px 30px rgba(64,44,17,0.03)', textAlign: 'left', boxSizing: 'border-box', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <span style={{ display: 'inline-block', padding: '6px 18px', backgroundColor: 'rgba(138,107,47,0.08)', color: '#8a6b2f', borderRadius: '999px', fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                      🙌 Vas a estar a cargo vos de la dinámica
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#3a2e2b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#2f2417', textAlign: 'center' }}>Esta vez te tocará acompañar solo.</p>
                    <p>Y quizás al leer esto aparezcan algunas dudas o algunos miedos.</p>
                    <p style={{ fontStyle: 'italic', color: '#675744', textAlign: 'center' }}>Pero queremos que recuerdes algo:</p>
                    <p style={{ fontWeight: 'bold', color: '#b91c1c', fontSize: '18px', textAlign: 'center', margin: '4px 0' }}>No vas solo.</p>
                    <p>Jesús te acompañará en cada paso y este equipo caminará con vos durante todo el retiro.</p>
                    <p>Confiamos en vos porque hemos visto todo lo que Dios viene haciendo en tu corazón.</p>
                    <p>No tenés que tener todas las respuestas. No tenés que transformar la vida de nadie.</p>
                    <p style={{ fontWeight: 'bold', color: '#8a6b2f', textAlign: 'center', fontSize: '15px' }}>Esa tarea es de Dios.</p>
                    <p>Vos solamente dejate usar como instrumento suyo.</p>
                    <p style={{ fontWeight: 'bold', textAlign: 'center', letterSpacing: '1px', color: '#20663a', margin: '6px 0' }}>ESCUCHÁ. ACOMPAÑÁ. AMÁ. Y CONFIÁ.</p>
                    <p style={{ fontStyle: 'italic', textAlign: 'center', color: '#8a6b2f', fontWeight: 'bold' }}>Porque mientras vos pongas tu corazón, Jesús se encargará del resto. ❤️</p>
                  </div>
                </div>
              )}

              <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#675744', marginTop: '32px' }}>
                Que tengas un hermoso y bendecido Oasis. 🕊️
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}