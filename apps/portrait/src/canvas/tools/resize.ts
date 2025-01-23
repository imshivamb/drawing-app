import { Shape, Point, RectShape, CircleShape, TextShape, ImageShape } from '@repo/common/types';
import { HandlePosition } from '../shapes/base';

interface ResizeState {
    originalShape: Shape;
    startPoint: Point;
    handle: HandlePosition;
}

export class ResizeTool {
    private state: ResizeState | null = null;

    startResize(shape: Shape, handle: HandlePosition, startPoint: Point) {
        if (!handle) return;
        this.state = {
            originalShape: { ...shape },
            startPoint,
            handle
        };
    }

    resize(shape: Shape, currentPoint: Point, preserveAspectRatio: boolean): Shape {
        if (!this.state || !this.state.handle) return shape;

        const dx = currentPoint.x - this.state.startPoint.x;
        const dy = currentPoint.y - this.state.startPoint.y;

        switch(shape.type) {
            case 'rect':
            case 'image':
                return this.resizeRect(shape as RectShape | ImageShape, dx, dy, preserveAspectRatio);
            case 'circle':
                return this.resizeCircle(shape as CircleShape, dx, dy);
            case 'text':
                return this.resizeText(shape as TextShape, dx);
            default:
                return shape;
        }
    }

    private resizeRect(shape: RectShape | ImageShape, dx: number, dy: number, preserveAspectRatio: boolean): RectShape | ImageShape {
        const newShape = { ...shape };
        const minSize = 10;

        if (!this.state?.handle) return newShape;

        switch(this.state.handle) {
            case 'top-left':
                this.handleTopLeft(newShape, dx, dy, preserveAspectRatio, minSize);
                break;
            case 'top-middle':
                this.handleTopMiddle(newShape, dy, minSize);
                break;
            case 'top-right':
                this.handleTopRight(newShape, dx, dy, preserveAspectRatio, minSize);
                break;
            case 'middle-right':
                this.handleMiddleRight(newShape, dx, minSize);
                break;
            case 'bottom-right':
                this.handleBottomRight(newShape, dx, dy, preserveAspectRatio, minSize);
                break;
            case 'bottom-middle':
                this.handleBottomMiddle(newShape, dy, minSize);
                break;
            case 'bottom-left':
                this.handleBottomLeft(newShape, dx, dy, preserveAspectRatio, minSize);
                break;
            case 'middle-left':
                this.handleMiddleLeft(newShape, dx, minSize);
                break;
        }

        return newShape;
    }

    private handleTopLeft(shape: RectShape | ImageShape, dx: number, dy: number, preserveAspectRatio: boolean, minSize: number) {
        shape.width = Math.max(minSize, shape.width - dx);
        shape.height = Math.max(minSize, shape.height - dy);
        shape.x += dx;
        shape.y += dy;

        if (preserveAspectRatio) {
            const ratio = shape.width / shape.height;
            shape.height = shape.width / ratio;
            shape.y = shape.y - (shape.height - (shape.height + dy));
        }
    }

    private handleTopMiddle(shape: RectShape | ImageShape, dy: number, minSize: number) {
        shape.height = Math.max(minSize, shape.height - dy);
        shape.y += dy;
    }

    private handleTopRight(shape: RectShape | ImageShape, dx: number, dy: number, preserveAspectRatio: boolean, minSize: number) {
        shape.width = Math.max(minSize, shape.width + dx);
        shape.height = Math.max(minSize, shape.height - dy);
        shape.y += dy;

        if (preserveAspectRatio) {
            const ratio = shape.width / shape.height;
            shape.height = shape.width / ratio;
            shape.y = shape.y - (shape.height - (shape.height + dy));
        }
    }

    private handleMiddleRight(shape: RectShape | ImageShape, dx: number, minSize: number) {
        shape.width = Math.max(minSize, shape.width + dx);
    }

    private handleBottomRight(shape: RectShape | ImageShape, dx: number, dy: number, preserveAspectRatio: boolean, minSize: number) {
        shape.width = Math.max(minSize, shape.width + dx);
        shape.height = Math.max(minSize, shape.height + dy);

        if (preserveAspectRatio) {
            const ratio = shape.width / shape.height;
            shape.height = shape.width / ratio;
        }
    }

    private handleBottomMiddle(shape: RectShape | ImageShape, dy: number, minSize: number) {
        shape.height = Math.max(minSize, shape.height + dy);
    }

    private handleBottomLeft(shape: RectShape | ImageShape, dx: number, dy: number, preserveAspectRatio: boolean, minSize: number) {
        shape.width = Math.max(minSize, shape.width - dx);
        shape.height = Math.max(minSize, shape.height + dy);
        shape.x += dx;

        if (preserveAspectRatio) {
            const ratio = shape.width / shape.height;
            shape.height = shape.width / ratio;
        }
    }

    private handleMiddleLeft(shape: RectShape | ImageShape, dx: number, minSize: number) {
        shape.width = Math.max(minSize, shape.width - dx);
        shape.x += dx;
    }

    private resizeCircle(shape: CircleShape, dx: number, dy: number): CircleShape {
        const newShape = { ...shape };
        const center = { x: shape.x, y: shape.y };
        const currentPoint = { 
            x: this.state!.startPoint.x + dx, 
            y: this.state!.startPoint.y + dy 
        };

        newShape.radius = Math.max(10, Math.sqrt(
            Math.pow(currentPoint.x - center.x, 2) + 
            Math.pow(currentPoint.y - center.y, 2)
        ));

        return newShape;
    }

    private resizeText(shape: TextShape, dx: number): TextShape {
        const newShape = { ...shape };
        if (this.state?.handle && ['top-right', 'middle-right', 'bottom-right'].includes(this.state.handle)) {
            newShape.fontSize = Math.max(12, shape.fontSize * (1 + dx/100));
        }
        return newShape;
    }

    endResize() {
        this.state = null;
    }
}