## 🤖 Registro Detallado del Uso de Inteligencia Artificial (AI)

Durante el desarrollo de esta API de MiniBlog, se utilizó asistencia de Inteligencia Artificial (AI) como una herramienta de apoyo colaborativo para el diseño de arquitectura, depuración de errores, consultas SQL y documentación.

> **Nota importante:** Los fragmentos e ideas generadas por la IA sirvieron como base de referencia teórica y práctica. Todo el código, la adaptación de los controladores, las consultas y la integración final fueron revisados, probados e implementados manualmente en el repositorio.

---

### 💬 Historial de Interacciones y Prompts

#### 1. Generación automática de identificadores UUID en PostgreSQL
* **👤 Prompt del usuario:** 
  > *"¿Cómo configuro mis tablas en PostgreSQL para utilizar identificadores únicos universales (UUID) de manera automática sin depender de IDs autoincrementales?"*
* **🤖 Respuesta de la IA:** 
  Se sugirió utilizar la extensión nativa de PostgreSQL habilitando tipos de datos `UUID` y estableciendo `DEFAULT gen_random_uuid()` como valor predeterminado en las llaves primarias de las tablas `authors` y `posts`.

  ![Imagen de código proporcionado ](/assets/UUID.png)


* **💡 Lección Aprendida / Implementación:** 
  Comprender la ventaja de los UUIDs frente a los IDs secuenciales en términos de seguridad y distribución de datos, aplicándolo directamente en el script de configuración de la base de datos.

#### 2. Recuperación de datos insertados con `RETURNING *`
* **👤 Prompt del usuario:** 
  > *"¿Cómo puedo hacer para que, al momento de insertar un registro en PostgreSQL desde Node.js usando el paquete `pg`, la base de datos me devuelva de inmediato el objeto creado con su UUID?"*
* **🤖 Respuesta de la IA:** 
  Se indicó incorporar la cláusula SQL `RETURNING *` al final de la sentencia `INSERT` dentro de la consulta ejecutada por el pool de conexiones, permitiendo extraer `result.rows[0]`.
* **💡 Lección Aprendida / Implementación:** 
  Evitar consultas adicionales de tipo `SELECT` posteriores a la inserción, optimizando el rendimiento de los servicios y asegurando que la API responda con el recurso completo recién creado.

#### 3. Estructuración de arquitectura limpia (Servicios y Controladores)
* **👤 Prompt del usuario:** 
  > *"¿Cuál es la mejor manera de separar la lógica de conexión a la base de datos de las rutas y respuestas HTTP en un proyecto de Express?"*
* **🤖 Respuesta de la IA:** 
  Se recomendó adoptar una arquitectura basada en capas separando la lógica en `services` (encargados exclusivamente de interactuar con la base de datos) y `controllers` (encargados de gestionar peticiones HTTP, validaciones y códigos de estado).
* **💡 Lección Aprendida / Implementación:** 
  Mejorar la mantenibilidad del código backend, facilitando la lectura de los endpoints y permitiendo reutilizar la lógica de negocio de manera más limpia.

#### 4. Manejo de restricciones únicas en la base de datos (Error 23505)
* **👤 Prompt del usuario:** 
  > *"¿Cómo puedo capturar el error de duplicidad de correo electrónico en PostgreSQL dentro de mi controlador de Node.js para enviarle un mensaje claro al cliente?"*
* **🤖 Respuesta de la IA:** 
  Se sugirió implementar bloques `try...catch` evaluando la propiedad `error.code === '23505'` (código estándar de violación de restricción única en PostgreSQL) para responder con un estado HTTP 400.

![Imagen de código proporcionado ](../assets/arreglo.png)

* **💡 Lección Aprendida / Implementación:** 
  Transformar errores crudos de la base de datos en respuestas HTTP amigables y comprensibles para el usuario final de la API.

#### 5. Validación de datos de entrada obligatorios
* **👤 Prompt del usuario:** 
  > *"¿Cómo valido de forma sencilla en el controlador que los campos requeridos como el nombre y el correo no lleguen vacíos antes de enviarlos al servicio?"*
