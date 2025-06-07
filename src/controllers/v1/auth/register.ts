/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';
import { genUsername } from '@/utils';

/**
 * Models
 */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;

    if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'You are not allowed to register as an admin.',
        });

        logger.warn(`Unauthorized admin registration attempt by ${email}`);
        return;
    }

    try {
        const username = genUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role,
        });

        // Generate access token and refresh token for the new user
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // Store refresh token in db
        await Token.create({ token: refreshToken, userId: newUser._id });
        logger.info('Refresh token stored in database.', {
            userId: newUser._id,
            token: refreshToken,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF attacks
        });

        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            accessToken,
        });

        logger.info(`User registered successfully.`, {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });

        logger.error('Error during user registration', err);
    }
};

export default register;
