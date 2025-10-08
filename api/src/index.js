const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users.routes');
const postsRouter = require('./routes/posts.routes');
const notFound = require('./middlewares/notFound');
const error = require('./middlewares/error');
const engagementRouter = require('./routes/engagement.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api', engagementRouter);

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 3001;

module.exports = app;

app.listen(PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${PORT}`);
  console.log(`📚 Swagger UI en http://localhost:${PORT}/docs`);
});
