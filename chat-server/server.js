const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Redis clients (One for general use, one for subscribing)
const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const redisSubscriber = redisClient.duplicate();

redisClient.on('error', err => console.log('Redis Client Error', err));
redisSubscriber.on('error', err => console.log('Redis Subscriber Error', err));

// Set to keep track of the bot socket ID
let botSocketId = null;

async function startServer() {
    await redisClient.connect();
    await redisSubscriber.connect();
    console.log('Connected to Redis');

    // Subscribe to Admin broadcasts
    await redisSubscriber.subscribe('admin_broadcast', (message) => {
        console.log('Admin broadcast received:', message);
        io.emit('adminAlert', message); // Emite a todos los clientes conectados
    });

    io.on('connection', async (socket) => {
        console.log('New client connected:', socket.id);
        
        socket.on('join', async (data) => {
            const { username, is_bot } = data;
            
            if (is_bot) {
                botSocketId = socket.id;
                console.log('Bot registered with socket ID:', botSocketId);
                return;
            }

            const userId = uuidv4();
            socket.userId = userId;
            socket.username = username;

            const userData = {
                id: userId,
                username: username,
                is_bot: 'false',
                created_at: new Date().toISOString(),
                status_code: '1',
                ip_address: socket.handshake.address,
                avatar_color: '#' + Math.floor(Math.random()*16777215).toString(16),
                score: '0.0'
            };

            // Guarda el usuario activo en un set para el admin app
            await redisClient.sAdd('active_users', userId);
            await redisClient.hSet(`user:${userId}`, userData);
            
            // Send past private messages (if we wanted persistence across reloads for the same user, 
            // we would need auth, but here we just show empty or load based on a temporary session).
            const messages = await redisClient.lRange(`chat:messages:${userId}`, 0, 50);
            const parsedMessages = messages.map(msg => JSON.parse(msg));
            socket.emit('history', parsedMessages.reverse());
        });

        // Handle incoming messages
        socket.on('sendMessage', async (content) => {
            if (!socket.userId && socket.id !== botSocketId) return;

            const msgId = uuidv4();
            
            // If the sender is the user, send to bot. If sender is bot, send to user.
            // For the bot, it will send a special payload: { toUserId, content }
            if (socket.id === botSocketId) {
                const { toUserId, text } = content;
                const messageData = {
                    msg_id: msgId,
                    sender_id: 'bot',
                    username: 'AutoBot 🤖',
                    content: text,
                    sent_at: new Date().toISOString(),
                    priority: 'N'
                };
                // Enviar al usuario específico
                // Encontramos el socket del usuario
                const sockets = await io.fetchSockets();
                const userSocket = sockets.find(s => s.userId === toUserId);
                
                if (userSocket) {
                    await redisClient.lPush(`chat:messages:${toUserId}`, JSON.stringify(messageData));
                    io.to(userSocket.id).emit('newMessage', messageData);
                }
            } else {
                // Sender is a normal user
                const messageData = {
                    msg_id: msgId,
                    sender_id: socket.userId,
                    username: socket.username,
                    content: content,
                    sent_at: new Date().toISOString(),
                    priority: 'N'
                };

                // Store in user's private list
                await redisClient.lPush(`chat:messages:${socket.userId}`, JSON.stringify(messageData));
                
                // Enviar confirmación al propio usuario
                socket.emit('newMessage', messageData);

                // Enviar al bot para que procese (incluyendo el ID del remitente)
                if (botSocketId) {
                    io.to(botSocketId).emit('botMessage', {
                        userId: socket.userId,
                        username: socket.username,
                        content: content
                    });
                }
            }
        });

        socket.on('disconnect', async () => {
            console.log('Client disconnected:', socket.id);
            if (socket.id === botSocketId) {
                botSocketId = null;
            } else if (socket.userId) {
                await redisClient.hSet(`user:${socket.userId}`, 'status_code', '0');
                await redisClient.sRem('active_users', socket.userId);
            }
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();
