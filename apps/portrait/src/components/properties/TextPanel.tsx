import { useCanvasStore } from "@/store/useCanvasStore";
import { Input } from "@repo/ui/input";

export const TextPanel = () => {
  const { selectedShape, updateShape } = useCanvasStore();
  if (selectedShape?.type !== "text") return null;

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label>Font Size</label>
        <Input
          type="number"
          value={selectedShape.fontSize}
          onChange={(e) =>
            updateShape({
              ...selectedShape,
              fontSize: Number(e.target.value),
            })
          }
          className="w-full"
        />
      </div>
      <div>
        <label>Text</label>
        <Input
          value={selectedShape.text}
          onChange={(e) =>
            updateShape({
              ...selectedShape,
              text: e.target.value,
            })
          }
          className="w-full"
        />
      </div>
    </div>
  );
};
