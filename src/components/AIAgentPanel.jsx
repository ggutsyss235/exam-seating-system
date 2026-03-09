import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bot, User, Sparkles, Send, Box, CheckCircle2, Download, Trash2 } from 'lucide-react';
import axios from 'axios';

const AIAgentPanel = () => {
    const { seatingPlan, setSeatingPlan, user } = useAppContext();
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Greetings! I am your Seating Master AI. I will ask you 7 specific parameters to calculate the optimal matrix. \n\nShall we begin? (Type 'Start' to begin. Mid-conversation, type 'Back' to trace back a step, or 'Reset' to start over)." }
    ]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // 7-Step Wizard State Machine
    const [step, setStep] = useState(0);
    const [params, setParams] = useState({
        roomNumber: '',
        verticalRows: '',
        seatsPerRow: '',
        studentsPerSeat: '',
        classes: '',
        classDetails: '',
        rollRanges: '',
        customConstraints: ''
    });

    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating, seatingPlan]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isGenerating) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);

        let nextStep = step + 1;
        let p = { ...params };

        const lowerInput = userText.toLowerCase();

        // Handle Restart
        if (lowerInput === 'reset' || lowerInput === 'start over') {
            setMessages(prev => [...prev, { role: 'ai', text: "Memory wiped. Let's start over. What is the Room Number?" }]);
            setStep(1);
            setSeatingPlan(null);
            return;
        }

        // Handle Backtracking / Traceback
        if (['back', 'previous', 'go back', 'trace back', 'traceback'].includes(lowerInput)) {
            if (step <= 1) {
                setMessages(prev => [...prev, { role: 'ai', text: "We are at the beginning. What is the Room Number?" }]);
                return;
            }
            const prevStep = step > 8 ? 7 : step - 1;
            setStep(prevStep);

            const backtrackMsg = {
                1: "Tracing back. What is the Room Number?",
                2: `Tracing back. Room Number is currently set to '${p.roomNumber}'. How many vertical rows are in this room?`,
                3: `Tracing back. Vertical rows set to '${p.verticalRows}'. How many seats are in each vertical row?`,
                4: `Tracing back. Seats per row set to '${p.seatsPerRow}'. How many students will sit on each seat?`,
                5: `Tracing back. Students per seat set to '${p.studentsPerSeat}'. What classes/levels will be seated?`,
                6: `Tracing back. Classes set to '${p.classes}'. For each class, what is the exact Subject and number of Question Paper Sets?`,
                7: `Tracing back. Class details set to '${p.classDetails}'. What is the range of roll numbers for each class?`
            };
            setMessages(prev => [...prev, { role: 'ai', text: backtrackMsg[prevStep] }]);
            return;
        }

        // Mid-step dynamic corrections (heuristics)
        if (step > 1 && step < 8 && (lowerInput.includes('change ') || lowerInput.includes('actually') || lowerInput.includes('update '))) {
            setMessages(prev => [...prev, { role: 'ai', text: `It looks like you want to change a previous parameter in the middle of our flow. Please explicitly type 'Back' to trace back to the relevant step, or 'Reset' to wipe memory.` }]);
            return;
        }

        // State Machine Flow
        if (step === 0) {
            setMessages(prev => [...prev, { role: 'ai', text: "Excellent! Let's start. What is the Room Number? (Remember, you can type 'Back' at any time to fix a mistake)." }]);
            setStep(1);
            return;
        } else if (step === 1) {
            p.roomNumber = userText;
            setMessages(prev => [...prev, { role: 'ai', text: `✅ Got it. Room ${userText}. How many vertical rows are in this room?` }]);
        } else if (step === 2) {
            p.verticalRows = userText;
            setMessages(prev => [...prev, { role: 'ai', text: `${userText} vertical rows. Next, how many seats are in each vertical row?` }]);
        } else if (step === 3) {
            p.seatsPerRow = userText;
            setMessages(prev => [...prev, { role: 'ai', text: `Understood. How many students will sit on each seat? (e.g., 1 or 2)` }]);
        } else if (step === 4) {
            p.studentsPerSeat = userText;
            setMessages(prev => [...prev, { role: 'ai', text: `Noted. What classes/levels will be seated in this room? (e.g., "Class 10 Section A and B" or "10th and 12th")` }]);
        } else if (step === 5) {
            p.classes = userText;
            setMessages(prev => [...prev, { role: 'ai', text: `Understood. For each class, please specify the exact Subject and the number of Question Paper Sets. (e.g., "10A: Mathematics (2 sets), 10B: Science (3 sets)")` }]);
        } else if (step === 6) {
            p.classDetails = userText;
            setMessages(prev => [...prev, { role: 'ai', text: `Great. Finally, what is the range of roll numbers for each class? (e.g., "1-30 for 10A, 31-60 for 10B")` }]);
        } else if (step === 7) {
            p.rollRanges = userText;
            setParams(p);
            setStep(8); // Generation State
            generatePlan(p);
            return;
        } else if (step === 8 || step === 9) {
            // Step 8 is post-generation refinement or error retry
            if (['yes', 'satisfied', 'perfect', 'looks good', 'ok', 'lock', 'done'].includes(userText.toLowerCase())) {
                setMessages(prev => [...prev, { role: 'ai', text: `Excellent. The matrix is permanently locked and ready for deployment. You can export the document below.` }]);
                setStep(9); // Locked state
                return;
            } else {
                // If the user isn't satisfied and didn't type reset/yes, assume it's a constraint update
                p.customConstraints = (p.customConstraints ? p.customConstraints + " AND " : "") + userText;
                setParams(p);
                setMessages(prev => [...prev, { role: 'ai', text: `Understood. I'm injecting the new constraint: "${userText}". Recalculating matrix...` }]);
                generatePlan(p);
                return;
            }
        }

        setParams(p);
        setStep(nextStep);
    };

    const generatePlan = async (finalParams) => {
        setIsGenerating(true);
        try {
            const response = await axios.post('http://localhost:5000/api/ai/generate', finalParams, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (response.data.seatingPlan) {
                setSeatingPlan(response.data.seatingPlan);
                setMessages(prev => [...prev, { role: 'ai', text: `Calculations complete! I have generated the mathematical matrix tailored exclusively to "${finalParams.roomNumber}". \n\nAre you satisfied with this specific arrangement? If not, please tell me exactly what changes you'd like (e.g., 'Move Section A to the front' or 'Disperse Class 10 more'). Type 'Yes' to lock it, or 'Reset' to start entirely over.` }]);
                setStep(8); // Wait for refinement or lock
            } else {
                throw new Error("Invalid format from AI Engine.");
            }
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg = error.response?.data?.error || "A fatal error occurred in my logic circuits while computing the matrix.";
            setMessages(prev => [...prev, { role: 'ai', text: `⚠️ Error: ${errorMsg}. You can type anything to try generating again, or 'Reset' to start over.` }]);
            setStep(8); // Keep at retry step
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="grid-2">
                {/* Chat Interface */}
                <div className="card glass-panel animate-fade-in stagger-1 glow-border" style={{ display: 'flex', flexDirection: 'column', height: '600px', gridColumn: seatingPlan ? '1 / -1' : 'span 1' }}>
                    <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 2rem', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '8px', borderRadius: '50%', boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)' }}>
                            <Bot size={28} color="white" />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
                            <span style={{ background: 'linear-gradient(to right, var(--text-main), var(--text-muted))', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Seating Master AI</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '10px', fontWeight: '800' }}>{step > 0 && `STEP ${step} OF 7`}</span>
                        </h3>
                    </div>

                    <div className="card-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'flex-start',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                            }}>
                                <div style={{
                                    background: msg.role === 'ai' ? 'var(--primary-light)' : 'var(--surface-hover)',
                                    color: msg.role === 'ai' ? 'var(--primary)' : 'var(--text-muted)',
                                    padding: '0.6rem',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {msg.role === 'ai' ? <Sparkles size={18} /> : <User size={18} />}
                                </div>
                                <div style={{
                                    background: msg.role === 'ai' ? 'var(--surface)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    color: msg.role === 'ai' ? 'var(--text-main)' : '#fff',
                                    padding: '1rem 1.25rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: msg.role === 'ai' ? '1px solid var(--border)' : 'none',
                                    maxWidth: '80%',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem',
                                    boxShadow: msg.role === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isGenerating && (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', color: 'white', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)' }}>
                                    <Sparkles size={18} className="pulse-icon" />
                                </div>
                                <div style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(124, 58, 237, 0.3)', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#fff', fontWeight: '600' }}>
                                    Formulating optimized spatial matrix...
                                    <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--background)', borderTop: '1px solid var(--border)' }}>
                        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Type your response here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isGenerating}
                                style={{ flex: 1, background: 'var(--surface)', borderColor: 'var(--border)' }}
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary" disabled={isGenerating || !input.trim()} style={{ width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                <Send size={20} style={{ marginLeft: '4px' }} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Render Matrices if Available */}
            {seatingPlan && (
                <div className="animate-fade-in stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                            <CheckCircle2 size={24} color="var(--secondary)" />
                            Generated Seating Matrix for Room {params.roomNumber}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => setSeatingPlan(null)} style={{ gap: '0.5rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                                <Trash2 size={18} /> Clear Layout
                            </button>
                            <button className="btn btn-outline" onClick={() => window.print()} style={{ gap: '0.5rem' }}>
                                <Download size={18} /> Export Document (PDF)
                            </button>
                        </div>
                    </div>

                    {seatingPlan.map((plan, idx) => (
                        <div key={idx} className="card print-break-inside matrix-container" style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px dashed var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '800', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                        <Box size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>Location: {plan.roomDetails.roomNumber}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Grid Array: {plan.roomDetails.rows} Seats/Col × {plan.roomDetails.columns} Vertical Rows
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body" style={{ background: 'var(--background)', overflowX: 'auto', padding: '3rem 2rem' }}>
                                <div style={{
                                    display: 'inline-grid',
                                    gap: '1.5rem',
                                    padding: '2rem',
                                    background: 'var(--surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                                }}>
                                    {plan.grid.map((row, rIdx) => (
                                        <div key={rIdx} style={{ display: 'flex', gap: '1.5rem' }}>
                                            {row.map((seatStudents, cIdx) => (
                                                <div
                                                    key={cIdx}
                                                    className={`seat-node ${seatStudents && seatStudents.length > 0 ? 'assigned' : 'empty'}`}
                                                    style={{
                                                        minWidth: '200px',
                                                        minHeight: '110px',
                                                        padding: '1.5rem 1rem',
                                                        backgroundColor: seatStudents && seatStudents.length > 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255,255,255,0.02)',
                                                        border: `1px solid ${seatStudents && seatStudents.length > 0 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.03)'}`,
                                                        borderRadius: 'var(--radius-lg)',
                                                        backdropFilter: 'blur(20px)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: 'relative',
                                                        boxShadow: seatStudents && seatStudents.length > 0 ? '0 8px 30px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,1)' : 'none',
                                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                    }}
                                                >
                                                    {(!seatStudents || seatStudents.length === 0) && (
                                                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.15, fontWeight: '600', letterSpacing: '1px' }}>
                                                            R{rIdx + 1} • C{cIdx + 1}
                                                        </span>
                                                    )}

                                                    {seatStudents && seatStudents.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', width: '100%', justifyContent: 'center', alignItems: 'stretch' }}>
                                                            {seatStudents.map((s, sIdx) => (
                                                                <React.Fragment key={sIdx}>
                                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                                        <div style={{ textAlign: 'center' }}>
                                                                            <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: '1.1', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
                                                                                {s.rollNumber}
                                                                            </div>
                                                                            <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: '700', marginTop: '0.2rem', letterSpacing: '0.02em' }}>
                                                                                {s.className}
                                                                            </div>
                                                                        </div>

                                                                        <div style={{
                                                                            fontSize: '0.75rem',
                                                                            color: 'white',
                                                                            fontWeight: '800',
                                                                            textTransform: 'uppercase',
                                                                            letterSpacing: '0.5px',
                                                                            background: s.set ? 'linear-gradient(135deg, var(--secondary), #0369a1)' : 'linear-gradient(135deg, var(--primary), #5b21b6)',
                                                                            padding: '0.35rem 0.75rem',
                                                                            borderRadius: '999px',
                                                                            boxShadow: s.set ? '0 2px 8px rgba(14, 165, 233, 0.4)' : '0 2px 8px rgba(139, 92, 246, 0.4)'
                                                                        }}>
                                                                            {s.subject} {s.set ? `| ${s.set}` : ''}
                                                                        </div>
                                                                    </div>
                                                                    {/* Divider if multiple students share a seat */}
                                                                    {sIdx < seatStudents.length - 1 && (
                                                                        <div style={{ width: '2px', background: 'rgba(0,0,0,0.1)', margin: '0 0.5rem', borderRadius: '2px' }}></div>
                                                                    )}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    ) : null}
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
                .pulse-icon { animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
                .loading-dots span { animation: blink 1.4s infinite both; font-size: 1.2rem; line-height: 1; }
                .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
                .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }

                .seat-node.assigned:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3) !important; z-index: 10; border-color: #818cf8 !important; }
                
                @media print {
                    .app-container aside { display: none !important; }
                    .app-container .main-content { padding: 0 !important; max-width: 100% !important; background: white !important; }
                    .main-content header, .btn, .glass-panel, .grid-2 { display: none !important; }
                    .print-break-inside { page-break-inside: avoid; margin-bottom: 3rem; box-shadow: none !important; border: 1px solid #ccc !important; }
                    body, .app-container { background: white !important; color: black !important; }
                    .matrix-container .card-header, .matrix-container .card-body { background: white !important; }
                    .matrix-container .card-body > div { background: white !important; box-shadow: none !important; padding: 0 !important; }
                    .seat-node { background: white !important; border-color: #ccc !important; box-shadow: none !important; }
                    .seat-node.assigned { border-color: #000 !important; }
                    .seat-node div[style*="var(--text-main)"] { color: black !important; }
                    .seat-node div[style*="var(--primary)"], .seat-node div[style*="var(--secondary)"] { color: #333 !important; background: transparent !important; }
                }
            `}</style>
        </div>
    );
};

export default AIAgentPanel;
