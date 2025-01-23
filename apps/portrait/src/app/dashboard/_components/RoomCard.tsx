import { Room } from "@/types";
import Link from "next/link";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <Link href={`/canvas/${room.id}`}>
      <div className="bg-white dark:bg-gray-800  p-4 rounded-lg shadow hover:shadow-md cursor-pointer">
        <h3 className="font-medium">{room.name}</h3>
        <p className="text-sm text-gray-400">
          Created {new Date(room.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          {room.users.length} collaborator{room.users.length !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
};
