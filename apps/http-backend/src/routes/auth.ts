import express, { Router } from 'express'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '@repo/database/db'
import { CreateUserSchema, SignInUserSchema } from '@repo/common/schema'
import { JWT_SECRET } from '@repo/common-backend/config'

const router: Router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect Inputs" })
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
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                photo: user.photo
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
})

router.post("/login", async (req: Request, res: Response) => {
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

export default router