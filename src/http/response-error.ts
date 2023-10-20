import { Status } from "./status";

export interface ResponseErrorMessage {
    message: string;
    status: Status;
}

export class ResponseError extends Error {
    #message: ResponseErrorMessage;

    constructor(message: string) {
        super(message);
        this.#message = JSON.parse(message);
    }

    get cause(): ResponseErrorMessage {
        return this.#message;
    }
}

export type SessionError = Error;