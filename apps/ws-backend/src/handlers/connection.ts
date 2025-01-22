import jwt from 'jsonwebtoken'
import { WebSocket } from 'ws'
import { JWT_SECRET } from '@repo/common-backend/config';
import { User } from '../types/socket.js';
import { broadcastToRoom } from './rooms.js';


export const users: User[] = [];

export function handleConnection(ws: WebSocket, request: any) {
    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const roomId = queryParams.get('roomId') || "";
    const userId = checkUser(token);

    if (!userId) {
        ws.close();
        return;
    }

    // Check for existing connection
    const existingUser = users.find(u => u.userId === userId);
    
    if (existingUser) {
        existingUser.ws.close();
        
        const updatedUser: User = {
            ws,
            userId,
            rooms: roomId ? [roomId] : existingUser.rooms
        };
        const index = users.findIndex(u => u.userId === userId);
        users[index] = updatedUser;
        
        updatedUser.rooms.forEach(room => {
            broadcastToRoom(room, {
                type: 'user_rejoined',
                userId
            });
        });

        return updatedUser;
    }

    const newUser: User = {
        ws,
        userId,
        rooms: roomId ? [roomId] : []
    };
    
    users.push(newUser);
    return newUser;
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