/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import winston from 'winston';

/**
 * Custom modules
 */
import config from '@/config';

const { combine, timestamp, printf, colorize, errors, align, json } =
    winston.format;

// Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// If the application is not running in production, add a console transport
if (config.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }), // Colorize all log levels
                timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), // Add timestamp to logs
                align(), // Align the log messages
                printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length
                        ? `\n${JSON.stringify(meta)}`
                        : '';
                    return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
                }),
            ),
        }),
    );
}

// Create a logger instance using Winston
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info', // Set the log level from config or default to 'info'
    format: combine(timestamp(), errors({ stack: true }), json()), // use JSON format for logs
    transports, // Add the transports defined above
    silent: config.NODE_ENV === 'test', // Silence the logger in test environment
});

export { logger };
