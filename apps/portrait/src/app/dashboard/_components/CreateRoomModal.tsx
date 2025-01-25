'use client';
import { useState } from "react";
import { Modal } from "@repo/ui/modal";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

interface CreateRoomModalProps {
  onCreate: (name: string) => void;
  onClose: () => void;
}

export const CreateRoomModal = ({
  onCreate,
  onClose,
}: CreateRoomModalProps) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreate(name);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Create New Room
        </h2>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Room name"
          className="w-full p-2 border rounded"
        />
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create
        </Button>
      </form>
    </Modal>
  );
};
