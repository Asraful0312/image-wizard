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
import Footer from "./footer";

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
    enabled: isSignedIn && !!user,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isSignedIn) {
      const stored = parseInt(localStorage.getItem("freeConversions") || "0");
      setFreeConversions(stored);
    }
  }, [isSignedIn]);

  return (
    <div className="flex min-h-screen flex-col w-full">
      {/* Header */}
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
              <span className="text-lg md:text-xl font-bold">
                ImageToTextNow
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/", label: "Convert" },
              { href: "/history", label: "History" },
              { href: "/profile", label: "Profile" },
              { href: "/coupon", label: "Coupon" },
              { href: "/remove-bg", label: "Background Remover" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  pathname === href ? "text-blue-500" : "text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
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

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
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
                  {[
                    { href: "/", icon: ImageIcon, label: "Convert" },
                    {
                      href: "/remove-bg",
                      icon: ScissorsLineDashed,
                      label: "Background Remover",
                    },
                    { href: "/history", icon: History, label: "History" },
                    { href: "/profile", icon: User, label: "Profile" },
                    { href: "/coupon", icon: Tag, label: "Coupon" },
                  ].map(({ href, icon: Icon, label }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild isActive={pathname === href}>
                        <Link href={href}>
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4 text-sm text-gray-600">
              {userId ? (
                <p className="flex items-center gap-1">
                  Credits:{" "}
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    credits
                  )}
                </p>
              ) : (
                <p>Free Conversions Left: {3 - freeConversions}/3</p>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Animated Mobile Sidebar */}
        <div
          className={`fixed inset-0 z-30 md:hidden bg-black/50 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`fixed inset-y-0 left-0 z-40 w-3/4 max-w-sm bg-white p-2 transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
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
              <nav className="flex flex-col mt-5">
                {[
                  { href: "/", icon: ImageIcon, label: "Convert" },
                  {
                    href: "/remove-bg",
                    icon: ScissorsLineDashed,
                    label: "Background Remover",
                  },
                  { href: "/history", icon: History, label: "History" },
                  { href: "/profile", icon: User, label: "Profile" },
                  { href: "/coupon", icon: Tag, label: "Coupon" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors p-2 hover:text-blue-500 ${
                      pathname === href ? "text-blue-500 bg-gray-50" : "text-gray-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 w-full md:p-6">
          <div className="flex flex-col justify-between w-full">
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
