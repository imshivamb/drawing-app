"use client";

import AuthForm from "@/components/AuthForm";
import LeftSection from "@/components/LeftSection";

export default function Register() {
  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-[#434343] to-black text-white p-12 relative">
        <LeftSection />
      </div>

      {/* Right Section */}
      <div className="w-full lg:!w-1/2 p-8 sm:p-12 flex items-center rounded-l-3xl">
        <div className="w-full max-w-md mx-auto space-y-8">
          <AuthForm isLogin={false} />
        </div>
      </div>
    </div>
  );
}
