import { generateId } from '@/canvas/utils/shapes';
import { Shape, ShapeType } from '@repo/common/types';
import { create } from 'zustand';

interface CanvasStore {
    mode: ShapeType | 'select';
    selectedShape: Shape | null;
    shapes: Shape[];
    setMode: (mode: ShapeType | 'select') => void;
    updateShape: (shape: Shape) => void;
    setSelectedShape: (shape: Shape | null) => void;
    updateShapes: (shapes: Shape[]) => void;
    copyShape: () => void;
    deleteShape: () => void;
    bringToFront: () => void;
    sendToBack: () => void;
   }
   
   export const useCanvasStore = create<CanvasStore>((set, get) => ({
    mode: 'select',
    selectedShape: null,
    shapes: [],
    setMode: (mode) => set({ mode }),
    updateShape: (shape) => {
      const { shapes } = get();
      const newShapes = shapes.map(s => s.id === shape.id ? shape : s);
      set({ shapes: newShapes });
    },
    copyShape: () => {
      const { selectedShape, shapes } = get();
      if (!selectedShape) return;
      
      const newShape = {
        ...selectedShape,
        id: generateId(),
        x: selectedShape.x + 20,
        y: selectedShape.y + 20
      };
      set({ shapes: [...shapes, newShape] });
    },
    deleteShape: () => {
      const { selectedShape, shapes } = get();
      if (!selectedShape) return;
      set({ 
        shapes: shapes.filter(s => s.id !== selectedShape.id),
        selectedShape: null 
      });
    },
    bringToFront: () => {
      const { selectedShape, shapes } = get();
      if (!selectedShape) return;
      const newShapes = shapes.filter(s => s.id !== selectedShape.id);
      set({ shapes: [...newShapes, selectedShape] });
    },
    sendToBack: () => {
      const { selectedShape, shapes } = get();
      if (!selectedShape) return;
      const newShapes = shapes.filter(s => s.id !== selectedShape.id);
      set({ shapes: [selectedShape, ...newShapes] });
    },
    setSelectedShape: (shape: Shape | null) => 
        set({ selectedShape: shape }),

    updateShapes: (shapes: Shape[]) => 
        set({ shapes })
   }));