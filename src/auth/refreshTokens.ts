import * as crypto from 'crypto'

export async function makeRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
}