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