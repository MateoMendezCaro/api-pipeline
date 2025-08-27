const service = require('../services/posts.service');

async function list(_req, res) {
  res.json(service.listPosts());
}

async function get(req, res) {
  const post = service.getPostById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post no encontrado' });
  res.json(post);
}

async function create(req, res, next) {
  try {
    const post = service.createPost(req.body);
    res.status(201).json(post);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const post = service.updatePost(req.params.id, req.body);
    res.json(post);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    service.deletePost(req.params.id);
    res.status(204).send();
  } catch (e) { next(e); }
}

module.exports = { list, get, create, update, remove };
