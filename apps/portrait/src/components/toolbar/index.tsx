import { ActionTools } from "./ActionTools";
import { ShapeTools } from "./ShapeTools";

export const Toolbar = () => (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-2">
    <ShapeTools />
    <div className="w-px bg-gray-200" />
    <ActionTools />
  </div>
);
