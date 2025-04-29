"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConvertPage } from "../convert-page";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative overflow-hidden w-full">
      {/* Enhanced Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-purple-50 overflow-hidden w-full ">
        {/* Animated gradient orbs */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-purple-300/30 to-transparent rounded-full blur-3xl animate-pulse "
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-radial from-indigo-300/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s" }}
        />

        {/* Decorative elements */}
        <div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400/30 rounded-full animate-ping"
          style={{
            animationDuration: "3s",
            animationIterationCount: "infinite",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-indigo-400/30 rounded-full animate-ping"
          style={{
            animationDuration: "4s",
            animationIterationCount: "infinite",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] "
          style={{
            backgroundImage:
              "linear-gradient(to right, #8B5CF6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Subtle wave effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/20 to-transparent  transform -skew-y-1" />
      </div>

      <div className="w-full max-w-[1100px] mx-auto sm:px-4 py-20 md:py-32 relative z-10">
        <div className="w-full max-w-5xl mx-auto text-center mt-10">
          {/* Headline with fade-in animation */}
          <h1
            className={cn(
              "text-3xl md:text-5xl px-2 sm:px-0 font-bold text-gray-900 mb-6 transition-opacity duration-1000 ease-out opacity-0",
              isLoaded && "opacity-100"
            )}
          >
            Convert Images to Text or Code Instantly
          </h1>

          {/* Subheadline with fade-in animation */}
          <p
            className={cn(
              "text-lg md:text-xl text-gray-600 mb-12 transition-opacity duration-1000 ease-out opacity-0 delay-200",
              isLoaded && "opacity-100"
            )}
          >
            Upload your image or PDF and let AI do the magic
          </p>

          {/* Conversion component with slide-up animation */}
          <div
            className={cn(
              "bg-white p-2 md:p-8 rounded-xl shadow-lg transition-all duration-700 ease-out transform translate-y-10 opacity-0 delay-500 w-full",
              isLoaded && "translate-y-0 opacity-100"
            )}
          >
            {/* Simple file upload placeholder */}
            <ConvertPage hero />

            {/* Features badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                AI-Powered
              </div>
              <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                99% Accuracy
              </div>
              <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                Code Formatting
              </div>
              <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                Instant Results
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
