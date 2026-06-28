const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redisClient.on('error', err => console.log('Redis Error', err));

async function startServer() {
    await redisClient.connect();
    console.log('Admin App conectado a Redis');

    // Endpoint para obtener los usuarios conectados
    app.get('/api/users', async (req, res) => {
        try {
            const activeUserIds = await redisClient.sMembers('active_users');
            const users = [];
            
            for (const id of activeUserIds) {
                const userData = await redisClient.hGetAll(`user:${id}`);
                if (Object.keys(userData).length > 0) {
                    users.push(userData);
                }
            }
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    });

    // Endpoint para enviar un mensaje masivo (Broadcast)
    app.post('/api/broadcast', async (req, res) => {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        try {
            // Publica el mensaje en el canal 'admin_broadcast'
            await redisClient.publish('admin_broadcast', message);
            res.json({ success: true, message: 'Broadcast sent' });
        } catch (error) {
            res.status(500).json({ error: 'Error sending broadcast' });
        }
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Admin panel running on port ${PORT}`);
    });
}

startServer();
