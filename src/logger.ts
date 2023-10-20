import { config, createLogger, format, transports } from 'winston';

import { IS_PRODUCTION } from 'shared.constants';

const logger = createLogger({
    levels: config.syslog.levels,
    defaultMeta: {
        service: 'query-studio',
    },
    exitOnError: false,
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format((info) => {
            info.traceId = global.span.spanContext().traceId;
            info.spanId = global.span.spanContext().spanId;

            return info;
        })(),
    )
});

if (!IS_PRODUCTION) {
    logger.add(new transports.Console({
        level: 'debug',
        format: format.combine(
            format.colorize({ all: true, colors: { debug: 'cyan' } }),
            format.splat(),
            format.printf((info) => {
                return `[${info.spanId}] [${info.message}]${info.data ? ` ${JSON.stringify(info.data)}` : ""}${info.stack ? ` ${info.stack}` : ''}`;
            })
        )
    }));
} else {
    logger.add(new transports.Console({
        level: process.env.QUERY_STUDIO_LOG_LEVEL || 'info',
        format: format.json()
    }));
}

export default logger;
