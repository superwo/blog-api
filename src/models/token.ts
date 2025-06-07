/**
 * @copyright 2025 Radu Avadanii
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model, Types } from 'mongoose';

export interface IToken {
    token: string;
    userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

export default model<IToken>('Token', tokenSchema);
