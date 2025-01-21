import Canvas from "@/components/Canvas";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}
const CanvasPage = ({ params }: RoomPageProps) => {
  const roomId = params.roomId;
  console.log(roomId);

  return <Canvas roomId={roomId} />;
};

export default CanvasPage;
