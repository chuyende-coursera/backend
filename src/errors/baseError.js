import errorCode from "../utils/errorCode";
import BasicError from "./error";

class BaseError extends BasicError {
  constructor({ type, statusCode, error, message, name }) {
    super(message, name);
    this.name = "BaseApiError";
    if (name) {
      this.name = `${this.name} => ${name}Error`;
    }
    this.type = type || null;
    const customError = type ? errorCode[type] : null;

    this.code = customError && customError.code;
    this.statusCode = statusCode || 500;
    this.error = error || null;
    this.stack = error ? error.stack : null;
    if (message) {
      this.message = message;
    } else {
      this.message = customError ? `${customError.messages[0]}` : "";
    }
    if (error) {
      this.messageError = `${error.message}`;
    }
    this.errors = [
      {
        code: this.code,
        message: `${error ? this.messageError : this.message}`,
        type,
        stack: this.stack
      }
    ];
    Error.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
