const socket = io();

const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');
const currentUserSpan = document.getElementById('currentUser');
const messagesArea = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let myUsername = '';

joinBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        myUsername = username;
        socket.emit('join', { username: username, is_bot: false });
        loginContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        currentUserSpan.textContent = `Logueado como: ${username}`;
    }
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinBtn.click();
});

sendBtn.addEventListener('click', () => {
    const content = messageInput.value.trim();
    if (content) {
        socket.emit('sendMessage', content);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

function appendMessage(msg) {
    const msgDiv = document.createElement('div');
    const isOwn = msg.username === myUsername;
    msgDiv.className = `message ${isOwn ? 'message-own' : 'message-other'}`;
    
    const time = new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgDiv.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${msg.username}</span>
            <span>${time}</span>
        </div>
        <div class="message-content">${msg.content}</div>
    `;
    
    messagesArea.appendChild(msgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

socket.on('history', (messages) => {
    messagesArea.innerHTML = '';
    messages.forEach(appendMessage);
});

socket.on('newMessage', (msg) => {
    appendMessage(msg);
});

socket.on('userJoined', (data) => {
    // Ya no mostramos uniones de usuarios globales ya que los chats son privados.
});

socket.on('adminAlert', (message) => {
    const sysMsg = document.createElement('div');
    sysMsg.style.textAlign = 'center';
    sysMsg.style.color = '#ef4444'; // Red color
    sysMsg.style.fontWeight = 'bold';
    sysMsg.style.fontSize = '0.9rem';
    sysMsg.style.margin = '15px 0';
    sysMsg.style.padding = '10px';
    sysMsg.style.background = 'rgba(239, 68, 68, 0.1)';
    sysMsg.style.borderRadius = '8px';
    sysMsg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    sysMsg.textContent = `📢 ADMIN ALERT: ${message}`;
    messagesArea.appendChild(sysMsg);
    messagesArea.scrollTop = messagesArea.scrollHeight;
});
