const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const USERS = [
  { username: 'admin', password: '1234' },
  { username: 'usuario', password: 'pass' },
];

const activeTokens = new Set();

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  activeTokens.add(token);
  res.json({ token, username: user.username });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  activeTokens.delete(token);
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  res.json({ authenticated: true });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
