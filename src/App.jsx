import React, { useState, useEffect } from 'react';
import { ShieldCheck, GraduationCap, Briefcase, Zap, LogOut } from 'lucide-react';
import { useAppContext } from './context/AppContext';

// Import Dashboards
import ExamBoardDashboard from './components/dashboards/ExamBoardDashboard';
import ClassTeacherDashboard from './components/dashboards/ClassTeacherDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import AnimatedLogo from './components/AnimatedLogo';

function App() {
  const { logout, user } = useAppContext();

  // Dynamic tabs based on user role
  const getInitialTab = () => {
    if (user?.role === 'Exam Board Official' || user?.isExamDept === true) return 'students';
    if (user?.role === 'Class Teacher') return 'overview';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // 3D Parallax State for Dashboard
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Reset tab if the user logs in as someone else without unmounting App
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [user]);

  // Subtle global mouse tracking for the dashboard layout
  const handleMouseMove = (e) => {
    if (!isHovering) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    // Extremely subtle tilt for the dashboard (max ~2 degrees)
    const rotX = ((e.clientY - centerY) / centerY) * -1.5;
    const rotY = ((e.clientX - centerX) / centerX) * 1.5;
    setMousePos({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Render correct dashboard
  const renderDashboard = () => {
    // If they explicitly marked themselves as Exam Dept, or their role is Exam Board Official, give them full access
    if (user?.role === 'Exam Board Official' || user?.isExamDept === true) {
      return <ExamBoardDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    if (user?.role === 'Class Teacher') {
      return <ClassTeacherDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    // Default Fallback
    return <TeacherDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
  };

  return (
    <div
      className="app-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '2000px', // Very deep perspective for subtle dashboard warping
        backgroundColor: '#0a0a0c', // Darker, secure theme base
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Subtle Orbital Background (Examination Theme) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.05) 0%, transparent 60%)', filter: 'blur(80px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.03) 0%, transparent 60%)', filter: 'blur(80px)' }}></div>
        {/* Examination "Data Grid" overlay */}
        <div style={{ position: 'absolute', inset: -50, backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'linear-gradient(to bottom, black, transparent)', transform: `translate(${mousePos.y * -0.5}px, ${mousePos.x * 0.5}px)`, transition: isHovering ? 'none' : 'transform 1s ease' }}></div>
      </div>

      {/* Global Dashboard 3D Shell */}
      <div
        className="dashboard-shell"
        style={{
          transform: `rotateX(${mousePos.x}deg) rotateY(${mousePos.y}deg)`,
          transition: isHovering ? 'transform 0.1s ease-out' : 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Sidebar Navigation */}
        <aside className="sidebar" style={{ transform: 'translateZ(10px)', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95))', borderRight: '1px solid rgba(255,255,255,0.05)', boxShadow: '5px 0 25px rgba(0,0,0,0.5)' }}>
          <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2rem', fontWeight: '950', letterSpacing: '-2.5px',
              margin: 0, background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }}>
              SeatPro<span style={{ color: 'var(--secondary)', WebkitTextFillColor: 'var(--secondary)', textShadow: 'var(--text-shadow-neon)' }}>X</span>
            </h1>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* Exam Board Nav */}
            {(user?.role === 'Exam Board Official' || user?.isExamDept) && (
              <button
                className={`btn ${['students', 'rooms', 'planner', 'ai-agent'].includes(activeTab) ? 'btn-ghost active' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', position: 'relative', overflow: 'hidden' }}
                onClick={() => setActiveTab('students')}
              >
                <ShieldCheck size={20} className={['students', 'rooms', 'planner', 'ai-agent'].includes(activeTab) ? 'active-icon' : ''} />
                <span style={{ position: 'relative', zIndex: 1 }}>Exam Infrastructure</span>
              </button>
            )}

            {/* Class Teacher Nav */}
            {user?.role === 'Class Teacher' && !user?.isExamDept && (
              <button
                className={`btn ${['overview', 'seatplan'].includes(activeTab) ? 'btn-ghost active' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => setActiveTab('overview')}
              >
                <GraduationCap size={20} className={['overview', 'seatplan'].includes(activeTab) ? 'active-icon' : ''} />
                Class Overview
              </button>
            )}

            {/* Teacher Nav */}
            {(user?.role === 'Teacher' && !user?.isExamDept) && (
              <button
                className={`btn ${['profile', 'seatplan'].includes(activeTab) ? 'btn-ghost active' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => setActiveTab('profile')}
              >
                <Briefcase size={20} className={['profile', 'seatplan'].includes(activeTab) ? 'active-icon' : ''} />
                Subject Teacher Dashboard
              </button>
            )}

          </nav>

          <div className="nav-profile-block" style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.06)', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(139,92,246,0.15)', display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(203,213,225,0.6)', fontWeight: '500', letterSpacing: '0.01em' }}>Identified as</span>
              <span style={{ fontWeight: '800', color: '#f1f5f9', fontSize: '1rem', letterSpacing: '-0.02em' }}>{user?.name?.split(' ')[0]}</span>
              <span className="badge badge-violet" style={{ marginTop: '0.2rem' }}>{user?.role}</span>
            </div>
            <button
              onClick={logout}
              className="btn btn-ghost"
              style={{ justifyContent: 'center', color: '#ff4d4d', fontWeight: 'bold', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <LogOut size={18} />
              <span className="hide-mobile" style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>Terminate Session</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          <div className="dashboard-content-wrapper">
            {renderDashboard()}
          </div>
        </main>
      </div>

      <style>{`
        .active-icon { color: var(--primary); filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.5)); }
        .btn-ghost.active { background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.3); }
      `}</style>
    </div>
  );
}

export default App;
