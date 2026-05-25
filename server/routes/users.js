const express = require('express');
const prisma = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

const RANKING_DEFAULT_LIMIT = 10;
const RANKING_MAX_LIMIT = 100;

function emptyStats() {
    return {
        gamesPlayed: 0,
        gamesWon: 0,
        totalPoints: 0,
        rank: null,
    };
}

async function fetchStatsForUser(userId) {
    const row = await prisma.user_stats.findFirst({ where: { user_id: userId } });
    if (!row) return emptyStats();

    // Ranking liczymy jako liczba użytkowników z większą sumą punktów + 1.
    const betterCount = await prisma.user_stats.count({
        where: { total_points: { gt: row.total_points || 0 } },
    });

    return {
        gamesPlayed: row.games_played || 0,
        gamesWon: row.games_won || 0,
        totalPoints: row.total_points || 0,
        rank: betterCount + 1,
    };
}

router.get('/me/stats', auth, async (req, res) => {
    try {
        const stats = await fetchStatsForUser(req.user.id);
        return res.json(stats);
    } catch (err) {
        console.error('GET /api/users/me/stats error:', err);
        return res.status(500).json({ error: 'Nie udało się pobrać statystyk' });
    }
});

router.get('/ranking', auth, async (req, res) => {
    try {
        const requested = parseInt(req.query.limit, 10);
        const limit = Number.isInteger(requested) && requested > 0
            ? Math.min(requested, RANKING_MAX_LIMIT)
            : RANKING_DEFAULT_LIMIT;

        const top = await prisma.user_stats.findMany({
            orderBy: [
                { games_won: 'desc' },
                { total_points: 'desc' },
            ],
            take: limit,
            include: { users: true },
        });

        return res.json(
            top.map((row, idx) => ({
                rank: idx + 1,
                userId: row.user_id,
                username: row.users?.username || 'Nieznany',
                gamesPlayed: row.games_played || 0,
                gamesWon: row.games_won || 0,
                totalPoints: row.total_points || 0,
            }))
        );
    } catch (err) {
        console.error('GET /api/users/ranking error:', err);
        return res.status(500).json({ error: 'Nie udało się pobrać rankingu' });
    }
});

module.exports = {
    router,
    fetchStatsForUser,
};
