import { LOG_COLORS } from "./const";
import { LogLevel } from "./type";

/**
 * This file contains logger utility logic.
 */

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
    case "ERROR":
      console.error(
        `${timestampLog} | ${colorize(LOG_COLORS.ERROR, level.toUpperCase())} : ${colorize(LOG_COLORS.ERROR, message)}`,
      );
      break;
    case "WARN":
      console.warn(
        `${timestampLog} | ${colorize(LOG_COLORS.WARN, level.toUpperCase())} : ${colorize(LOG_COLORS.WARN, message)}`,
      );
      break;
    case "INFO":
      console.info(
        `${timestampLog} | ${colorize(LOG_COLORS.INFO, level.toUpperCase())} : ${colorize(LOG_COLORS.INFO, message)}`,
      );
      break;
    default:
      console.log(
        `${timestampLog} | ${colorize(LOG_COLORS.DEBUG, level.toUpperCase())} : ${colorize(LOG_COLORS.DEBUG, message)}`,
      );
      break;
  }
};

export const logger = {
  info: (...message: string[]) => log("INFO", message.join(" ")),
  warn: (...message: string[]) => log("WARN", message.join(" ")),
  error: (...message: string[]) => log("ERROR", message.join(" ")),
  debug: (...message: string[]) => log("DEBUG", message.join(" ")),
};
