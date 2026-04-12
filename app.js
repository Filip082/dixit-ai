require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
// const { createClient } = require('redis');

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// const authRoutes = require('./routes/auth');

// Initialize Prisma client (will connect to DB once schema is pulled via `npx prisma db pull`)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Initialize Redis client (uncomment when Redis server is available)
// const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
// redisClient.on('error', (err) => console.log('Redis Client Error', err));

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use('/api/auth', authRoutes);

app.use(express.static('public'));

const server = createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
}); // TODO: Configure CORS properly for production

io.on('connection', (socket) => {
    console.log(`User connected via WebSocket: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

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
        await prisma.$disconnect();
        process.exit(1);
    }
}

startServer();
