import { Point, Shape } from '@repo/common/types';
import { CanvasStateManager } from './state';
import { CanvasRenderer } from './render';
import { generateId } from '../utils/shapes';
import { isPointInShape, getResizeHandleAtPoint, HandlePosition, getResizeCursor } from '../shapes/base';
import { ResizeTool } from '../tools/resize';
import { TransformTool } from '../tools/transform';
import { HistoryManager } from './history';
import { Grid } from './grid';
import { Viewport } from './viewport';

export class CanvasEventManager {
   private startX: number = 0;
   private startY: number = 0;
   private selectedHandle: HandlePosition = null;
   private resizeTool: ResizeTool;
   private transformTool: TransformTool;
   private rotationStartPoint: Point | null = null;
   private viewport: Viewport;
   private grid: Grid;
   private history: HistoryManager;

   constructor(
       private canvas: HTMLCanvasElement,
       private stateManager: CanvasStateManager,
       private renderer: CanvasRenderer
   ) {
       this.resizeTool = new ResizeTool();
       this.transformTool = new TransformTool(renderer);
       this.viewport = new Viewport(canvas, renderer.getContext());
       this.grid = new Grid(renderer.getContext());
       this.history = new HistoryManager();
       this.setupEventListeners();
   }

   private setupEventListeners() {
       this.canvas.addEventListener('mousedown', this.handleMouseDown);
       this.canvas.addEventListener('mousemove', this.handleMouseMove);
       this.canvas.addEventListener('mouseup', this.handleMouseUp);
       this.canvas.addEventListener('mouseleave', this.handleMouseUp);
       this.canvas.addEventListener('wheel', this.handleWheel);
       window.addEventListener('keydown', this.handleKeyDown);
       this.canvas.addEventListener('mousedown', this.viewport.handlePanStart);
       this.canvas.addEventListener('mousemove', this.viewport.handlePanMove);
       this.canvas.addEventListener('mouseup', this.viewport.handlePanEnd);
   }

   private getEventPoint(e: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

   private handleMouseDown = (e: MouseEvent) => {
       const point = this.getEventPoint(e);
       const snappedPoint = this.grid.snapPoint(point);
       const state = this.stateManager.getState();
       const ctx = this.renderer.getContext();

       if (state.mode === 'free') {
        state.isDrawing = true;
        const initialShape = {
            id: generateId(),
            type: 'free' as const,
            points: [snappedPoint],
            strokeColor: '#FFFFFF',
            strokeWidth: 2,
            opacity: 1,
            x: snappedPoint.x,
            y: snappedPoint.y,
            fillColor: 'transparent'
        };
        this.stateManager.setSelectedShape(initialShape);
        this.stateManager.addShape(initialShape);
        this.history.pushState(state.shapes, initialShape.id);
        return;
    }

       if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
           this.viewport.startPan(e);
           this.canvas.style.cursor = 'grabbing';
           return;
       }

       if (state.mode === 'select') {
           if (state.selectedShape) {
               this.selectedHandle = getResizeHandleAtPoint(snappedPoint, state.selectedShape, ctx);
               if (this.selectedHandle) {
                   state.isResizing = true;
                   this.resizeTool.startResize(state.selectedShape, this.selectedHandle, snappedPoint);
                   return;
               }
           }

           // Check for shape selection
           const clickedShape = state.shapes.find(shape => isPointInShape(snappedPoint, shape));
           state.shapes.forEach(shape => shape.selected = false);
           
           if (clickedShape) {
               clickedShape.selected = true;
               state.selectedShape = clickedShape;
               state.isDragging = true;
           } else {
               state.selectedShape = null;
           }
       } else {
           state.isDrawing = true;
           this.startX = snappedPoint.x;
           this.startY = snappedPoint.y;
           
           const initialShape = this.createInitialShape(state.mode, snappedPoint);
           if (initialShape) {
               this.stateManager.setSelectedShape(initialShape);
               this.stateManager.addShape(initialShape);
               this.history.pushState(state.shapes, initialShape.id);
           }
       }

       if (e.altKey && state.selectedShape) {
           state.isRotating = true;
           this.rotationStartPoint = snappedPoint;
       }

       this.renderer.render(state.shapes);
   };

   private createInitialShape(mode: string, point: Point): Shape | null {
       const baseShape = {
           id: generateId(),
           x: point.x,
           y: point.y,
           strokeColor: '#FFFFFF',
           fillColor: 'transparent',
           strokeWidth: 2,
           opacity: 1
       };

       switch(mode) {
            case 'free':
                return { ...baseShape, type: 'free' as const, points: [point] };
           case 'rect':
               return { ...baseShape, type: 'rect', width: 0, height: 0 };
           case 'circle':
               return { ...baseShape, type: 'circle', radius: 0 };
           case 'line':
           case 'arrow':
               return { ...baseShape, type: mode, points: [point] };
           case 'text':
               return { ...baseShape, type: 'text', text: '', fontSize: 16, fontFamily: 'Arial' };
           default:
               return null;
       }
   }

