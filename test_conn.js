import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

async function testConnection() {
    console.log("Starting MongoDB Connection Test...");
    console.log("URI:", process.env.MONGODB_URI ? "HIDDEN (Exists)" : "MISSING");
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ SUCCESS: Connected to MongoDB Atlas successfully.");
        
        // Check database name
        console.log("Database:", mongoose.connection.name);
        
        await mongoose.disconnect();
        console.log("Disconnected.");
    } catch (err) {
        console.error("❌ FAILURE: Could not connect to MongoDB.");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.reason) console.error("Reason:", err.reason);
    }
}

testConnection();
