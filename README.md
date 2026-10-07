# 🚀 MiniBlog API - DevSpark

API REST desarrollada con **Node.js**, **Express 5** y **PostgreSQL** para gestionar un MiniBlog: autores (`authors`) y publicaciones (`posts`) con una relación **1:N** (un autor tiene muchos posts). Los identificadores son **UUID** generados por la base de datos.

---

## 🔗 Enlaces del proyecto

| Recurso | URL |
|---|---|
| API en producción (Railway) | https://proyectom2sandyhurtado-production.up.railway.app/ |
| Swagger UI (producción) | https://proyectom2sandyhurtado-production.up.railway.app/api-docs |
| Especificación OpenAPI 3.0 | [`openapi.json`](openapi.json) |
| Repositorio | https://github.com/hurtadosandy21-ops/ProyectoM2_SandyHurtado |

---

## 📁 Estructura

```
├── app.js                     # Configura Express: middlewares, rutas, 404 y manejador de errores
├── server.js                  # Arranca el servidor (app.listen)
├── setup.js                   # Crea la base de datos, aplica el schema y (opcional) el seed
├── openapi.json               # Especificación OpenAPI generada (npm run docs:openapi)
├── db/
│   ├── schema.sql             # Tablas, PK, FK, UNIQUE, NOT NULL, CHECK e índice
│   └── seed.sql               # Datos de ejemplo
├── scripts/export-openapi.js  # Exporta la especificación a openapi.json
├── src/
│   ├── config/                # Pool de PostgreSQL y configuración de Swagger
│   ├── routes/                # Rutas + documentación @swagger
│   ├── controllers/           # Validaciones y respuestas HTTP
│   ├── services/              # Consultas SQL parametrizadas (lógica de datos)
│   └── middlewares/           # Manejador global de errores
└── test/api.test.js           # Tests de integración (Vitest + Supertest)
```

Flujo de una petición: **ruta → controlador (valida) → servicio (SQL con `$1, $2…`) → PostgreSQL**. Cualquier error se envía con `next(error)` al middleware global `errorHandler`.

---

## 🗄️ Modelo de datos

```
authors (1) ──────────< (N) posts
```

| Tabla | Columna | Tipo | Restricciones |
|---|---|---|---|
| authors | id | UUID | PK, `DEFAULT gen_random_uuid()` |
| authors | name | VARCHAR(100) | NOT NULL, no vacío (CHECK) |
| authors | email | VARCHAR(100) | NOT NULL, **UNIQUE** (se guarda en minúsculas) |
| authors | bio | TEXT | opcional |
| authors | created_at | TIMESTAMP | NOT NULL, `DEFAULT CURRENT_TIMESTAMP` |
| posts | id | UUID | PK, `DEFAULT gen_random_uuid()` |
| posts | author_id | UUID | NOT NULL, **FK → authors(id) ON DELETE CASCADE** |
| posts | title | VARCHAR(200) | NOT NULL, no vacío (CHECK) |
| posts | content | TEXT | NOT NULL, no vacío (CHECK) |
| posts | published | BOOLEAN | NOT NULL, `DEFAULT FALSE` |
| posts | created_at | TIMESTAMP | NOT NULL, `DEFAULT CURRENT_TIMESTAMP` |

El script completo está en [`db/schema.sql`](db/schema.sql) y los datos de ejemplo en [`db/seed.sql`](db/seed.sql). Ambos son **idempotentes**: se pueden ejecutar varias veces sin borrar ni duplicar datos.

---

## 🛠️ Ejecutar en local

### Prerrequisitos

- **Node.js 20 o superior** (lo exige Vitest 5).
- **PostgreSQL 13 o superior** corriendo en local (o accesible por red).

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/hurtadosandy21-ops/ProyectoM2_SandyHurtado.git
cd ProyectoM2_SandyHurtado
npm install
```

### 2. Variables de entorno

Copia el archivo de ejemplo y edita la contraseña de tu PostgreSQL:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor (por defecto 8080) | `8080` |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://postgres:tu_contraseña@localhost:5432/blog_db` |
| `DB_SSL` | `true` solo si el servidor exige SSL | `false` |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` | Alternativa a `DATABASE_URL`: se usan solo si `DATABASE_URL` no está definida | `localhost`, `postgres`, `tu_contraseña`, `blog_db`, `5432` |
| `NODE_ENV` | Entorno de ejecución | `development` |

### 3. Crear la base de datos y las tablas

```bash
npm run db:setup
```

Crea la base `blog_db` si no existe y aplica `db/schema.sql`. Para cargar además los datos de ejemplo:

```bash
npm run db:seed
```

### 4. Levantar el servidor

```bash
npm run dev
```

La API queda en `http://localhost:8080` y Swagger en `http://localhost:8080/api-docs`.

---

## 📌 Endpoints

Todas las respuestas son JSON. Los errores tienen la forma `{ "error": "mensaje" }`.

### Authors

| Método | Ruta | Descripción | Éxito | Errores |
|---|---|---|---|---|
| GET | `/authors` | Lista todos los autores | 200 | 500 |
| GET | `/authors/:id` | Detalle de un autor | 200 | 400, 404 |
| POST | `/authors` | Crea un autor (`name`, `email` obligatorios; `bio` opcional) | 201 | 400, 409 |
| PUT | `/authors/:id` | Actualiza un autor (`name` obligatorio; `email`, `bio` opcionales) | 200 | 400, 404, 409 |
| DELETE | `/authors/:id` | Elimina un autor y sus posts (CASCADE) | 204 | 400, 404 |

