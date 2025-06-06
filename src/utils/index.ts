/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Generate a random username (e.g user-abc123)
 */
export const genUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).substring(2);

    const username = `${usernamePrefix}${randomChars}`;

    return username;
};
