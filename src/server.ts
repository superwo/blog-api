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

(async () => {
    try {
        app.get('/', (req, res) => {
            res.json({
                message: 'Welcome to the API',
            });
        });

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
