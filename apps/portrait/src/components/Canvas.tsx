"use client";
import React, { useEffect, useRef } from "react";
import { Toolbar } from "./toolbar";
import { PropertiesPanel } from "./properties";
import { useCanvasStore } from "@/store/useCanvasStore";
import { CanvasRenderer } from "@/canvas/core/render";
import { CanvasEventManager } from "@/canvas/core/events";

export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { initStateManager, stateManager } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("Initializing canvas with:", { socket, roomId });
    initStateManager(socket, roomId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, socket]);

  useEffect(() => {
    if (!canvasRef.current || !stateManager) return;

    console.log("Setting up canvas managers");

    const renderer = new CanvasRenderer(canvasRef.current);
    const eventManager = new CanvasEventManager(
      canvasRef.current,
      stateManager,
      renderer
    );

    return () => {
      console.log("Cleaning up canvas managers");
      eventManager.cleanup();
    };
  }, [stateManager]);

  return (
    <div className="relative w-full h-full">
      <Toolbar />
      <PropertiesPanel />
      <canvas
        ref={canvasRef}
        width={1540}
        height={700}
        className="w-full h-full"
      />
    </div>
  );
};
