"use client";
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useAuth } from "@/hooks/useAuth";

interface CanvasProps {
  roomId: string;
}

const RoomCanvas = ({ roomId }: CanvasProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({ type: "join_room", roomId });
      ws.send(data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, user]);

  if (!socket) {
    return <div>Connecting to Server...</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
};

export default RoomCanvas;
