/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';

const router = Router();

/**
 * Root route
 */
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://docs.example.com',
        timestamp: new Date().toISOString(),
    });
});

export default router;
