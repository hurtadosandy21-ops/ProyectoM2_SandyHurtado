const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  if (err.code === '23505') {
    statusCode = 400;
    message = 'El email ya está registrado';
  } else if (err.code === '23503' || err.code === '22P02') {
    // 🚀 Aquí atrapamos tanto si no existe en la BD (23503) como si el formato de ID es inválido (22P02)
    statusCode = 400;
    message = 'El author_id especificado no existe';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;