import express, { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@repo/database/db";
import { CreateUserSchema, SignInUserSchema } from "@repo/common/schema";
import { JWT_SECRET } from "@repo/common-backend/config";
import { auth, middleware } from "../middleware/auth.js";

const router: Router = express.Router();

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect Inputs" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsedData.data.email,
        password: hashedPassword,
        name: parsedData.data.name,
        photo: req.body.photo || "",
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Log in a user
router.post("/login", async (req: Request, res: Response) => {
  const parsedData = SignInUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect Inputs" });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );
    if (!validPassword) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

// Fetch the current user
router.get("/me", async (req: Request, res: Response) => {
  // @ts-ignore - fix this type issue later
  const userId = req.userId;

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user });
});

// Log out a user
router.post("/signout", middleware, async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Error during signout:", error);
    res.status(500).json({ message: "Error during signout" });
  }
});

export default router;