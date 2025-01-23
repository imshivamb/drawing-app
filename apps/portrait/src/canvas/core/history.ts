import { Shape } from "@repo/common/types";
import { CanvasState } from "./state";

interface HistoryState {
    shapes: Shape[];
    selectedId: string | null;
}

export class HistoryManager {
    private undoStack: HistoryState[] = [];
    private redoStack: HistoryState[] = [];
    private maxHistory = 50;
    

    pushState(shapes: Shape[], selectedId: string | null) {
        this.undoStack.push({ shapes: JSON.parse(JSON.stringify(shapes)), selectedId });
        this.redoStack = [];
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
        }
    }

    undo(currentState: CanvasState): HistoryState | null {
        const prevState = this.undoStack.pop();
        if (prevState) {
            this.redoStack.push({
                shapes: currentState.shapes,
                selectedId: currentState.selectedShape?.id || null
            });
            return prevState;
        }
        return null;
    }

    redo(currentState: CanvasState): HistoryState | null {
        const nextState = this.redoStack.pop();
        if (nextState) {
            this.undoStack.push({
                shapes: currentState.shapes,
                selectedId: currentState.selectedShape?.id || null
            });
            return nextState;
        }
        return null;
    }
}