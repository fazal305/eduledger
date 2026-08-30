export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.status = 404
    this.expose = true
  }
}

export class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message)
    this.status = 409
    this.expose = true
  }
}

export class BadRequestError extends Error {
  constructor(message = 'Bad request') {
    super(message)
    this.status = 400
    this.expose = true
  }
}
