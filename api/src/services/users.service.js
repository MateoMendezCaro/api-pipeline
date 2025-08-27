const db = require('../data/db');
const { isValidEmail } = require('../utils/email');
const { nextId } = require('../utils/id');

function listUsers() {
  return db.read().users;
}

function getUserById(id) {
  const { users } = db.read();
  return users.find(u => u.id === Number(id));
}

function createUser({ name, email, password }) {
  if (!name || !email || !password) {
    const err = new Error('Los campos name, email y password son obligatorios');
    err.status = 400; throw err;
  }
  if (!isValidEmail(email)) {
    const err = new Error('Email inválido');
    err.status = 400; throw err;
  }

  const data = db.read();
  const exists = data.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    const err = new Error('El email ya está en uso');
    err.status = 409; throw err;
  }

  const user = { id: nextId(data.users), name, email, password };
  data.users.push(user);
  db.write(data);
  return user;
}

function updateUser(id, patch) {
  const data = db.read();
  const idx = data.users.findIndex(u => u.id === Number(id));
  if (idx === -1) {
    const err = new Error('Usuario no encontrado');
    err.status = 404; throw err;
  }
  if (patch.email) {
    if (!isValidEmail(patch.email)) {
      const err = new Error('Email inválido');
      err.status = 400; throw err;
    }
    const collision = data.users.some(
      u => u.id !== Number(id) && u.email.toLowerCase() === patch.email.toLowerCase()
    );
    if (collision) {
      const err = new Error('El email ya está en uso');
      err.status = 409; throw err;
    }
  }
  data.users[idx] = { ...data.users[idx], ...patch, id: Number(id) };
  db.write(data);
  return data.users[idx];
}

function deleteUser(id) {
  const data = db.read();
  const before = data.users.length;
  data.users = data.users.filter(u => u.id !== Number(id));
  if (data.users.length === before) {
    const err = new Error('Usuario no encontrado');
    err.status = 404; throw err;
  }
  db.write(data);
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
