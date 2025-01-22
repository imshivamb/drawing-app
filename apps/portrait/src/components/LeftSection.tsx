"use client";
import { Pencil, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const testimonials = [
  {
    content:
      "This collaborative drawing platform is a game-changer! It's easy to use, provides real-time collaboration, and has helped our team visualize ideas effectively. I highly recommend it.",
    author: "Sarah Chen",
    role: "Design Lead, Artify",
  },
  {
    content:
      "The real-time collaboration features are incredible. It's like having our entire team in the same room, sketching and ideating together.",
    author: "Marcus Rodriguez",
    role: "Product Manager, InnovateCo",
  },
  {
    content:
      "Perfect for remote design sprints and workshops. The infinite canvas and sharing capabilities make it our go-to tool for visual collaboration.",
    author: "Emily Watson",
    role: "UX Director, DesignFlow",
  },
];

const LeftSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === testimonials.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="max-w-md mx-auto flex flex-col justify-between h-full">
      <div className="flex items-center absolute top-8 left-8 space-x-2">
        <Pencil className="size-5" />
        <span className="text-2xl font-bold">Portrait</span>
      </div>

      <div className="flex flex-col items-center justify-center h-full space-y-8">
        <div>
          <h1 className="text-4xl text-center font-bold mb-4">
            Collaborate in Real-Time, Anywhere
          </h1>
          <p className="text-gray-400 text-center">
            Create, share, and collaborate on drawings with your team in
            real-time!
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="mb-4 text-gray-300">
              {testimonials[currentSlide].content}
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">
                  {testimonials[currentSlide].author}
                </p>
                <p className="text-sm text-gray-400">
                  {testimonials[currentSlide].role}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default LeftSection;
