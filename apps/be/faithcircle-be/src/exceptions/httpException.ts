export class HttpException extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;

    // Maintains proper stack trace (only in V8 environments)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
