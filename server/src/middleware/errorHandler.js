export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Not found' })
}

export function errorHandler(err, req, res, _next) {
  console.error(err)
  res.status(err.status ?? 500).json({
    message: err.expose ? err.message : 'Internal server error',
  })
}
