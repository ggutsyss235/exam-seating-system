import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, User, Mail, Lock, ShieldCheck, Briefcase, GraduationCap, ArrowLeft, ArrowRight, Building } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';

import { useAppContext } from '../context/AppContext';

const AuthCard = ({ isLogin }) => {
    const navigate = useNavigate();
    const { login, register } = useAppContext();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    // 3D Parallax State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Auth state hooks
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Role state hooks
    const [role, setRole] = useState(''); // 'Teacher', 'Class Teacher', 'Exam Board Official'
    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('none'); // 'PGT', 'TGT', 'PRT'
    const [assignClass, setAssignClass] = useState('');
    const [assignSection, setAssignSection] = useState('');

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseMove = (e) => {
        if (!isHovering) return;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        // Subtle tilt for smaller card compared to splash screen
        const rotX = ((e.clientY - centerY) / centerY) * -8;
        const rotY = ((e.clientX - centerX) / centerX) * 8;
        setMousePos({ x: rotX, y: rotY });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setMousePos({ x: 0, y: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLogin) {
            if (!name || !email || !password) {
                setError('Please fill in all basic details.');
                return;
            }
            if (!role) {
                setError('Please select an administrative role.');
                return;
            }
            if ((role === 'Teacher' || role === 'Class Teacher') && (!subject || level === 'none')) {
                setError('Subject and Teaching Level are strictly required for teaching roles.');
                return;
            }
            if (role === 'Exam Board Official' && level === 'none') {
                setError('Please specify your staff designation (Teacher Level or Support Staff).');
                return;
            }
            if (role === 'Class Teacher' && (!assignClass || !assignSection)) {
                setError('Class and Section are required for Class Teachers.');
                return;
            }
        }

        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register({
                    name, email, password, role, subject, level, assignClass, assignSection, isClassTeacher: role === 'Class Teacher'
                });
            }
            navigate('/app');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="app-container"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem 0',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#050505',
                perspective: '1200px'
            }}
        >

            {/* Ambient Background Glows */}
            <div className="ambient-glow" style={{
                position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw',
                background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, transparent 60%)',
                filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
            }}></div>
            <div className="ambient-glow-alt" style={{
                position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw',
                background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, transparent 60%)',
                filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none'
            }}></div>

            {/* Floating 3D Orbs (Particles in background) */}
            <div className="orb orb-1" style={{ position: 'absolute', top: '20%', left: '20%', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(124, 58, 237, 0.6), rgba(124, 58, 237, 0))', filter: 'blur(6px)', opacity: 0.5, zIndex: 0 }}></div>
            <div className="orb orb-2" style={{ position: 'absolute', bottom: '25%', right: '25%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.5), rgba(14, 165, 233, 0))', filter: 'blur(5px)', opacity: 0.4, zIndex: 0 }}></div>

            {/* Faint Grid Overlay (Parallax) */}
            <div style={{
                position: 'absolute', inset: -50,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                zIndex: 0, pointerEvents: 'none',
                WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                transform: `translate(${mousePos.y * -1.5}px, ${mousePos.x * 1.5}px)`,
                transition: isHovering ? 'none' : 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}></div>

            <div
                className="main-3d-platform"
                style={{
                    width: '100%',
                    maxWidth: isLogin ? '440px' : '620px',
                    padding: window.innerWidth <= 480 ? '2rem 1.5rem' : '3.5rem 3rem',
                    transition: isHovering && window.innerWidth > 768 ? 'transform 0.15s ease-out, max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 1,
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    borderRadius: '32px',
                    transformStyle: window.innerWidth > 768 ? 'preserve-3d' : 'flat',
                    transform: window.innerWidth > 768 ? `
                        ${mounted ? 'translateY(0)' : 'translateY(60px)'}
                        rotateX(${mousePos.x * 1.2}deg) 
                        rotateY(${mousePos.y * 1.2}deg)
                        translateZ(0)
                    ` : (mounted ? 'translateY(0)' : 'translateY(40px)'),
                    opacity: mounted ? 1 : 0,
                    boxShadow: window.innerWidth > 768 ? `
                        0 45px 100px -20px rgba(0,0,0,0.9), 
                        inset 0 1px 1px rgba(255,255,255,0.15),
                        ${mousePos.y * -1.2}px ${mousePos.x * 1.2}px 60px rgba(139, 92, 246, 0.25)
                    ` : '0 10px 30px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                }}
            >
                {/* 3D Elevated Content Wrapper */}
                <div style={{ transform: 'translateZ(30px)', transition: 'transform 0.3s ease-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <AnimatedLogo scale={1.2} showText={false} layout="row" />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', letterSpacing: '-2px', fontWeight: '900', background: 'linear-gradient(135deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.2rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: '600', textShadow: 'var(--text-shadow-glow)' }}>
                            {isLogin ? 'Enter your credentials to access the console.' : 'Initialize your personal profile and specify your institutional role.'}
                        </p>
                    </div>

                    {error && (
                        <div className="animate-fade-in" style={{ padding: '0.8rem', backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.3)', fontWeight: '600' }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div className="animate-fade-in">
                            {!isLogin && (
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: '700' }}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Jane Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={{ paddingLeft: '2.5rem' }}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label" style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: '700' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="name@domain.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ paddingLeft: '2.5rem', color: '#ffffff' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontWeight: '800', textShadow: 'none' }}>
                                    Security Cipher Key
                                    {isLogin && <a href="#" style={{ textTransform: 'none', color: 'var(--primary)', letterSpacing: '0', fontWeight: '800' }}>Forgot?</a>}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.8 }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            paddingLeft: '2.5rem',
                                            paddingRight: '2.5rem',
                                            color: '#ffffff',
                                            fontWeight: '600',
                                            backgroundColor: 'rgba(0,0,0,0.4)',
                                            textShadow: 'none'
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Primary Institutional Role</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', perspective: '1000px' }}>
                                        <RoleSelector
                                            icon={<Briefcase size={22} />} title="Teacher"
                                            isActive={role === 'Teacher'} onClick={() => setRole('Teacher')}
                                        />
                                        <RoleSelector
                                            icon={<GraduationCap size={22} />} title="Class Teacher"
                                            isActive={role === 'Class Teacher'} onClick={() => setRole('Class Teacher')}
                                        />
                                        <RoleSelector
                                            icon={<ShieldCheck size={22} />} title="Exam Board"
                                            isActive={role === 'Exam Board Official'} onClick={() => setRole('Exam Board Official')}
                                        />
                                    </div>
                                </div>

                                {(role === 'Teacher' || role === 'Class Teacher') && (
                                    <div className="grid-2 animate-fade-in" style={{ gap: '1rem', background: 'var(--surface-hover)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Subject Domain</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="e.g. Mathematics"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Teaching Level</label>
                                            <select
                                                className="form-input"
                                                value={level}
                                                onChange={(e) => setLevel(e.target.value)}
                                                required
                                            >
                                                <option value="none" disabled>Select standard...</option>
                                                <option value="PGT">PGT (Post Graduate Teacher)</option>
                                                <option value="TGT">TGT (Trained Graduate Teacher)</option>
                                                <option value="PRT">PRT (Primary Teacher)</option>
                                            </select>
                                        </div>

                                        {role === 'Class Teacher' && (
                                            <>
                                                <div className="form-group animate-fade-in" style={{ marginBottom: 0, gridColumn: '1' }}>
                                                    <label className="form-label">Responsible Class</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. 10"
                                                        value={assignClass}
                                                        onChange={(e) => setAssignClass(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group animate-fade-in" style={{ marginBottom: 0, gridColumn: '2' }}>
                                                    <label className="form-label">Section</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. A"
                                                        value={assignSection}
                                                        onChange={(e) => setAssignSection(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {role === 'Exam Board Official' && (
                                    <div className="animate-fade-in" style={{ background: 'var(--surface-hover)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Staff Designation</label>
                                            <select
                                                className="form-input"
                                                value={level}
                                                onChange={(e) => setLevel(e.target.value)}
                                                required
                                            >
                                                <option value="none" disabled>Select designation...</option>
                                                <option value="PGT">Teacher (PGT)</option>
                                                <option value="TGT">Teacher (TGT)</option>
                                                <option value="PRT">Teacher (PRT)</option>
                                                <option value="Support Staff">Supporting Staff</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}


                        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1rem' }}>
                            {isLoading ? 'Processing...' : (isLogin ? 'Authenticate' : 'Complete Registration')}
                        </button>
                    </form>

                    {/* Footer Switch */}
                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an account? " : "Already initialized? "}
                        <button
                            onClick={() => navigate(isLogin ? '/signup' : '/login')}
                            style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', padding: 0 }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
                <style>{`
                @keyframes float-slow {
                    0% { transform: translateY(0) translateX(0) scale(1); }
                    33% { transform: translateY(-30px) translateX(20px) scale(1.05); }
                    66% { transform: translateY(20px) translateX(-20px) scale(0.95); }
                    100% { transform: translateY(0) translateX(0) scale(1); }
                }
                .orb { animation: float-slow 15s infinite ease-in-out; }
                .orb-2 { animation-delay: -5s; animation-duration: 20s; }
                
                .ambient-glow { animation: float-slow 20s infinite alternate linear; }
                .ambient-glow-alt { animation: float-slow 25s infinite alternate-reverse linear; }

                select.form-input { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; }
                
                .auth-btn-glow {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .auth-btn-glow::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: all 0.5s ease;
                }
                .auth-btn-glow:hover::before {
                    left: 150%;
                }
            `}</style>
            </div>
        </div>
    );
};

// Smaller component for role selection card
const RoleSelector = ({ icon, title, isActive, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: '1.5rem 0.5rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
            border: `1.5px solid ${isActive ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 'var(--radius-md)',
            background: isActive ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))' : 'rgba(0,0,0,0.3)',
            color: isActive ? '#fff' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            textAlign: 'center',
            transformStyle: 'preserve-3d',
            transform: isActive ? 'translateZ(20px) scale(1.05)' : 'translateZ(0) scale(1)',
            boxShadow: isActive ? '0 15px 35px rgba(139, 92, 246, 0.3), inset 0 1px 1px rgba(255,255,255,0.2)' : '0 4px 15px rgba(0,0,0,0.2)',
            outline: isActive ? '2px solid var(--primary)' : 'none',
            outlineOffset: '4px'
        }}
    >
        <div style={{
            transform: isActive ? 'translateZ(10px)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            color: isActive ? 'var(--primary)' : 'inherit'
        }}>
            {icon}
        </div>
        <span style={{
            fontSize: '0.8rem',
            fontWeight: isActive ? '900' : '600',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textShadow: isActive ? 'var(--text-shadow-glow)' : 'none'
        }}>{title}</span>
    </div>
);

export default AuthCard;
