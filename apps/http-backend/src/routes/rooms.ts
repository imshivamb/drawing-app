import { Router, Request, Response } from 'express';
import express from 'express';
import prisma from '@repo/database/db';
import { CreateRoomSchema } from '@repo/common/schema';
import { middleware as auth } from '../middleware/auth.js';

const router: Router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect Inputs" })
        return
    }

    // @ts-ignore  - we'll fix this type issue later
    const userId = req.userId;

    try {
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (error) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
});

router.get('/:slug', async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({
        where: {
            slug
        }
    })
    res.json({ room })
});

router.get('/chats/:roomId', async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        const messages = await prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.json({ messages })
    } catch (e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
});

export default router;