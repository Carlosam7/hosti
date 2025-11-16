export class HttpException extends Error {
  status: number;
  error: string;
  message: string;

  constructor(status: number, error: string, message: string) {
    super(message);
    this.status = status;
    this.error = error;
    this.message = message;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = "Bad Request") {
    super(400, "Bad Request", message);
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

export class InternalServerErrorException extends HttpException {
  constructor(message: string = "An unexpected error occurred") {
    super(500, "Internal Server Error", message);
  }
}
