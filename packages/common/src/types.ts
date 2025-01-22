import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

// Express type extensions
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export type Point = {
    x: number;
    y: number;
}

export interface BaseShape {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    opacity: number;
    selected?: boolean;
    angle?: number;
}

export type ShapeType = 
  | "select"
  | "rect" 
  | "circle" 
  | "line" 
  | "arrow"
  | "free" 
  | "text"
  | "ellipse"
  | "image"

export interface RectShape extends BaseShape {
    type: "rect";
    width: number;
    height: number;
}

export interface CircleShape extends BaseShape {
    type: "circle";
    radius: number;
}

export interface LineShape extends BaseShape {
    type: "line";
    points: Point[];
}

export interface ArrowShape extends BaseShape {
    type: "arrow";
    points: Point[];
    startArrow?: boolean;
    endArrow?: boolean;
}

export interface TextShape extends BaseShape {
    type: "text";
    text: string;
    fontSize: number;
    fontFamily: string;
}

export interface ImageShape extends BaseShape {
    type: "image";
    width: number;
    height: number;
    imageUrl: string;
}

export type Shape = 
  | RectShape 
  | CircleShape 
  | LineShape 
  | ArrowShape 
  | TextShape 
  | ImageShape;