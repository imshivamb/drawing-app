import { User } from "../types/socket.js";
import { Event } from "../types/events.js";
import {users} from './connection.js'

export function handleJoinRoom(user: User, roomId: string) {
    user.rooms.push(roomId);
    broadcastToRoom(roomId, {
        type: 'user_joined',
        userId: user.userId
    });
}

export function handleLeaveRoom(user: User, roomId: string) {
    user.rooms = user.rooms.filter(id => id !== roomId);
    broadcastToRoom(roomId, {
        type: 'user_left',
        userId: user.userId
    });
}

export function broadcastToRoom(roomId: string, message: Event,) {
    users.forEach(user => {
        if(user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify(message));
        }
    })
}