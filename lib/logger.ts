/**
 * This file contains logger utility logic.
 */
// Types for log levels.
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const LOG_COLORS = {
    TIMESTAMP: '\x1b[38;2;128;128;128m',
    ERROR: '\x1b[38;2;246;62;2m',
    WARN: '\x1b[38;2;243;183;0m',
    INFO: '\x1b[38;2;79;117;155m',
    DEBUG: '\x1b[38;2;0;155;114m',
    RESET: '\x1b[0m'
} as const;

/**
 * Colorizes the text with the given color.
 *
 * @param color The color code to apply.
 * @param text The text to colorize.
 * @returns The colorized text.
 */
const colorize = (color: string, text: string) =>
    `${color}${text}${LOG_COLORS.RESET}`;

/**
 * Function to log messages with timestamps and colors.
 * @param level The log level (info, warn, error, debug).
 * @param message The message to log.
 * @returns void
 */
const log = (level: LogLevel, message: string) => {
    const timestamp = new Date().toISOString();
    const timestampLog = colorize(LOG_COLORS.TIMESTAMP, timestamp);
    switch (level) {
        case 'error':
            console.error(
                `${timestampLog} | ${colorize(LOG_COLORS.ERROR, level.toUpperCase())} : ${colorize(LOG_COLORS.ERROR, message)}`
            );
            break;
        case 'warn':
            console.warn(
                `${timestampLog} | ${colorize(LOG_COLORS.WARN, level.toUpperCase())} : ${colorize(LOG_COLORS.WARN, message)}`
            );
            break;
        case 'info':
            console.info(
                `${timestampLog} | ${colorize(LOG_COLORS.INFO, level.toUpperCase())} : ${colorize(LOG_COLORS.INFO, message)}`
            );
            break;
        default:
            console.log(
                `${timestampLog} | ${colorize(LOG_COLORS.DEBUG, level.toUpperCase())} : ${colorize(LOG_COLORS.DEBUG, message)}`
            );
            break;
    }
};

const logger = {
    info: (...message: string[]) => log('info', message.join(' ')),
    warn: (...message: string[]) => log('warn', message.join(' ')),
    error: (...message: string[]) => log('error', message.join(' ')),
    debug: (...message: string[]) => log('debug', message.join(' '))
};

export { LOG_COLORS, logger };
