import { Point, Shape } from "@repo/common/types";
import { CanvasRenderer } from "../core/render";

export class TransformTool {

    constructor(private renderer: CanvasRenderer) {}
    rotateShape(shape: Shape, center: Point, angle: number) {
        const newShape = { ...shape };
        newShape.angle = (newShape.angle || 0) + angle;
        return newShape;
    }

    getRotationAngle(center: Point, start: Point, current: Point): number {
        const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
        const currentAngle = Math.atan2(current.y - center.y, current.x - center.x);
        return currentAngle - startAngle;
    }

    getShapeCenter(shape: Shape): Point {
        switch(shape.type) {
            case 'rect':
            case 'image':
                return {
                    x: shape.x + shape.width / 2,
                    y: shape.y + shape.height / 2
                };
            case 'circle':
                return {
                    x: shape.x,
                    y: shape.y
                };
            case 'text':
                const ctx = this.renderer.getContext();
                const textWidth = ctx.measureText(shape.text).width;
                return {
                    x: shape.x + textWidth / 2,
                    y: shape.y - shape.fontSize / 2
                };
            case 'line':
            case 'arrow':
                if (!shape.points || shape.points.length < 2) return { x: shape.x, y: shape.y };
                return {
                    x: (shape.points[0].x + shape.points[1].x) / 2,
                    y: (shape.points[0].y + shape.points[1].y) / 2
                };
            default:
                return { x: shape.x, y: shape.y };
        }
    }
}