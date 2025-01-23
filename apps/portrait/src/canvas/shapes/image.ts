import { ImageShape as ImageType, Point } from '@repo/common/types';
import { ShapeBehavior } from './base';

export class ImageShape implements ShapeBehavior {
    private imageElement: HTMLImageElement | null = null;

    constructor(private shape: ImageType) {
        this.loadImage();
    }

    private loadImage() {
        this.imageElement = new Image();
        this.imageElement.src = this.shape.imageUrl;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.imageElement) return;

        ctx.globalAlpha = this.shape.opacity;
        ctx.drawImage(
            this.imageElement,
            this.shape.x,
            this.shape.y,
            this.shape.width,
            this.shape.height
        );
        ctx.globalAlpha = 1;
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

    transform(matrix: DOMMatrix): void {
        const topLeft = new DOMPoint(this.shape.x, this.shape.y);
        const transformed = topLeft.matrixTransform(matrix);
        
        this.shape.x = transformed.x;
        this.shape.y = transformed.y;
        
        // Handle scaling
        const scale = matrix.a;
        if (scale !== 1) {
            this.shape.width *= scale;
            this.shape.height *= scale;
        }
    }
}