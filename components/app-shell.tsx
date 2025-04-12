"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ImageIcon,
  FileText,
  Code,
  History,
  User,
  Tag,
  Loader2,
  ScissorsLineDashed,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { SignInButton, SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useQuery } from "@tanstack/react-query";

const fetchCredits = async () => {
  const res = await fetch("/api/user/credits");
  if (!res.ok) throw new Error("Failed to fetch credits");
  const data = await res.json();
  return data.credits ?? 0;
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const [freeConversions, setFreeConversions] = useState(0);
  const { data: credits = 0, isLoading } = useQuery({
    queryKey: ["userCredits"],
    queryFn: fetchCredits,
    enabled: isSignedIn && !!user, // Only run when signed in
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (!isSignedIn) {
      const stored = parseInt(localStorage.getItem("freeConversions") || "0");
      setFreeConversions(stored);
    }
  }, [isSignedIn]);

  return (
    <div className="flex min-h-screen flex-col w-full">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b bg-white inset-x-0 w-full">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              <span className="sr-only">Toggle menu</span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold">ImageToTextNow</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === "/" ? "text-blue-500" : "text-gray-600"
              }`}
            >
              Convert
            </Link>
            <Link
              href="/history"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === "/history" ? "text-blue-500" : "text-gray-600"
              }`}
            >
              History
            </Link>
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === "/profile" ? "text-blue-500" : "text-gray-600"
              }`}
            >
              Profile
            </Link>
            <Link
              href="/coupon"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === "/coupon" ? "text-blue-500" : "text-gray-600"
              }`}
            >
              Coupon
            </Link>
            <Link
              href="/remove-bg"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === "/coupon" ? "text-blue-500" : "text-gray-600"
              }`}
            >
              Background Remover
            </Link>
          </nav>
          <div>
            {userId ? (
              <SignOutButton>
                <Button
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105"
                >
                  Sign Out
                </Button>
              </SignOutButton>
            ) : (
              <SignInButton>
                <Button
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar variant="floating" collapsible="offcanvas">
          <SidebarHeader>
            <div className="p-2">
              <h2 className="text-lg font-semibold">Conversion Tools</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/?type=text">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Image to Text</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/?type=code">
                        <Code className="mr-2 h-4 w-4" />
                        <span>Image to Code</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/"}>
                      <Link href="/">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        <span>Convert</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/remove-bg"}
                    >
                      <Link href="/">
                        <ScissorsLineDashed className="mr-2 h-4 w-4" />
                        <span>Background Remover</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/history"}
                    >
                      <Link href="/history">
                        <History className="mr-2 h-4 w-4" />
                        <span>History</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/profile"}
                    >
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/coupon"}
                    >
                      <Link href="/coupon">
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Coupon</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              {userId ? (
                <div className="text-sm text-gray-600">
                  <p className="flex items-center">
                    Credits:{" "}
                    {isLoading ? (
                      <Loader2 className="size-4 shrink-0 animate-spin" />
                    ) : (
                      credits
                    )}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <p>Free Conversions Left: {3 - freeConversions}/3</p>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <ImageIcon className="h-6 w-6 text-blue-500" />
                    <span className="text-xl font-bold">ImageWizard</span>
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X size={24} />
                    <span className="sr-only">Close menu</span>
                  </button>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-500 ${
                      pathname === "/" ? "text-blue-500" : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Convert
                  </Link>
                  <Link
                    href="/remove-bg"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-500 ${
                      pathname === "/remove-bg"
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ScissorsLineDashed className="h-4 w-4" />
                    Background Remover
                  </Link>
                  <Link
                    href="/history"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-500 ${
                      pathname === "/history"
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <History className="h-4 w-4" />
                    History
                  </Link>
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-500 ${
                      pathname === "/profile"
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/coupon"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-500 ${
                      pathname === "/coupon" ? "text-blue-500" : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Tag className="h-4 w-4" />
                    Coupon
                  </Link>
                </nav>
                <div className="mt-4 border-t pt-4">
                  <h3 className="mb-2 text-sm font-semibold">
                    Conversion Tools
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/?type=text"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="h-4 w-4" />
                      Image to Text
                    </Link>
                    <Link
                      href="/?type=code"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Code className="h-4 w-4" />
                      Image to Code
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 w-full md:p-6">{children}</main>
      </div>
    </div>
  );
}