### Posts

| Método | Ruta | Descripción | Éxito | Errores |
|---|---|---|---|---|
| GET | `/posts` | Lista todos los posts | 200 | 500 |
| GET | `/posts/:id` | Detalle de un post | 200 | 400, 404 |
| GET | `/posts/author/:authorId` | Posts de un autor (incluye datos del autor) | 200 | 400, 404 |
| POST | `/posts` | Crea un post (`title`, `content`, `author_id` obligatorios; `published` opcional) | 201 | 400, 404 |
| PUT | `/posts/:id` | Actualiza un post (`title`, `content` obligatorios; `published` opcional) | 200 | 400, 404 |
| DELETE | `/posts/:id` | Elimina un post | 204 | 400, 404 |

### Ejemplos

```bash
curl -X POST http://localhost:8080/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Sandy Hurtado", "email": "sandy@example.com", "bio": "Desarrolladora Full Stack"}'
```

```bash
curl -X POST http://localhost:8080/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer post", "content": "Hola mundo", "author_id": "<uuid-del-autor>", "published": true}'
```

### Códigos de estado

| Código | Cuándo |
|---|---|
| 200 | Lectura o actualización correcta |
| 201 | Recurso creado |
| 204 | Recurso eliminado (sin body) |
| 400 | Campo obligatorio faltante, email/`published` inválido, ID que no es UUID, texto demasiado largo o JSON mal formado |
| 404 | Autor/post inexistente, `author_id` inexistente o ruta desconocida |
| 409 | El email ya está registrado (control de unicidad) |
| 500 | Error inesperado del servidor |

---

## 🧪 Tests

Son **tests de integración**: llaman a la API real con Supertest y usan la base de datos real, así validan el comportamiento completo (incluidos el UNIQUE del email, la FK, el CASCADE y los errores de PostgreSQL). Por eso necesitan PostgreSQL levantado con el schema aplicado:

```bash
npm run db:setup
```

```bash
npm test
```

La suite (`test/api.test.js`) tiene **26 tests** que cubren el CRUD completo de authors y posts, `/posts/author/:authorId` y los casos de error (400, 404, 409, JSON mal formado y ruta inexistente). Cada test crea sus propios datos con emails únicos y al terminar los borra, así no ensucia la base.

> 💡 Si quieres una base separada para tests, crea otra (p. ej. `blog_db_test`) y ejecuta los comandos con esa `DATABASE_URL`.

---

## 📄 Documentación OpenAPI / Swagger

- **Swagger UI interactivo:** `/api-docs` (en local y en producción). Permite probar cada endpoint con *Try it out*.
- **Archivo OpenAPI 3.0:** [`openapi.json`](openapi.json), en la raíz del repositorio. Se genera a partir de los comentarios `@swagger` de las rutas:

```bash
npm run docs:openapi
```

Si cambias la documentación de alguna ruta, vuelve a ejecutar este comando para actualizar `openapi.json`.

---

## ☁️ Deploy en Railway

1. **Subir el código a GitHub.**
2. En [Railway](https://railway.app/) crear un proyecto con **Deploy from GitHub repo** y elegir este repositorio.
3. **Agregar PostgreSQL** al mismo proyecto (*New → Database → PostgreSQL*).
4. **Variables del servicio Node.js** (*Variables*):
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (referencia a la URL interna de la base).
   - `NODE_ENV` = `production`.
   - `PORT` lo asigna Railway automáticamente y el servidor lo lee con `process.env.PORT`.
5. Railway ejecuta `npm install` y luego `npm start` (`node server.js`).
6. **Crear las tablas en la base de Railway** (una sola vez, o después de cambiar el schema). Desde tu computadora, usando la URL **pública** de la base (`DATABASE_PUBLIC_URL` en Railway):

   ```bash
   DATABASE_URL="<DATABASE_PUBLIC_URL de Railway>" npm run db:seed
   ```

   Si la conexión pide SSL, agrega `DB_SSL=true` delante del comando.
7. En *Settings → Networking* generar un dominio público y comprobar `/` y `/api-docs`.

### Internal URL vs Public URL

- **Internal URL** (`DATABASE_URL`, `*.railway.internal`): red privada de Railway. La usa la API en producción para hablar con PostgreSQL; es más rápida y no está expuesta a internet.
- **Public URL** (`DATABASE_PUBLIC_URL` y el dominio `*.up.railway.app`): acceso desde fuera de Railway. La de la base sirve para ejecutar `db:setup`/`db:seed` desde tu computadora; la del servicio es la que usan los usuarios y evaluadores para consumir la API y Swagger.

---

## 🤖 Uso de Inteligencia Artificial

Durante el desarrollo se usó IA como herramienta de apoyo para:

- **Diseño de base de datos:** esquema relacional con UUID generados por PostgreSQL (`gen_random_uuid()`).
- **Consultas SQL:** uso de `RETURNING *` para devolver el registro creado o actualizado.
- **Depuración:** errores de conexión a PostgreSQL en Windows (*Connection refused*).
- **Documentación:** especificación OpenAPI/Swagger y este README.

Más detalle en [documentacion/IA.md](documentacion/IA.md).
