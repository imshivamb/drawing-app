import { Shape, Point } from '@repo/common/types';

interface HandleInfo {
    x: number;
    y: number;
    position: HandlePosition;
}

export interface ShapeBehavior {
    draw(ctx: CanvasRenderingContext2D): void;
    hitTest(point: Point): boolean;
    getBounds(): { x: number; y: number; width: number; height: number };
    transform(matrix: DOMMatrix): void;
}

export type HandlePosition = 
    | 'top-left' 
    | 'top-middle' 
    | 'top-right'
    | 'middle-right' 
    | 'bottom-right' 
    | 'bottom-middle'
    | 'bottom-left' 
    | 'middle-left'
    | null;

    export function isPointInShape(point: Point, shape: Shape): boolean {
        switch(shape.type) {
            case 'rect':
                const tolerance = 5;
                return (
                    point.x >= shape.x - tolerance &&
                    point.x <= shape.x + shape.width + tolerance &&
                    point.y >= shape.y - tolerance &&
                    point.y <= shape.y + shape.height + tolerance
                );
            case 'circle':
                const dx = point.x - shape.x;
                const dy = point.y - shape.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return Math.abs(distance - shape.radius) <= 5;
            case 'line':
            case 'arrow':
                if (shape.points?.length >= 2) {
                    return isPointNearLine(point, shape.points[0], shape.points[1]);
                }
                return false;
            case 'free':
                if (!shape.points?.length) return false;
                for (let i = 1; i < shape.points.length; i++) {
                    if (isPointNearLine(point, shape.points[i-1], shape.points[i])) {
                        return true;
                    }
                }
                return false;
            default:
                return false;
        }
    }

    function isPointNearLine(point: Point, start: Point, end: Point): boolean {
        const tolerance = 5;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return false;
        
        const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (length * length)));
        const projectedX = start.x + t * dx;
        const projectedY = start.y + t * dy;
        
        const distanceSquared = Math.pow(point.x - projectedX, 2) + Math.pow(point.y - projectedY, 2);
        return distanceSquared <= tolerance * tolerance;
    }

export function getResizeHandleAtPoint(point: Point, shape: Shape, ctx: CanvasRenderingContext2D ): HandlePosition {
    if (!shape.selected) return null;

    const handleSize = 8;
    const handlePositions = getHandlePositions(ctx, shape);

    for(let i = 0; i < handlePositions.length; i++) {
        const handle = handlePositions[i];
        if (
            point.x >= handle.x - handleSize/2 &&
            point.x <= handle.x + handleSize/2 &&
            point.y >= handle.y - handleSize/2 &&
            point.y <= handle.y + handleSize/2
        ) {
            return handle.position;
        }
    }
    return null;
}

export function getResizeCursor(handle: HandlePosition): string {
    switch (handle) {
        case 'top-left':
        case 'bottom-right':
            return 'nwse-resize';
        case 'top-right':
        case 'bottom-left':
            return 'nesw-resize';
        case 'top-middle':
        case 'bottom-middle':
            return 'ns-resize';
        case 'middle-left':
        case 'middle-right':
            return 'ew-resize';
        default:
            return 'move';
    }
}


export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.beginPath();
    ctx.strokeStyle = shape.strokeColor;
    ctx.fillStyle = shape.fillColor;
    ctx.lineWidth = shape.strokeWidth;
    ctx.globalAlpha = shape.opacity;

    drawShapePath(ctx, shape);

    ctx.stroke();
    if(shape.fillColor !== 'transparent') {
        ctx.fill();
    }

    if (shape.selected) {
        drawSelectionBox(ctx, shape);
    }

    ctx.globalAlpha = 1;
}

export function drawShapePath(ctx: CanvasRenderingContext2D, shape: Shape) {
    switch (shape.type) {
        case 'rect':
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            break;
        case 'circle':
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            break;
        case 'line':
            if (shape.points && shape.points.length >= 2) {
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                ctx.lineTo(shape.points[1].x, shape.points[1].y);
            }
            break;
        case 'arrow':
            if (shape.points && shape.points.length >= 2) {
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                ctx.lineTo(shape.points[1].x, shape.points[1].y);
            }
            break;
        case 'text':
            ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
            ctx.fillText(shape.text, shape.x, shape.y);
            break;
        case 'free':
            if (shape.points?.length) {
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                        ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
            }
            break;
        case 'image':
            const img = new Image();
            img.src = shape.imageUrl;
            img.onload = () => {
                ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height);
            };
            break;
        default:
            throw new Error(`Unsupported shape type: ${shape.type}`);
    }
}

