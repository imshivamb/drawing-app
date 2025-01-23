// User type
export interface User {
    id: string;
    email: string;
    name: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Room type
  export interface Room {
    id: string;
    slug: string;
    name: string;
    adminId: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    users: User[];
  }
  
  // RoomMember type
  export interface RoomMember {
    id: string;
    roomId: string;
    userId: string;
    role: string; // "admin", "editor", "viewer"
    joinedAt: string;
    user: User;
  }
  
  // Chat type
  export interface Chat {
    id: number;
    roomId: string;
    userId: string;
    message: string;
    createdAt: string;
    user: User;
  }