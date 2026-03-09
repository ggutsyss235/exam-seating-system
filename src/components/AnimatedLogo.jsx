import React from 'react';

const AnimatedLogo = ({ scale = 1, showText = true, layout = 'row' }) => {
    return (
        <div style={{ transform: `scale(${scale})`, display: 'inline-flex', flexDirection: layout, alignItems: 'center', gap: layout === 'column' ? '0' : '1rem', transformOrigin: layout === 'column' ? 'center center' : 'left center' }}>
            <div className="logo-3d-core">
                <div className="ring ring-outer"></div>
                <div className="ring ring-middle"></div>
                <div className="ring ring-inner"></div>
                <div className="core-sphere">
                    <div className="core-glow"></div>
                </div>
            </div>
            {showText && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: layout === 'column' ? 'center' : 'flex-start', zIndex: 2 }}>
                    <span style={{
                        fontSize: layout === 'column' ? 'clamp(4rem, 8vw, 6.5rem)' : '1.6rem',
                        fontWeight: '900',
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(135deg, #fff 0%, var(--text-muted) 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: "'Outfit', sans-serif",
                        lineHeight: 1,
                        textShadow: layout === 'column' ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
                    }}>
                        SeatPro<span style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial', background: 'none' }}>.</span>
                    </span>
                    {layout === 'column' && (
                        <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '6px', fontSize: '1rem', textTransform: 'uppercase', marginTop: '1.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', backdropFilter: 'blur(10px)', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                            Advanced Matrix Engine
                        </span>
                    )}
                </div>
            )}

            <style>{`
                .logo-3d-core {
                    width: ${layout === 'column' ? '220px' : '48px'};
                    height: ${layout === 'column' ? '220px' : '48px'};
                    position: relative;
                    perspective: 1000px;
                    transform-style: preserve-3d;
                    margin-bottom: ${layout === 'column' ? '2rem' : '0'};
                    z-index: 1;
                }

                .ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: ${layout === 'column' ? '4px' : '2px'} solid transparent;
                    transform-style: preserve-3d;
                }

                .ring-outer {
                    border-left-color: var(--primary);
                    border-right-color: var(--secondary);
                    animation: spin3D 8s linear infinite;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(14, 165, 233, 0.4);
                }

                .ring-middle {
                    inset: ${layout === 'column' ? '25px' : '6px'};
                    border-top-color: var(--accent);
                    border-bottom-color: var(--secondary);
                    animation: spin3DReverse 6s linear infinite;
                    box-shadow: 0 0 15px rgba(244, 63, 94, 0.4), inset 0 0 15px rgba(14, 165, 233, 0.4);
                }

                .ring-inner {
                    inset: ${layout === 'column' ? '50px' : '12px'};
                    border-left-color: var(--primary);
                    border-bottom-color: var(--primary);
                    animation: spin3DY 4s linear infinite;
                    box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
                }

                .core-sphere {
                    position: absolute;
                    inset: ${layout === 'column' ? '75px' : '18px'};
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 50%;
                    box-shadow: 0 0 40px var(--primary);
                    animation: pulseCore 2s ease-in-out infinite alternate;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .core-glow {
                    width: 50%;
                    height: 50%;
                    background: #fff;
                    border-radius: 50%;
                    filter: blur(${layout === 'column' ? '15px' : '4px'});
                    opacity: 0.9;
                }

                @keyframes spin3D {
                    0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
                    100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(360deg); }
                }

                @keyframes spin3DReverse {
                    0% { transform: rotateX(-45deg) rotateY(360deg) rotateZ(0deg); }
                    100% { transform: rotateX(-45deg) rotateY(0deg) rotateZ(-360deg); }
                }

                @keyframes spin3DY {
                    0% { transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg); }
                    100% { transform: rotateX(20deg) rotateY(360deg) rotateZ(360deg); }
                }

                @keyframes pulseCore {
                    0% { transform: scale(0.9); box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); }
                    100% { transform: scale(1.1); box-shadow: 0 0 50px rgba(14, 165, 233, 1); }
                }
            `}</style>
        </div>
    );
};

export default AnimatedLogo;
