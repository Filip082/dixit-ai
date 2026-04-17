const prisma = require("../config/db");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const saltRounds = 10;

router.post('/register', async (req, res) => {
    // 1. NAPRAWA REJESTRACJI: Pobieramy 'username' wysyłane przez front, lub fallbackowo 'login'
    const { username, login, password, email } = req.body; 
    const finalUsername = username || login;

    if (!finalUsername || !password) {
        return res.status(400).json({ error: "Brak loginu lub hasła" });
    }

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        
        // Prisma wymaga unikalnego emaila. Jeśli frontend go nie przesyła, generujemy placeholder
        const userEmail = email || `${finalUsername}@placeholder.dixit-ai.com`;

        const newUser = await prisma.users.create({
            data: {
                username: finalUsername,
                email: userEmail,
                password_hash: hash
            }
        });

        console.log('Gracz dodany: ' + newUser.username);
        res.status(201).json({ response: 'Dodano gracza' });
    } catch (e) {
        console.error(e);
        if (e.code === 'P2002') {
             return res.status(409).json({ error: "Użytkownik o takim loginie lub emailu już istnieje" });
        }
        res.status(500).json({ error: "Błąd serwera" });
    }
});

router.post('/login', async (req, res) => {
    try {
        // 2. NAPRAWA LOGOWANIA: Front wysyła pole 'email' zawierające Nick LUB E-mail
        const { email, login, password } = req.body; 
        const identifier = email || login;
        
        if (!identifier || !password) {
            return res.status(400).json({ error: "Brak danych logowania" });
        }

        // Szukamy użytkownika po username LUB emailu
        const user = await prisma.users.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
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

            // 3. NAPRAWA ZUSTAND: Zwracamy obiekt `user` tak, jak oczekuje tego frontend
            return res.status(200)
                .cookie('token', token, { httpOnly: true, sameSite: 'lax' }) 
                .json({ 
                    response: "Zalogowany", 
                    user: {
                        id: user.id,
                        username: user.username
                    }
                });
        }
        
        return res.status(401).json({ error: "Złe hasło" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Błąd logowania" });
    }
});

router.get('/me', auth, (req, res) => {
    res.status(200).json({ username: req.user.login, id: req.user.id });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ response: "Wylogowano" });
});

module.exports = router;