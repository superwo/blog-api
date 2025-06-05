/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ['https://docs.blog-api.codewithsadee.com'],
};

export default config;
