export function errorHandler(error, _request, response, _next) {
  const requestedStatus = Number(error.status ?? error.statusCode)
  const status = Number.isInteger(requestedStatus)
    && requestedStatus >= 400
    && requestedStatus <= 599
    ? requestedStatus
    : 500

  if (status >= 500) {
    console.error(error)
  }

  const message = status >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : error.message || 'Internal server error'

  response.status(status).json({
    error: {
      message,
      status,
    },
  })
}
