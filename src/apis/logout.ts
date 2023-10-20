import logger from "logger";

import { client } from "http/client";
import { getUserSession, userSession } from "apis/user-session";
import { PAGE_LOGIN } from 'shared.constants';
import { ResponseHeader } from "http/header";


export function apiLogout(req: Request): Response {
    logger.info("LOGOUT_START");

    try {
        const session = getUserSession(req);
        userSession.clear(session);
    } catch {}

    const res = Response.redirect(client(PAGE_LOGIN));

    res.headers.set(ResponseHeader.SET_COOKIE, "session=; Path=/; Max-Age=0; HttpOnly; Secure;");

    logger.info("LOGOUT_END", { data: { status: res.status, headers: res.headers } });

    return res;
}