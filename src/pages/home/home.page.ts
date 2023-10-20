import 'h/document';

import { getUserSession, userSession } from 'apis/user-session';
import logger from 'logger';

import { homeContent } from './home.content';
import { template } from '../template' with { type: "macro" };
import { getStyle, getScripts } from '../get-bundle-files';
import { PAGE_LOGIN } from '../../shared.constants';

export async function pageHome(req: Request) {
    logger.info("HOME_PAGE_START");

    try {
        const sessionToken = getUserSession(req);

        if (!sessionToken) {
            return Response.redirect(PAGE_LOGIN);
        } else if (userSession.isExpired(sessionToken)) {
            userSession.refresh(sessionToken);
        }
    } catch (error) {
        logger.error("HOME_PAGE", error);

        return Response.redirect(PAGE_LOGIN);
    }

    let html = await template();

    html = html
        .replace("<title></title>", "<title>Query Login</title>")
        .replace("</head>", `
            ${await getStyle('/dist/styles.css')}
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="/public/tabulator.css">
            <link rel="stylesheet" href="/public/highlightjs@11.8.0_dark.min.css">
        </head>`)
        .replace("<body></body>", `
            <body>
                ${homeContent()}
                ${await getScripts('/dist/pages/home/home.island.js', './src/pages/home/home.island.ts')}
            </body>`)
        .replace("<body>", '<body class="bg-slate-950 border border-slate-600 overflow-hidden text-white">');

    logger.info("HOME_PAGE_END");

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        },
    });
}