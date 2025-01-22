"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Pencil,
  Sparkles,
  ChevronRight,
  Github,
  Play,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@repo/ui/button";
import Link from "next/link";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { number: "100K+", label: "Active Users" },
    { number: "1M+", label: "Drawings Created" },
    { number: "150+", label: "Countries" },
    { number: "4.9/5", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""}`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-200 rounded-lg transform rotate-45 animate-spin-slow"></div>
                <Pencil className="h-8 w-8 text-purple-600 relative" />
              </div>
              <span className="text-2xl font-bold text-gray-800">Portrait</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="https://github.com/imshivamb/drawing-app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link href="/login">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all hover:scale-105">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.1),transparent)] pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative">
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight relative">
                Where Ideas
                <span className="text-purple-600 block">Come to Life</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your thoughts into stunning visuals with our
                collaborative drawing platform. Real-time collaboration,
                integrated chat, and beautiful hand-drawn styles make Portrait
                the perfect canvas for your creativity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-purple-700 transition-all hover:scale-105 shadow-lg hover:shadow-purple-200 flex items-center justify-center group"
                  >
                    Start Creating Free
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  className="border-2 border-purple-200 bg-white !text-purple-600 px-8 py-4 rounded-xl font-medium hover:border-purple-600 transition-all hover:scale-105 shadow-lg hover:shadow-purple-100 flex items-center justify-center group"
                >
                  Watch Demo
                  <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-100 rounded-2xl transform rotate-2 animate-pulse"></div>
              <div className="absolute -inset-4 bg-purple-50 rounded-2xl transform -rotate-2 animate-pulse animation-delay-500"></div>
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                alt="Collaboration Preview"
                className="relative rounded-2xl shadow-2xl w-full transform hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute -right-8 -bottom-8 bg-white p-4 rounded-xl shadow-xl transform hover:scale-105 transition-transform">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    1,234 users online now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent)] pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Craft Your Vision Together
            </h2>
            <p className="text-xl text-gray-600">
              Experience the perfect blend of creativity and collaboration with
              our powerful features designed to bring your ideas to life.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-purple-600 group-hover:rotate-6">
                <Users className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Real-time Collaboration
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Work seamlessly with your team in real-time. See changes
                instantly and create together without boundaries or delays.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 group/link"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-purple-600 group-hover:rotate-6">
                <MessageSquare className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Integrated Chat
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Communicate effectively with built-in chat. Share feedback,
                discuss ideas, and make decisions in context.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 group/link"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-purple-600 group-hover:rotate-6">
                <Sparkles className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Excalidraw Style
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Create beautiful hand-drawn diagrams that stand out. Perfect for
                wireframes, architecture, and presentations.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 group/link"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Loved by Teams Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Portrait has transformed how our design team collaborates. The real-time features are game-changing.",
                author: "Sarah Chen",
                role: "Design Lead at Dropbox",
                rating: 5,
              },
              {
                quote:
                  "The best whiteboarding tool we've used. The hand-drawn style adds a personal touch to our presentations.",
                author: "Michael Torres",
                role: "Product Manager at Slack",
                rating: 5,
              },
              {
                quote:
                  "Incredibly intuitive and perfect for remote collaboration. Our team can't imagine working without it.",
                author: "Emma Watson",
                role: "CEO at StartupCo",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-purple-50 p-8 rounded-2xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-purple-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl text-purple-100 mb-12">
              Join thousands of teams already creating amazing things together
              on Portrait.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-medium hover:bg-purple-50 transition-all hover:scale-105 shadow-lg group">
                Get Started Free
                <ChevronRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all hover:scale-105">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Pencil className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold">Portrait</span>
              </div>
              <p className="text-gray-400">
                Bringing creativity and collaboration together in perfect
                harmony.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Licenses
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex justify-between items-center">
            <div className="text-gray-400">
              © 2024 Portrait. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
