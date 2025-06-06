/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        linkedIn?: string;
        x?: string;
        youtube?: string;
    };
}

/**
 * User schema
 */

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxlength: [20, 'Username must be less than 20 characters'],
            unique: [true, 'Username must be unique'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxlength: [50, 'Email must be less than 50 characters'],
            unique: [true, 'Email must be unique'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false, // Do not return password in queries
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['user', 'admin'],
                message: '{VALUE} is not a valid role',
            },
            default: 'user',
        },
        firstName: {
            type: String,
            maxlength: [20, 'First name must be less than 20 characters'],
        },
        lastName: {
            type: String,
            maxlength: [20, 'Last name must be less than 20 characters'],
        },
        socialLinks: {
            website: {
                type: String,
                maxlength: [100, 'Website must be less than 100 characters'],
            },
            facebook: {
                type: String,
                maxlength: [
                    100,
                    'Facebook link must be less than 100 characters',
                ],
            },
            instagram: {
                type: String,
                maxlength: [
                    100,
                    'Instagram link must be less than 100 characters',
                ],
            },
            linkedIn: {
                type: String,
                maxlength: [
                    100,
                    'LinkedIn link must be less than 100 characters',
                ],
            },
            x: {
                type: String,
                maxlength: [
                    100,
                    'X (Twitter) link must be less than 100 characters',
                ],
            },
            youtube: {
                type: String,
                maxlength: [
                    100,
                    'YouTube link must be less than 100 characters',
                ],
            },
        },
    },
    {
        timestamps: true,
    },
);

export default model<IUser>('User', userSchema);
