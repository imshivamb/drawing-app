import { useCanvasStore } from "@/store/useCanvasStore";
import { Button } from "@repo/ui/button";
import { Copy, MoveDown, MoveUp, Trash2 } from "lucide-react";

export const ActionTools = () => {
  const { selectedShape, copyShape, deleteShape, bringToFront, sendToBack } =
    useCanvasStore();

  return (
    <div className="flex gap-1">
      <Button variant="outline" onClick={copyShape} disabled={!selectedShape}>
        <Copy className="w-5 h-5" />
      </Button>
      <Button variant="outline" onClick={deleteShape} disabled={!selectedShape}>
        <Trash2 className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        onClick={bringToFront}
        disabled={!selectedShape}
      >
        <MoveUp className="w-5 h-5" />
      </Button>
      <Button variant="outline" onClick={sendToBack} disabled={!selectedShape}>
        <MoveDown className="w-5 h-5" />
      </Button>
    </div>
  );
};
