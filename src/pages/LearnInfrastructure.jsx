import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BrainCircuit, Boxes, ArrowLeft, Terminal, CheckCircle2, MessageSquare, Sparkles, Database, LayoutGrid } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';

const LearnInfrastructure = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Track scroll for parallax and reveal effects
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#030305',
            color: '#fff',
            fontFamily: "'Inter', 'Outfit', sans-serif",
            overflowX: 'hidden',
            position: 'relative',
            perspective: '1000px'
        }}>
            {/* Ambient Backgrounds */}
            <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.4 }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%)', filter: 'blur(80px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 60%)', filter: 'blur(80px)' }}></div>
                {/* Grid Overlay */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}></div>
            </div>

            {/* Navigation Bar */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50, background: 'linear-gradient(to bottom, rgba(3,3,5,0.9) 0%, transparent 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <AnimatedLogo scale={0.4} layout="row" />
                </div>
                <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '999px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }}>
                    <ArrowLeft size={16} /> Return Home
                </button>
            </nav>

            {/* Hero Section */}
            <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 2rem', paddingTop: '5rem' }}>
                <div style={{ textAlign: 'center', maxWidth: '800px', transform: mounted ? 'translateY(0)' : 'translateY(40px)', opacity: mounted ? 1 : 0, transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '999px', color: '#a855f7', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px', marginBottom: '2rem', textTransform: 'uppercase' }}>
                        System Architecture
                    </div>
                    <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
                        How SeatPro<span style={{ color: '#0ea5e9', WebkitTextFillColor: '#0ea5e9' }}>X</span> Thinks.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 3.5rem', fontWeight: '500', textShadow: 'var(--text-shadow-glow)' }}>
                        Discover the deterministic AI engine that physically guarantees exam integrity through algorithmic spatial isolation.
                    </p>

                    {/* Scroll Indicator */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem', animation: 'bounce 2s infinite', marginTop: '4rem', fontWeight: '700' }}>
                        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, var(--primary), transparent)' }}></div>
                        Scroll to explore
                    </div>
                </div>

                {/* 3D Floating Elements attached to Hero */}
                <div style={{ position: 'absolute', top: '50%', left: '10%', transform: `translateY(-50%) translateZ(${scrollProgress * 600}px) rotateY(${scrollProgress * 180}deg) scale(${1 + scrollProgress})`, transition: 'transform 0.1s ease-out', zIndex: 5 }}>
                    <div className="float-obj" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <Terminal color="#0ea5e9" size={32} />
                    </div>
                </div>
                <div style={{ position: 'absolute', top: '30%', right: '12%', transform: `translateY(-50%) translateZ(${scrollProgress * 400}px) rotateX(${scrollProgress * -120}deg) scale(${1 + scrollProgress * 1.5})`, transition: 'transform 0.1s ease-out', zIndex: 5 }}>
                    <div className="float-obj-alt" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <BrainCircuit color="#a855f7" size={32} />
                    </div>
                </div>
            </section>

            {/* Component Showcase 1: Student Database */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '6rem 4rem', position: 'relative', zIndex: 10 }}>
                <div className="split-section-grid">

                    {/* Left: Text */}
                    <div style={{ transform: scrollProgress > 0.1 ? 'translateX(0) scale(1)' : 'translateX(-200px) scale(0.5) rotateY(30deg)', opacity: scrollProgress > 0.1 ? 1 : 0, transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#3b82f6', marginBottom: '1.5rem', fontWeight: '600' }}>
                            <div style={{ width: '40px', height: '1px', background: '#3b82f6' }}></div>
                            Node 1: Student Manager
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>Mass scale data ingestion.</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', fontWeight: '500' }}>
                            Before AI can generate seating, it needs data. The Student Manager handles massive CSV uploads instantly, verifying and organizing thousands of student profiles, classes, and subjects into an encrypted database node.
                        </p>
                    </div>

                    {/* Right: Simulated Student Table */}
                    <div style={{
                        transform: `perspective(1200px) rotateY(${scrollProgress > 0.1 ? -25 : -60}deg) translateZ(${scrollProgress > 0.1 ? 100 : -600}px)`,
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                        background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '24px', padding: '1.5rem',
                        boxShadow: '-20px 20px 60px rgba(0,0,0,0.5), inset 0 2px 20px rgba(59, 130, 246, 0.1)',
                        position: 'relative', overflow: 'hidden', height: '400px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <Database color="#3b82f6" /> <h3 style={{ margin: 0, color: '#fff' }}>Student Registry</h3>
                        </div>

                        {/* Headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                            <span>Roll No</span><span>Name</span><span>Class</span><span>Subject</span>
                        </div>

                        {/* Scrolling Data Rows */}
                        <div className="scroll-y-anim" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                ['25001', 'Alex Mercer', '12-A', 'Physics'], ['25002', 'Sarah Connor', '12-A', 'Math'],
                                ['25003', 'John Doe', '12-B', 'Math'], ['25004', 'Jane Smith', '11-C', 'Biology'],
                                ['25005', 'Michael Bay', '12-A', 'Physics'], ['25006', 'Tony Stark', '12-B', 'Math'],
                                ['25007', 'Bruce Wayne', '11-C', 'Biology'], ['25008', 'Clark Kent', '12-A', 'Physics']
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{row[0]}</span>
                                    <span style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{row[1]}</span>
                                    <span style={{ color: '#0ea5e9', fontSize: '0.85rem', background: 'rgba(14, 165, 233, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', textAlign: 'center' }}>{row[2]}</span>
                                    <span style={{ color: '#a855f7', fontSize: '0.85rem' }}>{row[3]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Showcase 2: Room Architect */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '6rem 4rem', position: 'relative', zIndex: 10 }}>
                <div className="split-section-grid">

                    {/* Left: 3D Room Grid Builder */}
                    <div style={{
                        transform: `perspective(1200px) rotateY(${scrollProgress > 0.25 ? 25 : 60}deg) translateZ(${scrollProgress > 0.25 ? 100 : -600}px) rotateX(${scrollProgress > 0.25 ? 15 : 45}deg)`,
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                        background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '2rem',
                        boxShadow: '20px 20px 60px rgba(0,0,0,0.5), inset 0 2px 20px rgba(16, 185, 129, 0.1)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><LayoutGrid color="#10b981" /> <h3 style={{ margin: 0, color: '#fff' }}>Room Architect (Room 101)</h3></div>
                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>Capacity: 24</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[...Array(24)].map((_, i) => (
                                <div key={i} className="build-anim" style={{
                                    height: '40px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.4)',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    animationDelay: `${scrollProgress > 0.25 ? i * 0.05 : 0}s`
                                }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div style={{ transform: scrollProgress > 0.25 ? 'translateX(0) scale(1)' : 'translateX(200px) scale(0.5) rotateY(-30deg)', opacity: scrollProgress > 0.25 ? 1 : 0, transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', marginBottom: '1.5rem', fontWeight: '600' }}>
                            <div style={{ width: '40px', height: '1px', background: '#10b981' }}></div>
                            Node 2: Room Architect
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>Spatial coordinate mapping.</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', fontWeight: '500' }}>
                            The system doesn't just look at total capacity. Administrators use the Room Manager to define exact physical dimensions—rows, columns, and seats. This builds a digital isometric grid that the AI uses to calculate distance vectors.
                        </p>
                    </div>

                </div>
            </section>

            {/* Split Screen Explanation 1: The Problem */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '6rem 4rem', position: 'relative', zIndex: 10 }}>
                <div className="split-section-grid">

                    {/* Left: Text */}
                    <div style={{ transform: scrollProgress > 0.1 ? 'translateX(0) scale(1)' : 'translateX(-200px) scale(0.5) rotateY(30deg)', opacity: scrollProgress > 0.1 ? 1 : 0, transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', marginBottom: '1.5rem', fontWeight: '600' }}>
                            <div style={{ width: '40px', height: '1px', background: '#ef4444' }}></div>
                            The Legacy Problem
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>Manual seating is inherently flawed.</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', fontWeight: '500' }}>
                            Human administrators trying to map hundreds of students across varying subjects to physical grids inevitably create proximity vulnerabilities. Students with identical question papers inevitably sit directly behind or diagonally adjacent to each other.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> Horizontal blind spots</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> Sub-optimal room capacity usage</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> Hours of manual spreadsheet logic</li>
                        </ul>
                    </div>

                    {/* Right: Visual Bad Grid Demo */}
                    <div style={{
                        transform: `perspective(1200px) rotateY(${scrollProgress > 0.1 ? -35 : -70}deg) translateZ(${scrollProgress > 0.1 ? 150 : -600}px) rotateX(${scrollProgress > 0.1 ? 5 : 30}deg)`,
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                        background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem',
                        boxShadow: '-20px 20px 60px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className={i === 5 || i === 6 || i === 9 ? 'flash-error' : ''} style={{
                                    height: '60px', borderRadius: '8px', background: i === 5 || i === 6 || i === 9 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.02)',
                                    border: i === 5 || i === 6 || i === 9 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {i === 5 || i === 6 || i === 9 ? <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>Physics Set A</span> : <span style={{ color: '#475569', fontSize: '0.7rem' }}>Empty</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Split Screen Explanation 2: The AI Solution */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '6rem 4rem', position: 'relative', zIndex: 10 }}>
                <div className="split-section-grid">

                    {/* Left: Interactive Good Grid Demo */}
                    <div style={{
                        transform: `perspective(1200px) rotateY(${scrollProgress > 0.6 ? 35 : 70}deg) translateZ(${scrollProgress > 0.6 ? 150 : -600}px) rotateX(${scrollProgress > 0.6 ? -5 : -30}deg)`,
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                        background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '24px', padding: '2rem',
                        boxShadow: '20px 20px 60px rgba(124, 58, 237, 0.1)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {['Math Set A', 'Bio Set B', 'Math Set B', 'Bio Set A', 'Bio Set A', 'Math Set B', 'Bio Set B', 'Math Set A', 'Math Set B', 'Bio Set A', 'Math Set A', 'Bio Set B', 'Bio Set B', 'Math Set A', 'Bio Set A', 'Math Set B'].map((subj, i) => (
                                <div key={i} className="bounce-in" style={{
                                    height: '60px', borderRadius: '8px',
                                    background: subj.includes('Math') ? 'rgba(168, 85, 247, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                                    border: subj.includes('Math') ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(14, 165, 233, 0.4)',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    animationDelay: `${scrollProgress > 0.6 ? i * 0.05 : 0}s`
                                }}>
                                    <span style={{ color: subj.includes('Math') ? '#d8b4fe' : '#bae6fd', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center' }}>{subj}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div style={{ transform: scrollProgress > 0.6 ? 'translateX(0) scale(1)' : 'translateX(200px) scale(0.5) rotateY(-30deg)', opacity: scrollProgress > 0.6 ? 1 : 0, transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#a855f7', marginBottom: '1.5rem', fontWeight: '600' }}>
                            <div style={{ width: '40px', height: '1px', background: '#a855f7' }}></div>
                            The Deterministic Solution
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>Spatial Cryptography via Gemini AI.</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', fontWeight: '500' }}>
                            SeatPro X utilizes the Google Gemini architecture to process explicit dimensional parameters. We force the LLM to obey radial exclusion zones—meaning no student will ever sit adjacent, diagonal, or parallel to an identical question paper.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}><CheckCircle2 color="#a855f7" size={20} /> Zero proximity overlaps guaranteed</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}><CheckCircle2 color="#a855f7" size={20} /> Multi-Set interleaving (Set A / Set B alternating)</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}><CheckCircle2 color="#a855f7" size={20} /> Millisecond generation for complex matrices</li>
                        </ul>
                    </div>

                </div>
            </section>

            {/* Split Screen Explanation 3: The Interface Demo */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '6rem 4rem', position: 'relative', zIndex: 10 }}>
                <div className="split-section-grid">

                    {/* Left: Chat AI Interface Mockup */}
                    <div style={{ transform: scrollProgress > 0.8 ? 'translateX(0) scale(1)' : 'translateX(-200px) scale(0.5) rotateY(30deg)', opacity: scrollProgress > 0.8 ? 1 : 0, transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#0ea5e9', marginBottom: '1.5rem', fontWeight: '600' }}>
                            <div style={{ width: '40px', height: '1px', background: '#0ea5e9' }}></div>
                            Node 3: The Execution Engine
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>Conversational generation.</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '3rem', fontWeight: '500' }}>
                            Data and space merge at the AI Agent node. The interface abstracts away the complex math into a simple chat. You provide the parameters; the AI negotiates the spatial isolation logic instantly in the background.
                        </p>

                        {/* Simulated Chat Interface */}
                        <div style={{
                            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '24px', padding: '1.5rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 2px 20px rgba(14, 165, 233, 0.1)',
                            display: 'flex', flexDirection: 'column', gap: '1rem',
                            transform: `translateZ(${scrollProgress > 0.8 ? 80 : 0}px)`, transition: 'all 1s ease-out'
                        }}>
                            {/* Chat Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                <div style={{ background: '#0ea5e9', padding: '0.5rem', borderRadius: '50%' }}><Sparkles size={20} color="#fff" /></div>
                                <div>
                                    <h4 style={{ margin: 0, color: '#fff' }}>Seating Master AI</h4>
                                    <span style={{ color: '#10b981', fontSize: '0.8rem' }}>● Online and ready</span>
                                </div>
                            </div>

                            {/* Chat Bubbles */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                {/* AI Message */}
                                <div className="chat-reveal-1" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px', borderTopLeftRadius: '0', maxWidth: '80%', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    How many rows and seats per row does Room 101 have?
                                </div>
                                {/* Admin Message */}
                                <div className="chat-reveal-2" style={{ alignSelf: 'flex-end', background: 'rgba(14, 165, 233, 0.2)', padding: '1rem', borderRadius: '16px', borderTopRightRadius: '0', maxWidth: '80%', border: '1px solid rgba(14, 165, 233, 0.4)', color: '#bae6fd' }}>
                                    It has 6 rows. Each row has 4 seats. We need to seat Math and Physics students.
                                </div>
                                {/* AI Generating Message */}
                                <div className="chat-reveal-3" style={{ alignSelf: 'flex-start', background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '16px', borderTopLeftRadius: '0', maxWidth: '80%', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d8b4fe' }}>
                                        <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                                        <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem' }}>Processing spatial matrix...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Interface Generative Simulation */}
                    <div style={{
                        transform: `perspective(1200px) rotateY(${scrollProgress > 0.8 ? -30 : -70}deg) translateZ(${scrollProgress > 0.8 ? 100 : -600}px) rotateX(${scrollProgress > 0.8 ? 10 : 30}deg)`,
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                        background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem',
                        boxShadow: '-20px 20px 60px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Live Generation Visualizer</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[...Array(24)].map((_, i) => {
                                const isMath = (i % 2 === 0 && Math.floor(i / 4) % 2 === 0) || (i % 2 !== 0 && Math.floor(i / 4) % 2 !== 0);
                                const subj = isMath ? 'Math' : 'Physics';
                                const colorPrimary = isMath ? '#a855f7' : '#0ea5e9';
                                const colorBg = isMath ? 'rgba(168, 85, 247, 0.2)' : 'rgba(14, 165, 233, 0.2)';
                                const colorBorder = isMath ? 'rgba(168, 85, 247, 0.5)' : 'rgba(14, 165, 233, 0.5)';

                                return (
                                    <div key={i} className="sequence-reveal" style={{
                                        height: '50px', borderRadius: '8px',
                                        background: colorBg,
                                        border: `1px solid ${colorBorder}`,
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        animationDelay: `${scrollProgress > 0.8 ? 2 + (i * 0.1) : 0}s`
                                    }}>
                                        <span style={{ color: colorPrimary, fontSize: '0.7rem', fontWeight: 'bold' }}>{subj}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Fake UI Overlay elements */}
                        <div className="ui-scanline" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.5)', filter: 'blur(2px)', opacity: 0.5 }}></div>
                    </div>

                </div>
            </section>

            {/* Outro CTA */}
            <section style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 2rem', position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', transform: scrollProgress > 0.9 ? 'translateZ(100px) scale(1.1)' : 'translateZ(-400px) scale(0.5) rotateX(45deg)', opacity: scrollProgress > 0.9 ? 1 : 0, transition: 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '2rem' }}>Ready to secure your exams?</h2>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: '700', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '999px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4), inset 0 2px 0 rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(168, 85, 247, 0.6), inset 0 2px 0 rgba(255,255,255,0.2)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.4), inset 0 2px 0 rgba(255,255,255,0.2)'; }}
                    >
                        Access Dashboard Now
                    </button>
                </div>
            </section>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .float-obj { animation: float-slow 8s infinite ease-in-out; }
                .float-obj-alt { animation: float-slow 10s infinite alternate-reverse ease-in-out; }
                
                @keyframes flash {
                    0%, 100% { opacity: 1; background: rgba(239, 68, 68, 0.2); }
                    50% { opacity: 0.5; background: rgba(239, 68, 68, 0.5); transform: scale(1.05); }
                }
                .flash-error { animation: flash 2s infinite ease-in-out; }

                @keyframes bounce-in-fwd {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .bounce-in {
                    animation: bounce-in-fwd 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
                }

                @keyframes chat-pop {
                    0% { transform: translateY(20px) scale(0.9); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                .chat-reveal-1 { animation: chat-pop 0.5s ease-out 0.5s both; }
                .chat-reveal-2 { animation: chat-pop 0.5s ease-out 2s both; }
                .chat-reveal-3 { animation: chat-pop 0.5s ease-out 4s both; }

                @keyframes dot-blink {
                    0%, 100% { opacity: 0.2; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .typing-dot {
                    width: 6px; height: 6px; background-color: #d8b4fe; border-radius: 50%; display: inline-block;
                    animation: dot-blink 1.4s infinite ease-in-out both;
                }
                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes seq-reveal {
                    0% { transform: scale(0) rotateX(-90deg); opacity: 0; }
                    100% { transform: scale(1) rotateX(0deg); opacity: 1; }
                }
                .sequence-reveal {
                    animation: seq-reveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }

                @keyframes scanline {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .ui-scanline {
                    animation: scanline 3s linear infinite;
                }

                @keyframes scroll-y {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .scroll-y-anim {
                    animation: scroll-y 10s linear infinite alternate;
                }
                .scroll-y-anim:hover {
                    animation-play-state: paused;
                }

                @keyframes build-up {
                    0% { opacity: 0; transform: scale(0.5) translateY(20px); border-color: transparent; }
                    50% { opacity: 1; transform: scale(1.1) translateY(-5px); border-color: rgba(16, 185, 129, 0.8); }
                    100% { opacity: 1; transform: scale(1) translateY(0); border-color: rgba(16, 185, 129, 0.4); }
                }
                .build-anim {
                    animation: build-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }
            `}</style>
        </div>
    );
};

export default LearnInfrastructure;
