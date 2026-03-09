import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Plus, Box } from 'lucide-react';

const RoomManager = () => {
    const { rooms, addRoom, removeRoom } = useAppContext();

    const [formData, setFormData] = useState({
        roomNumber: '',
        rows: '',
        columns: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const rows = parseInt(formData.rows);
        const columns = parseInt(formData.columns);

        if (!formData.roomNumber || isNaN(rows) || isNaN(columns) || rows <= 0 || columns <= 0) return;

        addRoom({
            roomNumber: formData.roomNumber,
            rows,
            columns,
            capacity: rows * columns
        });

        setFormData({ roomNumber: '', rows: '', columns: '' });
    };

    return (
        <div className="grid-2">
            <div className="card glass-panel animate-fade-in stagger-2" style={{ borderTop: '4px solid var(--primary)' }}>
                <div className="card-header" style={{ background: 'transparent' }}>
                    <div>
                        <p className="dash-label" style={{ marginBottom: '0.35rem' }}>Planning</p>
                        <h3 className="dash-subtitle">Configure Location</h3>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Location Identifier</label>
                            <input
                                type="text"
                                name="roomNumber"
                                className="form-input"
                                placeholder="e.g. Sector-7 Hall"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid-2" style={{ marginBottom: '1.5rem', gap: '1.5rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Grid Rows</label>
                                <input
                                    type="number"
                                    name="rows"
                                    className="form-input"
                                    placeholder="e.g. 10"
                                    min="1"
                                    value={formData.rows}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Grid Columns</label>
                                <input
                                    type="number"
                                    name="columns"
                                    className="form-input"
                                    placeholder="e.g. 8"
                                    min="1"
                                    value={formData.columns}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(14, 165, 233, 0.05)',
                            border: '1px dashed var(--secondary-light)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                        }}>
                            <div>
                                <p className="dash-label" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Total Grid Nodes</p>
                                <div className="dash-stat-cyan">
                                    {(parseInt(formData.rows) || 0) * (parseInt(formData.columns) || 0)}
                                </div>
                            </div>
                            <Box size={32} color="var(--secondary)" style={{ opacity: 0.3 }} />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            <Plus size={18} /> Initialize Location
                        </button>
                    </form>
                </div>
            </div>

            <div className="card glass-panel animate-fade-in stagger-3" style={{ borderTop: '4px solid var(--secondary)' }}>
                <div className="card-header" style={{ background: 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div>
                            <p className="dash-label" style={{ marginBottom: '0.35rem' }}>Infrastructure</p>
                            <h3 className="dash-subtitle">Active Locations</h3>
                        </div>
                        <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                            {rooms.length}
                        </span>
                    </div>
                </div>
                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {rooms.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div className="animate-float" style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '1.5rem', borderRadius: '50%', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                <Box size={48} color="var(--secondary)" opacity={0.6} />
                            </div>
                            <p className="dash-subtitle">No Locations Configured</p>
                            <p className="dash-body" style={{ maxWidth: '300px', textAlign: 'center' }}>
                                Add examination halls and their grid dimensions to enable the routing algorithm.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '0.5rem' }}>
                            {rooms.map((room) => (
                                <div key={room.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1.25rem',
                                    background: 'var(--background)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all 0.2s ease',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    className="room-row"
                                >
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--secondary)' }}></div>
                                    <div style={{ marginLeft: '1rem' }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#f1f5f9', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{room.roomNumber}</div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', alignItems: 'center' }}>
                                            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{room.capacity} Nodes</span>
                                            <span className="dash-muted" style={{ fontSize: '0.75rem' }}>GRID {room.rows} × {room.columns}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeRoom(room.id)} className="btn btn-ghost" style={{ padding: '0.6rem', color: 'var(--danger)' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .room-row:hover { border-color: var(--secondary-light); transform: scale(1.02); box-shadow: var(--shadow-md); }
            `}</style>
        </div>
    );
};

export default RoomManager;
