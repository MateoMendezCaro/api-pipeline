const fs = require('fs');
const path = require('path');

const DEFAULT_DATA = { users: [], posts: [] };

// Permite apuntar a otro archivo en tests con env var
const DB_PATH = path.resolve(__dirname, '../../data/db.json');

function ensureFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

function read() {
  ensureFile();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw || JSON.stringify(DEFAULT_DATA));
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
