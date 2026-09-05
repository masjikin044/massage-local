const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const users = [];
let messages = [];

// Auth
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    users.push({ username, email, password });
    res.status(201).json({ message: "Registrasi berhasil!" });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: "Email/password salah!" });
    res.json({ message: "Login berhasil!", username: user.username });
});

// Messages API
app.post('/api/messages', (req, res) => {
    const { sender, receiver, text } = req.body;
    const newMessage = { id: Date.now(), sender, receiver, text, timestamp: new Date() };
    messages.push(newMessage);
    res.status(201).json({ message: "Pesan terkirim!" });
});

app.get('/api/messages', (req, res) => res.json(messages));

// FITUR HAPUS PESAN
app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    messages = messages.filter(m => m.id !== parseInt(id));
    res.json({ message: "Pesan berhasil dihapus!" });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
    res.json({
        total_users: users.length,
        total_messages: messages.length,
        users_list: users.map(u => ({ username: u.username })),
        recent_messages: messages
    });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(5000, () => console.log('Backend berjalan di port 5000'));