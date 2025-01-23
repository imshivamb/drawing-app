import { useCanvasStore } from "@/store/useCanvasStore";
import { ArrowRight, Circle, Minus, Pencil, Square, Type } from "lucide-react";

const tools = [
  { type: "select", icon: Pencil },
  { type: "rect", icon: Square },
  { type: "circle", icon: Circle },
  { type: "line", icon: Minus },
  { type: "arrow", icon: ArrowRight },
  { type: "text", icon: Type },
] as const;

export const ShapeTools = () => {
  const { mode, setMode } = useCanvasStore();
  return (
    <div className="flex gap-1">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => setMode(tool.type)}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${mode === tool.type ? "bg-gray-100 dark:bg-[#403e6a]" : ""}`}
        >
          <tool.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};
