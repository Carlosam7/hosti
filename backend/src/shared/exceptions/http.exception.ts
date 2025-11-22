export class HttpException extends Error {
  status: number;
  error: string;
  message: string;
  details?: object | undefined;

  constructor(
    status: number,
    error: string,
    message: string,
    details?: object
  ) {
    super(message);
    this.status = status;
    this.error = error;
    this.message = message;
    this.details = details;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = "Bad Request", details?: object) {
    super(400, "Bad Request", message, details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = "Unauthorized") {
    super(401, "Unauthorized", message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = "Forbidden") {
    super(403, "Forbidden", message);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = "Conflict") {
    super(409, "Conflict", message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = "An unexpected error occurred") {
    super(500, "Internal Server Error", message);
  }
}
