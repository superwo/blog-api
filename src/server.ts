/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */

import express from 'express';

/**
 * Express app initialization
 */

const app = express();

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
