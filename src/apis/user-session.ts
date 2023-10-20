import { ResponseHeader } from '../http/header';

export type InnerToken = string;
export type Token = string;

export interface UserSessionLoad {
    token: Token;
    expiresAt: number;
}

export class UserSession {
    #private;
    constructor() {
        this.#private = new Map();
    }
    save(key: InnerToken, outerToken: Token): void {
        // set the expiry time as 120s after the current time
        const now = new Date();
        const expiresAt = +new Date(+now + 60 * 1000);

        this.#private.set(key, { token: outerToken, expiresAt } as UserSessionLoad);
        this.clearExpired();
    }
    load(key: InnerToken): UserSessionLoad {
        return this.#private.get(key);
    }
    clear(key: InnerToken): void {
        this.#private.delete(key);
    }
    isExpired(key: InnerToken): boolean {
        const now = new Date();
        const value = this.#private.get(key);

        if (value) {
            return value.expiresAt < now;
        }

        return true;
    }
    clearExpired(): void {
        this.#private.forEach((_, key) => {
            if (this.isExpired(key)) {
                this.clear(key);
            }
        });
    }
    refresh(key: InnerToken): void {
        const now = new Date();
        const expiresAt = +new Date(+now + 60 * 1000);
        const value = this.#private.get(key);

        if (value) {
            value.expiresAt = expiresAt;
        }
    }
}

export class UserSessionError extends Error {}

export const userSession = new UserSession();

export function getUserSession(req: Request): string {
    const cookie = req.headers.get("cookie");

    if (!cookie) throw new UserSessionError("There isn't a Set Cookie header.");

    const match = cookie.match(/session=([\w-]+)/);

    if (!match) throw new UserSessionError("Session cookie not found.");

    const session = match[1];

    if (!userSession.load(session)) {
        throw new UserSessionError("Session not found.");
    }

    return decodeURIComponent(session);
}

export function setUserSession(token: string, res: Response) {
    const innerToken = crypto.randomUUID();

    userSession.save(innerToken, token);

    res.headers.set(ResponseHeader.SET_COOKIE, `session=${innerToken}; Path=/; Expires=3600000; Max-Age=3600000; HttpOnly; Secure;`);
}
