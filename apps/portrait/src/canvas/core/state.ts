import { Shape, ShapeType, Point } from '@repo/common/types';
import { generateId } from '../utils/shapes';
import { fetchRoomChats } from '@/services/api';

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
        this.setupSocket();
        this.loadHistory();
    }
 
    setupSocket() {
        this.state.socket?.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            switch(data.type) {
                case 'draw_end':
                    this.handleRemoteShape(data.shape);
                    break;
                case 'shapes_erased':
                    this.handleRemoteErase(data.shapeIds);
                    break;
            }
        });
    }
 
    private handleRemoteShape(shape: Shape) {
        const index = this.state.shapes.findIndex(s => s.id === shape.id);
        if (index !== -1) {
            const newShapes = [...this.state.shapes];
            newShapes[index] = shape;
            this.setState({ shapes: newShapes });
        } else {
            this.setState({ shapes: [...this.state.shapes, shape] });
        }
    }
 
    private handleRemoteErase(shapeIds: string[]) {
        const newShapes = this.state.shapes.filter(s => !shapeIds.includes(s.id));
        this.setState({ shapes: newShapes });
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
        if (this.state.isDrawing) {
            this.broadcastStart(shape);  // draw_start for initial
        } else {
            this.broadcastEnd(shape);    // draw_end for completion
        }
    }
 
    updateShape(shape: Shape) {
        const index = this.state.shapes.findIndex(s => s.id === shape.id);
        if (index !== -1) {
            const newShapes = [...this.state.shapes];
            newShapes[index] = shape;
            this.setState({ shapes: newShapes });
            
            if (this.state.isDrawing) {
                this.state.socket?.send(JSON.stringify({
                    type: 'draw_move',
                    shape,
                    roomId: this.state.roomId
                }));
            } else {
                this.broadcastEnd(shape);
            }
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

    private async loadHistory() {
        try {
            const messages = await fetchRoomChats(this.state.roomId);
            const shapes = messages
                .map((msg: {message: string}) => {
                    try {
                        return JSON.parse(msg.message).shape;
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean);
    
            if (shapes.length) {
                this.setState({ shapes });
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }
 
    broadcastStart(shape: Shape) {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'draw_start',
                shape,
                roomId: this.state.roomId
            }));
        }
    }

    broadcastMove(shape: Shape | null) {
        if (!shape) return;
        this.state.socket?.send(JSON.stringify({
            type: 'draw_move',
            shape,
            roomId: this.state.roomId
        }));
    }
 
    broadcastEnd(shape: Shape) {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'draw_end',
                shape,
                roomId: this.state.roomId
            }));
        }
    }
 
    broadcastDelete(shapeId: string) {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'erase',
                shapeIds: [shapeId],
                roomId: this.state.roomId
            }));
        }
    }
 
    private broadcastLayerUpdate() {
        if (this.state.socket) {
            this.state.socket.send(JSON.stringify({
                type: 'draw_end',
                shapes: this.state.shapes,
                roomId: this.state.roomId
            }));
        }
    }
 
    cleanup() {
        this.subscribers = {};
    }
 }