class AppError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    statusCode = statusCode;
  }
}

export default AppError;
