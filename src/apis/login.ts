import logger from "logger";

import { bad_request, ok } from "http/responses";
import { cors } from "http/cors";
import { fetcher } from "http/fetcher";
import { getBody, getter } from "http/get-body";
import { Method } from "http/method";
import { QUERY_API_USER_TOKEN_VALUE } from "http/http.constants";
import { RequestHeader } from 'http/header';
import { setUserSession } from "apis/user-session";

export async function apiLogin(req: Request): Promise<Response> {
    const formData = await getBody(req, getter.formData) as FormData;

    const email = formData.get("email");
    const password = formData.get("password");

    logger.info("LOGIN_START", { data: { email, password: password ? "*****" : "" } });
    logger.debug("LOGIN_START", { data: { email, password } });

    if (!email || !password) {
        throw bad_request("Email and password are required.");
    }

    const response = await fetcher(QUERY_API_USER_TOKEN_VALUE, {
        getter: getter.json,
        method: Method.POST,
        body: JSON.stringify({ email, password }),
        headers: {
            [RequestHeader.CONTENT_TYPE]: "application/json",
        },
    });

    const json = response[`${getter.json}`] as unknown as { data: { token: string }[] };
    const res = ok(JSON.stringify(json));

    setUserSession(json.data[0].token, res);
    cors(res);

    logger.info("LOGIN_END");

    return res;
};
