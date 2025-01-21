import express from 'express'
import { Request, Response } from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import prisma from '@repo/database/db'
import {CreateUserSchema, SignInUserSchema, CreateRoomSchema } from '@repo/common/schema'
import { JWT_SECRET } from '@repo/common-backend/config'
import { middleware } from './middleware.js'


const app = express();

app.use(express.json())
app.use(bodyParser.json())


app.post('/register', async (req: Request, res:Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrct Inputs" })
        return
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)
        const user = await prisma.user.create({
            data: {
                email: parsedData.data.email,
                password: hashedPassword,
                name: parsedData.data.name,
                photo: req.body.photo || ""
            }
        })

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({token})
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
})

app.post("/login", async (req: Request, res: Response) => {
    const parsedData = SignInUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect Inputs" })
        return
    }

    try {
        const user = await prisma.user.findFirst({
            where: { 
                email: parsedData.data.email
            }
        })

        if (!user) {
            res.status(401).json({ message: "Invalid Credentials"})
            return
        }

        const validPassword = await bcrypt.compare(parsedData.data.password, user.password)
        if (!validPassword) {
            res.status(401).json({ message: "Invalid credentials" });
            return
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: "Error during login" });
    }
})

app.post('/room', middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect Inputs" })
        return
    }

    // @ts-ignore
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
})

app.get('/chats/:roomId', async (req, res) => {
    try {
        const roomId = req.params.roomId
        console.log(req.params.roomId);
        const messages = await prisma.chat.findMany({
            where:{
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.json({ messages})
    } catch (e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
})

app.get('/room/:slug', async (req, res) => {
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({
        where: {
            slug
        }
    })
    res.json({ room })
})


app.listen(3002)