require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Inicjalizacja natywnego klienta Prisma (bez zbędnych adapterów)
const prisma = new PrismaClient();

// Test połączenia z AWS przy starcie serwera
prisma.$queryRaw`SELECT NOW()`
    .then((res) => {
        console.log('✅ Połączono z bazą danych AWS. Czas serwera DB:', res[0].now);
    })
    .catch((err) => {
        console.error('❌ Błąd połączenia z bazą danych PostgreSQL:', err.message);
    });

module.exports = prisma;