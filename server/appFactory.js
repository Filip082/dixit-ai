const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const webhookRoutes = require('./routes/webhooks');
const roomRoutes = require('./routes/rooms');
const cardSetRoutes = require('./routes/cardSets');
const { router: userRoutes } = require('./routes/users');

function createApp() {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    app.use('/api/auth', authRoutes);
    app.use('/api/webhooks', webhookRoutes);
    app.use('/api/rooms', roomRoutes);
    app.use('/api/card-sets', cardSetRoutes);
    app.use('/api/users', userRoutes);

    app.use(express.static('public'));

    return app;
}

module.exports = { createApp };
