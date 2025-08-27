const express = require('express');
const cors = require('cors');

// Rutas y middlewares
const usersRouter = require('./routes/users.routes');
const postsRouter = require('./routes/posts.routes');
const notFound = require('./middlewares/notFound');
const error = require('./middlewares/error');

// Configurar la app
const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// Middlewares finales
app.use(notFound); // 404 para rutas no encontradas
app.use(error);    // Manejo de errores

// Servidor
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API escuchando en http://localhost:${PORT}`);
  });
}
