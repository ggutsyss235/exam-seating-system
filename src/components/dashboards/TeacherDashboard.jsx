import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Briefcase, CalendarDays, UserSquare2 } from 'lucide-react';

const TeacherDashboard = ({ activeTab, setActiveTab }) => {
    const { user, seatingPlan } = useAppContext();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="animate-fade-in" style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -40, left: -40, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 10px rgba(168, 85, 247, 0.1)' }}>
                        <Briefcase size={28} color="#a855f7" />
                    </div>
                    <h2 className="dash-title" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', lineHeight: 1 }}>
                        Subject Operations
                    </h2>
                </div>
                <p className="dash-body" style={{ fontSize: '1.05rem', maxWidth: '650px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
                    Welcome back, <span style={{ color: '#fff', fontWeight: 600 }}>{user.name}</span>. Access the <span className="badge badge-violet" style={{ verticalAlign: 'middle', marginTop: '-3px' }}>{user.subject} - {user.level}</span> subject portal and review invigilation seating matrices.
                </p>
            </header>

            <div style={{
                display: 'flex', gap: '0.75rem', marginBottom: '2rem',
                background: 'rgba(0, 0, 0, 0.2)', padding: '0.5rem', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                width: '100%', maxWidth: 'fit-content', flexWrap: 'wrap'
            }}>
                <button
                    className={`btn ${activeTab === 'profile' ? 'btn-liquid-secondary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('profile')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <UserSquare2 size={18} /> Credentials
                </button>
                <button
                    className={`btn ${activeTab === 'seatplan' ? 'btn-liquid-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('seatplan')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <CalendarDays size={18} /> Invigilation Matrices
                </button>
            </div>

            <div className="animate-fade-in stagger-1" style={{ flex: 1, position: 'relative', zIndex: 1 }}>

                {activeTab === 'profile' && (
                    <div className="card glass-panel padding-lg" style={{ maxWidth: '500px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{user.name}</h3>
                                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{user.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Role</p>
                                <p style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.role}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Department</p>
                                <p style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.subject}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Level</p>
                                <p style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.level}</p>
                            </div>
                            {user.isExamDept && (
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Clearance</p>
                                    <p style={{ fontWeight: '500', color: 'var(--secondary)' }}>Exam Board Member</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'seatplan' && (
                    <div className="card glass-panel padding-lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <CalendarDays size={20} className="text-secondary" />
                                <h3 className="dash-subtitle">Examination Layout</h3>
                            </div>
                            <span className="badge badge-cyan">Universal Access</span>
                        </div>

                        {!seatingPlan ? (
                            <div className="empty-state">
                                <p style={{ color: 'var(--text-muted)' }}>The Exam Board has not generated a layout yet.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <div className="seating-plan-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 'max-content' }}>
                                    {seatingPlan.map((roomPlan, index) => (
                                        <div key={index} style={{ background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Room: {roomPlan.roomNumber}</span>
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {roomPlan.grid.map((row, rIdx) => (
                                                    <div key={rIdx} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        {row.map((student, cIdx) => (
                                                            <div key={`${rIdx}-${cIdx}`}
                                                                style={{
                                                                    width: '80px', height: '60px',
                                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                                    background: student ? 'var(--surface)' : 'rgba(255,255,255,0.02)',
                                                                    border: student ? '1px solid var(--border)' : '1px dashed var(--border)',
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    fontSize: '0.75rem',
                                                                    opacity: student ? 1 : 0.5,
                                                                    boxShadow: student ? 'var(--shadow-sm)' : 'none'
                                                                }}
                                                            >
                                                                {student ? (
                                                                    <>
                                                                        <span style={{ fontWeight: '600', color: 'var(--primary)', marginBottom: '4px' }}>{student.rollNumber}</span>
                                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', padding: '0 4px' }}>{student.subject}</span>
                                                                    </>
                                                                ) : (
                                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>-</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
