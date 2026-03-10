import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const router = express.Router();

let aiClient;
try {
    if (process.env.GEMINI_API_KEY) {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log("✅ Google GenAI SDK Initialized");
    } else {
        console.warn("⚠️ No GEMINI_API_KEY found. AI routes will be disabled.");
    }
} catch (error) {
    console.error("❌ Failed to initialize Google GenAI SDK:", error.message);
}

// @route   POST /api/ai/generate
// @desc    Takes explicit conversational wizard constraints and generates a matrix for a single room.
// @access  Public
router.post('/generate', async (req, res) => {
    if (!aiClient) {
        return res.status(503).json({ error: "AI Service is not configured or offline." });
    }

    const { roomNumber, verticalRows, seatsPerRow, studentsPerSeat, classes, classDetails, rollRanges, customConstraints } = req.body;

    if (!roomNumber || !verticalRows || !seatsPerRow) {
        return res.status(400).json({ error: "Missing required critical dimensions for the room." });
    }

    try {
        const systemInstruction = `
        You are an elite Examination Seating Arrangement engine.
        You will create a precision 2D seating matrix for a SINGLE physical examination room based exclusively on the constraints I pass in.

        Environment Constraints:
        - "Room Number": ${roomNumber}
        - Physical layout involves Columns (which are the "vertical rows", there are ${verticalRows} of them).
        - Each column has Rows (which are the "seats per vertical row", there are ${seatsPerRow} of them).
        - Maximum students that can physically sit on ONE seat: ${studentsPerSeat}.
        
        Population Constraints:
        - Student origin classes: ${classes}
        - Detailed Subject and Paper Set configurations per class: ${classDetails}
        - Respective roll number boundaries: ${rollRanges}

        ${customConstraints ? `
        🚨 USER OVERRIDE INSTRUCTIONS (ABSOLUTE MAXIMUM PRIORITY) 🚨
        The user has reviewed a previous matrix and explicitly requested the following changes:
        "${customConstraints}"
        You MUST prioritize these specific requests. If they conflict with general routing, the user's override wins.
        ` : ''}

        🚨 CRITICAL DATA BINDING RULES (FAILING THESE WILL CRASH THE SYSTEM) 🚨
        You are a deterministic parsing engine, NOT a creative assistant.
        1. Examine 'classDetails' carefully. It contains the EXACT subjects the user wants.
        2. The JSON "subject" field MUST EXACTLY MATCH the strings inside 'classDetails'. 
        3. ❌ DO NOT output default subjects like "Math", "Science", "Physics", "Chemistry", "English", "History" UNLESS they are explicitly written in 'classDetails'.
        4. If you hallucinate or infer a subject that the user did not provide, the entire application will crash.
        5. The "className" field MUST EXACTLY MATCH the class names provided in 'classes'.

        YOUR TASK:
        1. MATHEMATICAL PRE-COMPUTATION (DO THIS BEFORE GRID PLACEMENT):
           - Parse the requested 'classes' and their specific 'classDetails'. Explicitly map the correct distinct Subject and Paper Sets to each respective Class.
           - Generate a strict list of student objects using the exact roll boundaries requested limit. DO NOT invent random roll numbers. Use sequential numbers.
           - Distribute the explicitly assigned Paper Sets evenly among the students within each specific class.
           - LIMITER: Calculate Total Capacity = (Columns * Rows * StudentsPerSeat). Validate that your generated student list length is less than or equal to this Capacity. If the roll ranges exceed capacity, trim the list sequentially to fit.
        2. MATRIX DISTRIBUTION ALGORITHM (ISOLATION FOCUS):
           - Fill the 2D grid systematically aiming for MAXIMUM ISOLATION. 
           - To naturally pass the anti-cheating constraints and create a strict isolation environment, use a highly dispersed interleaved placement strategy. Space out identical classes as far apart as possible.
        3. EXTREME ANTI-CHEATING CONSTRAINTS (ABSOLUTE PRIORITY):
           - RULE A (Total Isolation Radius): No two students sharing the EXACT SAME Class AND EXACT SAME Subject AND EXACT SAME Set can ever sit anywhere near each other. They MUST NOT be placed directly in front of each other, behind each other, perfectly next to each other, or diagonally adjacent (the entire 8-cell perimeter must be clear of identical question papers). If mathematically possible, extend this isolation even further. The student MUST feel completely isolated from anyone taking their exact variation.
           - RULE B (Intra-Seat Sharing): If multiple students share the exact SAME physical seat (i.e. studentsPerSeat > 1), they MUST NEVER take the exact same exam paper.
           - RULE C (Strict Set Alternation): When assigning Sets for the SAME subject and class, you MUST alternate them across neighboring rows and columns to maximize distance between identical papers.
        
        CRITICAL VALIDATION STEP: Before returning the JSON, mathematically evaluate every single student's Class, Subject, and Set against their 8 surrounding neighbors (Up, Down, Left, Right, Diagonals, and within the Shared Seat). If any identical combination touches, YOU MUST swap it for a different class or different set.
        4. Fill the grid, placing up to ${studentsPerSeat} students in a single seat cell.

        OUTPUT FORMAT:
        Output the result STRICTLY as a JSON array containing a single object representing this room.
        [
          {
            "roomDetails": { "roomNumber": "${roomNumber}", "rows": ${seatsPerRow}, "columns": ${verticalRows} },
            "classSubjectMap": {
               "Class Name 1": "Exact Subject String 1",
               "Class Name 2": "Exact Subject String 2"
            },
            "grid": [ ... ] 
          }
        ]
        
        CRITICAL: 
        - The 'grid' must be a 2D array of exactly ${seatsPerRow} arrays, each containing exactly ${verticalRows} items.
        - Each item in the 2D grid represents a seat. 
        - A seat MUST ALWAYS be an array (even if empty). 
        - If the seat has students, it must be an array of student objects (up to length ${studentsPerSeat}):
          [ { "rollNumber": "String", "subject": "SubjectName", "set": "SetName", "className": "ClassLevel" }, ... ]
        - If the seat is empty, it must be an empty array: []

        DO NOT wrap the JSON in Markdown code blocks like \`\`\`json. Return ONLY raw JSON array string. No preamble.
        `;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: "Proceed to dynamically build the JSON seating matrix." }] }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1, // Highly deterministic code/matrix output
                responseMimeType: 'application/json'
            }
        });

        let outputText = response.text.trim();
        let planJson = [];

        try {
            planJson = JSON.parse(outputText);

            // DETERMINISTIC DATA INJECTION OVERRIDE
            if (planJson && planJson[0] && planJson[0].classSubjectMap && planJson[0].grid) {
                const subjectMap = planJson[0].classSubjectMap;
                console.log("✅ Backend Intercept: AI generated subject map:", subjectMap);

                // Build a normalized map for fuzzy matching to prevent key mismatches 
                // (e.g., "Class 10A" vs "10A")
                const normalizedMap = {};
                for (const [key, value] of Object.entries(subjectMap)) {
                    normalizedMap[key.toLowerCase().trim()] = value;
                    normalizedMap[key.toLowerCase().replace('class ', '').trim()] = value;
                }

                planJson[0].grid.forEach(row => {
                    row.forEach(seat => {
                        if (Array.isArray(seat)) {
                            seat.forEach(student => {
                                if (student.className) {
                                    const rawClass = String(student.className).toLowerCase().trim();
                                    const noClassPrefix = rawClass.replace('class ', '').trim();

                                    // 1. Exact Match
                                    if (normalizedMap[rawClass]) {
                                        student.subject = normalizedMap[rawClass]; // Hard override
                                    }
                                    // 2. Exact Match without 'Class' prefix
                                    else if (normalizedMap[noClassPrefix]) {
                                        student.subject = normalizedMap[noClassPrefix];
                                    }
                                    // 3. Substring match fallback (e.g. Map has "10A Physics", class is "10A")
                                    else {
                                        for (const [key, val] of Object.entries(normalizedMap)) {
                                            if (rawClass.includes(key) || key.includes(rawClass)) {
                                                student.subject = val;
                                                break;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
            } else {
                console.warn("⚠️ Backend Intercept FAILED: AI did not output 'classSubjectMap'.");
                console.log("Keys found in JSON:", planJson && planJson[0] ? Object.keys(planJson[0]) : "Invalid structure");
            }

        } catch (parseError) {
            console.error("AI output was not valid JSON:", outputText);
            return res.status(500).json({ error: "AI generated an invalid mathematical matrix structure." });
        }

        res.json({ seatingPlan: planJson });

    } catch (error) {
        console.error("Critical AI Generation Runtime Error:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        if (error.response) {
            console.error("Response Header:", error.response.headers);
            console.error("Response Data:", error.response.data);
        }
        res.status(500).json({ 
            error: "The AI calculation engine encountered a fatal error.", 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;
