import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    x: number;
    y: number;
    radius: number;
}

export async function initCanvas(canvas: HTMLCanvasElement, mode: Shape["type"] | "free", roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    const existingShapes: Shape[] =  await getExistingShapes(roomId);
    clearCanvas(canvas, existingShapes, ctx);
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    console.log(existingShapes)

    socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);

        if (messageData.type === 'chat') {
            const parsedMessage = JSON.parse(messageData.message);
            existingShapes.push(parsedMessage.shape);
            clearCanvas(canvas, existingShapes, ctx);
        }
        // if (messageData.type === 'rect') {
        //     ctx.beginPath();
        //     ctx.rect(messageData.x, messageData.y, messageData.width, messageData.height);
        //     ctx.stroke();
        // }
    }

    function handleMouseDown(e: MouseEvent) {
        isDrawing = true;
        startX = e.clientX;
        startY = e.clientY;
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isDrawing) return;
        if (!ctx) return;

        if (mode === 'free') {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            startX = e.clientX;
            startY = e.clientY;
        } else {
            clearCanvas(canvas, existingShapes, ctx);
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.beginPath();
            ctx.rect(startX, startY, width, height);
            ctx.stroke();
        }
    }

    function handleMouseUp(e: MouseEvent) {
        if (!isDrawing) return;
        isDrawing = false;

        if (mode === 'rect') {
            const shape: Shape = {type: 'rect',
                x: startX,
                y: startY,
                width: e.clientX - startX,
                height: e.clientY - startY}
            existingShapes.push(shape);
            socket.send(JSON.stringify({
                type: 'chat',
                message: JSON.stringify({shape}),
                roomId
            }))
        }
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseleave", handleMouseUp);
    };
}

function clearCanvas(canvas: HTMLCanvasElement, existingShapes: Shape[], ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach(shape => {
        if (shape.type === 'rect') {
            ctx.beginPath();
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            ctx.stroke();
        }
    });
}

const getExistingShapes = async (roomId: string) => {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
    })

    return shapes;
}