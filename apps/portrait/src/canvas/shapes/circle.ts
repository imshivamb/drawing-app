import { CircleShape, Point } from '@repo/common/types';
import { ShapeBehavior } from './base';

export class Circle implements ShapeBehavior {
    constructor(private shape: CircleShape) {}

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.shape.x, this.shape.y, this.shape.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.shape.strokeColor;
        ctx.fillStyle = this.shape.fillColor;
        ctx.lineWidth = this.shape.strokeWidth;
        ctx.stroke();
        if (this.shape.fillColor !== 'transparent') {
            ctx.fill();
        }
    }

    hitTest(point: Point): boolean {
        const dx = point.x - this.shape.x;
        const dy = point.y - this.shape.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.shape.radius;
    }

    getBounds() {
        return {
            x: this.shape.x - this.shape.radius,
            y: this.shape.y - this.shape.radius,
            width: this.shape.radius * 2,
            height: this.shape.radius * 2
        };
    }

    transform(matrix: DOMMatrix): void {
        const point = new DOMPoint(this.shape.x, this.shape.y);
        const transformed = point.matrixTransform(matrix);
        
        this.shape.x = transformed.x;
        this.shape.y = transformed.y;
        
        // For scaling
        const scale = matrix.a; // Assuming uniform scaling
        if (scale !== 1) {
            this.shape.radius *= scale;
        }
    }
}