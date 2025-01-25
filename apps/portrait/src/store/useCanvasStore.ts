import { Shape, ShapeType } from '@repo/common/types';
import { create } from 'zustand';
import { CanvasStateManager } from '@/canvas/core/state';

interface CanvasStore {
    stateManager: CanvasStateManager | null;
    mode: ShapeType | 'select';
    selectedShape: Shape | null;
    shapes: Shape[];
    initStateManager: (socket: WebSocket, roomId: string) => void;
    setMode: (mode: ShapeType | 'select') => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
    stateManager: null,
    mode: 'select',
    selectedShape: null,
    shapes: [],
    
    initStateManager: (socket: WebSocket, roomId: string) => {
      console.log("Creating state manager");
      const manager = new CanvasStateManager(socket, roomId);
      manager.subscribe({
          onShapesChange: (shapes) => {
              console.log("Shapes updated:", shapes);
              set({ shapes });
          },
          onSelectionChange: (shape) => {
              console.log("Selection changed:", shape);
              set({ selectedShape: shape });
          }
      });
      set({ stateManager: manager });
  },

    setMode: (mode) => {
        set({ mode });
        const { stateManager } = useCanvasStore.getState();
        if (stateManager) {
            stateManager.setState({ mode });
        }
    }
}));