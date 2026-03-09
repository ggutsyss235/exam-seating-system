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
                    <h3 style={{ fontSize: '1.4rem' }}>Configure Location</h3>
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
                            background: 'var(--background)',
                            border: '1px dashed var(--border)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Calculated Nodes</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>
                                    {(parseInt(formData.rows) || 0) * (parseInt(formData.columns) || 0)}
                                </div>
                            </div>
                            <Box size={32} color="var(--primary)" opacity={0.2} />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            <Plus size={18} /> Initialize Location
                        </button>
                    </form>
                </div>
            </div>

            <div className="card glass-panel animate-fade-in stagger-3" style={{ borderTop: '4px solid var(--secondary)' }}>
                <div className="card-header" style={{ background: 'transparent' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
                        Active Locations
                        <span style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '800' }}>
                            {rooms.length}
                        </span>
                    </h3>
                </div>
                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {rooms.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div className="animate-float" style={{ background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: '50%' }}>
                                <Box size={48} color="var(--secondary)" opacity={0.5} />
                            </div>
                            <h4>No Locations Configured</h4>
                            <p style={{ fontSize: '0.9rem', maxWidth: '300px', opacity: 0.7 }}>
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
                                    <div style={{ marginLeft: '0.5rem' }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-main)', letterSpacing: '-0.5px', textShadow: 'var(--text-shadow-glow)' }}>{room.roomNumber}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', gap: '1.5rem', fontWeight: '500' }}>
                                            <span>Capacity: <strong style={{ color: 'var(--secondary)', fontWeight: '800' }}>{room.capacity}</strong></span>
                                            <span style={{ color: 'var(--text-dim)' }}>Grid: {room.rows} × {room.columns}</span>
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
