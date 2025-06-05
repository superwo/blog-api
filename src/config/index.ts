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
};

export default config;
