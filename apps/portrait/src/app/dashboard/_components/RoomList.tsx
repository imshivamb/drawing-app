"use client";

import { useEffect, useState } from "react";
import { createRoom, fetchRooms } from "../../../services/api";
import { RoomCard } from "./RoomCard";
import { CreateRoomModal } from "./CreateRoomModal";
import { Room } from "@/types";

export const RoomList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch rooms on mount
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    loadRooms();
  }, []);

  // Handle room creation
  const handleCreateRoom = async (name: string) => {
    try {
      const newRoom = await createRoom({ name });
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Your Rooms
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {isCreating && (
        <CreateRoomModal
          onCreate={handleCreateRoom}
          onClose={() => setIsCreating(false)}
        />
      )}
    </div>
  );
};
