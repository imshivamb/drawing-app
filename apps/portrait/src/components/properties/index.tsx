import { useCanvasStore } from "@/store/useCanvasStore";
import { ColorPanel } from "./ColorPanel";
import { StrokePanel } from "./StrokePanel";
import { TextPanel } from "./TextPanel";

export const PropertiesPanel = () => {
  const { selectedShape } = useCanvasStore();

  if (!selectedShape) return null;

  return (
    <div className="fixed right-4 top-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <ColorPanel />
      <StrokePanel />
      {selectedShape.type === "text" && <TextPanel />}
    </div>
  );
};
