"use client";
import { initCanvas } from "@/canvas";
import { Button } from "@repo/ui/button";
import React, { useEffect, useRef, useState } from "react";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"free" | "rect">("free");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | undefined;

    const init = async () => {
      cleanup = await initCanvas(canvas, mode, roomId, socket);
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, [mode, roomId]);
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 p-4 z-10 flex gap-3">
        <Button size="lg" onClick={() => setMode("free")}>
          Free Draw
        </Button>
        <Button size="lg" onClick={() => setMode("rect")}>
          Rectangle
        </Button>
      </div>
      <canvas ref={canvasRef} width={1540} height={700}></canvas>
    </div>
  );
};

export default Canvas;
