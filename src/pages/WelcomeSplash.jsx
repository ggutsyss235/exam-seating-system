import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Shield, Cpu, ArrowRight } from 'lucide-react';
import HeroCanvas3D from '../components/HeroCanvas3D';

// Shared mouse ref — read by HeroCanvas3D via prop each frame
export const sharedMouse = { x: 0, y: 0 };

const WelcomeSplash = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    // DOM refs for direct style manipulation (no re-renders)
    const cardRef = useRef(null);
    const sheenRef = useRef(null);
    const layer1Ref = useRef(null);
    const layer2Ref = useRef(null);
    const layer3Ref = useRef(null);
    const vignRef = useRef(null);
    const rafRef = useRef(null);

    // Raw + smoothed mouse targets — never touches React state
    const raw = useRef({ x: 0, y: 0 });
    const smooth = useRef({ x: 0, y: 0 });
    // Separate ref for passing to Three.js (updated each frame)
    const mouseForCanvas = useRef({ x: 0, y: 0 });
    const [canvasMouse, setCanvasMouse] = useState({ x: 0, y: 0 });
    const canvasUpdateTimer = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Animation loop — runs independently of React
    useEffect(() => {
        const tick = () => {
            // Lerp smooth toward raw
            smooth.current.x += (raw.current.x - smooth.current.x) * 0.07;
            smooth.current.y += (raw.current.y - smooth.current.y) * 0.07;

            const sx = smooth.current.x;
            const sy = smooth.current.y;

            // Card 3D tilt
            if (cardRef.current) {
                cardRef.current.style.transform = `
                    perspective(1000px)
                    rotateX(${-sy * 10}deg)
                    rotateY(${sx * 10}deg)
                `;
            }

            // Moving sheen inside card
            if (sheenRef.current) {
                const spotX = 50 + sx * 30;
                const spotY = 50 + sy * 30;
                sheenRef.current.style.background = `radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.055) 0%, transparent 60%)`;
            }

            // Vignette spotlight
            if (vignRef.current) {
                const spotX = 50 + sx * 25;
                const spotY = 50 + sy * 25;
                vignRef.current.style.background = `
                    radial-gradient(circle at ${spotX}% ${spotY}%, rgba(139,92,246,0.14) 0%, transparent 50%),
                    radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, rgba(5,5,10,0.6) 75%, rgba(5,5,10,0.92) 100%)
                `;
            }

            // Parallax layers (different speeds = depth illusion)
            if (layer1Ref.current)
                layer1Ref.current.style.transform = `translate(${-sx * 18}px, ${-sy * 12}px)`;
            if (layer2Ref.current)
                layer2Ref.current.style.transform = `translate(${-sx * 10}px, ${-sy * 7}px)`;
            if (layer3Ref.current)
                layer3Ref.current.style.transform = `translate(${-sx * 5}px, ${-sy * 3}px)`;

            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // Update canvas mouse at low frequency (30fps) to avoid Three.js flooding
    useEffect(() => {
        const interval = setInterval(() => {
            setCanvasMouse({ x: smooth.current.x, y: smooth.current.y });
        }, 33);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = useCallback((e) => {
        raw.current.x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        raw.current.y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    }, []);

    const handleMouseLeave = useCallback(() => {
        raw.current = { x: 0, y: 0 };
    }, []);

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#05050a',
                fontFamily: "'Outfit', 'Inter', sans-serif",
            }}
        >
            {/* Three.js scene — updated at 30fps, no excessive re-renders */}
            <Suspense fallback={null}>
                <HeroCanvas3D mouse={canvasMouse} />
            </Suspense>

            {/* Vignette + moving spot */}
            <div ref={vignRef} style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, rgba(5,5,10,0.6) 75%, rgba(5,5,10,0.92) 100%)',
            }} />

            {/* ── Hero Content ─────────────────────────────────── */}
            <div
                ref={cardRef}
                style={{
                    position: 'relative', zIndex: 10,
                    textAlign: 'center',
                    maxWidth: '820px', width: '90%',
                    padding: '3.5rem 3rem',
                    opacity: mounted ? 1 : 0,
                    transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)',
                    transformStyle: 'preserve-3d',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '28px',
                }}
            >
                {/* Moving sheen */}
                <div ref={sheenRef} style={{
                    position: 'absolute', inset: 0, borderRadius: '28px', pointerEvents: 'none',
                }} />

                {/* Layer 1 — badge (shifts fastest) */}
                <div ref={layer1Ref} style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.45rem 1.2rem', borderRadius: '999px',
                        background: 'rgba(139,92,246,0.15)',
                        border: '1px solid rgba(139,92,246,0.35)',
                        backdropFilter: 'blur(12px)',
                    }}>
                        <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: '#a855f7', display: 'inline-block',
                            boxShadow: '0 0 10px #a855f7',
                            animation: 'dot-pulse 2s ease-in-out infinite',
                        }} />
                        <span style={{
                            color: '#c4b5fd', fontSize: '0.72rem', fontWeight: '800',
                            letterSpacing: '3px', textTransform: 'uppercase',
                        }}>
                            Seating Intelligence Engine v2.0
                        </span>
                    </div>
                </div>

                {/* Layer 2 — title */}
                <div ref={layer2Ref}>
                    <h1 style={{
                        margin: '0 0 1rem',
                        fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                        fontWeight: '950',
                        lineHeight: '1',
                        letterSpacing: '-4px',
                        textTransform: 'uppercase',
                    }}>
                        <span className="hero-shimmer" style={{
                            background: 'linear-gradient(105deg, #94a3b8 0%, #fff 18%, #c4b5fd 38%, #8b5cf6 52%, #fff 66%, #a5b4fc 80%, #94a3b8 100%)',
                            backgroundSize: '300% 100%',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'holographic-sweep 3.5s linear infinite',
                            display: 'inline',
                            filter: 'drop-shadow(0 0 35px rgba(139,92,246,0.5))',
                        }}>SeatPro</span><span style={{
                            display: 'inline',
                            color: '#38bdf8',
                            WebkitTextFillColor: '#38bdf8',
                            animation: 'neon-x-pulse 2.5s ease-in-out infinite',
                        }}>X</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.75)',
                        margin: '0 0 0.75rem',
                    }}>
                        Advanced <span className="matrix-word" style={{ color: '#a5b4fc', fontWeight: '800' }}>Matrix</span> Engine.
                    </p>
                </div>

                {/* Layer 3 — description + buttons (slowest) */}
                <div ref={layer3Ref}>
                    <p style={{
                        fontSize: 'clamp(0.88rem, 1.5vw, 1.05rem)',
                        color: 'rgba(203,213,225,0.65)',
                        maxWidth: '520px',
                        margin: '0 auto 2.5rem',
                        lineHeight: '1.8',
                        fontWeight: '400',
                    }}>
                        The intelligent infrastructure for examination management.{' '}
                        <span className="kw-violet" style={{ fontWeight: '600' }}>Cryptographically secure</span> matrices,{' '}
                        <span className="kw-cyan" style={{ fontWeight: '600' }}>algorithmic anti-cheating</span>, and precise spatial distribution.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                padding: '1rem 2.2rem', fontSize: '1rem', fontWeight: '700',
                                backgroundColor: '#fff', color: '#000',
                                borderRadius: '999px', border: 'none', cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                            }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(255,255,255,0.3), 0 0 25px rgba(255,255,255,0.35)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)'; }}
                        >
                            Access Console <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => navigate('/learn')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '1rem 2.2rem', fontSize: '1rem', fontWeight: '600',
                                backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff',
                                borderRadius: '999px',
                                border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                                backdropFilter: 'blur(8px)',
                                transition: 'all 0.25s ease',
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                        >
                            Learn Infrastructure
                        </button>
                    </div>

                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
                        borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem',
                        opacity: mounted ? 1 : 0, transition: 'opacity 1.5s ease 1s',
                    }}>
                        <FeatureItem icon={<Cpu size={18} />} title="AI Generative Core" delay="0s" />
                        <FeatureItem icon={<Shield size={18} />} title="Deterministic Constraints" delay="0.12s" />
                        <FeatureItem icon={<Network size={18} />} title="Spatial Encryption" delay="0.24s" />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes holographic-sweep {
                    0%   { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                @keyframes neon-x-pulse {
                    0%, 100% { text-shadow: 0 0 12px rgba(56,189,248,0.8), 0 0 35px rgba(56,189,248,0.5), 0 0 5px #fff; }
                    50%       { text-shadow: 0 0 25px rgba(56,189,248,1), 0 0 70px rgba(56,189,248,0.8), 0 0 120px rgba(56,189,248,0.4), 0 0 8px #fff; }
                }
                @keyframes dot-pulse {
                    0%, 100% { box-shadow: 0 0 6px #a855f7; }
                    50%       { box-shadow: 0 0 18px #a855f7; }
                }
                @keyframes word-glow {
                    0%, 100% { text-shadow: 0 0 12px rgba(165,180,252,0.4); }
                    50%       { text-shadow: 0 0 28px rgba(165,180,252,0.9), 0 0 55px rgba(165,180,252,0.4); }
                }
                @keyframes keyword-glow-violet {
                    0%, 100% { color: #c4b5fd; }
                    50%       { color: #ddd6fe; text-shadow: 0 0 18px rgba(196,181,253,0.7); }
                }
                @keyframes keyword-glow-cyan {
                    0%, 100% { color: #7dd3fc; }
                    50%       { color: #bae6fd; text-shadow: 0 0 18px rgba(125,211,252,0.7); }
                }
                .matrix-word { animation: word-glow 3s ease-in-out infinite; }
                .kw-violet   { animation: keyword-glow-violet 3s ease-in-out infinite; }
                .kw-cyan     { animation: keyword-glow-cyan   3s ease-in-out infinite 1.5s; }
                @keyframes reveal-up { to { opacity: 1; transform: translateY(0); } }
                .feature-reveal { animation: reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; transform:translateY(18px); }
            `}</style>
        </div>
    );
};

const FeatureItem = ({ icon, title, delay }) => (
    <div className="feature-reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', animationDelay: delay }}>
        <div style={{
            padding: '0.5rem', borderRadius: '10px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#a855f7', display: 'flex',
            boxShadow: 'inset 0 0 10px rgba(124,58,237,0.15)',
        }}>
            {icon}
        </div>
        <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600' }}>{title}</span>
    </div>
);

export default WelcomeSplash;
