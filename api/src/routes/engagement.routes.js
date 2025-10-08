/**
 * @openapi
 * tags:
 *   - name: Engagement
 *     description: Agregación de métricas por Post
 */

/**
 * @openapi
 * /api/posts/{id}/engagement:
 *   get:
 *     tags: [Engagement]
 *     summary: Engagement (comments + reactions) de un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Métricas de engagement }
 *       502: { description: Error consultando microservicios }
 */

const { Router } = require('express');
const router = Router();

const COMMENTS_URL  = process.env.COMMENTS_URL  || 'http://localhost:4003';
const REACTIONS_URL = process.env.REACTIONS_URL || 'http://localhost:4004';

router.get('/posts/:id/engagement', async (req, res) => {
  const postId = Number(req.params.id);
  try {
    const [cRes, rRes] = await Promise.all([
      fetch(`${COMMENTS_URL}/comments/count?postId=${postId}`),
      fetch(`${REACTIONS_URL}/reactions/count?postId=${postId}`)
    ]);
    if (!cRes.ok || !rRes.ok) {
      return res.status(502).json({ message: 'Error consultando microservicios' });
    }
    const comments = await cRes.json(); 
    const reactions = await rRes.json(); 
    res.json({ postId, comments: comments.count ?? 0, reactions });
  } catch (e) {
    res.status(502).json({ message: 'Fallo de agregación', detail: e.message });
  }
});

module.exports = router;
