import { useCanvasStore } from "@/store/useCanvasStore";
import { Shape } from "@repo/common/types";

export const StrokePanel = () => {
  const { selectedShape, stateManager } = useCanvasStore();

  if (!selectedShape || !stateManager) return null;

  const handleUpdate = (key: "strokeWidth" | "opacity", value: number) => {
    const updatedShape = { ...selectedShape, [key]: value } as Shape;
    stateManager.updateShape(updatedShape);
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label>Stroke Width</label>
        <input
          type="range"
          min="1"
          max="20"
          className="w-full mt-2"
          value={selectedShape.strokeWidth}
          onChange={(e) => handleUpdate("strokeWidth", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="w-full mt-2"
          value={selectedShape.opacity}
          onChange={(e) => handleUpdate("opacity", Number(e.target.value))}
        />
      </div>
    </div>
  );
};
