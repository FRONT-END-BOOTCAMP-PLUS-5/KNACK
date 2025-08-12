export class InsufficientPointsError extends Error {
    status = 400;
    constructor(message = 'insufficient_points') {
        super(message);
        this.name = 'InsufficientPointsError';
    }
}

export class DuplicateOperationError extends Error {
    status = 409;
    constructor(message = 'duplicate_operation') {
        super(message);
        this.name = 'DuplicateOperationError';
    }
}