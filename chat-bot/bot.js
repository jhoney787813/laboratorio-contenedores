const { io } = require('socket.io-client');

const serverUrl = process.env.CHAT_SERVER_URL || 'http://localhost:3000';
const botName = 'AutoBot 🤖';

const socket = io(serverUrl);

socket.on('connect', () => {
    console.log('Bot conectado al servidor de chat:', serverUrl);
    socket.emit('join', { username: botName, is_bot: true });
});

// El bot ahora escucha 'botMessage' que contiene la info del remitente real
socket.on('botMessage', (msg) => {
    console.log(`Mensaje privado de ${msg.username} (ID: ${msg.userId}): ${msg.content}`);

    setTimeout(() => {
        let response = '';
        const lowerMsg = msg.content.toLowerCase();

        if (lowerMsg.includes('hola') || lowerMsg.includes('saludos')) {
            response = `¡Hola ${msg.username}! ¿En qué te puedo ayudar hoy de forma privada?`;
        } else if (lowerMsg.includes('hora')) {
            response = `La hora actual es ${new Date().toLocaleTimeString()}`;
        } else if (lowerMsg.includes('ayuda')) {
            response = 'Soy un bot automático en tu sala privada. Pregúntame sobre la "hora", "hola", o sobre "docker".';
        } else if (lowerMsg.includes('docker') || lowerMsg.includes('podman')) {
            response = '¡Los contenedores nos permiten crear estas salas privadas sin problema!';
        } else {
            response = `Interesante, cuéntame más ${msg.username}.`;
        }

        // Enviamos la respuesta dirigida al usuario específico
        socket.emit('sendMessage', { toUserId: msg.userId, text: response });
        console.log(`Respuesta enviada a ${msg.username}:`, response);
    }, 1500);
});

socket.on('disconnect', () => {
    console.log('Bot desconectado del servidor');
});
