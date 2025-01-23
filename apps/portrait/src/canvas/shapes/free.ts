import { Shape, Point } from '@repo/common/types';
import { ShapeBehavior } from './base';

export class FreeDraw implements ShapeBehavior {
    constructor(private shape: Shape & { points?: Point[] }) {}

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.shape.points?.length) return;

        ctx.beginPath();
        ctx.strokeStyle = this.shape.strokeColor;
        ctx.lineWidth = this.shape.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.moveTo(this.shape.points[0].x, this.shape.points[0].y);
        for (let i = 1; i < this.shape.points.length; i++) {
            ctx.lineTo(this.shape.points[i].x, this.shape.points[i].y);
        }
        ctx.stroke();
    }

    hitTest(point: Point): boolean {
        if (!this.shape.points?.length) return false;

        // Check if point is near any segment of the free drawing
        for (let i = 1; i < this.shape.points.length; i++) {
            const start = this.shape.points[i - 1];
            const end = this.shape.points[i];
            const distance = this.pointToLineDistance(point, start, end);
            if (distance <= 5) return true; // 5px threshold
        }
        return false;
    }

    getBounds() {
        if (!this.shape.points?.length) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        const xs = this.shape.points.map(p => p.x);
        const ys = this.shape.points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

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

    private pointToLineDistance(point: Point, lineStart: Point, lineEnd: Point): number {
        const A = point.x - lineStart.x;
        const B = point.y - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }
        
        const dx = point.x - xx;
        const dy = point.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
}