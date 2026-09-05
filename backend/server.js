const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware (CORS Terbuka untuk HP & Format JSON)
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. Prometheus Metrics Collector
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Database Sementara (In-Memory)
const users = [];
let messages = [];

// ------------------- AUTH ENDPOINTS -------------------

// Register
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
    }
    users.push({ username, email, password });
    res.status(201).json({ message: "Registrasi berhasil!" });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: "Email/password salah!" });
    res.json({ message: "Login berhasil!", username: user.username });
});

// ------------------- MESSAGES ENDPOINTS -------------------

// Ambil Semua Pesan
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

// Kirim Pesan (Mendukung format 'content' maupun 'text/sender/receiver')
app.post('/api/messages', (req, res) => {
    const { sender, receiver, text, content } = req.body;
    const messageContent = content || text;

    if (!messageContent) {
        return res.status(400).json({ error: 'Isi pesan tidak boleh kosong!' });
    }

    const newMessage = {
        id: Date.now(),
        sender: sender || 'User',
        receiver: receiver || 'All',
        content: messageContent,
        text: messageContent,
        created_at: new Date(),
        timestamp: new Date()
    };

    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// Hapus Pesan berdasarkan ID
app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    messages = messages.filter(m => m.id !== parseInt(id));
    res.json({ message: "Pesan berhasil dihapus!" });
});

// ------------------- ADMIN & MONITORING -------------------

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
    res.json({
        total_users: users.length,
        total_messages: messages.length,
        users_list: users.map(u => ({ username: u.username })),
        recent_messages: messages
    });
});

// Prometheus Endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// ------------------- SERVER LISTEN -------------------
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});