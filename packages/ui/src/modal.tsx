import React from "react";
import { Button } from "./button";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 relative p-6 rounded-lg shadow-lg max-w-md w-full">
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          X
        </Button>
        {children}
      </div>
    </div>
  );
};
