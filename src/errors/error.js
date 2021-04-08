class BasicError extends Error {
    constructor(message) {
        super(message);
        this.isApiError = true,
        this.name = 'BasicApiError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default BasicError;