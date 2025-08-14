export class InsufficientPointsError extends Error {
    status = 400;
    constructor(message = 'insufficient_points') {
        super(message);
        this.name = 'InsufficientPointsError';
    }
}