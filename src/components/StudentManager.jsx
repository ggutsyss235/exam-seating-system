import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, UserPlus, Upload, FileType, Search } from 'lucide-react';
import Papa from 'papaparse';

const StudentManager = () => {
    const { students, addStudent, removeStudent } = useAppContext();

    const [formData, setFormData] = useState({
        rollNumber: '',
        name: '',
        department: '',
        subject: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.rollNumber || !formData.name || !formData.subject) return;

        addStudent(formData);
        setFormData({ rollNumber: '', name: '', department: '', subject: '' });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setUploadError('');
        setUploadSuccess('');

        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const { data, errors } = results;

                if (errors.length > 0) {
                    setUploadError('Error parsing CSV file. Please check the format.');
                    return;
                }

                let addedCount = 0;
                data.forEach(row => {
                    // Check if required fields exist, mapping flexibly
                    const rollNumber = row.rollNumber || row.RollNumber || row.id || row.ID || row['Roll Number'];
                    const name = row.name || row.Name || row['Full Name'];
                    const subject = row.subject || row.Subject || row['Subject Code'];
                    const department = row.department || row.Department || row.Dept || '';

                    if (rollNumber && name && subject) {
                        addStudent({ rollNumber, name, department, subject });
                        addedCount++;
                    }
                });

                if (addedCount > 0) {
                    setUploadSuccess(`Successfully intelligence-mapped ${addedCount} student records.`);
                } else {
                    setUploadError('Data anomaly detected. Ensure CSV contains rollNumber, name, and subject fields.');
                }

                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            error: (err) => {
                setUploadError('System failed to parse file: ' + err.message);
            }
        });
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid-2">
            <div className="card animate-fade-in stagger-2">
                <div className="card-header">
                    <h3>Register Student</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Identifier (Roll Number)</label>
                            <input
                                type="text"
                                name="rollNumber"
                                className="form-input"
                                placeholder="e.g. CS-2024-X1"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="e.g. Alex Chen"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department / Cohort</label>
                            <input
                                type="text"
                                name="department"
                                className="form-input"
                                placeholder="e.g. Engineering"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject Code</label>
                            <input
                                type="text"
                                name="subject"
                                className="form-input"
                                placeholder="e.g. PHY-101"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            <UserPlus size={18} /> Register Manually
                        </button>
                    </form>
                </div>
            </div>

            <div className="card animate-fade-in stagger-3">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Database <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>{students.length}</span>
                    </h3>
                    <div>
                        <input
                            type="file"
                            accept=".csv"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ fontSize: '0.85rem' }}
                        >
                            <Upload size={16} /> Bulk Init (CSV)
                        </button>
                    </div>
                </div>

                {uploadError && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.9rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }}></div>
                        {uploadError}
                    </div>
                )}
                {uploadSuccess && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', fontSize: '0.9rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                        {uploadSuccess}
                    </div>
                )}

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '600px' }}>

                    {students.length > 0 && (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search registry..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '2.5rem', background: 'var(--background)' }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="table-responsive" style={{ flex: 1, paddingRight: '0.5rem' }}>
                        {students.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: '50%' }}>
                                    <FileType size={48} color="var(--primary)" opacity={0.5} />
                                </div>
                                <h4>No Records Found</h4>
                                <p style={{ fontSize: '0.9rem', maxWidth: '300px', opacity: 0.7 }}>
                                    Initialize the database by adding records manually or importing a systemic CSV file format.
                                </p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {filteredStudents.map((student) => (
                                    <div key={student.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '1rem 1.25rem',
                                        background: 'var(--background)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        transition: 'all 0.2s ease',
                                        flexWrap: 'wrap',
                                        gap: '0.75rem'
                                    }}
                                        className="student-row"
                                    >
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{student.name} <span style={{ opacity: 0.5, fontWeight: '400', marginLeft: '0.5rem' }}>#{student.rollNumber}</span></div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', marginTop: '0.2rem' }}>
                                                {student.subject} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>• {student.department}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => removeStudent(student.id)} className="btn btn-ghost" style={{ padding: '0.6rem', color: 'var(--danger)' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .student-row:hover { border-color: var(--primary-light); transform: translateX(4px); box-shadow: -4px 0 0 var(--primary); }
            `}</style>
        </div>
    );
};

export default StudentManager;
