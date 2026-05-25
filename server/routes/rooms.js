const express = require('express');
const prisma = require('../config/db');
const auth = require('../middleware/auth');
const roomCodes = require('../utils/roomCodes');

const router = express.Router();

const MAX_PLAYERS_HARD_LIMIT = 6;
const MIN_PLAYERS_HARD_LIMIT = 4;

async function loadRoomById(roomId) {
    return prisma.rooms.findUnique({
        where: { id: roomId },
        include: {
            room_players: {
                include: { users: true },
                orderBy: { joined_at: 'asc' },
            },
        },
    });
}

function serializeRoom(room) {
    if (!room) return null;
    return {
        id: room.id,
        code: roomCodes.getCodeForRoom(room.id),
        hostUserId: room.host_user_id,
        status: room.status,
        maxPlayers: room.max_players,
        endCondition: room.end_condition,
        pointLimit: room.point_limit,
        roundLimit: room.round_limit,
        activeSetId: room.active_set_id,
        createdAt: room.created_at,
        players: room.room_players.map((p) => ({
            id: p.id,
            userId: p.user_id,
            username: p.is_bot ? `Bot_${p.id.slice(0, 4)}` : p.users?.username || null,
            isBot: !!p.is_bot,
            botDifficulty: p.bot_difficulty,
            joinedAt: p.joined_at,
        })),
    };
}

async function loadAndSerialize(roomId) {
    const room = await loadRoomById(roomId);
    return serializeRoom(room);
}

router.post('/', auth, async (req, res) => {
    try {
        const { maxPlayers, endCondition, pointLimit, roundLimit, activeSetId } = req.body || {};

        const players = Number.isInteger(maxPlayers) ? maxPlayers : MAX_PLAYERS_HARD_LIMIT;
        if (players < MIN_PLAYERS_HARD_LIMIT || players > MAX_PLAYERS_HARD_LIMIT) {
            return res.status(400).json({ error: `maxPlayers musi być w zakresie ${MIN_PLAYERS_HARD_LIMIT}-${MAX_PLAYERS_HARD_LIMIT}` });
        }

        if (endCondition && !['points', 'rounds'].includes(endCondition)) {
            return res.status(400).json({ error: "endCondition musi być 'points' lub 'rounds'" });
        }

        if (endCondition === 'rounds' && (!Number.isInteger(roundLimit) || roundLimit < 2)) {
            return res.status(400).json({ error: 'roundLimit musi być liczbą >= 2 dla endCondition=rounds' });
        }

        const room = await prisma.rooms.create({
            data: {
                host_user_id: req.user.id,
                max_players: players,
                end_condition: endCondition || 'points',
                point_limit: endCondition === 'rounds' ? null : (Number.isInteger(pointLimit) ? pointLimit : 30),
                round_limit: endCondition === 'rounds' ? roundLimit : null,
                active_set_id: activeSetId || null,
                status: 'waiting',
                room_players: {
                    create: { user_id: req.user.id, is_bot: false },
                },
            },
            include: { room_players: { include: { users: true } } },
        });

        roomCodes.generateCode(room.id);

        return res.status(201).json(serializeRoom(room));
    } catch (err) {
        console.error('POST /api/rooms error:', err);
        return res.status(500).json({ error: 'Nie udało się utworzyć pokoju' });
    }
});

