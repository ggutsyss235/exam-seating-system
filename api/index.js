import express from 'express';
const app = express();
app.get('/api/ping', (req, res) => res.json({ standalone_pong: true }));
app.get('/api', (req, res) => res.json({ standalone_healthy: true }));
export default app;
