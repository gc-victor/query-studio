import logger from "logger";
import { ResponseError } from "./response-error";
import { Status, StatusMessage } from "./status";


export function ok(body: string): Response {
    return new Response(body, { status: Status.OK });
}

export function created(): Response {
    return new Response('', { status: Status.CREATED });
}

export function no_content(): Response {
    return new Response('', { status: Status.NO_CONTENT });
}

export function unauthorized() {
    throw new ResponseError(JSON.stringify({ message: '', status: Status.UNAUTHORIZED }));
}

export function not_found() {
    throw new ResponseError(JSON.stringify({ message: '', status: Status.NOT_FOUND }));
}

export function not_implemented() {
    throw new ResponseError(JSON.stringify({ message: '', status: Status.NOT_IMPLEMENTED }));
}

export function bad_request(message: string) {
    throw new ResponseError(JSON.stringify({ message, status: Status.BAD_REQUEST }));
}

export function internal_server_error(error?: unknown) {
    logger.error("INTERNAL_SERVER_ERROR", error);
    throw new ResponseError(JSON.stringify({ message: StatusMessage.INTERNAL_SERVER_ERROR, status: Status.INTERNAL_SERVER_ERROR }));
}