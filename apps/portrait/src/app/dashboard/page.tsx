import React from "react";
import { Header } from "./_components/Header";
import { RoomList } from "./_components/RoomList";
export const dynamic = "force-dynamic";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RoomList />
      </main>
    </div>
  );
};

export default DashboardPage;
