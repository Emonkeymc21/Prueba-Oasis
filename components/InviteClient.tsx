'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatLocalDate } from '@/lib/time';

type ApiResponse = {
  invitation: {
    slug: string;
    nombre: string;
    title: string;
    verse: string;
    verseRef: string;
    unlockAtArgentina: string;
    unlockAtArgentinaFormatted: string;
    meetUrl: string;
  };
  content: {
    intro: string[];
    objetivos: string[];
    actividades: string[];
    bloques: Array<{
      titulo: string;
      lema?: string;
      intro?: string;
      preguntas?: string[];
      nota?: string;
      oracion?: string[];
    }>;
    cierre: string[];
  };
};

type PublicInvitation = {
  nombre: string;
  unlockAtArgentina: string;
  unlockAtArgentinaFormatted: string;
};

function getCountdownParts(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, unlocked: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, unlocked: false };
}

export default function InviteClient({
  slug,
  publicInvitation
}: {
  slug: string;
  publicInvitation: PublicInvitation;
}) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState<ApiResponse | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const initialUnlockStatus = useMemo(() => {
    const unlockDate = new Date(publicInvitation.unlockAtArgentina);
    return {
      unlocked: now >= unlockDate.getTime(),
      localFormatted: formatLocalDate(publicInvitation.unlockAtArgentina),
      countdown: getCountdownParts(publicInvitation.unlockAtArgentina)
    };
  }, [now, publicInvitation]);

  const unlockStatus = useMemo(() => {
    const source = payload?.invitation ?? publicInvitation;
    const unlockDate = new Date(source.unlockAtArgentina);

    return {
      unlocked: now >= unlockDate.getTime(),
      localFormatted: formatLocalDate(source.unlockAtArgentina)
    };
  }, [now, payload, publicInvitation]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/invite/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = (await response.json()) as ApiResponse | { message?: string };

      if (!response.ok) {
        setPayload(null);
        if ('message' in data) {
          setError(data.message ?? 'No se pudo validar el acceso.');
        } else {
          setError('No se pudo validar el acceso.');
        }
        return;
      }

      setPayload(data as ApiResponse);
    } catch {
      setError('Ocurrió un error al validar el acceso.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPdf() {
    if (!payload || !unlockStatus.unlocked) return;

    setDownloadLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/pdf/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? 'No se pudo generar el PDF personalizado.');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `invitacion-${slug}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Ocurrió un error al descargar el PDF.');
    } finally {
      setDownloadLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card teaser-card">
        <p className="eyebrow">Cuenta regresiva</p>
        <h1>{publicInvitation.nombre.split(' ')[0]}, algo se viene pronto</h1>
        <p className="hero-copy teaser-copy">Dejate sorprender.</p>

        <div className="countdown-grid" aria-label="Cuenta regresiva al desbloqueo">
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.days).padStart(2, '0')}</span>
            <small>Días</small>
          </div>
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.hours).padStart(2, '0')}</span>
            <small>Horas</small>
          </div>
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.minutes).padStart(2, '0')}</span>
            <small>Minutos</small>
          </div>
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.seconds).padStart(2, '0')}</span>
            <small>Segundos</small>
          </div>
        </div>

        <div className="blur-actions">
          <button
            type="button"
            className={`action-button ${!initialUnlockStatus.unlocked ? 'blurred-preview' : ''}`}
            disabled={!initialUnlockStatus.unlocked}
            onClick={() => setShowAuth(true)}
          >
            Invitación
          </button>

          {initialUnlockStatus.unlocked ? (
            <a
              className="action-button secondary"
              href={payload?.invitation.meetUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
            >
              Unite para saber más
            </a>
          ) : (
            <button type="button" className="action-button secondary blurred-preview" disabled>
              Unite para saber más
            </button>
          )}
        </div>

        <div className={`status-pill ${initialUnlockStatus.unlocked ? 'open' : 'closed'}`}>
          {initialUnlockStatus.unlocked ? 'Ya se encuentra disponible' : 'Se habilita al finalizar la cuenta regresiva'}
        </div>

        <div className="quote-stack">
          <p className="featured-quote">“Dios no llama a los preparados, prepara a los llamados”</p>
        </div>
      </section>

      {showAuth && !payload ? (
        <section className="hero-card">
          <p className="eyebrow">Accede a este llamado</p>
          <h2>"En todo amar y servir" - San Ignacio de Loyola.</h2>
          <p className="hero-copy">Coloca la contraseña que te dimos.</p>


          <form className="access-form" onSubmit={handleSubmit}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresá tu contraseña"
              autoComplete="off"
            />
            <button type="submit" disabled={loading || password.trim().length === 0}>
              {loading ? 'Validando...' : 'Ingresar'}
            </button>
          </form>

          {error ? <p className="error-box">{error}</p> : null}
        </section>
      ) : null}

      {payload ? (
        <section className="invitation-layout">
          <article className="invitation-card">
            <div className="invitation-header">
              <p className="eyebrow">Discernimiento 2026</p>
              <h2>{payload.invitation.title}</h2>
              <blockquote>{payload.invitation.verse}</blockquote>
              <p className="verse-ref">{payload.invitation.verseRef}</p>
            </div>

            <div className="welcome-box">
              <p className="welcome-label">Querido/a</p>
              <p className="welcome-name">{payload.invitation.nombre}</p>
            </div>

            {payload.content.intro.map((paragraph) => (
              <p key={paragraph} className="body-copy">
                {paragraph}
              </p>
            ))}

            <section className="content-section">
              <h3>Objetivos</h3>
              <ul>
                {payload.content.objetivos.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="content-section">
              <h3>Actividades propias del Área de Comunidad</h3>
              <ul>
                {payload.content.actividades.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {payload.content.bloques.map((bloque) => (
              <section key={bloque.titulo} className="content-block">
                <h3>{bloque.titulo}</h3>
                {bloque.lema ? <p className="block-quote">{bloque.lema}</p> : null}
                {bloque.intro ? <p className="body-copy">{bloque.intro}</p> : null}
                {bloque.preguntas?.length ? (
                  <ul>
                    {bloque.preguntas.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {bloque.nota ? <p className="note-box">{bloque.nota}</p> : null}
                {bloque.oracion?.length ? (
                  <div className="prayer-box">
                    {bloque.oracion.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}

            <section className="content-section final-prayer">
              {payload.content.cierre.map((line, index) => (
                <p key={`${line}-${index}`} className={index === 0 ? 'closing-title' : 'body-copy'}>
                  {line}
                </p>
              ))}
            </section>
          </article>

          <aside className="side-panel">
            <div className="side-card sticky-card">
              <p className="featured-quote">
                “Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti”
              </p>
              <p className="featured-quote secondary-quote">
                “Toda vocación es un don de Dios. Es Él el que llama, quien vocaciona.”
              </p>
            </div>

            <div className="side-card actions-card">

              <button
                type="button"
                className="action-button"
                disabled={!unlockStatus.unlocked || downloadLoading}
                onClick={handleDownloadPdf}
              >
                {downloadLoading ? 'Preparando PDF...' : 'Invitación'}
              </button>

              {unlockStatus.unlocked ? (
                <a className="action-button secondary" href={payload.invitation.meetUrl} target="_blank" rel="noreferrer">
                  Videollamada
                </a>
              ) : (
                <button type="button" className="action-button secondary" disabled>
                  Videollamada
                </button>
              )}
            </div>
          </aside>
        </section>
      ) : null}
    </main>
  );
}
