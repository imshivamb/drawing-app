import { useCanvasStore } from "@/store/useCanvasStore";

const colors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
];

export const ColorPanel = () => {
  const { selectedShape, stateManager } = useCanvasStore();

  const updateColor = (type: "stroke" | "fill", color: string) => {
    if (!selectedShape || !stateManager) return;
    stateManager.updateShape({
      ...selectedShape,
      [type === "stroke" ? "strokeColor" : "fillColor"]: color,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label>Stroke Color</label>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => updateColor("stroke", color)}
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <div>
        <label>Fill Color</label>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => updateColor("fill", color)}
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
