"use client";

import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SignInButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { userId } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Convert", href: "/convert" },
    { name: "Pricing", href: "/profile" },
    { name: "History", href: "/history" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ImageIcon className="h-8 w-8 text-[#6B46C1]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-[#6B46C1] transition-all hover:scale-105"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            {userId ? (
              <Link
                href="/convert"
                className={buttonVariants({
                  className:
                    "transition-all duration-200 hover:scale-105 bg-purple-600 text-white hover:bg-purple-500",
                })}
              >
                Dashboard
              </Link>
            ) : (
              <SignInButton>
                <Button
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105 bg-purple-600 text-white hover:bg-purple-500"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && isMobile && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-4 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-[#6B46C1] py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {userId ? (
              <Link
                href="/convert"
                className={buttonVariants({
                  className:
                    "transition-all duration-200 hover:scale-105 bg-purple-600 hover:bg-purple-500 text-white",
                })}
              >
                Dashboard
              </Link>
            ) : (
              <SignInButton>
                <Button
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105 bg-purple-600 hover:bg-purple-500 text-white"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
