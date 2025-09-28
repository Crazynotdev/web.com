import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import ConnectManager from './connect.js';
import SessionManager from './sessionManager.js';
import { logServer } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.post('/api/connect', async (req, res) => {
  const { phone, prefix } = req.body;
  try {
    const { pairingCode } = await ConnectManager.initSession(phone, prefix);
    res.json({ success: true, pairingCode });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post('/api/command', async (req, res) => {
  try {
    const result = await ConnectManager.runCommand(req.body.command);
    res.json({ result });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get('/api/session', (req, res) => {
  res.json(SessionManager.status());
});

app.post('/api/logout', async (req, res) => {
  await ConnectManager.logout();
  res.json({ success: true });
});

// WebSocket for live logs
wss.on('connection', ws => {
  logServer.subscribe((log) => {
    ws.send(JSON.stringify(log));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
