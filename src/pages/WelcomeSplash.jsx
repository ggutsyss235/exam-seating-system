import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Shield, Cpu, ArrowRight } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';

const WelcomeSplash = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    // 3D Mouse Tracking State
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate dynamic rotation based on mouse position relative to center of screen
    const handleMouseMove = (e) => {
        if (!isHovering) return;
        // Disable intense 3D tracking on mobile devices to prevent jittering
        if (window.innerWidth <= 768) return;
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Dampen the effect so it's not too extreme (max ~15 degrees)
        const rotX = ((clientY - centerY) / centerY) * -12;
        const rotY = ((clientX - centerX) / centerX) * 12;

        setMousePosition({ x: rotX, y: rotY });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        // Reset to center smoothly
        setMousePosition({ x: 0, y: 0 });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#050505', // Deep space black
                fontFamily: "'Inter', 'Outfit', sans-serif",
                perspective: '1200px' // Critical for 3D depth
            }}
        >
            {/* Ambient Background Glows */}
            <div className="ambient-glow" style={{
                position: 'absolute', top: '-20%', right: '-10%', width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 60%)',
                filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
            }}></div>
            <div className="ambient-glow-alt" style={{
                position: 'absolute', bottom: '-20%', left: '-10%', width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 60%)',
                filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
            }}></div>

            {/* Floating 3D Orbs (Particles in background) */}
            <div className="orb orb-1" style={{ position: 'absolute', top: '15%', left: '15%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(124, 58, 237, 0.8), rgba(124, 58, 237, 0))', filter: 'blur(4px)', opacity: 0.6, zIndex: 0 }}></div>
            <div className="orb orb-2" style={{ position: 'absolute', bottom: '20%', right: '20%', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.6), rgba(14, 165, 233, 0))', filter: 'blur(8px)', opacity: 0.4, zIndex: 0 }}></div>
            <div className="orb orb-3" style={{ position: 'absolute', top: '40%', right: '10%', width: '60px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.7), rgba(168, 85, 247, 0))', filter: 'blur(3px)', opacity: 0.8, zIndex: 0 }}></div>

            {/* Faint Grid Overlay (Moves slightly opposite to mouse for parallax) */}
            <div style={{
                position: 'absolute', inset: -50,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                zIndex: 0, pointerEvents: 'none',
                WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                transform: `translate(${mousePosition.y * -2}px, ${mousePosition.x * 2}px)`,
                transition: isHovering ? 'none' : 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}></div>

            {/* Main Interactive 3D Card Platform */}
            <div
                className="main-3d-platform"
                style={{
                    zIndex: 10, textAlign: 'center', maxWidth: '850px', padding: '3rem', width: '90%',
                    transform: `
                        ${mounted ? 'translateY(0)' : 'translateY(50px)'}
                        rotateX(${mousePosition.x}deg) 
                        rotateY(${mousePosition.y}deg)
                    `,
                    opacity: mounted ? 1 : 0,
                    transition: isHovering ? 'transform 0.1s ease-out' : 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformStyle: 'preserve-3d', // Treat children in 3D space
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    boxShadow: `
                        0 25px 50px -12px rgba(0, 0, 0, 0.7),
                        inset 0 1px 1px rgba(255, 255, 255, 0.1),
                        ${mousePosition.y * -1}px ${mousePosition.x * 1}px 40px rgba(124, 58, 237, 0.15)
                    ` // Dynamic shadow opposing light source
                }}
            >
                {/* 3D Elevated Content Wrapper */}
                <div style={{ transform: 'translateZ(40px)', transition: 'transform 0.3s ease-out' }}>

                    {/* Top Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.5rem 1.2rem', borderRadius: '999px',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        marginBottom: '2rem', backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}>
                        <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7', boxShadow: '0 0 12px #a855f7' }}></span>
                        <span style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Seating Intelligence Engine v2.0</span>
                    </div>

                    <div style={{ marginBottom: '2.5rem', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
                        <AnimatedLogo scale={1} layout="column" />
                    </div>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--text-main)',
                        maxWidth: '600px', margin: '0 auto 3.5rem', lineHeight: '1.6', fontWeight: '600',
                        textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        The intelligent infrastructure for examination management.
                        Cryptographically secure matrices, algorithmic anti-cheating, and precise spatial distribution.
                    </p>

                    {/* Action Buttons (Elevated further) */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '4rem', flexWrap: 'wrap', transform: 'translateZ(20px)' }}>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-glow-master"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1.2rem 2.5rem', fontSize: '1.1rem', fontWeight: '700',
                                backgroundColor: '#fff', color: '#000', borderRadius: '999px',
                                border: 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                boxShadow: '0 10px 25px rgba(255,255,255,0.2), inset 0 -3px 0 rgba(0,0,0,0.2)'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.5), inset 0 -3px 0 rgba(0,0,0,0.2)' }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(255,255,255,0.2), inset 0 -3px 0 rgba(0,0,0,0.2)' }}
                        >
                            Access Console <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/learn')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '1.2rem 2.5rem', fontSize: '1.1rem', fontWeight: '600',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)', color: '#fff', borderRadius: '999px',
                                border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', transition: 'all 0.2s ease',
                                backdropFilter: 'blur(5px)'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)' }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)' }}
                        >
                            Learn Infrastructure
                        </button>
                    </div>

                    {/* Feature Inline List */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '2.5rem',
                        opacity: mounted ? 1 : 0, transition: 'opacity 1.5s ease 0.8s',
                        transform: 'translateZ(10px)'
                    }}>
                        <FeatureItem icon={<Cpu size={20} />} title="AI Generative Core" delay="0s" />
                        <FeatureItem icon={<Shield size={20} />} title="Deterministic Constraints" delay="0.1s" />
                        <FeatureItem icon={<Network size={20} />} title="Spatial Encryption" delay="0.2s" />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float-slow {
                    0% { transform: translateY(0) translateX(0) scale(1); }
                    33% { transform: translateY(-30px) translateX(20px) scale(1.05); }
                    66% { transform: translateY(20px) translateX(-20px) scale(0.95); }
                    100% { transform: translateY(0) translateX(0) scale(1); }
                }
                @keyframes pulse-intense {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .orb { animation: float-slow 15s infinite ease-in-out; }
                .orb-2 { animation-delay: -5s; animation-duration: 20s; }
                .orb-3 { animation-delay: -10s; animation-duration: 12s; }
                .pulse-dot { animation: pulse-intense 2s infinite ease-in-out; }
                
                .ambient-glow { animation: float-slow 20s infinite alternate linear; }
                .ambient-glow-alt { animation: float-slow 25s infinite alternate-reverse linear; }
                
                .feature-reveal {
                    animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                @keyframes reveal-up {
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const FeatureItem = ({ icon, title, delay }) => (
    <div className="feature-reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', animationDelay: delay }}>
        <div style={{
            padding: '0.6rem', borderRadius: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(124, 58, 237, 0.3)',
            color: '#a855f7', display: 'flex',
            boxShadow: 'inset 0 0 10px rgba(124, 58, 237, 0.2)'
        }}>
            {icon}
        </div>
        <div style={{ color: '#e2e8f0', fontSize: '1.05rem', fontWeight: '600', letterSpacing: '0.5px' }}>{title}</div>
    </div>
);

export default WelcomeSplash;
