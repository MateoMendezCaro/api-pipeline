const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Inicializamos la app de Express
const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.use(cors()); // Middleware para habilitar CORS

// Ruta al archivo de la base de datos
const dbPath = path.resolve(__dirname, 'db.json');

// --- Funciones de ayuda para leer y escribir en la BD ---
const readDB = () => {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// --- Rutas del CRUD ---

// READ (Obtener todos los posts)
app.get('/api/posts', (req, res) => {
    const db = readDB();
    res.json(db.posts);
});

// READ (Obtener un post por ID)
app.get('/api/posts/:id', (req, res) => {
    const db = readDB();
    const post = db.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ message: 'Post no encontrado lastima!!' });
    }
    res.json(post);
});

// CREATE (Crear un nuevo post)
app.post('/api/posts', (req, res) => {
    const db = readDB();
    const newPost = {
        id: db.posts.length > 0 ? Math.max(...db.posts.map(p => p.id)) + 1 : 1,
        title: req.body.title,
        content: req.body.content
    };
    db.posts.push(newPost);
    writeDB(db);
    res.status(201).json(newPost);
});

// UPDATE (Actualizar un post existente)
app.put('/api/posts/:id', (req, res) => {
    const db = readDB();
    const postIndex = db.posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post no encontrado' });
    }
    const updatedPost = { ...db.posts[postIndex], ...req.body };
    db.posts[postIndex] = updatedPost;
    writeDB(db);
    res.json(updatedPost);
});

// DELETE (Eliminar un post)
app.delete('/api/posts/:id', (req, res) => {
    const db = readDB();
    const newPosts = db.posts.filter(p => p.id !== parseInt(req.params.id));
    if (newPosts.length === db.posts.length) {
        return res.status(404).json({ message: 'Post no encontrado' });
    }
    db.posts = newPosts;
    writeDB(db);
    res.status(204).send(); // No Content
});

// Netlify exporta el handler de la función
module.exports = app;
// Si quieres correrlo localmente también, puedes añadir:
// const PORT = process.env.PORT || 3000;
// if (process.env.NODE_ENV !== 'production') {
//     app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
// }