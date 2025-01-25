import prisma from "@repo/database/db";
import { User } from '../types/socket.js';
import { Event, Shape } from "../types/events.js";
import { broadcastToRoom } from "./rooms.js";

export async function handleChats(event: Event, user: User) {
   const roomId = user.rooms[0];
   if (!roomId) return;

   switch (event.type) {
       case 'draw_start':
       case 'draw_move':
           broadcastToRoom(roomId, event);
           break;
           
       case 'draw_end':
           if ('shape' in event) {
               await handleShape(event.shape, user);
           }
           break;

       case 'erase':
           if ('shapeIds' in event) {
               await handleErase(event.shapeIds, user);
           }
           break;
           
       case 'cursor_moved':
           handleCursor(event, user);
           break;
   }
}

async function handleShape(shape: Shape, user: User) {
   const roomId = user.rooms[0];
   if (!roomId) {
       throw new Error("User is not in any room.");
   }

   await prisma.chat.create({
       data: {
           roomId,
           message: JSON.stringify({ shape }),
           userId: user.userId
       }
   });

   broadcastToRoom(roomId, {
       type: 'draw_end',
       shape
   });
}

async function handleErase(shapeIds: string[], user: User) {
   const roomId = user.rooms[0];
   if (!roomId) {
       throw new Error("User is not in any room.");
   }
   // TODO: add database logic for erasing
   broadcastToRoom(roomId, {
       type: 'shapes_erased',
       shapeIds
   });
}

function handleCursor(event: { x: number; y: number }, user: User) {
   const roomId = user.rooms[0];
   if (!roomId) {
       throw new Error("User is not in any room.");
   }
   broadcastToRoom(roomId, {
       type: 'cursor_moved',
       userId: user.userId,
       x: event.x,
       y: event.y
   });
}