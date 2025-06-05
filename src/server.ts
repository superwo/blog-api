/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';

/**
 * Routes
 */
import v1Routes from '@/routes/v1';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Express app initialization
 */
const app = express();

// Configure CORS options
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (
            config.NODE_ENV === 'development' ||
            !origin ||
            config.WHITELIST_ORIGINS.includes(origin)
        ) {
            callback(null, true);
        } else {
            callback(
                new Error(
                    `CORS policy does not allow access from origin: ${origin}`,
                ),
                false,
            );
            console.error(
                `CORS policy does not allow access from origin: ${origin}`,
            );
        }
    },
};

// Applly CORS middleware
app.use(cors(corsOptions));

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended syntax
// `extended: true` allows for rich objects and arrays to be encoded
app.use(express.urlencoded({ extended: true }));

// Enable cookie parsing
app.use(cookieParser());

// Enable compression for response bodies
app.use(
    compression({
        threshold: 1024, // Compress responses larger than 1KB
    }),
);

// Enable security headers using Helmet
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server.
 * - Tries to connect to the database before initializing the server.
 * - Defines the API route (‘/api/v1‘).
 * - Starts the server on the specified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process exits with status 1.
 */

(async () => {
    try {
        await connectToDatabase();

        app.use('/api/v1', v1Routes);

        app.listen(config.PORT, () => {
            console.log(`Server is running on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);

        if (config.NODE_ENV === 'production') {
            process.exit(1); // Exit the process in production on error
        }
    }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 *
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code ‘0* (indicating a successful shutdown).
 */
const handleServerShutdown = async () => {
    try {
        await disconnectFromDatabase();
        console.log('Server SHUTDOWN');
        process.exit(0);
    } catch (err) {
        console.error('Error during server shutdown:', err);
    }
};

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`).
 *
 * — `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * — `SIGINT` is triggered when the user interrupts the process (e.g., pressing `Ctrl + C`).
 * - When either signal is received, `handleServerShutdown` is executed to ensure proper cleanup.
 */

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
