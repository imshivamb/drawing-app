import WebSocket from 'ws';
import { Shape } from './events.js';

export interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}
