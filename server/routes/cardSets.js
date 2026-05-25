const express = require('express');
const prisma = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const sets = await prisma.card_sets.findMany({
            include: {
                _count: { select: { cards: true } },
                unlockable_sets: true,
            },
        });

        return res.json(
            sets.map((s) => ({
                id: s.id,
                name: s.name,
                isDefault: !!s.is_default,
                unlockableSetId: s.unlockable_set_id,
                unlockCondition: s.unlockable_sets?.unlock_condition || null,
                requiredWins: s.unlockable_sets?.required_wins || null,
                cardCount: s._count.cards,
            }))
        );
    } catch (err) {
        console.error('GET /api/card-sets error:', err);
        return res.status(500).json({ error: 'Nie udało się pobrać zestawów kart' });
    }
});

module.exports = router;
