import express from 'express';
import nodemailer from 'nodemailer';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/email', protect, async (req, res) => {
    try {
        const { pdfDataUri, roomNumber } = req.body;
        const userEmail = req.user.email;

        if (!pdfDataUri || !userEmail) {
            return res.status(400).json({ error: 'Missing PDF data or user email.' });
        }

        // Extract base64 data from URI (data:application/pdf;base64,...)
        const base64Data = pdfDataUri.split(';base64,').pop();
        const pdfBuffer = Buffer.from(base64Data, 'base64');

        // Configure Nodemailer Transporter securely
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Construct the Email
        const mailOptions = {
            from: `"Seating Master AI" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `Confidential Seating Matrix - Room ${roomNumber || 'Generated'}`,
            text: `Greetings from Seating Master AI,\n\nPlease find the explicitly generated confidential seating arrangement attached for Room ${roomNumber || 'your session'}.\n\nSafe executions,\nThe AI Engine`,
            html: `
                <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00ff9d; background: #111; padding: 20px; text-align: center; border-radius: 10px;">Seating Master AI</h2>
                    <p>Greetings,</p>
                    <p>Please find the explicitly generated confidential seating arrangement matrix attached for Room <strong>${roomNumber || 'your session'}</strong>.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>The AI Compute Engine</strong></p>
                </div>
            `,
            attachments: [
                {
                    filename: `Seating_Matrix_Room_${roomNumber || 'Export'}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        // Dispatch Email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'PDF generated and dispatched to mailbox.' });
    } catch (error) {
        console.error("Email Dispatch Error:", error);
        res.status(500).json({ error: 'Failed to dispatch the email. Please verify SMTP configurations.' });
    }
});

export default router;
