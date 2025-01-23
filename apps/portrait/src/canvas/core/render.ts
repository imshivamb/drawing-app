import { Shape } from '@repo/common/types';
import { drawShape } from '../shapes/base';
import { Viewport } from './viewport';
import { Grid } from './grid';
import { HistoryManager } from './history';

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private viewport: Viewport;
    private grid: Grid;
    private history: HistoryManager;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = context;
        canvas.style.backgroundColor = '#000000';
        this.viewport = new Viewport(canvas, this.ctx);
        this.grid = new Grid(this.ctx);
        this.history = new HistoryManager();
    }
    getContext() {
        return this.ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Helper method for shape preview during drawing
    drawShapePreview(shape: Shape) {
        this.ctx.save();
        drawShape(this.ctx, shape);
        this.ctx.restore();
    }

    render(shapes: Shape[]) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.viewport.applyTransform();
        // this.grid.draw(this.viewport);
        
        shapes.forEach(shape => drawShape(this.ctx, shape));
        
        this.ctx.restore();
    }
}