router.get('/:codeOrId', auth, async (req, res) => {
    try {
        const roomId = roomCodes.resolveRoomId(req.params.codeOrId);
        if (!roomId) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        const room = await loadRoomById(roomId);
        if (!room) {
            roomCodes.releaseRoom(roomId);
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        return res.json(serializeRoom(room));
    } catch (err) {
        console.error('GET /api/rooms/:codeOrId error:', err);
        return res.status(500).json({ error: 'Nie udało się pobrać pokoju' });
    }
});

router.post('/:codeOrId/join', auth, async (req, res) => {
    try {
        const roomId = roomCodes.resolveRoomId(req.params.codeOrId);
        if (!roomId) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        const room = await loadRoomById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        if (room.status !== 'waiting') {
            return res.status(409).json({ error: 'Gra już się rozpoczęła' });
        }

        const already = room.room_players.find((p) => p.user_id === req.user.id);
        if (already) {
            return res.json(await loadAndSerialize(roomId));
        }

        if (room.room_players.length >= (room.max_players || MAX_PLAYERS_HARD_LIMIT)) {
            return res.status(409).json({ error: 'Pokój jest pełny' });
        }

        await prisma.room_players.create({
            data: {
                room_id: roomId,
                user_id: req.user.id,
                is_bot: false,
            },
        });

        return res.json(await loadAndSerialize(roomId));
    } catch (err) {
        console.error('POST /api/rooms/:codeOrId/join error:', err);
        return res.status(500).json({ error: 'Nie udało się dołączyć do pokoju' });
    }
});

router.post('/:codeOrId/leave', auth, async (req, res) => {
    try {
        const roomId = roomCodes.resolveRoomId(req.params.codeOrId);
        if (!roomId) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        const room = await loadRoomById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        if (room.status !== 'waiting') {
            return res.status(409).json({ error: 'Nie można opuścić pokoju w trakcie gry' });
        }

        const myEntry = room.room_players.find((p) => p.user_id === req.user.id);
        if (!myEntry) {
            return res.status(404).json({ error: 'Nie jesteś w tym pokoju' });
        }

        await prisma.room_players.delete({ where: { id: myEntry.id } });

        // Host opuszcza pokój → zamykamy lobby.
        if (room.host_user_id === req.user.id) {
            await prisma.rooms.delete({ where: { id: roomId } });
            roomCodes.releaseRoom(roomId);
            return res.json({ closed: true });
        }

        return res.json(await loadAndSerialize(roomId));
    } catch (err) {
        console.error('POST /api/rooms/:codeOrId/leave error:', err);
        return res.status(500).json({ error: 'Nie udało się opuścić pokoju' });
    }
});

router.post('/:codeOrId/bots', auth, async (req, res) => {
    try {
        const roomId = roomCodes.resolveRoomId(req.params.codeOrId);
        if (!roomId) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        const room = await loadRoomById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        if (room.host_user_id !== req.user.id) {
            return res.status(403).json({ error: 'Tylko host może dodać bota' });
        }

        if (room.status !== 'waiting') {
            return res.status(409).json({ error: 'Gra już się rozpoczęła' });
        }

        if (room.room_players.length >= (room.max_players || MAX_PLAYERS_HARD_LIMIT)) {
            return res.status(409).json({ error: 'Pokój jest pełny' });
        }

        const { difficulty } = req.body || {};
        if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ error: "difficulty musi być 'easy', 'medium' lub 'hard'" });
        }

        await prisma.room_players.create({
            data: {
                room_id: roomId,
                user_id: null,
                is_bot: true,
                bot_difficulty: difficulty || 'medium',
            },
        });

        return res.status(201).json(await loadAndSerialize(roomId));
    } catch (err) {
        console.error('POST /api/rooms/:codeOrId/bots error:', err);
        return res.status(500).json({ error: 'Nie udało się dodać bota' });
    }
});

router.delete('/:codeOrId', auth, async (req, res) => {
    try {
        const roomId = roomCodes.resolveRoomId(req.params.codeOrId);
        if (!roomId) {
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        const room = await prisma.rooms.findUnique({ where: { id: roomId } });
        if (!room) {
            roomCodes.releaseRoom(roomId);
            return res.status(404).json({ error: 'Pokój nie istnieje' });
        }

        if (room.host_user_id !== req.user.id) {
            return res.status(403).json({ error: 'Tylko host może usunąć pokój' });
        }

        if (room.status !== 'waiting') {
            return res.status(409).json({ error: 'Nie można usunąć pokoju w trakcie gry' });
        }

        await prisma.rooms.delete({ where: { id: roomId } });
        roomCodes.releaseRoom(roomId);

        return res.status(204).end();
    } catch (err) {
        console.error('DELETE /api/rooms/:codeOrId error:', err);
        return res.status(500).json({ error: 'Nie udało się usunąć pokoju' });
    }
});

module.exports = router;
