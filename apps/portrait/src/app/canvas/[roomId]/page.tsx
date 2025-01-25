import RoomCanvas from "@/components/RoomCanvas";

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}
const CanvasPage = async ({ params }: RoomPageProps) => {
  const { roomId } = await params;
  console.log(roomId);

  return <RoomCanvas roomId={roomId} />;
};

export default CanvasPage;
