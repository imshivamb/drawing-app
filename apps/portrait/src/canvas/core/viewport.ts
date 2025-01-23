import { Point } from "@repo/common/types";

export class Viewport {
     scale: number = 1;
     offsetX: number = 0;
     offsetY: number = 0;
    isDragging: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;

    constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('wheel', this.handleZoom);
        this.canvas.addEventListener('mousedown', this.handlePanStart);
        this.canvas.addEventListener('mousemove', this.handlePanMove);
        this.canvas.addEventListener('mouseup', this.handlePanEnd);
    }

    handleZoom = (e: WheelEvent) => {
        e.preventDefault();
        const delta = -e.deltaY;
        const zoom = 1 + delta / 1000;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const prevScale = this.scale;
        this.scale *= zoom;
        this.scale = Math.min(Math.max(0.1, this.scale), 5);

        const scaleDiff = this.scale - prevScale;
        this.offsetX -= mouseX * scaleDiff / prevScale;
        this.offsetY -= mouseY * scaleDiff / prevScale;

        this.applyTransform();
    }

    handlePanStart = (e: MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handlePanMove = (e: MouseEvent) => {
        if (!this.isDragging) return;

        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;

        this.offsetX += dx / this.scale;
        this.offsetY += dy / this.scale;

        this.lastX = e.clientX;
        this.lastY = e.clientY;

        this.applyTransform();
    }

    handlePanEnd = () => {
        this.isDragging = false;
        this.canvas.style.cursor = 'default';
    }

    applyTransform() {
        this.ctx.setTransform(
            this.scale, 0,
            0, this.scale,
            this.offsetX, this.offsetY
        );
    }

    startPan(e: MouseEvent) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    endPan() {
        this.isDragging = false;
    }

    screenToWorld(point: Point): Point {
        return {
            x: (point.x - this.offsetX) / this.scale,
            y: (point.y - this.offsetY) / this.scale
        };
    }
    
    worldToScreen(point: Point): Point {
        return {
            x: (point.x * this.scale) + this.offsetX,
            y: (point.y * this.scale) + this.offsetY
        };
    }
}