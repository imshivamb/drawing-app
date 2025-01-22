export type Event = 
    | { type: 'user_joined'; userId: string }
    | { type: 'user_left'; userId: string }
    | { type: 'user_rejoined'; userId: string }
    | { type: 'shape_updated'; shape: Shape }
    | { type: 'shapes_erased'; shapeIds: string[] }
    | { type: 'cursor_moved'; userId: string; x: number; y: number }
    | { type: 'draw_start'; shape: Shape }
    | { type: 'draw_move'; shape: Shape }
    | { type: 'draw_end'; shape: Shape }
    | { type: 'erase'; shapeIds: string[] };
//  | { type: "erase_area"; points: Point[] }

export type ShapeType = 
    | "rect"
    | "circle"
    | "line"
    | "text"
    | "free"
    | "arrow"
    | "ellipse"
    | "images"
 


export type Shape = {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: { x: number; y: number }[];
    radius?: number;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    opacity: number;
    angle?: number;
    startArrow?: boolean;
    endArrow?: boolean;
    // Text
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    // Image
    imageUrl?: string;
    imageData?: string;
    aspectRatio?: number;
}