import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Shield, Cpu, ArrowRight } from 'lucide-react';
import HeroCanvas3D from '../components/HeroCanvas3D';

const WelcomeSplash = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#05050a',
            fontFamily: "'Outfit', 'Inter', sans-serif",
        }}>
            {/* ── Three.js Background Canvas ─────────────────────── */}
            <Suspense fallback={null}>
                <HeroCanvas3D />
            </Suspense>

            {/* ── Radial dark vignette so text pops ─────────────── */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, rgba(5,5,10,0.65) 80%, rgba(5,5,10,0.92) 100%)',
            }} />

            {/* ── Hero Content — sits in the BOTTOM portion so 3D text dominates center ── */}
            <div
                style={{
                    position: 'relative', zIndex: 10,
                    textAlign: 'center',
                    maxWidth: '720px',
                    width: '90%',
                    padding: '0 1.5rem',
                    marginTop: '55vh', // push below the 3D text
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Version Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.45rem 1.2rem', borderRadius: '999px',
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    marginBottom: '1.5rem',
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

                {/* Tagline */}
                <p style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '0.75rem',
                    textShadow: '0 2px 16px rgba(0,0,0,0.9)',
                }}>
                    Advanced <span className="matrix-word" style={{ color: '#a5b4fc', fontWeight: '800' }}>Matrix</span> Engine.
                </p>

                {/* Description */}
                <p style={{
                    fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                    color: 'rgba(203,213,225,0.65)',
                    maxWidth: '500px',
                    margin: '0 auto 2.5rem',
                    lineHeight: '1.8',
                    fontWeight: '400',
                }}>
                    The intelligent infrastructure for examination management.{' '}
                    <span className="kw-violet" style={{ fontWeight: '600' }}>Cryptographically secure</span> matrices,{' '}
                    <span className="kw-cyan" style={{ fontWeight: '600' }}>algorithmic anti-cheating</span>, and precise spatial distribution.
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                            padding: '1rem 2.2rem', fontSize: '1rem', fontWeight: '700',
                            backgroundColor: '#ffffff', color: '#000',
                            borderRadius: '999px', border: 'none', cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.4)'; }}
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

                {/* Feature Chips */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
                    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem',
                    opacity: mounted ? 1 : 0, transition: 'opacity 1.5s ease 1s',
                }}>
                    <FeatureItem icon={<Cpu size={18} />} title="AI Generative Core" delay="0s" />
                    <FeatureItem icon={<Shield size={18} />} title="Deterministic Constraints" delay="0.12s" />
                    <FeatureItem icon={<Network size={18} />} title="Spatial Encryption" delay="0.24s" />
                </div>
            </div>

            <style>{`
                @keyframes holographic-sweep {
                    0%   { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                @keyframes neon-x-pulse {
                    0%, 100% {
                        text-shadow: 0 0 12px rgba(56,189,248,0.8), 0 0 35px rgba(56,189,248,0.5), 0 0 5px #fff;
                    }
                    50% {
                        text-shadow: 0 0 25px rgba(56,189,248,1), 0 0 70px rgba(56,189,248,0.8), 0 0 120px rgba(56,189,248,0.4), 0 0 8px #fff;
                    }
                }
                @keyframes dot-pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 6px #a855f7; }
                    50%       { opacity: 0.5; box-shadow: 0 0 18px #a855f7; }
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
                .kw-violet { animation: keyword-glow-violet 3s ease-in-out infinite; }
                .kw-cyan   { animation: keyword-glow-cyan   3s ease-in-out infinite 1.5s; }
                @keyframes reveal-up { to { opacity: 1; transform: translateY(0); } }
                .feature-reveal { animation: reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; transform:translateY(20px); }

                /* Floating orbs via CSS (fallback if canvas not rendering) */
                @keyframes float-slow {
                    0%   { transform: translateY(0) scale(1); }
                    50%  { transform: translateY(-20px) scale(1.05); }
                    100% { transform: translateY(0) scale(1); }
                }
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
        <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600', letterSpacing: '0.3px' }}>{title}</span>
    </div>
);

export default WelcomeSplash;
