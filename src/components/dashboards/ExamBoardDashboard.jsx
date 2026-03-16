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
                    <h2 className="dash-title" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', lineHeight: 1 }}>
                        Infrastructure Control
                    </h2>
                </div>
                <p className="dash-body" style={{ fontSize: '1.05rem', maxWidth: '650px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
                    Full administrative governance. Manage the student registry, configure physical examination halls, and execute cryptographic AI seating algorithms across the terminal.
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
                    className={`btn ${activeTab === 'students' ? 'btn-liquid-secondary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('students')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Users size={18} /> Registry
                </button>
                <button
                    className={`btn ${activeTab === 'rooms' ? 'btn-liquid-secondary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('rooms')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Building size={18} /> Physical Halls
                </button>
                <button
                    className={`btn ${activeTab === 'planner' ? 'btn-liquid-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('planner')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <CalendarDays size={18} /> Static Planner
                </button>
                <button
                    className={`btn ${activeTab === 'ai-agent' ? 'btn-liquid' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('ai-agent')}
                    style={{
                        padding: '0.6rem 1.5rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
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
