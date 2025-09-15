📦 API Pipeline — Users/Posts + Microservicios (Comments & Reactions)

Proyecto educativo de Express.js que muestra cómo evolucionar un prototipo a algo más cercano a producción:

API principal con Usuarios y Posts.

Dos microservicios independientes:

Comments: comentarios por postId.

Reactions: reacciones/likes con upsert y conteo agregado.

Arquitectura por capas, manejo de errores, pruebas automatizadas (Jest + Supertest), y scripts para correr todo junto.

✅ Requiere Node 18+ (usa fetch nativo).

🧠 ¿Qué hace este sistema?

Permite registrar usuarios y crear posts (validando que el userId exista).

Expone microservicios Comments y Reactions que guardan datos en archivos JSON propios.

La API agrega métricas de engagement por post (conteo de comentarios + reacciones) consultando a los microservicios.

🏗️ Estructura y arquitectura

API (carpeta api/) con capas:

routes/ → define endpoints (users, posts, engagement).

controllers/ → maneja request/response.

services/ → lógica de negocio (validaciones, reglas, ids).

data/ → acceso a JSON (api/data/db.json).

middlewares/ → notFound y error (400/404/409/500).

utils/ → utilidades (email, generación de ids).

index.js → instancia Express (puerto 3001).

Microservicios:

comments/ (puerto 4003) → src/index.js y data/comments-db.json.

reactions/ (puerto 4004) → src/index.js y data/reactions-db.json.

Persistencia:

Archivos JSON autogenerados si no existen.

Validación cruzada:

Comments y Reactions validan postId/userId contra la API (MAIN_API_URL).

⚙️ Variables de entorno

API:

PORT (default 3001)

COMMENTS_URL (default http://localhost:4003)

REACTIONS_URL (default http://localhost:4004)

DB_PATH (default api/data/db.json)

Comments:

PORT (default 4003)

DB_PATH (default comments/data/comments-db.json)

MAIN_API_URL (default http://localhost:3001)

Reactions:

PORT (default 4004)

DB_PATH (default reactions/data/reactions-db.json)

MAIN_API_URL (default http://localhost:3001)

Los servicios crean sus archivos JSON si no existen.

🚀 Cómo ejecutar (local)

Instalar dependencias en raíz, comments y reactions:

npm run setup


Levantar todo en paralelo (API + Comments + Reactions):

npm run dev:all


API → http://localhost:3001

Comments → http://localhost:4003

Reactions → http://localhost:4004

También puedes correr por servicio: npm run dev:api, npm run dev:comments, npm run dev:reactions.

🔌 Endpoints (texto simple y ejemplos)
1) API principal — Users

Crear usuario
Método: POST
URL: http://localhost:3001/api/users
Body (JSON):

{ "name": "Ada", "email": "ada@example.com", "password": "secret" }


Respuestas:

201 → usuario creado { id, name, email, password }

400 → faltan campos o email inválido

409 → email ya en uso

Listar usuarios
GET http://localhost:3001/api/users

Obtener usuario por id
GET http://localhost:3001/api/users/1
(404 si no existe)

Actualizar usuario (parcial)
PUT http://localhost:3001/api/users/1
Body (ejemplo):

{ "name": "Ada Lovelace" }


Eliminar usuario
DELETE http://localhost:3001/api/users/1
(204 si elimina, 404 si no existe)

2) API principal — Posts

Crear post (requiere userId válido)
POST http://localhost:3001/api/posts
Body:

{ "userId": 1, "title": "Hola", "content": "Mundo" }


Respuestas:

201 → post creado { id, userId, title, content }

400 → faltan campos

404 → usuario no existe

Listar posts
GET http://localhost:3001/api/posts

Obtener post por id
GET http://localhost:3001/api/posts/1

Actualizar post (parcial)
PUT http://localhost:3001/api/posts/1
Body (ejemplo):

{ "title": "Hola (editado)" }


Eliminar post
DELETE http://localhost:3001/api/posts/1

3) API principal — Engagement (agregación)

Engagement por post (usa Comments + Reactions)
GET http://localhost:3001/api/posts/1/engagement
Respuestas:

200 → { postId, comments: <n>, reactions: { postId, total, breakdown } }

502 → si algún microservicio falla o no responde OK

4) Microservicio — Comments

