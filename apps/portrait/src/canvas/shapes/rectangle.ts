import { RectShape, Point } from '@repo/common/types';
import { ShapeBehavior } from './base';

export class Rectangle implements ShapeBehavior {
    constructor(private shape: RectShape) {}

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(this.shape.x, this.shape.y, this.shape.width, this.shape.height);
        ctx.strokeStyle = this.shape.strokeColor;
        ctx.fillStyle = this.shape.fillColor;
        ctx.lineWidth = this.shape.strokeWidth;
        ctx.stroke();
        if (this.shape.fillColor !== 'transparent') {
            ctx.fill();
        }
    }

    hitTest(point: Point): boolean {
        return (
            point.x >= this.shape.x &&
            point.x <= this.shape.x + this.shape.width &&
            point.y >= this.shape.y &&
            point.y <= this.shape.y + this.shape.height
        );
    }

    getBounds() {
        return {
            x: this.shape.x,
            y: this.shape.y,
            width: this.shape.width,
            height: this.shape.height
        };
    }

    transform(matrix: DOMMatrix) {
        const topLeft = new DOMPoint(this.shape.x, this.shape.y);
        const transformed = topLeft.matrixTransform(matrix);
        
        this.shape.x = transformed.x;
        this.shape.y = transformed.y;
        
        // Handle scaling if present in the matrix
        const scale = matrix.a; // Assuming uniform scaling
        if (scale !== 1) {
            this.shape.width *= scale;
            this.shape.height *= scale;
        }
    }
}