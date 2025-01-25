import { HTTP_BACKEND } from "@/config";
import axios from "axios";

const token = localStorage.getItem("token");
export const fetchRooms = async () => {
    try {
      
      const response = await axios.get(`${HTTP_BACKEND}/room`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      throw error;
    }
  };
  
  // Create a new room
  export const createRoom = async (data: { name: string }) => {
    try {
      const response = await axios.post(`${HTTP_BACKEND}/room`, data, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create room:", error);
      throw error;
    }
  };
  
  // Fetch a single room by slug
  export const fetchRoomBySlug = async (slug: string) => {
    try {
      const response = await axios.get(`${HTTP_BACKEND}/room/${slug}`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data.room;
    } catch (error) {
      console.error("Failed to fetch room:", error);
      throw error;
    }
  };

  export const fetchRoomChats = async (roomId: string) => {
    try {
      const response = await axios.get(`${HTTP_BACKEND}/room/chats/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.messages;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      throw error;
    }
  };
  
  // Join a room
  export const joinRoom = async (slug: string) => {
    try {
      const response = await axios.post(
        `${HTTP_BACKEND}/room/${slug}/join`,
        {},
        { withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
              },
         }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to join room:", error);
      throw error;
    }
  };
  
  // Leave a room
  export const leaveRoom = async (slug: string) => {
    try {
      const response = await axios.post(
        `${HTTP_BACKEND}/room/${slug}/leave`,
        {},
        { withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
              },
         }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to leave room:", error);
      throw error;
    }
  };