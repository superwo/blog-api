/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { rateLimit } from 'express-rate-limit';

// Configure rate limiting middleware to prevent abuse
const limiter = rateLimit({
    windowMs: 60000, // 1 minute time window for request limiting
    limit: 60, // Limit each IP to 60 requests per windowMs
    standardHeaders: 'draft-8', // Use the latest standard headers for rate limiting
    legacyHeaders: false, // Disable deprecated X-RateLimit-* headers
    message: {
        error: 'You have send too many requests in a short period of time. Please try again later.',
    },
});

export default limiter;
