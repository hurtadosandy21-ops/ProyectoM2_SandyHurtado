// Manejador global de errores.
// Los controladores envían aquí cualquier error con next(error)
// y este archivo decide qué código HTTP y qué mensaje devolver.
// IMPORTANTE: debe registrarse en app.js DESPUÉS de todas las rutas.

function errorHandler(err, req, res, next) {
  // JSON mal escrito en el body (por ejemplo, una coma de más)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado no es válido' });
  }

  // Errores de PostgreSQL (err.code es el código del error)
  switch (err.code) {
    case '22P02': // formato inválido (por ejemplo, un ID que no es UUID)
      return res.status(400).json({ error: 'El ID tiene un formato inválido' });

    case '23502': // campo obligatorio nulo
      return res.status(400).json({ error: 'Falta un campo obligatorio' });

    case '23505': // valor único repetido
      return res.status(409).json({
        error:
          err.constraint && err.constraint.includes('email')
            ? 'El email ya está registrado'
            : 'Ya existe un registro con esos datos',
      });

    case '23503': // llave foránea (relación entre tablas)
      return res.status(409).json({
        error: 'La operación no es posible porque hay registros relacionados (por ejemplo, el autor tiene posts)',
      });
  }

  // Cualquier otro error: se registra en consola/Railway y se responde 500
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorHandler;
