import logger from 'logger';
import { bad_request, internal_server_error } from './responses';
import { url } from './url';
import { getBody, getter, Getter } from './get-body';

interface FetcherOptions extends RequestInit {
    getter?: Getter;
}

interface FetcherResponse extends Response {
    [key: string]: unknown;
}

export async function fetcher(path: string, options?: FetcherOptions): Promise<FetcherResponse> {
    logger.info("FETCH_REQUEST", { data: `${options?.method} ${url(path)}` });

    const res = await fetch(url(path), options);

    if (!res.ok) logger.error("FETCH_RESPONSE", { data: `${options?.method} [${res.status}] ${res.url}` });

    if (res.status >= 500) {
        throw internal_server_error();
    } else if (res.status >= 400) {
        const text = await res.text().catch(() => res.statusText);

        throw bad_request(text);
    }

    const body = await getBody(res as Body, getter.json);

    logger.info("FETCH_RESPONSE", {
        data: {
            status: res.status,
            headers: res.headers
        }
    });
    logger.debug("FETCH_RESPONSE", {
        data: {
            status: res.status,
            headers: res.headers,
            body,
        }
    });

    return { ...res, [`${getter.json}`]: body };
}