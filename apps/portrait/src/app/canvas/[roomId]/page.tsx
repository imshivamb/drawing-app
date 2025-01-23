import RoomCanvas from "@/components/RoomCanvas";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}
const CanvasPage = async ({ params }: RoomPageProps) => {
  const roomId = await params.roomId;
  console.log(roomId);

  return <RoomCanvas roomId={roomId} />;
};

export default CanvasPage;
