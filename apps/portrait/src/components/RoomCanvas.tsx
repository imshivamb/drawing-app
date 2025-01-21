"use client";
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

interface CanvasProps {
  roomId: string;
}

const RoomCanvas = ({ roomId }: CanvasProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMWM2YjMzZS01NDYyLTQ2NjctYWY5Ni1iYzc5YjFlNmJlNDAiLCJpYXQiOjE3Mzc0NjkzNTIsImV4cCI6MTczNzU1NTc1Mn0.OwRiH8Eus84Oe8g5QmbtSikZe0_KQupAzb1qLdRP8VI`
    );

    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({ type: "join_room", roomId });
      console.log(data);
      ws.send(data);
    };
  }, []);

  if (!socket) {
    return <div>Connecting to Server...</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
};

export default RoomCanvas;
