import { ArrowShape, Point } from '@repo/common/types';
import { Line } from './line';

export class Arrow extends Line {
    private arrowShape: ArrowShape;

    constructor(shape: ArrowShape) {
        super(shape);
        this.arrowShape = shape;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // Draw the main line using the parent class's draw method
        super.draw(ctx);

        if (!this.arrowShape.points || this.arrowShape.points.length < 2) return;

        // Draw arrow heads
        ctx.beginPath();
        ctx.strokeStyle = this.arrowShape.strokeColor;
        ctx.fillStyle = this.arrowShape.strokeColor;
        ctx.lineWidth = this.arrowShape.strokeWidth;

        const start = this.arrowShape.points[0];
        const end = this.arrowShape.points[1];

        // Draw end arrow
        if (this.arrowShape.endArrow) {
            this.drawArrowHead(ctx, end, start);
        }

        // Draw start arrow
        if (this.arrowShape.startArrow) {
            this.drawArrowHead(ctx, start, end);
        }
    }

    private drawArrowHead(ctx: CanvasRenderingContext2D, from: Point, to: Point) {
        const headLength = 15; // Length of arrow head
        const headAngle = Math.PI / 6; // 30 degrees

        // Calculate angle of the line
        const angle = Math.atan2(to.y - from.y, to.x - from.x);

        // Calculate arrow head points
        const left = {
            x: from.x - headLength * Math.cos(angle - headAngle),
            y: from.y - headLength * Math.sin(angle - headAngle)
        };

        const right = {
            x: from.x - headLength * Math.cos(angle + headAngle),
            y: from.y - headLength * Math.sin(angle + headAngle)
        };

        // Draw arrow head
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.closePath();
        ctx.fill();
    }
}