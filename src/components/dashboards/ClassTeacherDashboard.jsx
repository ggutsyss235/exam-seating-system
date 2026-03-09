import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GraduationCap, Users, CalendarDays, BookOpen } from 'lucide-react';

const ClassTeacherDashboard = ({ activeTab, setActiveTab }) => {
    const { user, students, seatingPlan } = useAppContext();

    // The class teacher theoretically only cares about their own students
    // If our student database had 'class' columns, we'd filter here. 
    // For now we'll just show the total overview as "read-only".
    const myStudentsCount = students.length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="animate-fade-in" style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -40, left: -40, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15), transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '12px', boxShadow: '0 0 20px rgba(14, 165, 233, 0.2), inset 0 0 10px rgba(14, 165, 233, 0.1)' }}>
                        <GraduationCap size={28} color="#0ea5e9" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, letterSpacing: '-0.5px' }}>
                        Class Operations
                    </h2>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '650px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
                    Welcome back, <span style={{ color: '#fff', fontWeight: 600 }}>{user.name}</span>. Access your securely assigned roster (Class <span style={{ color: '#fff', fontWeight: 600 }}>{user.assignClass}-{user.assignSection}</span>) and review the generated cryptographic seating plans.
                </p>
            </header>

            <div style={{
                display: 'flex', gap: '0.75rem', marginBottom: '2rem',
                background: 'rgba(0, 0, 0, 0.2)', padding: '0.5rem', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                width: 'fit-content'
            }}>
                <button
                    className={`btn`}
                    onClick={() => setActiveTab('overview')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        background: activeTab === 'overview' ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
                        color: activeTab === 'overview' ? '#fff' : '#64748b',
                        border: `1px solid ${activeTab === 'overview' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        boxShadow: activeTab === 'overview' ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <BookOpen size={18} /> Class Roster
                </button>
                <button
                    className={`btn`}
                    onClick={() => setActiveTab('seatplan')}
                    style={{
                        padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '0.5rem', borderRadius: '12px',
                        background: activeTab === 'seatplan' ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
                        color: activeTab === 'seatplan' ? '#fff' : '#64748b',
                        border: `1px solid ${activeTab === 'seatplan' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        boxShadow: activeTab === 'seatplan' ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <CalendarDays size={18} /> Seating Matrices
                </button>
            </div>

            <div className="animate-fade-in stagger-1" style={{ flex: 1, position: 'relative', zIndex: 1 }}>

                {activeTab === 'overview' && (
                    <div className="card glass-panel padding-lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} className="text-primary" /> Student Directory</h3>
                            <div className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>Read Only Access</div>
                        </div>

                        {students.length === 0 ? (
                            <div className="empty-state">
                                <p style={{ color: 'var(--text-muted)' }}>The Exam Board has not uploaded the student manifest yet.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Roll Number</th>
                                            <th>Name</th>
                                            <th>Department</th>
                                            <th>Subject</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.id}>
                                                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{student.rollNumber}</td>
                                                <td style={{ fontWeight: '500' }}>{student.name}</td>
                                                <td><span className="badge">{student.department}</span></td>
                                                <td>{student.subject}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'seatplan' && (
                    <div className="card glass-panel padding-lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalendarDays size={20} className="text-secondary" /> Active Examination Layout</h3>
                            <div className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>Read Only Access</div>
                        </div>

                        {!seatingPlan ? (
                            <div className="empty-state">
                                <p style={{ color: 'var(--text-muted)' }}>The Exam Board has not generated a layout yet.</p>
                            </div>
                        ) : (
                            <div className="seating-plan-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {seatingPlan.map((roomPlan, index) => (
                                    <div key={index} style={{ background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Room: {roomPlan.roomNumber}</span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                                                {roomPlan.grid.length} Rows &times; {roomPlan.grid[0]?.length || 0} Cols
                                            </span>
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
                                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Empty</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassTeacherDashboard;
