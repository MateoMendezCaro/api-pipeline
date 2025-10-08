/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios
 *     responses:
 *       200: { description: Lista de usuarios }
 *   post:
 *     tags: [Users]
 *     summary: Crear usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NewUser' }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Campos inválidos u obligatorios faltantes }
 *       409: { description: Email ya está en uso }
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario }
 *       404: { description: Usuario no encontrado }
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUser' }
 *     responses:
 *       200: { description: Usuario actualizado }
 *       400: { description: Datos inválidos }
 *       409: { description: Email ya está en uso }
 *       404: { description: Usuario no encontrado }
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Eliminado }
 *       404: { description: Usuario no encontrado }
 */

const { Router } = require('express');
const ctrl = require('../controllers/users.controller');

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
