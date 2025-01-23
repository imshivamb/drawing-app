"use client";
import React, { useEffect, useRef } from "react";
import { Toolbar } from "./toolbar";
import { PropertiesPanel } from "./properties";
import { useCanvasStore } from "@/store/useCanvasStore";
import { initCanvas } from "@/canvas";

export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode, updateShapes, setSelectedShape } = useCanvasStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      const cleanup = await initCanvas(canvas, mode, roomId, socket, {
        onShapesUpdate: updateShapes,
        onSelectionChange: setSelectedShape,
      });
      return cleanup;
    };

    const cleanupPromise = init();

    // Cleanup on unmount
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [mode, roomId, socket]);

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
