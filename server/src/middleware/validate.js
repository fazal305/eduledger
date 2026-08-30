export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      })
    }
    req.body = result.data
    next()
  }
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid query parameters',
        errors: result.error.flatten().fieldErrors,
      })
    }
    req.validatedQuery = result.data
    next()
  }
}
