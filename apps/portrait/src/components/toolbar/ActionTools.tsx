import { useCanvasStore } from "@/store/useCanvasStore";
import { Button } from "@repo/ui/button";
import { Copy, MoveDown, MoveUp, Trash2 } from "lucide-react";

export const ActionTools = () => {
  const { selectedShape, stateManager } = useCanvasStore();

  const handlers = {
    copyShape: () => stateManager?.copySelectedShape(),
    deleteShape: () =>
      selectedShape && stateManager?.deleteShape(selectedShape.id),
    bringToFront: () =>
      selectedShape && stateManager?.bringToFront(selectedShape.id),
    sendToBack: () =>
      selectedShape && stateManager?.sendToBack(selectedShape.id),
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        onClick={handlers.copyShape}
        disabled={!selectedShape}
      >
        <Copy className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        onClick={handlers.deleteShape}
        disabled={!selectedShape}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        onClick={handlers.bringToFront}
        disabled={!selectedShape}
      >
        <MoveUp className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        onClick={handlers.sendToBack}
        disabled={!selectedShape}
      >
        <MoveDown className="w-5 h-5" />
      </Button>
    </div>
  );
};
