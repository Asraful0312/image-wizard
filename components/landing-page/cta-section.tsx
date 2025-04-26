"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonAnimated, setIsButtonAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const buttonTimer = setTimeout(() => {
      setIsButtonAnimated(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-[#F9FAFB]">
        <div className="absolute inset-0 bg-gradient-radial from-purple-400/20 via-transparent to-transparent opacity-70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-opacity duration-1000",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            Ready to Transform Your Images?
          </h2>
          <p
            className={cn(
              "text-lg text-gray-600 mb-8 transition-opacity duration-1000 delay-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            Sign up now and start converting with 10 free credits!
          </p>
          <Link href="/convert">
            <Button
              className={cn(
                "bg-[#6B46C1] hover:bg-purple-700 text-white text-lg px-8 py-6 transition-all hover:scale-105 hover:shadow-lg",
                isButtonAnimated && "animate-bounce-subtle"
              )}
              variant="default"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
