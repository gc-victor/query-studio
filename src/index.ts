import { serve } from "bun";

import { ConsoleSpanExporter, NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { apiLogin } from "apis/login";
import { apiLogout } from "apis/logout";
import { apiQuery } from "apis/query";

import { Status, StatusMessage } from "http/status";
import { not_found } from "http/responses";

import logger from "logger";
import { API_LOGIN, API_LOGOUT, API_QUERY, PAGE_LOGIN } from "./shared.constants";
import { UserSessionError } from "apis/user-session";
import { ResponseError } from "http/response-error";
import { pageLogin } from "pages/login/login.page";
import { pageHome } from "pages/home/home.page";

// TODO: validate the environment variables

// Create a tracer provider with a console exporter
const tracerProvider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'query-studio',
    }),
});
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
tracerProvider.register();

const { port } = serve({
    fetch(req: Request): Response | Promise<Response> {
        global.span = tracerProvider.getTracer('query-studio').startSpan('log');

        const { pathname } = new URL(req.url);

        logger.info("START_REQUEST", { data: { method: req.method, url: req.url } });
        logger.debug("START_REQUEST", { data: { method: req.method, url: req.url, headers: req.headers } });

        // TODO: add cache control headers for static assets
        if (/^\/dist\//.test(pathname)) return new Response(Bun.file(`.${pathname}`), { status: Status.OK });
        if (/^\/public\//.test(pathname)) return new Response(Bun.file(`.${pathname}`), { status: Status.OK });
        if (pathname === "/") return pageHome(req);
        if (pathname === PAGE_LOGIN) return pageLogin(req);
        if (pathname === API_QUERY) return apiQuery(req);
        if (pathname === API_LOGIN) return apiLogin(req);
        if (pathname === API_LOGOUT) return apiLogout(req);

        throw not_found();

    },
    error(e: Error): Response {
        if (e instanceof ResponseError) {
            const error = e as ResponseError;

            logger.error("RESPONSE_END (ResponseError)", error);

            return new Response(error?.cause?.message || StatusMessage.INTERNAL_SERVER_ERROR, {
                status: error?.cause?.status || Status.INTERNAL_SERVER_ERROR
            });
        } else if (e instanceof UserSessionError) {
            logger.error("RESPONSE_END (UserSessionError)", e);

            return new Response("", {
                status: Status.UNAUTHORIZED
            });
        } else {
            logger.error("RESPONSE_END (Error)", e);

            return new Response(e.message, {
                status: Status.BAD_REQUEST
            });
        }
    },

    // Optional port number - the default value is 3000
    port: process.env.QUERY_STUDIO_PORT || 3000,
});

console.log(`Listening on http://localhost:${port}`);
