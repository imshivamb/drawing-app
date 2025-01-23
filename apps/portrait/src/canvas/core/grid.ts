import { Point } from "@repo/common/types";
import { Viewport } from "./viewport";

export class Grid {
    private spacing: number = 20;
    private color: string = '#e0e0e0';
    private enabled: boolean = true;
    snap: boolean = false;

    constructor(private ctx: CanvasRenderingContext2D) {}

    draw(viewport: Viewport) {
        if (!this.enabled) return;

        const { width, height } = this.ctx.canvas;
        const { scale, offsetX, offsetY } = viewport;

        this.ctx.save();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 0.5;

        // Calculate grid bounds based on viewport
        const startX = Math.floor(-offsetX / scale / this.spacing) * this.spacing;
        const startY = Math.floor(-offsetY / scale / this.spacing) * this.spacing;
        const endX = startX + width / scale;
        const endY = startY + height / scale;

        // Draw vertical lines
        for (let x = startX; x <= endX; x += this.spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = startY; y <= endY; y += this.spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    snapPoint(point: Point): Point {
        if (!this.snap) return point;
        
        return {
            x: Math.round(point.x / this.spacing) * this.spacing,
            y: Math.round(point.y / this.spacing) * this.spacing
        };
    }

    setSpacing(spacing: number) {
        this.spacing = spacing;
    }

    toggleGrid() {
        this.enabled = !this.enabled;
    }

    toggleSnap() {
        this.snap = !this.snap;
    }
}