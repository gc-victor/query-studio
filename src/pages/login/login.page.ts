import 'h/document';

import logger from 'logger';
import { getUserSession, userSession } from 'apis/user-session';

import { loginContent } from './login.content';
import { template } from '../template' with { type: "macro" };
import { getStyle, getScripts } from '../get-bundle-files';
import { PAGE_HOME } from '../../shared.constants';

export async function pageLogin(req: Request) {
    try {
        const sessionToken = getUserSession(req);

        if (sessionToken) {
            logger.info("LOGIN_PAGE_REDIRECT_TO_HOME");
            userSession.refresh(sessionToken);
            return Response.redirect(PAGE_HOME);
        }
    } catch { }

    let html = await template();

    html = html
        .replace("<title></title>", "<title>Query Login</title>")
        .replace("</head>", `${await getStyle('/dist/styles.css')}</head>`)
        .replace("<body></body>", `
            <body>
                ${loginContent()}
                ${await getScripts('/dist/pages/login/login.island.js', './src/pages/login/login.island.tsx')}
            </body>`)
        .replace("<body>", '<body class="bg-slate-950 text-white bg-gradient-to-b from-slate-900 to-slate-950">');

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        },
    });
}

