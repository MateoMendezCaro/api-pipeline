const db = require('../data/db');
const { nextId } = require('../utils/id');

function listPosts() {
  return db.read().posts;
}

function getPostById(id) {
  const { posts } = db.read();
  return posts.find(p => p.id === Number(id));
}

function createPost({ userId, title, content }) {
  if (!userId || !title || !content) {
    const err = new Error('Los campos userId, title y content son obligatorios');
    err.status = 400; throw err;
  }
  const data = db.read();
  const user = data.users.find(u => u.id === Number(userId));
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404; throw err;
  }
  const post = { id: nextId(data.posts), userId: Number(userId), title, content };
  data.posts.push(post);
  db.write(data);
  return post;
}

function updatePost(id, patch) {
  const data = db.read();
  const idx = data.posts.findIndex(p => p.id === Number(id));
  if (idx === -1) {
    const err = new Error('Post no encontrado');
    err.status = 404; throw err;
  }
  // Si cambian el userId, validar que exista
  if (patch.userId) {
    const user = data.users.find(u => u.id === Number(patch.userId));
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.status = 404; throw err;
    }
  }
  data.posts[idx] = { ...data.posts[idx], ...patch, id: Number(id) };
  db.write(data);
  return data.posts[idx];
}

function deletePost(id) {
  const data = db.read();
  const before = data.posts.length;
  data.posts = data.posts.filter(p => p.id !== Number(id));
  if (data.posts.length === before) {
    const err = new Error('Post no encontrado');
    err.status = 404; throw err;
  }
  db.write(data);
}

module.exports = {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
