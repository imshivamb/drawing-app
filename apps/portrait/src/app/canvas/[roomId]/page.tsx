import RoomCanvas from "@/components/RoomCanvas";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}
const CanvasPage = ({ params }: RoomPageProps) => {
  const roomId = params.roomId;
  console.log(roomId);

  return <RoomCanvas roomId={roomId} />;
};

export default CanvasPage;
