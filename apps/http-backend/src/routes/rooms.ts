import { Router, Request, Response } from "express";
import express from "express";
import prisma from "@repo/database/db";
import { CreateRoomSchema } from "@repo/common/schema";
import { middleware } from "../middleware/auth.js";

const router: Router = express.Router();

// Create a new room
router.post("/", middleware, async (req: Request, res: Response) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect Inputs" });
    return;
  }

  // @ts-ignore - fix this type issue later
  const userId = req.userId;

  try {
    const room = await prisma.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
        members: {
          create: {
            userId: userId,
            role: "admin",
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    const roomWithUsers = {
      ...room,
      users: room.members.map((member) => member.user),
    };

    res.json(roomWithUsers);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Error creating room" });
  }
});

// Fetch all rooms
router.get("/", middleware, async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    const roomsWithUsers = rooms.map((room) => ({
      ...room,
      users: room.members.map((member) => member.user),
    }));

    res.json(roomsWithUsers);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

// Fetch a single room by slug
router.get("/:slug", middleware, async (req: Request, res: Response) => {
  const slug = req.params.slug;

  try {
    const room = await prisma.room.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    const roomWithUsers = {
      ...room,
      users: room.members.map((member) => member.user),
    };

    res.json({ room: roomWithUsers });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Error fetching room" });
  }
});

// Fetch chats for a room
router.get("/chats/:roomId", middleware, async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const messages = await prisma.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Error fetching chats" });
  }
});

// Add a user to a room
router.post("/:slug/join", middleware, async (req: Request, res: Response) => {
  const slug = req.params.slug;

  // @ts-ignore - fix this type issue later
  const userId = req.userId;

  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({
      where: { slug },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }


    const existingMember = await prisma.roomMember.findFirst({
      where: {
        roomId: room.id,
        userId: userId,
      },
    });

    if (existingMember) {
      res.status(400).json({ message: "User is already a member of this room" });
      return;
    }

    // Add the user to the room
    const newMember = await prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: userId,
        role: "editor",
      },
      include: {
        user: true,
      },
    });

    res.json(newMember);
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: "Error joining room" });
  }
});

router.post("/:slug/leave", middleware, async (req: Request, res: Response) => {
  const slug = req.params.slug;

  // @ts-ignore - fix this type issue later
  const userId = req.userId;

  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({
      where: { slug },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const existingMember = await prisma.roomMember.findFirst({
      where: {
        roomId: room.id,
        userId: userId,
      },
    });

    if (!existingMember) {
      res.status(400).json({ message: "User is not a member of this room" });
      return;
    }

    // Remove the user from the room
    await prisma.roomMember.delete({
      where: {
        id: existingMember.id,
      },
    });

    res.json({ message: "User has left the room" });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({ message: "Error leaving room" });
  }
});

export default router;