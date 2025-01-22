import jwt from 'jsonwebtoken'
import { WebSocket } from 'ws'
import { JWT_SECRET } from '@repo/common-backend/config';
import { User } from '../types/socket.js';


export const users: User[] = [];

export function handleConnection(ws: WebSocket, request: any) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if(!userId) {
        ws.close();
        return;
    }

    const user: User = {
        userId,
        rooms: [],
        ws
    }

    users.push(user);
    return user;
}

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(typeof decoded === "string") {
            return null;
        }
        if(!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (error) {
        return null;
    }
}