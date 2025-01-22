import { Shape, Point } from "@repo/common/types"

export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export const defaultShapeProps = {
    strokeColor: "#FFFFFF",
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    selected: false,
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

export function isPointInShape(point: Point, shape: Shape): boolean {
    switch(shape.type) {
        case 'rect':
            return (
                point.x >= shape.x &&
                point.x <= shape.x + shape.width &&
                point.y >= shape.y &&
                point.y <= shape.y + shape.height
            )
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
    return null
}

function getHandlePositions(shape: Shape) {
    if (shape.type !== 'rect') return [];
  
    return [
      { position: 'top-left' as HandlePosition, x: shape.x, y: shape.y },
      { position: 'top-middle' as HandlePosition, x: shape.x + shape.width/2, y: shape.y },
      { position: 'top-right' as HandlePosition, x: shape.x + shape.width, y: shape.y },
      { position: 'middle-right' as HandlePosition, x: shape.x + shape.width, y: shape.y + shape.height/2 },
      { position: 'bottom-right' as HandlePosition, x: shape.x + shape.width, y: shape.y + shape.height },
      { position: 'bottom-middle' as HandlePosition, x: shape.x + shape.width/2, y: shape.y + shape.height },
      { position: 'bottom-left' as HandlePosition, x: shape.x, y: shape.y + shape.height },
      { position: 'middle-left' as HandlePosition, x: shape.x, y: shape.y + shape.height/2 }
    ];
  }

  export function drawSelectionBox(ctx: CanvasRenderingContext2D, shape: Shape) {
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
      case 'circle':
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius + padding, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }
    
    ctx.strokeStyle = originalStroke;
    ctx.lineWidth = originalWidth;
  }

  function drawResizeHandles(ctx: CanvasRenderingContext2D, shape: Shape) {
    if (shape.type !== 'rect') return;
    
    const handleSize = 8;
    const handles = getHandlePositions(shape);
  
    handles.forEach(handle => {
      ctx.fillStyle = '#FFFFFF';
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

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.beginPath();
    ctx.strokeStyle = shape.strokeColor;
    ctx.fillStyle = shape.fillColor;
    ctx.lineWidth = shape.strokeWidth;
    ctx.globalAlpha = shape.opacity;

    switch (shape.type) {
        case 'rect':
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            break;
        case 'circle':
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            break;
            // Other shapes later
    }

    ctx.stroke();
    if(shape.fillColor !== 'transparent') {
        ctx.fill();
    }

    if (shape.selected) {
        drawSelectionBox(ctx, shape);
    }

    ctx.globalAlpha = 1;
}