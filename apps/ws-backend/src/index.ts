import { WebSocketServer } from 'ws';
import { handleConnection, users } from './handlers/connection.js';
import { handleChats } from './handlers/chats.js';
import { handleJoinRoom, handleLeaveRoom } from './handlers/rooms.js';
import { Event } from './types/events.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
    const user = handleConnection(ws, request);
    if (!user) return;

    ws.on('message', async function message(data) {
        let parsedData;
        if(typeof data !== "string") {
            parsedData = JSON.parse(data.toString());
        } else {
            parsedData = JSON.parse(data);
        }

        switch(parsedData.type) {
            case 'join_room':
                handleJoinRoom(user, parsedData.roomId);
                break;
            case 'leave_room':
                handleLeaveRoom(user, parsedData.roomId);
                break;
            default:
                handleChats(parsedData as Event, user);
                break;
        }
    });

    ws.on('close', () => {
        // Remove user from all rooms and users list
        user.rooms.forEach(roomId => handleLeaveRoom(user, roomId));
        const index = users.findIndex(u => u.ws === ws);
        if (index !== -1) users.splice(index, 1);
    });
});