* **🤖 Respuesta de la IA:** 
  Se recomendó realizar comprobaciones condicionales al inicio de los métodos del controlador validando propiedades como `!name` o `email.trim() === ''`, retornando un estado HTTP 400 en caso de incumplimiento.
* **💡 Lección Aprendida / Implementación:** 
  Asegurar la integridad de los datos antes de realizar operaciones costosas en la base de datos, protegiendo el sistema contra peticiones mal formadas.

#### 6. Documentación interactiva con OpenAPI y Swagger UI
* **👤 Prompt del usuario:** 
  > *"¿Cómo configuro JSDoc para documentar correctamente un parámetro de tipo UUID en una ruta GET usando `swagger-jsdoc`?"*
* **🤖 Respuesta de la IA:** 
  Se proporcionó la estructura de sintaxis OpenAPI dentro de comentarios multilínea especificando `in: path`, `name: id` y configurando el esquema con `type: string` y `format: uuid`.
* **💡 Lección Aprendida / Implementación:** 
  Lograr una documentación interactiva precisa que permita a cualquier desarrollador comprender los tipos de datos exactos que espera la API.

#### 7. Configuración de puertos dinámicos para entornos de producción
* **👤 Prompt del usuario:** 
  > *"¿Cómo debo configurar el archivo principal de Express para que funcione tanto con un puerto local fijo como con el puerto asignado automáticamente por un proveedor en la nube?"*
* **🤖 Respuesta de la IA:** 
  Se indicó utilizar la expresión lógica `const PORT = process.env.PORT || 3000;` al momento de inicializar el método `app.listen()`.
* **💡 Lección Aprendida / Implementación:** 
  Garantizar la compatibilidad del servidor backend con plataformas de despliegue automatizado que requieren puertos asignados de forma dinámica.

#### 8. Gestión de variables de entorno y conexión en la nube (Railway)
* **👤 Prompt del usuario:** 
  > *"¿Cómo estructuro la conexión de `pg` para que lea correctamente las credenciales del archivo `.env` en local y las referencias del servicio en Railway?"*
* **🤖 Respuesta de la IA:** 
  Se recomendó configurar el objeto `Pool` utilizando variables individuales (`host`, `user`, `password`, `database`, `port`) vinculadas a `process.env`, facilitando la inyección de datos desde el panel de Railway.
* **💡 Lección Aprendida / Implementación:** 
  Mantener las credenciales seguras fuera del código fuente y asegurar una transición fluida del entorno de desarrollo local al entorno de producción en la nube.

#### 9. Diagnóstico y solución de errores de conexión local (`Connection refused`)
* **👤 Prompt del usuario:** 
  > *"¿Por qué obtengo un error de conexión rechazada al intentar conectar mi aplicación Node.js con una instancia local de PostgreSQL en Windows?"*
* **🤖 Respuesta de la IA:** 
  Se diagnosticaron posibles causas como el servicio de Postgres detenido en Windows, variaciones en el puerto predeterminado (5432) o restricciones de red/firewall local, sugiriendo verificar el estado de los servicios del sistema operativo.
* **💡 Lección Aprendida / Implementación:** 
  Desarrollar habilidades de resolución de problemas a nivel de infraestructura local y servicios de red en entornos Windows.

#### 10. Automatización de despliegue mediante control de versiones (Git)
* **👤 Prompt del usuario:** 
  > *"¿Cuáles son los comandos de Git recomendados para enviar mis cambios recientes al repositorio y asegurar que la plataforma en la nube compile la nueva versión?"*
* **🤖 Respuesta de la IA:** 
  Se repasó el flujo estándar de comandos (`git add .`, `git commit -m "..."`, y `git push origin main`) para sincronizar el código con el repositorio remoto vinculado a Railway.
* **💡 Lección Aprendida / Implementación:** 
  Optimizar el flujo de trabajo de integración y despliegue continuo (CI/CD) básico mediante despliegues automáticos basados en commits.

  - [Volver](./README.md)