Listar (con filtros opcionales)
GET http://localhost:4003/comments?postId=1&userId=1

Contar comentarios por post
GET http://localhost:4003/comments/count?postId=1

Obtener comentario por id
GET http://localhost:4003/comments/1

Crear comentario
POST http://localhost:4003/comments
Body:

{ "postId": 1, "userId": 1, "content": "¡Buen post!" }


Respuestas:

201 → comentario creado

400 → faltan campos

404 → user/post no existen (validación contra API)

Eliminar comentario
DELETE http://localhost:4003/comments/1

Importante: en el código, declara la ruta /comments/count antes de /comments/:id (evita conflicto de rutas).

5) Microservicio — Reactions

Listar (con filtros)
GET http://localhost:4004/reactions?postId=1&userId=1

Conteo por post
GET http://localhost:4004/reactions/count?postId=1
Respuesta: { postId, total, breakdown: { like, love, laugh, wow, sad, angry } }

Upsert reacción (si ya existe, actualiza el tipo)
POST http://localhost:4004/reactions
Body:

{ "postId": 1, "userId": 1, "type": "like" }


Tipos válidos: like, love, laugh, wow, sad, angry
Respuestas:

201 → creada

200 → actualizada

400/404 → validaciones

Eliminar reacción (por postId + userId)
DELETE http://localhost:4004/reactions
Body:

{ "postId": 1, "userId": 1 }

🧪 Cómo ejecutar las pruebas

Ejecutar Jest + Supertest:

npm test


Notas sobre tests:

Se sobreescribe DB_PATH a un archivo temporal para no tocar tus datos.

Se prueban casos felices y errores para users y posts.

(Sugerencia de mejora) Evitar app.listen cuando NODE_ENV=test para tener instancias totalmente “in-memory”.

🧭 Guía rápida para probar manualmente (Postman/cURL)

Crear usuario:

POST http://localhost:3001/api/users
Content-Type: application/json
{
  "name": "Ada",
  "email": "ada@example.com",
  "password": "secret"
}


Crear post:

POST http://localhost:3001/api/posts
Content-Type: application/json
{
  "userId": 1,
  "title": "Hola",
  "content": "Mundo"
}


Crear comentario:

POST http://localhost:4003/comments
Content-Type: application/json
{
  "postId": 1,
  "userId": 1,
  "content": "¡Buen post!"
}


Dar like:

POST http://localhost:4004/reactions
Content-Type: application/json
{
  "postId": 1,
  "userId": 1,
  "type": "like"
}


Ver engagement del post:

GET http://localhost:3001/api/posts/1/engagement

🧯 Troubleshooting (cosas que ya resolvimos)

/comments/count devolvía “Comentario no encontrado”
Causa: conflicto de rutas (/comments/:id capturaba count).
Fix: declara /comments/count antes de /comments/:id.

reactions/count daba total: 0 aunque hiciste POST
Revisa:

Header Content-Type: application/json en el POST.

Estás mirando el archivo correcto: reactions/data/reactions-db.json.

La API responde 200 a /api/users/:id y /api/posts/:id (la validación lo exige).

El POST devuelve 201/200 (si devuelve 4xx, no se guarda).

/api/posts/:id/engagement responde 502
Pasa si /comments/count o /reactions/count no devuelven 200.
Asegúrate de que los microservicios estén arriba y respondan OK.

✅ Historias de usuario (cumplidas)

HU1: Registro de Usuarios

POST /api/users → 201

Valida obligatorios (400) y duplicado (409)

Persiste en api/data/db.json

HU2: Creación de Posts

POST /api/posts → 201

Requiere userId válido (404 si no existe)

Valida title y content (400)

Persiste en api/data/db.json

Extra: Comments & Reactions como microservicios + agregación /api/posts/:id/engagement.

🧾 Scripts útiles (package.json raíz)

npm run setup → instala deps en raíz, comments y reactions.

npm run dev:all → levanta todo en paralelo.

npm run dev:api / npm run dev:comments / npm run dev:reactions → por servicio.

npm test → corre Jest/Supertest.

🔒 Seguridad (nota académica)

Passwords se guardan en texto plano por simplicidad de la práctica.

En producción: hashear (p. ej. bcrypt), validar robustamente inputs, y agregar JWT o similar para endpoints protegidos.