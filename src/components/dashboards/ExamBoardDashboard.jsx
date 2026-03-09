import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Building, CalendarDays, Users, Zap, ShieldCheck } from 'lucide-react';
import StudentManager from '../StudentManager';
import RoomManager from '../RoomManager';
import SeatingPlanner from '../SeatingPlanner';
import AIAgentPanel from '../AIAgentPanel';

const ExamBoardDashboard = ({ activeTab, setActiveTab }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="animate-fade-in" style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -40, left: -40, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 10px rgba(168, 85, 247, 0.1)' }}>
                        <ShieldCheck size={28} color="#a855f7" />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', background: 'linear-gradient(135deg, #fff, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, letterSpacing: '-0.5px', textShadow: 'var(--text-shadow-glow)' }}>
                        Exam Infrastructure Control
                    </h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', position: 'relative', zIndex: 1, lineHeight: 1.6, textShadow: 'var(--text-shadow-glow)' }}>
                    Full administrative environment. Manage the student registry, configure examination halls, and execute cryptographic AI seating algorithms.
                </p>
            </header>

            {/* In-page Navigation for Mobile/Alternative flows (Sidebar handles desktop mainly) */}
            <div style={{
                display: 'flex', gap: '0.75rem', marginBottom: '2rem',
                background: 'rgba(0, 0, 0, 0.2)', padding: '0.5rem', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                width: '100%', maxWidth: 'fit-content', flexWrap: 'wrap'
            }}>
                <button
                    className={`btn`}
                    onClick={() => setActiveTab('students')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        background: activeTab === 'students' ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
                        color: activeTab === 'students' ? '#fff' : 'var(--text-dim)',
                        border: `1px solid ${activeTab === 'students' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        boxShadow: activeTab === 'students' ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Users size={18} /> Registry
                </button>
                <button
                    className={`btn`}
                    onClick={() => setActiveTab('rooms')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        background: activeTab === 'rooms' ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
                        color: activeTab === 'rooms' ? '#fff' : '#64748b',
                        border: `1px solid ${activeTab === 'rooms' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        boxShadow: activeTab === 'rooms' ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Building size={18} /> Physical Halls
                </button>
                <button
                    className={`btn`}
                    onClick={() => setActiveTab('planner')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        background: activeTab === 'planner' ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
                        color: activeTab === 'planner' ? '#fff' : '#64748b',
                        border: `1px solid ${activeTab === 'planner' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        boxShadow: activeTab === 'planner' ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <CalendarDays size={18} /> Static Planner
                </button>
                <button
                    className={`btn ${activeTab === 'ai-agent' ? 'glow-pulse' : ''}`}
                    onClick={() => setActiveTab('ai-agent')}
                    style={{
                        padding: '0.6rem 1.5rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        background: activeTab === 'ai-agent' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(124, 58, 237, 0.1)',
                        color: activeTab === 'ai-agent' ? '#fff' : '#a855f7',
                        border: `1px solid ${activeTab === 'ai-agent' ? 'rgba(255,255,255,0.2)' : 'rgba(124, 58, 237, 0.3)'}`,
                        boxShadow: activeTab === 'ai-agent' ? '0 10px 25px rgba(124, 58, 237, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)' : 'none',
                        fontWeight: activeTab === 'ai-agent' ? '600' : '500',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Zap size={18} /> Seating Master AI
                </button>
            </div>

            <div className="animate-fade-in stagger-1" style={{ flex: 1 }}>
                {activeTab === 'students' && <StudentManager />}
                {activeTab === 'rooms' && <RoomManager />}
                {activeTab === 'planner' && <SeatingPlanner />}
                {activeTab === 'ai-agent' && <AIAgentPanel />}
            </div>
        </div>
    );
};

export default ExamBoardDashboard;
