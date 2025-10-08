/**
 * @openapi
 * tags:
 *   - name: Posts
 *     description: Gestión de posts
 */

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Listar posts
 *     responses:
 *       200: { description: Lista de posts }
 *   post:
 *     tags: [Posts]
 *     summary: Crear post (requiere userId válido)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NewPost' }
 *     responses:
 *       201: { description: Post creado }
 *       400: { description: Campos faltantes o inválidos }
 *       404: { description: Usuario no encontrado }
 */

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Obtener post por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Post }
 *       404: { description: Post no encontrado }
 *   put:
 *     tags: [Posts]
 *     summary: Actualizar post (parcial)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePost' }
 *     responses:
 *       200: { description: Post actualizado }
 *       400: { description: Datos inválidos }
 *       404: { description: Post/Usuario no encontrado }
 *   delete:
 *     tags: [Posts]
 *     summary: Eliminar post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Eliminado }
 *       404: { description: Post no encontrado }
 */

const { Router } = require('express');
const ctrl = require('../controllers/posts.controller');

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
