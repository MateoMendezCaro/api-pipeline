const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4003;
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../data/comments-db.json');
const MAIN_API_URL = process.env.MAIN_API_URL || 'http://localhost:3001';

function ensureFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ comments: [] }, null, 2));
  }
}
function readDB() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
function nextId(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map(x => Number(x.id) || 0)) + 1;
}

async function validateRefs({ postId, userId }) {
  if (!MAIN_API_URL) return; 
  const [pRes, uRes] = await Promise.all([
    fetch(`${MAIN_API_URL}/api/posts/${postId}`),
    fetch(`${MAIN_API_URL}/api/users/${userId}`)
  ]);
  if (!pRes.ok) {
    const msg = 'Post no encontrado';
    const err = new Error(msg); err.status = 404; throw err;
  }
  if (!uRes.ok) {
    const msg = 'Usuario no encontrado';
    const err = new Error(msg); err.status = 404; throw err;
  }
}

app.get('/comments', (req, res) => {
  const { postId, userId } = req.query;
  const db = readDB();
  let out = db.comments;
  if (postId) out = out.filter(c => Number(c.postId) === Number(postId));
  if (userId) out = out.filter(c => Number(c.userId) === Number(userId));
  out = out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(out);
});

app.get('/comments/count', (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ message: 'postId es obligatorio' });
  const db = readDB();
  const count = db.comments.filter(c => Number(c.postId) === Number(postId)).length;
  res.json({ postId: Number(postId), count });
});


app.get('/comments/:id', (req, res) => {
  const db = readDB();
  const item = db.comments.find(c => c.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Comentario no encontrado' });
  res.json(item);
});

app.post('/comments', async (req, res) => {
  try {
    const { postId, userId, content } = req.body || {};
    if (!postId || !userId || !content || !String(content).trim()) {
      return res.status(400).json({ message: 'postId, userId y content son obligatorios' });
    }
    await validateRefs({ postId, userId });

    const db = readDB();
    const now = new Date().toISOString();
    const comment = {
      id: nextId(db.comments),
      postId: Number(postId),
      userId: Number(userId),
      content: String(content).trim(),
      createdAt: now,
      updatedAt: now
    };
    db.comments.push(comment);
    writeDB(db);
    res.status(201).json(comment);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message || 'Error creando comentario' });
  }
});

app.delete('/comments/:id', (req, res) => {
  const db = readDB();
  const before = db.comments.length;
  db.comments = db.comments.filter(c => c.id !== Number(req.params.id));
  if (db.comments.length === before) {
    return res.status(404).json({ message: 'Comentario no encontrado' });
  }
  writeDB(db);
  res.status(204).send();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Comments Service on http://localhost:${PORT}`));
}
module.exports = app;