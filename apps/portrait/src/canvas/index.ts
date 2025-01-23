import { Shape, ShapeType } from '@repo/common/types';
import { CanvasStateManager } from './core/state';
import { CanvasRenderer } from './core/render';
import { CanvasEventManager } from './core/events';
import axios from 'axios';
import { HTTP_BACKEND } from '@/config';

interface CanvasCallbacks {
    onShapesUpdate: (shapes: Shape[]) => void;
    onSelectionChange: (shape: Shape | null) => void;
  }

export async function initCanvas(
    canvas: HTMLCanvasElement, 
    mode: ShapeType | "select", 
    roomId: string, 
    socket: WebSocket,
    callbacks: CanvasCallbacks
) {
    // Initialize core components
    const stateManager = new CanvasStateManager(socket, roomId);
    const renderer = new CanvasRenderer(canvas);
    stateManager.subscribe({
        onShapesChange: callbacks.onShapesUpdate,
        onSelectionChange: callbacks.onSelectionChange
      });
    const eventManager = new CanvasEventManager(canvas, stateManager, renderer);

    // Set initial mode
    stateManager.setState({ mode });

    // Load existing shapes
    const existingShapes = await getExistingShapes(roomId);
    existingShapes.forEach(shape => stateManager.addShape(shape));

    

    // Handle WebSocket messages
    socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);

        if (messageData.type === 'chat') {
            const parsedMessage = JSON.parse(messageData.message);
            stateManager.addShape(parsedMessage.shape);
            renderer.render(stateManager.getState().shapes);
        } else if (messageData.type === 'shape_updated') {
            const updatedShape = messageData.shape;
            const state = stateManager.getState();
            const index = state.shapes.findIndex(s => s.id === updatedShape.id);
            if (index !== -1) {
                state.shapes[index] = updatedShape;
                renderer.render(state.shapes);
            }
        }
    };

    // Return cleanup function
    return () => {
        eventManager.cleanup();
        stateManager.cleanup();
    };
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${HTTP_BACKEND}/room/chats/${roomId}`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const messages = res.data.messages;

    return messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
    });
}