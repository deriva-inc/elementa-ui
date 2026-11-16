/**
 * This file contains logger utility logic for both server and client environments.
 *
 * @author Aayush Goyal
 * @modified 2026-11-16
 */

// SECTION: Types & Constants
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const ANSI_COLORS = {
    TIMESTAMP: '\x1b[38;2;128;128;128m',
    ERROR: '\x1b[38;2;246;62;2m',
    WARN: '\x1b[38;2;243;183;0m',
    INFO: '\x1b[38;2;79;117;155m',
    DEBUG: '\x1b[38;2;0;155;114m',
    RESET: '\x1b[0m'
} as const;

const CSS_COLORS = {
    TIMESTAMP: 'color: #808080;',
    ERROR: 'color: #f63e02; font-weight: 600;',
    WARN: 'color: #f3b700; font-weight: 600;',
    INFO: 'color: #4f759b; font-weight: 600;',
    DEBUG: 'color: #009b72; font-weight: 600;'
} as const;
// !SECTION: Types & Constants

// SECTION: Helpers
/**
 * Formats an array of log arguments into a readable string.
 */
const formatMessage = (args: unknown[]): string =>
    args
        .map((arg) => {
            if (arg instanceof Error) {
                return `${arg.name}: ${arg.message}`;
            }
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg);
                } catch {
                    return String(arg);
                }
            }
            return String(arg);
        })
        .join(' ');

/* eslint-disable no-console */
const CSS_STYLE_MAP: Record<LogLevel, string> = {
    error: CSS_COLORS.ERROR,
    warn: CSS_COLORS.WARN,
    info: CSS_COLORS.INFO,
    debug: CSS_COLORS.DEBUG
};

const ANSI_COLOR_MAP: Record<LogLevel, string> = {
    error: ANSI_COLORS.ERROR,
    warn: ANSI_COLORS.WARN,
    info: ANSI_COLORS.INFO,
    debug: ANSI_COLORS.DEBUG
};

const BROWSER_CONSOLE_MAP: Record<LogLevel, (...data: unknown[]) => void> = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.log
};

/**
 * Logs messages with timestamps and colors safely across server (ANSI) and browser (CSS).
 */
const log = (level: LogLevel, args: unknown[]) => {
    const timestamp = new Date().toISOString();
    const message = formatMessage(args);

    if (typeof window !== 'undefined') {
        // Browser environment: use %c CSS styling and console.warn for errors
        // to avoid triggering Next.js dev error overlay on handled exceptions.
        const colorStyle = CSS_STYLE_MAP[level];
        const fn = BROWSER_CONSOLE_MAP[level];

        fn(
            `%c${timestamp}%c | %c${level.toUpperCase()}%c : ${message}`,
            CSS_COLORS.TIMESTAMP,
            '',
            colorStyle,
            ''
        );
        return;
    }

    // Server environment: use ANSI color codes
    const ansiColor = ANSI_COLOR_MAP[level];
    const line = `${ANSI_COLORS.TIMESTAMP}${timestamp}${ANSI_COLORS.RESET} | ${ansiColor}${level.toUpperCase()}${ANSI_COLORS.RESET} : ${ansiColor}${message}${ANSI_COLORS.RESET}`;

    switch (level) {
        case 'error':
            console.error(line);
            break;
        case 'warn':
            console.warn(line);
            break;
        case 'info':
            console.info(line);
            break;
        default:
            console.log(line);
            break;
    }
};
// !SECTION: Helpers

const logger = {
    info: (...args: unknown[]) => log('info', args),
    warn: (...args: unknown[]) => log('warn', args),
    error: (...args: unknown[]) => log('error', args),
    debug: (...args: unknown[]) => log('debug', args)
};

export { ANSI_COLORS as LOG_COLORS, logger };
export default logger;
