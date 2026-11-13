export function errorHandler(error, _request, response, _next) {
  const status = Number(error.status || error.statusCode) || 500

  if (status >= 500) {
    console.error(error)
  }

  response.status(status).json({
    message: status >= 500 ? 'Internal server error' : error.message,
  })
}
