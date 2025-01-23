import { Shape, ShapeType, Point } from '@repo/common/types';
import { generateId } from '../utils/shapes';

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
    clipboard: Shape | null;
    isRotating: boolean;
    layers: Shape[];
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
            roomId,
            clipboard: null,
            isRotating: false,
            layers: []
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

    deleteShape(shapeId: string) {
        this.state.shapes = this.state.shapes.filter(s => s.id !== shapeId);
        if (this.state.selectedShape?.id === shapeId) {
            this.setSelectedShape(null);
        }

        if(this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'shape_erased',
                shapeIds: [shapeId],
                roomId: this.state.roomId
            }));
        }
    }

    copySelectedShape() {
        if (this.state.selectedShape) {
            this.state.clipboard = { ...this.state.selectedShape };
        }
    }

    pasteShape() {
        if (this.state.clipboard) {
            const newShape = {
                ...this.state.clipboard,
                id: generateId(),
                x: this.state.clipboard.x + 20,
                y: this.state.clipboard.y + 20

            };
            this.addShape(newShape);
        }
    }

    bringToFront(shapeId: string) {
        const index = this.state.shapes.findIndex(s => s.id === shapeId);
        if(index !== -1) {
            const [shape] = this.state.shapes.splice(index, 1);
            this.state.shapes.push(shape);
            this.broadcastLayerUpdate();
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

    sendToBack(shapeId: string) {
        const index = this.state.layers.findIndex(s => s.id === shapeId);
        if (index !== -1) {
            const [shape] = this.state.layers.splice(index, 1);
            this.state.layers.unshift(shape);
            this.broadcastLayerUpdate();
        }
    }

    private broadcastLayerUpdate() {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'layers_updated',
                layers: this.state.layers,
                roomId: this.state.roomId
            }));
        }
    }
}