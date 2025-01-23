import { Point, Shape } from '@repo/common/types';
import { CanvasStateManager } from './state';
import { CanvasRenderer } from './render';
import { generateId } from '../utils/shapes';
import { isPointInShape, getResizeHandleAtPoint, HandlePosition, getResizeCursor } from '../shapes/base';
import { ResizeTool } from '../tools/resize';
import { TransformTool } from '../tools/transform';

export class CanvasEventManager {
    private startX: number = 0;
    private startY: number = 0;
    private selectedHandle: HandlePosition = null;
    private resizeTool: ResizeTool;
    private transformTool: TransformTool
    private rotationStartPoint: Point | null = null;

    constructor(
        private canvas: HTMLCanvasElement,
        private stateManager: CanvasStateManager,
        private renderer: CanvasRenderer
    ) {
        this.resizeTool = new ResizeTool();
        this.setupEventListeners();
        this.transformTool = new TransformTool(renderer);
    }

    private setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseUp);
        this.canvas.addEventListener('keydown', this.handleKeyDown);
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
        const ctx = this.renderer.getContext();

        if (state.mode === 'select') {
            if (state.selectedShape) {
                this.selectedHandle = getResizeHandleAtPoint(point, state.selectedShape, ctx);
                if (this.selectedHandle) {
                    state.isResizing = true;
                    this.resizeTool.startResize(state.selectedShape, this.selectedHandle, point);
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
        if (e.altKey && state.selectedShape) {
            state.isRotating = true;
            this.rotationStartPoint = point;
        }

        this.renderer.render(state.shapes);
    };

    private handleMouseMove = (e: MouseEvent) => {
        const point = this.getEventPoint(e);
        const state = this.stateManager.getState();
     
        // Update cursor and handle hover effects
        if (state.mode === 'select' && state.selectedShape) {
            const handle = getResizeHandleAtPoint(point, state.selectedShape, this.renderer.getContext());
            this.canvas.style.cursor = handle ? 
                getResizeCursor(handle) : 
                isPointInShape(point, state.selectedShape) ? 'move' : 'default';
        }

        if (state.isRotating && state.selectedShape && this.rotationStartPoint) {
            const center = this.transformTool.getShapeCenter(state.selectedShape);
            const angle = this.transformTool.getRotationAngle(center, this.rotationStartPoint, point);
            const updatedShape = this.transformTool.rotateShape(state.selectedShape, center, angle);
            this.stateManager.updateShape(updatedShape);
            this.rotationStartPoint = point;
        }
        // Handle resize
        if (state.isResizing && state.selectedShape) {
            const updatedShape = this.resizeTool.resize(state.selectedShape, point, e.shiftKey);
            this.stateManager.updateShape(updatedShape);
        } 
        // Handle dragging
        else if (state.isDragging && state.selectedShape) {
            const dx = point.x - this.startX;
            const dy = point.y - this.startY;
            
            state.selectedShape.x += dx;
            state.selectedShape.y += dy;
            
            this.startX = point.x;
            this.startY = point.y;
            
            this.stateManager.updateShape(state.selectedShape);
        }
        // Handle drawing new shapes 
        else if (state.isDrawing && state.selectedShape) {
            const dx = point.x - this.startX;
            const dy = point.y - this.startY;
     
            switch(state.selectedShape.type) {
                case 'rect':
                    state.selectedShape.width = dx;
                    state.selectedShape.height = dy;
                    if (e.shiftKey) {
                        const size = Math.min(Math.abs(dx), Math.abs(dy));
                        state.selectedShape.width = dx < 0 ? -size : size;
                        state.selectedShape.height = dy < 0 ? -size : size;
                    }
                    break;
     
                case 'circle':
                    const radius = Math.sqrt(dx * dx + dy * dy);
                    state.selectedShape.radius = radius;
                    break;
     
                case 'line':
                case 'arrow':
                    if (state.selectedShape.points) {
                        state.selectedShape.points[1] = point;
                    }
                    break;
     
                case 'text':
                    if (state.selectedShape.type === 'text') {
                        state.selectedShape.x = Math.min(this.startX, point.x);
                        state.selectedShape.y = Math.min(this.startY, point.y);
                        if (!state.selectedShape.text) {
                            state.selectedShape.text = 'Double click to edit';
                        }
                    }
                    break;
     
                case 'free':
                    if (state.selectedShape.points) {
                        state.selectedShape.points.push(point);
                    }
                    break;
            }
     
            this.stateManager.updateShape(state.selectedShape);
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

    private handleKeyDown = (e: KeyboardEvent) => {
        const state = this.stateManager.getState();

        if(e.key === 'Delete' && state.selectedShape) {
            this.stateManager.deleteShape(state.selectedShape.id);
        } 
        else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && state.selectedShape) {
            this.stateManager.copySelectedShape();
        }
        else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            this.stateManager.pasteShape();
        }
        else if (state.selectedShape) {
            if (e.ctrlKey && e.key === ']') {
                this.stateManager.bringToFront(state.selectedShape.id);
            } else if (e.ctrlKey && e.key === '[') {
                this.stateManager.sendToBack(state.selectedShape.id);
            }
        }
        this.renderer.render(state.shapes);
    }

    cleanup() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    }
}