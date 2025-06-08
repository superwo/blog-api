/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom modules
 */
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken as string;

    try {
        const tokenExists = await Token.exists({ token: refreshToken });

        if (!tokenExists) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }

        // Verify the refresh token
        const jwtPayload = verifyRefreshToken(refreshToken) as {
            userId: Types.ObjectId;
        };

        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            accessToken,
        });
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token has expired, please log in again',
            });
            return;
        }

        if (err instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });

        logger.error('Error during token refresh', err);
    }
};

export default refreshToken;
