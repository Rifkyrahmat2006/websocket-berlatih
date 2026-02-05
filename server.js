require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

// Configure CORS for both Express and Socket.io
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:8000', 'http://127.0.0.1:8000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Socket.io server with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// API secret for authenticating Laravel requests
const API_SECRET = process.env.API_SECRET || 'your-secret-key-change-this';

// Track connected clients
let connectedClients = 0;

// Socket.io connection handling
io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected. Total: ${connectedClients}`);

  // Join the scoreboard room
  socket.join('scoreboard');

  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected. Total: ${connectedClients}`);
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CTF WebSocket Server is running',
    connectedClients 
  });
});

// Endpoint for Laravel to POST scoreboard updates
app.post('/broadcast/scoreboard', (req, res) => {
  // Verify API secret
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${API_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { scoreboard, updated_at } = req.body;

  if (!scoreboard) {
    return res.status(400).json({ error: 'Missing scoreboard data' });
  }

  // Broadcast to all clients in scoreboard room
  io.to('scoreboard').emit('scoreboard.updated', {
    scoreboard,
    updated_at: updated_at || new Date().toISOString()
  });

  console.log(`Broadcasted scoreboard update to ${connectedClients} clients`);

  res.json({ 
    success: true, 
    message: 'Scoreboard update broadcasted',
    clientsReached: connectedClients 
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 CTF WebSocket Server running on port ${PORT}`);
  console.log(`📡 Allowed origins: ${allowedOrigins.join(', ')}`);
});
