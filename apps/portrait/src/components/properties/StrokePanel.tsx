import { useCanvasStore } from "@/store/useCanvasStore";

export const StrokePanel = () => {
  const { selectedShape, updateShape } = useCanvasStore();

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label>Stroke Width</label>
        <input
          type="range"
          min="1"
          max="20"
          className="w-full mt-2"
          value={selectedShape?.strokeWidth || 1}
          onChange={(e) =>
            updateShape({
              ...selectedShape!,
              strokeWidth: Number(e.target.value),
            })
          }
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
          value={selectedShape?.opacity || 1}
          onChange={(e) =>
            updateShape({
              ...selectedShape!,
              opacity: Number(e.target.value),
            })
          }
        />
      </div>
    </div>
  );
};
