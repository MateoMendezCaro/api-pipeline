const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4004;
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../data/reactions-db.json');
const MAIN_API_URL = process.env.MAIN_API_URL || 'http://localhost:3001';

const ALLOWED = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];

function ensureFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ reactions: [] }, null, 2));
  }
}
function readDB() { ensureFile(); return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
function writeDB(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }
function nextId(items) { return (!items || items.length === 0) ? 1 : Math.max(...items.map(x => Number(x.id)||0)) + 1; }

async function validateRefs({ postId, userId }) {
  if (!MAIN_API_URL) return;
  const [pRes, uRes] = await Promise.all([
    fetch(`${MAIN_API_URL}/api/posts/${postId}`),
    fetch(`${MAIN_API_URL}/api/users/${userId}`)
  ]);
  if (!pRes.ok) { const e = new Error('Post no encontrado'); e.status = 404; throw e; }
  if (!uRes.ok) { const e = new Error('Usuario no encontrado'); e.status = 404; throw e; }
}

app.get('/reactions', (req, res) => {
  const { postId, userId } = req.query;
  const db = readDB();
  let out = db.reactions;
  if (postId) out = out.filter(r => Number(r.postId) === Number(postId));
  if (userId) out = out.filter(r => Number(r.userId) === Number(userId));
  res.json(out);
});

app.get('/reactions/count', (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ message: 'postId es obligatorio' });
  const db = readDB();
  const arr = db.reactions.filter(r => Number(r.postId) === Number(postId));
  const breakdown = ALLOWED.reduce((acc, t) => ({ ...acc, [t]: 0 }), {});
  for (const r of arr) breakdown[r.type] = (breakdown[r.type] || 0) + 1;
  const total = arr.length;
  res.json({ postId: Number(postId), total, breakdown });
});

app.post('/reactions', async (req, res) => {
  try {
    const { postId, userId, type } = req.body || {};
    if (!postId || !userId || !type) return res.status(400).json({ message: 'postId, userId y type son obligatorios' });
    if (!ALLOWED.includes(String(type))) return res.status(400).json({ message: `type inválido. Permitidos: ${ALLOWED.join(', ')}` });

    await validateRefs({ postId, userId });

    const db = readDB();
    const now = new Date().toISOString();
    const idx = db.reactions.findIndex(r => Number(r.postId) === Number(postId) && Number(r.userId) === Number(userId));

    if (idx === -1) {
      const reaction = { id: nextId(db.reactions), postId: Number(postId), userId: Number(userId), type, createdAt: now, updatedAt: now };
      db.reactions.push(reaction);
      writeDB(db);
      return res.status(201).json(reaction);
    } else {
      db.reactions[idx] = { ...db.reactions[idx], type, updatedAt: now };
      writeDB(db);
      return res.status(200).json(db.reactions[idx]);
    }
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message || 'Error creando reacción' });
  }
});


app.delete('/reactions', (req, res) => {
  const { postId, userId } = req.body || {};
  if (!postId || !userId) return res.status(400).json({ message: 'postId y userId son obligatorios' });
  const db = readDB();
  const before = db.reactions.length;
  db.reactions = db.reactions.filter(r => !(Number(r.postId) === Number(postId) && Number(r.userId) === Number(userId)) );
  if (db.reactions.length === before) return res.status(404).json({ message: 'Reacción no encontrada' });
  writeDB(db);
  res.status(204).send();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Reactions Service on http://localhost:${PORT}`));
}
module.exports = app;