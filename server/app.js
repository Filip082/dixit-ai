require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
// const { createClient } = require('redis');

const authRoutes = require('./routes/auth');

// Initialize Redis client (uncomment when Redis server is available)
// const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
// redisClient.on('error', (err) => console.log('Redis Client Error', err));

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use(express.static('public'));

const server = createServer(app);
const io = new Server(server);

io.use((socket, next) => {
    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const token = cookies.token;

        if (!token)
            return next(new Error('Brak tokena'));
        const result = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = result;
        next();
    } catch (err) {
        next(new Error('Niezalogowany'));
    }
});

// TODO: Placeholder for game logic
const gameHandler = (io, socket) => {
    console.log(`Nowy gracz połączony. ID Gniazda: ${socket.id}`);
};

io.on('connection', (socket) => gameHandler(io, socket));

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Connect to Redis if uncommented
        // await redisClient.connect();
        // console.log('Connected to Redis');

        server.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        // await prisma.$disconnect();
        process.exit(1);
    }
}

startServer();
