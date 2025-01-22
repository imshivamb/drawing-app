import { Point, Shape } from '@repo/common/types';
import { CanvasStateManager } from './state';
import { CanvasRenderer } from './render';
import { generateId } from '../utils/shapes';
import { isPointInShape, getResizeHandleAtPoint, HandlePosition, getResizeCursor } from '../shapes/base';

export class CanvasEventManager {
    private startX: number = 0;
    private startY: number = 0;
    private selectedHandle: HandlePosition = null;

    constructor(
        private canvas: HTMLCanvasElement,
        private stateManager: CanvasStateManager,
        private renderer: CanvasRenderer
    ) {
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseUp);
    }

    private getEventPoint(e: MouseEvent): Point {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    private handleMouseDown = (e: MouseEvent) => {
        const point = this.getEventPoint(e);
        const state = this.stateManager.getState();

        if (state.mode === 'select') {
            if (state.selectedShape) {
                this.selectedHandle = getResizeHandleAtPoint(point, state.selectedShape);
                if (this.selectedHandle) {
                    state.isResizing = true;
                    this.startX = point.x;
                    this.startY = point.y;
                    return;
                }
            }

            // Check for shape selection
            const clickedShape = state.shapes.find(shape => isPointInShape(point, shape));
            state.shapes.forEach(shape => shape.selected = false);
            
            if (clickedShape) {
                clickedShape.selected = true;
                state.selectedShape = clickedShape;
                state.isDragging = true;
            } else {
                state.selectedShape = null;
            }
        } else {
            // Start drawing new shape
            state.isDrawing = true;
            this.startX = point.x;
            this.startY = point.y;
            
            // Create appropriate shape based on mode
            let shapeData: Partial<Shape> = {
                id: generateId(),
                x: point.x,
                y: point.y,
                strokeColor: '#000000',
                fillColor: 'transparent',
                strokeWidth: 2,
                opacity: 1
            };

            // Add shape-specific properties
            switch(state.mode) {
                case 'rect':
                    shapeData = {
                        ...shapeData,
                        type: 'rect',
                        width: 0,
                        height: 0
                    };
                    break;
                case 'circle':
                    shapeData = {
                        ...shapeData,
                        type: 'circle',
                        radius: 0
                    };
                    break;
                case 'line':
                case 'arrow':
                    shapeData = {
                        ...shapeData,
                        type: state.mode,
                        points: [{ x: point.x, y: point.y }]
                    };
                    break;
                case 'text':
                    shapeData = {
                        ...shapeData,
                        type: 'text',
                        text: '',
                        fontSize: 16,
                        fontFamily: 'Arial'
                    };
                    break;
                default:
                    return; // Invalid shape type
            }

            const initialShape = shapeData as Shape;
            this.stateManager.setSelectedShape(initialShape);
            this.stateManager.addShape(initialShape);
        }

        this.renderer.render(state.shapes);
    };

    private handleMouseMove = (e: MouseEvent) => {
        const point = this.getEventPoint(e);
        const state = this.stateManager.getState();

        if (state.mode === 'select' && state.selectedShape) {
            const handle = getResizeHandleAtPoint(point, state.selectedShape);
            this.canvas.style.cursor = handle ? 
                getResizeCursor(handle) : 
                isPointInShape(point, state.selectedShape) ? 'move' : 'default';
        }

        if (state.isResizing && state.selectedShape) {
            // Handle resize logic (will be implemented in tools)
        } else if (state.isDragging && state.selectedShape) {
            // Handle drag logic
            const dx = point.x - this.startX;
            const dy = point.y - this.startY;
            
            state.selectedShape.x += dx;
            state.selectedShape.y += dy;
            
            this.startX = point.x;
            this.startY = point.y;
            
            this.stateManager.updateShape(state.selectedShape);
        } else if (state.isDrawing && state.selectedShape) {
            // Handle drawing logic
            const width = point.x - this.startX;
            const height = point.y - this.startY;

            if (state.selectedShape.type === 'rect') {
                state.selectedShape.width = width;
                state.selectedShape.height = height;
                
                // Make it a square if shift is held
                if (e.shiftKey) {
                    const size = Math.min(Math.abs(width), Math.abs(height));
                    state.selectedShape.width = width < 0 ? -size : size;
                    state.selectedShape.height = height < 0 ? -size : size;
                }

                this.stateManager.updateShape(state.selectedShape);
            }
        }

        this.renderer.render(state.shapes);
    }

    private handleMouseUp = () => {
        const state = this.stateManager.getState();
        
        state.isDrawing = false;
        state.isDragging = false;
        state.isResizing = false;
        this.selectedHandle = null;
        this.canvas.style.cursor = 'default';

        this.renderer.render(state.shapes);
    }

    cleanup() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    }
}