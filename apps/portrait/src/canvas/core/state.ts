import { Shape, ShapeType, Point } from '@repo/common/types';

export interface CanvasState {
    shapes: Shape[];
    selectedShape: Shape | null;
    mode: ShapeType | 'select';
    isDrawing: boolean;
    isDragging: boolean;
    isResizing: boolean;
    startPoint: Point | null;
    socket: WebSocket | null;
    roomId: string;
}

export class CanvasStateManager {
    private state: CanvasState;

    constructor(socket: WebSocket, roomId: string) {
        this.state = {
            shapes: [],
            selectedShape: null,
            mode: 'select',
            isDrawing: false,
            isDragging: false,
            isResizing: false,
            startPoint: null,
            socket,
            roomId
        };
    }

    getState(): CanvasState {
        return this.state;
    }

    setState(updates: Partial<CanvasState>) {
        this.state = { ...this.state, ...updates };
    }

    addShape(shape: Shape) {
        this.state.shapes.push(shape);
        this.broadcastShape(shape);
    }

    updateShape(shape: Shape) {
        const index = this.state.shapes.findIndex(s => s.id === shape.id);
        if (index !== -1) {
            this.state.shapes[index] = shape;
            this.broadcastShape(shape);
        }
    }

    setSelectedShape(shape: Shape | null) {
        if (this.state.selectedShape) {
            this.state.selectedShape.selected = false;
        }
        this.state.selectedShape = shape;
        if (shape) {
            shape.selected = true;
        }
    }

    private broadcastShape(shape: Shape) {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'chat',
                message: JSON.stringify({ shape }),
                roomId: this.state.roomId
            }));
        }
    }
}