import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { getEnvVariable } from './helpers';

const JWT_SECRET = getEnvVariable('JWT_SECRET')

interface TokenPayloadType {
    userId: Types.ObjectId | null;
    phone: string
}

export const generateTokens = (payload: TokenPayloadType) => {

    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1d' // make it 15 min of production mode
    });

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as TokenPayloadType;
};

export const refreshAccessToken = (refreshToken: string) => {
    const decoded = verifyToken(refreshToken);
    return generateTokens({
        userId: decoded.userId,
        phone: decoded.phone
    });
};

