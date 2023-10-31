class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.status = `${code}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class Forbidden extends AppError {
  constructor(message) {
    super(message || "Forbidden", 403);
  }
}

class Unauthorized extends AppError {
  constructor(error, errorCode) {
    super(error || "Unauthorized", errorCode || 403);
  }
}

module.exports = { AppError, Forbidden, Unauthorized };
