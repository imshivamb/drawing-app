import { JWT_SECRET } from '@repo/common-backend/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { CustomJwtPayload } from '@repo/common/types'

export function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({
            message: "No token provided"
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(403).json({
            message: "No token provided"
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Invalid token format"
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Unauthorized"
        });
    }
}