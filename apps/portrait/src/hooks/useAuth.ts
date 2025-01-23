'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${HTTP_BACKEND}/auth/me`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Register a new user
  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${HTTP_BACKEND}/auth/register`, {
        email,
        password,
        name,
      });
      const { token, user } = response.data;
      setUser(user);
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Log in a user
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${HTTP_BACKEND}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      setUser(user);
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Sign out a user
  const signOut = async () => {
    try {
      await axios.post(`${HTTP_BACKEND}/auth/signout`, {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return { user, loading, register, login, signOut };
};