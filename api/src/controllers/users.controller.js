const service = require('../services/users.service');

async function list(_req, res) {
  res.json(service.listUsers());
}

async function get(req, res) {
  const user = service.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
}

async function create(req, res, next) {
  try {
    const user = service.createUser(req.body);
    res.status(201).json(user);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const user = service.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    service.deleteUser(req.params.id);
    res.status(204).send();
  } catch (e) { next(e); }
}

module.exports = { list, get, create, update, remove };
