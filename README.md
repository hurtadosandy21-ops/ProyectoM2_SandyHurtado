# 🚀 MiniBlog API - DevSpark

API RESTful desarrollada con **Node.js**, **Express** y **PostgreSQL** para la gestión de un MiniBlog. Permite administrar autores y publicaciones (posts) utilizando identificadores únicos universales (**UUIDs**) generados por la base de datos.

---

## 📋 Descripción del Proyecto
Este proyecto implementa el backend para un sistema de blog minimalista. Cuenta con una arquitectura limpia basada en servicios y controladores, validaciones de datos, manejo de errores optimizado, documentación interactiva mediante **OpenAPI (Swagger)** y soporte para despliegue en la nube con **Railway**.

---
## Información detallada de: 

- [Uso de IA](../documentacion/IA.md)

## 🛠️ Requisitos y Pasos para Ejecutar Local

### Prerrequisitos
* **Node.js** (versión 18 o superior recomendada).
* **PostgreSQL** (versión 16 instalada localmente o un servidor accesible).

### 1. Clonar el repositorio e instalar dependencias
```
git clone <url-de-tu-repositorio>
cd nombre-de-tu-repositorio
npm install
```

### 2. Configurar las variables de entorno
Crea un archivo llamado .env en la raíz del proyecto basándote en el siguiente ejemplo:

```
Fragmento de código
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=miniblog_db
DB_PORT=5432

```

### 3. Configurar la Base de Datos (Setup SQL)

Abre tu cliente de PostgreSQL (como pgAdmin o la terminal psql) y ejecuta el siguiente script para crear las tablas con soporte para UUIDs:

```
SQL
-- Borrar tablas anteriores si existen
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

-- Crear tabla authors con UUID automático
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla posts con UUID automático y relación con authors
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Ejecutar el servidor en modo desarrollo
```
npm run dev

El servidor estará corriendo en http://localhost:8080.
```
**🧪 Cómo Ejecutar Tests**

Para ejecutar las pruebas automatizadas del proyecto (si aplica), utiliza el siguiente comando:

```
npm test
```

**📄 Documentación OpenAPI / Swagger UI**

La documentación interactiva de la API está integrada mediante Swagger.

En entorno local: Una vez que tu servidor esté encendido, abre en tu navegador:
http://localhost:3000/api-docs

En producción (Railway):
https://tu-proyecto.up.railway.app/api-docs


## ☁️ Guía de Deployment en Railway
Para desplegar este proyecto en producción usando Railway, sigue estos pasos:

### 1.Conectar el repositorio: 
Sube tu código a un repositorio público o privado en GitHub. Entra a Railway, crea un nuevo proyecto seleccionando Deploy from GitHub repo y elige tu repositorio.

### 2.Agregar la Base de Datos PostgreSQL:
 Dentro de tu proyecto en Railway, añade un servicio complementario de PostgreSQL.

### 3.Configurar las Variables de Entorno (Environment Variables):
Railway enlazará automáticamente las variables de tu base de datos si utilizas las referencias internas, o puedes configurarlas manualmente en la pestaña Variables:

**PORT** (Railway lo asigna de forma dinámica, asegúrate de usar process.env.PORT en tu código).

**DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT** (puedes usar las credenciales que provee el plugin de PostgreSQL en Railway).

### Internal URL vs Public URL:

**Internal URL**: Es la dirección de red privada que provee Railway para que tu servicio Node.js se comunique con la base de datos PostgreSQL de forma rápida y segura dentro del mismo clúster.

**Public URL**: Es el dominio web público generado por Railway (ej. https://miniblog-production.up.railway.app) que permite a los usuarios externos y colaboradores acceder a la API y a la documentación de Swagger desde internet.

## 🤖 Registro del Uso de Inteligencia Artificial (AI) en el Proyecto

Durante el desarrollo de esta API, se utilizó asistencia de Inteligencia Artificial (IA) como herramienta colaborativa para los siguientes propósitos:

Diseño de base de datos: Estructuración de esquemas relacionales utilizando extensiones nativas de PostgreSQL para la generación segura de UUIDs (gen_random_uuid()).

Optimización de consultas SQL: Implementación de la cláusula RETURNING * en las operaciones de inserción y actualización para garantizar que la API devuelva los identificadores generados en tiempo de ejecución.

Depuración de errores: Resolución de bloqueos de servicios locales en Windows y errores de conexión a PostgreSQL (Connection refused).

Documentación: Estructuración y redacción de las especificaciones OpenAPI/Swagger y el presente archivo README.