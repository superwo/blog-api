/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import register from '@/controllers/v1/auth/register';

/**
 * Middlewares
 */

/**
 * Models
 */

const router = Router();

router.post('/register', register);

export default router;
