/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';

/**
 * Custom modules
 */
import config from '@/config';

/**
 * Express app initialization
 */
const app = express();

// app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
    });
});

app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});