   private handleMouseMove = (e: MouseEvent) => {
       const point = this.getEventPoint(e);
       const snappedPoint = this.grid.snapPoint(point);
       const state = this.stateManager.getState();

       if (state.isDrawing && state.selectedShape?.type === 'free') {
        if (!state.selectedShape.points) {
            state.selectedShape.points = [];
        }
        state.selectedShape.points.push(snappedPoint);
        this.stateManager.updateShape(state.selectedShape);
        this.renderer.render(state.shapes);
        return;
    }

       if (state.mode === 'select' && state.selectedShape) {
           const handle = getResizeHandleAtPoint(snappedPoint, state.selectedShape, this.renderer.getContext());
           this.canvas.style.cursor = handle ? 
               getResizeCursor(handle) : 
               isPointInShape(snappedPoint, state.selectedShape) ? 'move' : 'default';
       }

       if (this.viewport.isDragging) {
           this.viewport.handlePanMove(e);
           this.renderer.render(state.shapes);
           return;
       }

       if (state.isRotating && state.selectedShape && this.rotationStartPoint) {
           const center = this.transformTool.getShapeCenter(state.selectedShape);
           const angle = this.transformTool.getRotationAngle(center, this.rotationStartPoint, snappedPoint);
           const updatedShape = this.transformTool.rotateShape(state.selectedShape, center, angle);
           this.stateManager.updateShape(updatedShape);
           this.rotationStartPoint = snappedPoint;
       } else if (state.isResizing && state.selectedShape) {
           const updatedShape = this.resizeTool.resize(state.selectedShape, snappedPoint, e.shiftKey);
           this.stateManager.updateShape(updatedShape);
       } else if (state.isDragging && state.selectedShape) {
           const dx = snappedPoint.x - this.startX;
           const dy = snappedPoint.y - this.startY;
           state.selectedShape.x += dx;
           state.selectedShape.y += dy;
           this.startX = snappedPoint.x;
           this.startY = snappedPoint.y;
           this.stateManager.updateShape(state.selectedShape);
       } else if (state.isDrawing && state.selectedShape) {
           this.handleShapeDrawing(state.selectedShape, snappedPoint, e.shiftKey);
       }

       this.renderer.render(state.shapes);
   };

   private handleShapeDrawing(shape: Shape, point: Point, preserveAspectRatio: boolean) {
       const dx = point.x - this.startX;
       const dy = point.y - this.startY;

       switch(shape.type) {
            case 'free':
                if (!shape.points) shape.points = [];
                shape.points.push(point);
                break;
           case 'rect':
               shape.width = preserveAspectRatio ? 
                   Math.sign(dx) * Math.min(Math.abs(dx), Math.abs(dy)) :
                   dx;
               shape.height = preserveAspectRatio ? 
                   Math.sign(dy) * Math.min(Math.abs(dx), Math.abs(dy)) :
                   dy;
               break;

           case 'circle':
               shape.radius = Math.sqrt(dx * dx + dy * dy);
               break;

           case 'line':
           case 'arrow':
               if (shape.points) {
                   shape.points[1] = point;
               }
               break;

           case 'text':
               if (shape.type === 'text') {
                   shape.x = Math.min(this.startX, point.x);
                   shape.y = Math.min(this.startY, point.y);
                   if (!shape.text) {
                       shape.text = 'Double click to edit';
                   }
               }
               break;

           case 'free':
               if (shape.points) {
                   shape.points.push(point);
               }
               break;
       }

       this.stateManager.updateShape(shape);
   }

   private handleMouseUp = () => {
       const state = this.stateManager.getState();
       
       if (state.isDrawing || state.isDragging || state.isResizing) {
           this.history.pushState(state.shapes, state.selectedShape?.id || null);
       }
       
       state.isDrawing = false;
       state.isDragging = false;
       state.isResizing = false;
       state.isRotating = false;
       this.rotationStartPoint = null;
       this.selectedHandle = null;
       this.viewport.endPan();
       this.canvas.style.cursor = 'default';

       this.renderer.render(state.shapes);
   };

   private handleKeyDown = (e: KeyboardEvent) => {
       const state = this.stateManager.getState();

       if (e.key === 'Delete' && state.selectedShape) {
           this.stateManager.deleteShape(state.selectedShape.id);
           this.history.pushState(state.shapes, null);
       } 
       else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
           if (e.shiftKey) {
               const nextState = this.history.redo(state);
               if (nextState) {
                   this.stateManager.setState({
                       ...state,
                       shapes: nextState.shapes,
                       selectedShape: nextState.selectedId ? 
                           nextState.shapes.find(s => s.id === nextState.selectedId) : null
                   });
               }
           } else {
               const prevState = this.history.undo(state);
               if (prevState) {
                   this.stateManager.setState({
                       ...state,
                       shapes: prevState.shapes,
                       selectedShape: prevState.selectedId ? 
                           prevState.shapes.find(s => s.id === prevState.selectedId) : null
                   });
               }
           }
       }
       else if (e.key === 'g') {
           if (e.shiftKey) {
               this.grid.toggleSnap();
           } else {
               this.grid.toggleGrid();
           }
       }
       
       this.renderer.render(state.shapes);
   };

   private handleWheel = (e: WheelEvent) => {
       if (e.ctrlKey) {
           e.preventDefault();
           this.viewport.handleZoom(e);
           this.renderer.render(this.stateManager.getState().shapes);
       }
   };

   cleanup() {
       this.canvas.removeEventListener('mousedown', this.handleMouseDown);
       this.canvas.removeEventListener('mousemove', this.handleMouseMove);
       this.canvas.removeEventListener('mouseup', this.handleMouseUp);
       this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
       this.canvas.removeEventListener('wheel', this.handleWheel);
       window.removeEventListener('keydown', this.handleKeyDown);
       this.canvas.removeEventListener('mousedown', this.viewport.handlePanStart);
       this.canvas.removeEventListener('mousemove', this.viewport.handlePanMove);
       this.canvas.removeEventListener('mouseup', this.viewport.handlePanEnd);
   }
}