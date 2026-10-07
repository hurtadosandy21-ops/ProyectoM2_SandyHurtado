# 🚀 MiniBlog API - DevSpark

API RESTful desarrollada con **Node.js**, **Express** y **PostgreSQL** para la gestión de un MiniBlog. Permite administrar autores y publicaciones (posts) utilizando identificadores únicos universales (**UUIDs**) generados por la base de datos.

---

## 📋 Descripción del Proyecto
Este proyecto implementa el backend para un sistema de blog minimalista. Cuenta con una arquitectura limpia basada en servicios y controladores, validaciones de datos, manejo de errores optimizado, documentación interactiva mediante **OpenAPI (Swagger)** y soporte para despliegue en la nube con **Railway**.

---

### 🔗 Enlaces del Proyecto

- **Swagger:** [Abrir Swagger](https://proyectom2sandyhurtado-production.up.railway.app/api-docs)

- **Railway (Producción):** [Abrir Railway](https://proyectom2sandyhurtado-production.up.railway.app/)

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

#### 📄 Documentación OpenAPI / Swagger UI

La documentación de la API está integrada de forma interactiva mediante **Swagger UI** y estandarizada bajo la especificación **OpenAPI**. Esta interfaz gráfica permite explorar, comprender y probar en tiempo real todos los endpoints del MiniBlog (autores y publicaciones), detallando los métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`), los esquemas de datos, los parámetros requeridos (como los identificadores UUID) y los códigos de respuesta.

#### 🔍 ¿Qué ofrece esta documentación interactiva?
* **Visualización de Contratos:** Muestra claramente la estructura exacta en formato JSON que espera recibir cada ruta y lo que devolverá como respuesta.
* **Función "Try it out":** Permite ejecutar peticiones directamente desde el navegador web para probar la API sin necesidad de usar herramientas externas como Postman o cURL.
* **Esquemas de Modelos (Schemas):** Detalla el diccionario de datos estructural de los recursos principales (`Author` y `Post`) y sus restricciones obligatorias.

---

#### 🔗 Enlaces de Acceso y Ejemplos

Dependiendo de dónde se esté ejecutando el proyecto, la interfaz de la documentación estará disponible a través de las siguientes rutas:

* **En entorno local (Desarrollo):**
  Una vez que enciendas tu servidor en tu computadora, la estructura del enlace generado será similar a esta:
  `http://localhost:3000/api-docs` *(Ejemplo de referencia local)*

* **En producción (Railway):**
  Una vez completado el despliegue en la nube, la plataforma te asignará un dominio público donde podrás consultar la documentación en vivo:
  `https://tu-proyecto.up.railway.app/api-docs` *(Ejemplo de URL pública en producción)*

## 5. ☁️ Guía de Deployment en Railway

Para desplegar este proyecto en producción utilizando **Railway**, sigue estos pasos:

###  Conectar el repositorio: 

1. **Sube tu código a GitHub.**
Entra a [Railway](https://railway.app/), crea un nuevo proyecto seleccionando *Deploy from GitHub repo* y vincula tu repositorio.
2. **Añadir Base de Datos:** Agrega un servicio complementario de **PostgreSQL** dentro del mismo proyecto en Railway.
3. **Vincular Servicios y Variables de Entorno:**
   Railway facilita la conexión mediante una única variable unificada:
   * **`DATABASE_URL`**: Railway genera automáticamente esta cadena de conexión cuando vinculas tu servicio de Node.js con la base de datos de PostgreSQL. Asegúrate de que tu aplicación lea esta variable en lugar de credenciales individuales.
   * **`PORT`**: Railway lo asigna de forma dinámica, por lo que tu servidor debe configurarse usando `process.env.PORT`.

> 💡 **Consejo de configuración en el código:** Para que tu aplicación reconozca esta variable tanto en local (si decides usar una URL de conexión) como en producción, puedes configurar tu `Pool` de PostgreSQL en Node.js de la siguiente manera:
> ```javascript
> const { Pool } = require('pg');
> 
> const pool = new Pool({
>   connectionString: process.env.DATABASE_URL,
>   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
> });
> ```

> 📌 **Nota sobre la implementación:** Esta es la forma en la que se configuró y estructuró este proyecto específico utilizando una URL de conexión unificada (`DATABASE_URL`). Sin embargo, ten en cuenta que existen otras opciones válidas de configuración en la plataforma (como el uso de variables separadas para host, usuario, contraseña, puerto y nombre de base de datos) según las preferencias de arquitectura de cada desarrollador.

### 6. Diferencia clave entre URLs:
   * **Internal URL (Red Interna):** Es la dirección privada que utiliza Railway para que tu servicio Node.js y PostgreSQL se comuniquen de forma ultrarrápida y segura dentro del mismo clúster en la nube.
   * **Public URL (Dominio Público):** Es el enlace web público generado por Railway (ej. `https://miniblog-production.up.railway.app`) que permite a los usuarios externos y evaluadores acceder a la API y a la interfaz de Swagger desde internet.

### 7. Internal URL vs Public URL:

**Internal URL**: Es la dirección de red privada que provee Railway para que tu servicio Node.js se comunique con la base de datos PostgreSQL de forma rápida y segura dentro del mismo clúster.

**Public URL**: Es el dominio web público generado por Railway (ej. `https://miniblog-production.up.railway.app`) que permite a los usuarios externos y colaboradores acceder a la API y a la documentación de Swagger desde internet.

## 8. 🤖 Registro del Uso de Inteligencia Artificial (AI) en el Proyecto

Durante el desarrollo de esta API, se utilizó asistencia de Inteligencia Artificial (IA) como herramienta colaborativa para los siguientes propósitos:

Diseño de base de datos: Estructuración de esquemas relacionales utilizando extensiones nativas de PostgreSQL para la generación segura de UUIDs (gen_random_uuid()).

Optimización de consultas SQL: Implementación de la cláusula RETURNING * en las operaciones de inserción y actualización para garantizar que la API devuelva los identificadores generados en tiempo de ejecución.

Depuración de errores: Resolución de bloqueos de servicios locales en Windows y errores de conexión a PostgreSQL (Connection refused).

Documentación: Estructuración y redacción de las especificaciones OpenAPI/Swagger y el presente archivo README.

## Información más detallada del: 

- [Uso de IA](/documentacion/IA.md)
