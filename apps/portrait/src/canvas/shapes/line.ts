import { LineShape, ArrowShape, Point } from '@repo/common/types';
import { ShapeBehavior } from './base';

export class Line implements ShapeBehavior {
    constructor(protected shape: LineShape | ArrowShape) {}

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.shape.points || this.shape.points.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = this.shape.strokeColor;
        ctx.lineWidth = this.shape.strokeWidth;

        // Move to first point
        ctx.moveTo(this.shape.points[0].x, this.shape.points[0].y);

        // Draw line to second point
        ctx.lineTo(this.shape.points[1].x, this.shape.points[1].y);
        
        ctx.stroke();
    }

    hitTest(point: Point): boolean {
        if (!this.shape.points || this.shape.points.length < 2) return false;
        const start = this.shape.points[0];
        const end = this.shape.points[1];
        
        const threshold = 5;
        
        return this.getPointDistanceFromLine(point, start, end) <= threshold;
    }

    getBounds() {
        if (!this.shape.points || this.shape.points.length < 2) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        const xPoints = this.shape.points.map(p => p.x);
        const yPoints = this.shape.points.map(p => p.y);

        const minX = Math.min(...xPoints);
        const maxX = Math.max(...xPoints);
        const minY = Math.min(...yPoints);
        const maxY = Math.max(...yPoints);

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    transform(matrix: DOMMatrix): void {
        if (!this.shape.points) return;

        this.shape.points = this.shape.points.map(point => {
            const transformed = new DOMPoint(point.x, point.y).matrixTransform(matrix);
            return { x: transformed.x, y: transformed.y };
        });
    }

    private getPointDistanceFromLine(point: Point, lineStart: Point, lineEnd: Point): number {
        const { x, y } = point;
        const { x: x1, y: y1 } = lineStart;
        const { x: x2, y: y2 } = lineEnd;
        
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = x - xx;
        const dy = y - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
}