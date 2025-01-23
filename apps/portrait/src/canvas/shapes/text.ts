import { TextShape, Point } from '@repo/common/types';
import { ShapeBehavior } from './base';

export class Text implements ShapeBehavior {
    constructor(private shape: TextShape) {}

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.font = `${this.shape.fontSize}px ${this.shape.fontFamily}`;
        ctx.fillStyle = this.shape.fillColor;
        ctx.strokeStyle = this.shape.strokeColor;
        ctx.lineWidth = this.shape.strokeWidth;
        
        // Draw text
        if (this.shape.fillColor !== 'transparent') {
            ctx.fillText(this.shape.text, this.shape.x, this.shape.y);
        }
        if (this.shape.strokeWidth > 0) {
            ctx.strokeText(this.shape.text, this.shape.x, this.shape.y);
        }
    }

    hitTest(point: Point): boolean {
        // Use the measured text dimensions for hit testing
        const metrics = this.getTextMetrics();
        return (
            point.x >= this.shape.x &&
            point.x <= this.shape.x + metrics.width &&
            point.y >= this.shape.y - metrics.height &&
            point.y <= this.shape.y
        );
    }

    getBounds() {
        const metrics = this.getTextMetrics();
        return {
            x: this.shape.x,
            y: this.shape.y - metrics.height,
            width: metrics.width,
            height: metrics.height
        };
    }

    transform(matrix: DOMMatrix): void {
        const point = new DOMPoint(this.shape.x, this.shape.y);
        const transformed = point.matrixTransform(matrix);
        this.shape.x = transformed.x;
        this.shape.y = transformed.y;
        
        // Scale font size if scaling is applied
        const scale = matrix.a;
        if (scale !== 1) {
            this.shape.fontSize *= scale;
        }
    }

    private getTextMetrics(): { width: number; height: number } {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        ctx.font = `${this.shape.fontSize}px ${this.shape.fontFamily}`;
        const metrics = ctx.measureText(this.shape.text);
        return {
            width: metrics.width,
            height: this.shape.fontSize
        };
    }
}