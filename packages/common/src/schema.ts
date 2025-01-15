import { z } from 'zod'

export const CreateUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    photo: z.string().optional()
})

export const SignInUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})