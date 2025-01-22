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
            return (
                point.x >= shape.x &&
                point.x <= shape.x + shape.width &&
                point.y >= shape.y &&
                point.y <= shape.y + shape.height
            );
        case 'circle':
            const dx = point.x - shape.x;
            const dy = point.y - shape.y;
            return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
        // Other shapes later
        default:
            return false;
    }
}

export function getResizeHandleAtPoint(point: Point, shape: Shape): HandlePosition {
    if (!shape.selected) return null;

    const handleSize = 8;
    const handlePositions = getHandlePositions(shape);

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
        // Will add other shapes here
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
        // Will add other shapes
    }
    
    ctx.strokeStyle = originalStroke;
    ctx.lineWidth = originalWidth;
}

function drawResizeHandles(ctx: CanvasRenderingContext2D, shape: Shape) {
    const handleSize = 8;
    const handles = getHandlePositions(shape);

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

function getHandlePositions(shape: Shape): HandleInfo[] {
    switch (shape.type) {
        case 'rect':
            return [
                { x: shape.x, y: shape.y, position: 'top-left' as HandlePosition },
                { x: shape.x + shape.width/2, y: shape.y, position: 'top-middle' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y, position: 'top-right' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y + shape.height/2, position: 'middle-right' as HandlePosition },
                { x: shape.x + shape.width, y: shape.y + shape.height, position: 'bottom-right' as HandlePosition },
                { x: shape.x + shape.width/2, y: shape.y + shape.height, position: 'bottom-middle' as HandlePosition },
                { x: shape.x, y: shape.y + shape.height, position: 'bottom-left' as HandlePosition },
                { x: shape.x, y: shape.y + shape.height/2, position: 'middle-left' as HandlePosition }
            ];
        // Add other shape types later
        default:
            return [];
    }
}