function drawSelectionBox(ctx: CanvasRenderingContext2D, shape: Shape) {
    const padding = 5;
    
    const originalStroke = ctx.strokeStyle;
    const originalWidth = ctx.lineWidth;
    
    ctx.strokeStyle = '#00A0FF';
    ctx.lineWidth = 1;
    
    switch (shape.type) {
        case 'rect':
            ctx.strokeRect(
                shape.x - padding,
                shape.y - padding,
                shape.width + padding * 2,
                shape.height + padding * 2
            );
            drawResizeHandles(ctx, shape);
            break;
        case 'text':
            const textWidth = ctx.measureText(shape.text).width;
            ctx.strokeRect(
                shape.x - padding,
                shape.y - shape.fontSize - padding,
                textWidth + padding * 2,
                shape.fontSize + padding * 2
            );
            drawResizeHandles(ctx, shape);
            break;
        case 'image':
            ctx.strokeRect(
                shape.x - padding,
                shape.y - padding,
                shape.width + padding * 2,
                shape.height + padding * 2
            );
            drawResizeHandles(ctx, shape);
            break;
        // Will add other shapes
    }
    
    ctx.strokeStyle = originalStroke;
    ctx.lineWidth = originalWidth;
}

function drawResizeHandles(ctx: CanvasRenderingContext2D, shape: Shape) {
    const handleSize = 8;
    const handles = getHandlePositions( ctx, shape);

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#00A0FF';
    ctx.lineWidth = 1;

    handles.forEach(handle => {
        ctx.fillRect(
            handle.x - handleSize/2,
            handle.y - handleSize/2,
            handleSize,
            handleSize
        );
        ctx.strokeRect(
            handle.x - handleSize/2,
            handle.y - handleSize/2,
            handleSize,
            handleSize
        );
    });
}

function getHandlePositions(ctx: CanvasRenderingContext2D, shape: Shape): HandleInfo[] {
    switch (shape.type) {
        case 'rect':
            return [
                { x: shape.x, y: shape.y, position: 'top-left' as HandlePosition },
                { x: shape.x + shape.width / 2, y: shape.y, position: 'top-middle' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y, position: 'top-right' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y + shape.height / 2, position: 'middle-right' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y + shape.height, position: 'bottom-right' as HandlePosition },
                { x: shape.x + shape.width / 2, y: shape.y + shape.height, position: 'bottom-middle' as HandlePosition },
                { x: shape.x, y: shape.y + shape.height, position: 'bottom-left' as HandlePosition },
                { x: shape.x, y: shape.y + shape.height / 2, position: 'middle-left' as HandlePosition }
            ];
        case 'text':
            // Measure the text width using the provided context
            const textWidth = ctx.measureText(shape.text).width;
            return [
                { x: shape.x, y: shape.y - shape.fontSize, position: 'top-left' as HandlePosition },
                { x: shape.x + textWidth / 2, y: shape.y - shape.fontSize, position: 'top-middle' as HandlePosition },
                { x: shape.x + textWidth, y: shape.y - shape.fontSize, position: 'top-right' as HandlePosition },
                { x: shape.x + textWidth, y: shape.y - shape.fontSize / 2, position: 'middle-right' as HandlePosition },
                { x: shape.x + textWidth, y: shape.y, position: 'bottom-right' as HandlePosition },
                { x: shape.x + textWidth / 2, y: shape.y, position: 'bottom-middle' as HandlePosition },
                { x: shape.x, y: shape.y, position: 'bottom-left' as HandlePosition },
                { x: shape.x, y: shape.y - shape.fontSize / 2, position: 'middle-left' as HandlePosition }
            ];
        case 'image':
            return [
                { x: shape.x, y: shape.y, position: 'top-left' as HandlePosition },
                { x: shape.x + shape.width / 2, y: shape.y, position: 'top-middle' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y, position: 'top-right' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y + shape.height / 2, position: 'middle-right' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y + shape.height, position: 'bottom-right' as HandlePosition },
                { x: shape.x + shape.width / 2, y: shape.y + shape.height, position: 'bottom-middle' as HandlePosition },
                { x: shape.x, y: shape.y + shape.height, position: 'bottom-left' as HandlePosition },
                { x: shape.x, y: shape.y + shape.height / 2, position: 'middle-left' as HandlePosition }
            ];
        default:
            return [];
    }
}