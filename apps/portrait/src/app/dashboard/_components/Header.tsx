"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export const Header = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
          Portrait
        </h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span>{user.name}</span>
            <Button
              variant="secondary"
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div>
            <Link
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
