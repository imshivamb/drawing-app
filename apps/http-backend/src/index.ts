import express from 'express'
import { Request, Response } from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import bcrypt from 'bcrypt'
import prisma from '@repo/database/db'
import {CreateUserSchema, SignInUserSchema, CreateRoomSchema } from '@repo/common/schema'
import { JWT_SECRET } from '@repo/common-backend/config'
import { middleware } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'


const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
app.use(bodyParser.json())


app.use('/auth', authRoutes)

app.use('/room', roomRoutes)

app.listen(3002)