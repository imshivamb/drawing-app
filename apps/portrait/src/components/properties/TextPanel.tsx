import { useCanvasStore } from "@/store/useCanvasStore";
import { TextShape } from "@repo/common/types";
import { Input } from "@repo/ui/input";

export const TextPanel = () => {
  const { selectedShape, stateManager } = useCanvasStore();

  if (!selectedShape || selectedShape.type !== "text" || !stateManager)
    return null;

  const handleUpdate = (updates: Partial<TextShape>) => {
    const updatedShape = { ...selectedShape, ...updates } as TextShape;
    stateManager.updateShape(updatedShape);
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label>Font Size</label>
        <Input
          type="number"
          value={selectedShape.fontSize}
          onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <div>
        <label>Text</label>
        <Input
          value={selectedShape.text}
          onChange={(e) => handleUpdate({ text: e.target.value })}
          className="w-full"
        />
      </div>
    </div>
  );
};
