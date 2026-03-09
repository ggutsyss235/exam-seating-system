import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, Download, LayoutGrid, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

const SeatingPlanner = () => {
    const { students, rooms, seatingPlan, setSeatingPlan } = useAppContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const generatePlan = () => {
        setIsGenerating(true);
        setError('');
        setSuccess(false);

        setTimeout(() => {
            try {
                const totalCapacity = rooms.reduce((acc, room) => acc + room.capacity, 0);
                if (students.length === 0) throw new Error("Database empty. Initialize student records first.");
                if (rooms.length === 0) throw new Error("No locations configured. Add routing hubs first.");
                if (students.length > totalCapacity) throw new Error(`Capacity breach. Available: ${totalCapacity}, Required: ${students.length}`);

                // Group students by composite key (Subject + Department/Class)
                const studentsGrouped = {};
                for (const s of students) {
                    const key = `${s.subject}|${s.department || ''}`;
                    if (!studentsGrouped[key]) studentsGrouped[key] = [];
                    studentsGrouped[key].push(s);
                }

                const newPlan = [];

                for (const room of rooms) {
                    const grid = Array(room.rows).fill(null).map(() => Array(room.columns).fill(null));

                    for (let r = 0; r < room.rows; r++) {
                        for (let c = 0; c < room.columns; c++) {
                            // Get available groups (groups that still have students left)
                            const availableGroups = Object.keys(studentsGrouped).filter(k => studentsGrouped[k].length > 0);
                            if (availableGroups.length === 0) break;

                            // Find explicitly 8-direction neighbors' keys to avoid distance conflicts
                            const blockGroups = new Set();
                            const getKey = (s) => `${s.subject}|${s.department || ''}`;

                            // Top, Left, and Diagonals (Top-Left, Top-Right)
                            if (r > 0 && grid[r - 1][c]) blockGroups.add(getKey(grid[r - 1][c]));
                            if (c > 0 && grid[r][c - 1]) blockGroups.add(getKey(grid[r][c - 1]));
                            if (r > 0 && c > 0 && grid[r - 1][c - 1]) blockGroups.add(getKey(grid[r - 1][c - 1]));
                            if (r > 0 && c < room.columns - 1 && grid[r - 1][c + 1]) blockGroups.add(getKey(grid[r - 1][c + 1]));

                            // Sort groups by remaining count (descending) to place large cohorts first
                            availableGroups.sort((a, b) => studentsGrouped[b].length - studentsGrouped[a].length);

                            // Find an academic group that doesn't conflict geographically
                            let selectedGroup = availableGroups.find(g => !blockGroups.has(g));

                            // If all conflict (rare density), force pick the one with most students remaining
                            if (!selectedGroup) {
                                selectedGroup = availableGroups[0];
                            }

                            // Place node in the grid
                            grid[r][c] = studentsGrouped[selectedGroup].pop();
                        }
                    }
                    newPlan.push({ roomDetails: room, grid });
                }

                setSeatingPlan(newPlan);
                setSuccess(true);

                // Keep success message briefly
                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsGenerating(false);
            }
        }, 1200); // Simulate complex algorithmic compute time
    };

    const capacityRatio = Math.min((students.length / Math.max(rooms.reduce((a, r) => a + r.capacity, 0), 1)) * 100, 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* Control Panel */}
            <div className="card glass-panel animate-fade-in stagger-2" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>

                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <LayoutGrid size={24} color="var(--primary)" />
                                <h3 style={{ margin: 0 }}>Allocation Engine</h3>
                            </div>

                            {/* Capacity Visualizer */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Network Capacity</span>
                                    <span style={{ fontWeight: '600', color: capacityRatio > 90 ? 'var(--danger)' : 'var(--secondary)' }}>
                                        {students.length} / {rooms.reduce((a, r) => a + r.capacity, 0)} Nodes
                                    </span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--background)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${capacityRatio}%`,
                                        background: capacityRatio > 90 ? 'var(--danger)' : 'linear-gradient(90deg, var(--secondary), var(--primary))',
                                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}></div>
                                </div>
                            </div>

                            {error && (
                                <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    <AlertTriangle size={18} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="animate-fade-in" style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <CheckCircle2 size={18} />
                                    Allocation sequence successfully generated!
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}>
                            <button
                                className={`btn btn-primary ${isGenerating ? 'generating' : ''}`}
                                onClick={generatePlan}
                                disabled={isGenerating}
                                style={{ padding: '1rem 2rem', fontSize: '1.1rem', letterSpacing: '0.5px' }}
                            >
                                <Play size={20} className={isGenerating ? 'spin' : ''} fill={isGenerating ? "transparent" : "currentColor"} />
                                {isGenerating ? 'Processing...' : 'Run Algorithm'}
                            </button>

                            {seatingPlan && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-ghost" onClick={() => window.print()} style={{ border: '1px solid var(--border)', flex: 1, gap: '0.5rem' }}>
                                        <Download size={18} /> Export (PDF)
                                    </button>
                                    <button className="btn btn-ghost" onClick={() => setSeatingPlan(null)} style={{ border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', padding: '0.5rem 1rem' }} title="Clear Layout">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Render Matrices */}
            {seatingPlan && (
                <div className="animate-fade-in stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {seatingPlan.map((plan, idx) => (
                        <div key={idx} className="card print-break-inside matrix-container" style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px dashed var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '800', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>Location: {plan.roomDetails.roomNumber}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Grid Array: {plan.roomDetails.rows} × {plan.roomDetails.columns}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body" style={{ background: 'var(--background)', overflowX: 'auto', padding: 'clamp(1rem, 5vw, 3rem) clamp(0.5rem, 3vw, 2rem)' }}>
                                <div style={{
                                    display: 'inline-grid',
                                    gap: '1.5rem',
                                    padding: '2.5rem',
                                    background: 'var(--surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)'
                                }}>
                                    {/* Desk Grid */}
                                    {plan.grid.map((row, rIdx) => (
                                        <div key={rIdx} style={{ display: 'flex', gap: '1.5rem' }}>
                                            {row.map((seat, cIdx) => (
                                                <div
                                                    key={cIdx}
                                                    className={`seat-node ${seat ? 'assigned' : 'empty'}`}
                                                    style={{
                                                        width: '140px',
                                                        height: '100px',
                                                        padding: '1rem',
                                                        backgroundColor: seat ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255,255,255,0.02)',
                                                        border: `1px solid ${seat ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)'}`,
                                                        borderRadius: 'var(--radius-lg)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        position: 'relative',
                                                        boxShadow: seat ? '0 8px 30px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,1)' : 'none',
                                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                    }}
                                                >
                                                    {/* Row/Col indicator for empty seats in debug/print mode */}
                                                    {!seat && (
                                                        <span style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '0.6rem', color: 'var(--text-muted)', opacity: 0.3 }}>
                                                            R{rIdx}C{cIdx}
                                                        </span>
                                                    )}

                                                    {seat ? (
                                                        <>
                                                            <div style={{
                                                                position: 'absolute', top: '-6px', right: '-6px',
                                                                width: '14px', height: '14px',
                                                                borderRadius: '50%', background: 'var(--secondary)',
                                                                boxShadow: '0 0 15px var(--secondary)'
                                                            }}></div>
                                                            <div style={{ fontWeight: '900', fontSize: '1.3rem', color: '#0f172a', letterSpacing: '-0.5px', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>{seat.rollNumber}</div>
                                                            <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: '800', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--primary), #a855f7)', padding: '0.2rem 0.75rem', borderRadius: '999px', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                {seat.subject}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Box size={24} color="var(--text-muted)" opacity={0.2} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .spin { animation: spin 2s linear infinite; }
                
                .generating { position: relative; overflow: hidden; pointer-events: none; }
                .generating::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    background-size: 200% 100%; animation: scan 1.5s infinite linear;
                }
                @keyframes scan { 0% { background-position: -100% 0; } 100% { background-position: 200% 0; } }

                .seat-node.assigned:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3) !important; z-index: 10; border-color: #818cf8 !important; }
                
                @media print {
                    .app-container aside { display: none !important; }
                    .app-container .main-content { padding: 0 !important; max-width: 100% !important; background: white !important; }
                    .main-content header, .btn, .glass-panel { display: none !important; }
                    .print-break-inside { page-break-inside: avoid; margin-bottom: 3rem; box-shadow: none !important; border: 1px solid #ccc !important; }
                    body, .app-container { background: white !important; color: black !important; }
                    .matrix-container .card-header, .matrix-container .card-body { background: white !important; }
                    .matrix-container .card-body > div { background: white !important; box-shadow: none !important; padding: 0 !important; }
                    .seat-node { background: white !important; border-color: #ccc !important; box-shadow: none !important; }
                    .seat-node.assigned { border-color: #000 !important; }
                    .seat-node div[style*="var(--text-main)"] { color: black !important; }
                    .seat-node div[style*="var(--primary)"] { color: #333 !important; background: transparent !important; }
                    .seat-node.assigned div:first-child[style*="position: absolute"] { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default SeatingPlanner;
