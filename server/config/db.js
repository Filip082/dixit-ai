require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Błąd połączenia z bazą danych PostgreSQL:', err.message);
    } else {
        console.log('✅ Połączono z bazą danych. Czas serwera DB:', res.rows[0].now);
    }
});

module.exports = prisma;
