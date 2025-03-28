import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Provider from "@/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ImageWizard - Image Conversion Made Easy",
  description: "Convert images to text or code with our powerful AI tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} min-h-screen bg-[#F9FAFB]`}>
            <SidebarProvider>{children}</SidebarProvider>
            <Toaster richColors />
          </body>
        </html>
      </ClerkProvider>
    </Provider>
  );
}
