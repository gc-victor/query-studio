import logger from "logger";

import { cors } from "http/cors";
import { fetcher } from "http/fetcher";
import { getBody, getter } from "http/get-body";
import { getUserSession, userSession } from "apis/user-session";
import { Method } from "http/method";
import { ok } from "http/responses";
import { QUERY_API_QUERY } from "http/http.constants";
import { RequestHeader } from "http/header";

export async function apiQuery(req: Request): Promise<Response> {
    const { db_name, query, params } = await getBody(req, getter.json) as { db_name: string, query: string, params?: unknown[] | { [key: string]: unknown } };

    logger.info("QUERY_START");
    logger.debug("QUERY_START", { data: { db_name, query, params } });

    const sessionToken = getUserSession(req);

    if (userSession.isExpired(sessionToken)) {
        userSession.refresh(sessionToken);
    }

    logger.debug("QUERY_SESSION_TOKEN", { data: sessionToken });

    const session = userSession.load(sessionToken);

    logger.debug("QUERY_SESSION", { data: session });

    const response = await fetcher(QUERY_API_QUERY, {
        getter: getter.json,
        method: Method.POST,
        body: JSON.stringify({ db_name, query, params }),
        headers: {
            [RequestHeader.AUTHORIZATION]: `Bearer ${session.token}`,
            [RequestHeader.CONTENT_TYPE]: "application/json",
        },
    });
    
    const res = ok(JSON.stringify((response[`${getter.json}`] as unknown as { data: unknown[]; })));

    cors(res);
    userSession.refresh(sessionToken);

    logger.info("QUERY_END");

    return res;
}
