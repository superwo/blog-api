/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';

/**
 * Custom modules
 */
import config from '@/config';

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

// app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
    });
});

app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});
