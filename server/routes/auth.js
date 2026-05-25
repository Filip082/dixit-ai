const prisma = require("../config/db");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Oczekuje middleware w tym miejscu
const { fetchStatsForUser } = require('./users');

const saltRounds = 10;

router.post('/register', async (req, res) => {
    // Pobieramy login, hasło oraz opcjonalnie email
    const { login, password, email } = req.body; 

    if (!login || !password) {
        return res.status(400).json({ error: "Brak loginu lub hasła" });
    }

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        
        // Prisma wymaga unikalnego emaila. Jeśli frontend go nie przesyła, generujemy placeholder
        const userEmail = email || `${login}@placeholder.dixit-ai.com`;

        const newUser = await prisma.users.create({
            data: {
                username: login,
                email: userEmail,
                password_hash: hash
            }
        });

        console.log('Gracz dodany: ' + newUser.username);
        res.status(201).json({ response: 'Dodano gracza' });
    } catch (e) {
        console.error(e);
        // Kod błędu Prismy przy naruszeniu unikalności (UNIQUE constraint)
        if (e.code === 'P2002') {
             return res.status(409).json({ error: "Użytkownik o takim loginie lub emailu już istnieje" });
        }
        res.status(500).json({ error: "Błąd serwera" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body; 
        
        // Szukamy użytkownika po username
        const user = await prisma.users.findUnique({
            where: { username: login }
        });

        if (!user) {
            return res.status(404).json({ error: "Użytkownik nie istnieje" });
        }

        // Sprawdzamy hasło
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (isMatch) {
            // Aktualizujemy datę ostatniego logowania w tle (nie blokuje odpowiedzi)
            prisma.users.update({
                where: { id: user.id },
                data: { last_login_at: new Date() }
            }).catch(console.error);

            // Zwracamy JWT w ciasteczku
            const token = jwt.sign(
                { id: user.id, login: user.username }, 
                process.env.JWT_SECRET,
                { expiresIn: '1w' }
            );

            return res.status(200)
                .cookie('token', token, { httpOnly: true, sameSite: 'lax' }) 
                .json({ response: "Zalogowany", username: user.username });
        }
        
        return res.status(401).json({ error: "Złe hasło" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Błąd logowania" });
    }
});

router.get('/me', auth, async (req, res) => {
    // req.user pochodzi z middleware 'auth'.
    // Stare pola (id, username) zostają — istniejący klient main je czyta.
    // Reszta to dodatkowe pola pod store Zustand z feature/frontend-refactor-zustand.
    try {
        const userRow = await prisma.users.findUnique({
            where: { id: req.user.id },
            include: {
                user_unlocks: true,
            },
        });

        const stats = await fetchStatsForUser(req.user.id);

        return res.status(200).json({
            id: req.user.id,
            username: req.user.login,
            email: userRow?.email || null,
            // TODO: kolumny `coins` i `active_theme_id` na `users` wymagają zmiany schematu DB
            // (cross-boundary) — póki co zwracamy placeholdery, żeby kontrakt z frontu nie pękał.
            coins: 0,
            activeThemeId: null,
            ownedThemeIds: (userRow?.user_unlocks || []).map((u) => u.set_id),
            stats,
        });
    } catch (err) {
        console.error('GET /api/auth/me error:', err);
        return res.status(500).json({ error: 'Błąd pobierania profilu' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ response: "Wylogowano" });
});

module.exports = router;
