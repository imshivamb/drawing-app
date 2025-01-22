import { Shape } from '@repo/common/types';
import { drawShape } from '../shapes/base';

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = context;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(shapes: Shape[]) {
        this.clear();
        shapes.forEach(shape => {
            drawShape(this.ctx, shape);
        });
    }

    // Helper method for shape preview during drawing
    drawShapePreview(shape: Shape) {
        this.ctx.save();
        drawShape(this.ctx, shape);
        this.ctx.restore();
    }
}