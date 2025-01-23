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
    private subscribers: {
        onShapesChange?: (shapes: Shape[]) => void;
        onSelectionChange?: (shape: Shape | null) => void;
    } = {};

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

    subscribe(callbacks: {
        onShapesChange?: (shapes: Shape[]) => void;
        onSelectionChange?: (shape: Shape | null) => void;
    }) {
        this.subscribers = { ...this.subscribers, ...callbacks };
    }

    getState(): CanvasState {
        return this.state;
    }

    setState(updates: Partial<CanvasState>) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };
 
        if (updates.shapes && this.subscribers.onShapesChange) {
            this.subscribers.onShapesChange(this.state.shapes);
        }
 
        if (updates.selectedShape !== undefined && 
            prevState.selectedShape?.id !== this.state.selectedShape?.id && 
            this.subscribers.onSelectionChange) {
            this.subscribers.onSelectionChange(this.state.selectedShape);
        }
    }

    addShape(shape: Shape) {
        this.setState({ shapes: [...this.state.shapes, shape] });
        this.broadcastShape(shape);
    }

    updateShape(shape: Shape) {
        const index = this.state.shapes.findIndex(s => s.id === shape.id);
        if (index !== -1) {
            const newShapes = [...this.state.shapes];
            newShapes[index] = shape;
            this.setState({ shapes: newShapes });
            this.broadcastShape(shape);
        }
    }

    setSelectedShape(shape: Shape | null) {
        if (this.state.selectedShape) {
            this.state.selectedShape.selected = false;
        }
        if (shape) {
            shape.selected = true;
        }
        this.setState({ selectedShape: shape });
    }

    deleteShape(shapeId: string) {
        const newShapes = this.state.shapes.filter(s => s.id !== shapeId);
        this.setState({ 
            shapes: newShapes,
            selectedShape: this.state.selectedShape?.id === shapeId ? null : this.state.selectedShape 
        });
        this.broadcastDelete(shapeId);
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
        const shape = this.state.shapes.find(s => s.id === shapeId);
        if (shape) {
            const newShapes = this.state.shapes.filter(s => s.id !== shapeId);
            this.setState({ shapes: [...newShapes, shape] });
            this.broadcastLayerUpdate();
        }
    }
 



    sendToBack(shapeId: string) {
        const shape = this.state.shapes.find(s => s.id === shapeId);
        if (shape) {
            const newShapes = this.state.shapes.filter(s => s.id !== shapeId);
            this.setState({ shapes: [shape, ...newShapes] });
            this.broadcastLayerUpdate();
        }
    }

    private broadcastShape(shape: Shape) {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'shape_updated',
                shape,
                roomId: this.state.roomId
            }));
        }
    }
 
    private broadcastDelete(shapeId: string) {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'shapes_erased',
                shapeIds: [shapeId],
                roomId: this.state.roomId
            }));
        }
    }
 
    private broadcastLayerUpdate() {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'layers_updated',
                shapes: this.state.shapes,
                roomId: this.state.roomId
            }));
        }
    }

    cleanup() {
        this.subscribers = {};
    }
}