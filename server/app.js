require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

// 1. Inicjalizacja Prisma Client (Nowy standard zamiast czystego SQL)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 2. ODKOMENTOWANE: Ścieżki autoryzacji (żeby Frontend mógł się zalogować)
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

// 3. Wpięcie endpointów autoryzacji (Teraz /api/auth/login zadziała!)
app.use('/api/auth', authRoutes);

app.use(express.static('public'));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Opcjonalnie do uściślenia w produkcji
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 4. Weryfikacja ciasteczek Socket.io
io.use((socket, next) => {
    try {
        // UWAGA DO FILIPA: Metoda w paczce 'cookie' nazywa się .parse(), a nie .parseCookie()
        const cookies = cookie.parse(socket.request.headers.cookie || "");
        const token = cookies.token;

        if (!token) return next(new Error('Brak tokena autoryzacji'));
        
        const result = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = result; // Zapisujemy dane gracza z tokena (np. socket.user.id)
        next();
    } catch (err) {
        next(new Error('Niezalogowany lub nieważny token'));
    }
});

// 5. GŁÓWNA LOGIKA GRY (Lobby)
const gameHandler = (io, socket) => {
    console.log(`✅Zalogowany gracz połączony. Socket ID: ${socket.id}, User ID: ${socket.user.id}`);

    // --- ZDARZENIE: TWORZENIE POKOJU (HostGameView na Froncie) ---
    socket.on('create_room', async (data) => {
        try {
            // Zapis nowego pokoju do bazy za pomocą Prisma
            const newRoom = await prisma.rooms.create({
                data: {
                    host_user_id: socket.user.id, 
                    max_players: data.maxPlayers || 6,
                    point_limit: data.pointsLimit || 30,
                    status: 'waiting'
                }
            });

            // Dodanie twórcy jako pierwszego gracza w pokoju
            await prisma.room_players.create({
                data: {
                    room_id: newRoom.id,
                    user_id: socket.user.id,
                    is_bot: false
                }
            });

            socket.join(newRoom.id);
            socket.emit('room_created', { roomId: newRoom.id });
            console.log(`Pokój ${newRoom.id} utworzony.`);
        } catch (error) {
            console.error('Błąd tworzenia pokoju:', error);
            socket.emit('error', 'Nie udało się utworzyć pokoju.');
        }
    });

    // --- ZDARZENIE: DOŁĄCZANIE DO POKOJU (JoinLobbyView na Froncie) ---
    socket.on('join_room', async ({ roomId }) => {
        try {
            // Sprawdzenie, czy pokój istnieje
            const room = await prisma.rooms.findUnique({ where: { id: roomId } });
            if (!room) return socket.emit('error', 'Taki pokój nie istnieje.');

            // Dodanie gracza do tabeli room_players
            await prisma.room_players.create({
                data: {
                    room_id: roomId,
                    user_id: socket.user.id,
                    is_bot: false
                }
            });

            socket.join(roomId);

            // Pobranie aktualnej listy graczy wraz z ich nickami (RELACJE W PRISMIE)
            const players = await prisma.room_players.findMany({
                where: { room_id: roomId },
                include: { users: { select: { username: true } } }
            });

            // Poinformowanie wszystkich w pokoju o nowym graczu
            io.to(roomId).emit('room_update', {
                message: `Nowy gracz dołączył!`,
                players: players
            });

        } catch (error) {
            console.error('Błąd dołączania:', error);
            socket.emit('error', 'Nie udało się dołączyć do pokoju.');
        }
    });

    // --- ZDARZENIE: ROZŁĄCZENIE ---
    socket.on('disconnect', () => {
        console.log(`❌Gracz rozłączony: ${socket.id}`);
        // W przyszłości: Obsługa usunięcia gracza z tabeli room_players po rozłączeniu
    });
};

io.on('connection', (socket) => gameHandler(io, socket));

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        server.listen(PORT, () => {
            console.log(`Serwer Dixit AI działa na http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Błąd startu serwera:', error);
        // Bezpieczne zamknięcie połączenia z bazą w razie błędu
        await prisma.$disconnect();
        process.exit(1);
    }
}

startServer();