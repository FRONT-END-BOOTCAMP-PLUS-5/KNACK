// server/errors/http.ts
export class HttpError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message); this.status = status
    }
}
export class BadRequest extends HttpError { constructor(m = 'bad request') { super(400, m) } }
export class Unauthorized extends HttpError { constructor(m = 'unauthorized') { super(401, m) } }
export class Forbidden extends HttpError { constructor(m = 'forbidden') { super(403, m) } }
export class NotFound extends HttpError { constructor(m = 'not found') { super(404, m) } }
