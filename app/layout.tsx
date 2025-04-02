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
  keywords:
    "image conversion, AI tools, image to text, image to code, ImageWizard",
  openGraph: {
    title: "ImageWizard - Image Conversion Made Easy",
    description: "Convert images to text or code with our powerful AI tools",
    url: process.env.NEXT_PUBLIC_URL, // Replace with your domain
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/og-image.jpg`, // Add an OG image
        width: 1200,
        height: 630,
        alt: "ImageWizard Preview",
      },
    ],
  },
  robots: {
    index: true, // Allow indexing
    follow: true, // Allow link following
  },
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
          <head>
            <link rel="icon" href="/favicon.ico" />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: "ImageWizard",
                  url: `${process.env.NEXT_PUBLIC_URL}`,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${process.env.NEXT_PUBLIC_URL}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                }),
              }}
            />
          </head>
          <body className={`${inter.className} min-h-screen bg-[#F9FAFB]`}>
            <SidebarProvider>{children}</SidebarProvider>
            <Toaster richColors />
          </body>
        </html>
      </ClerkProvider>
    </Provider>
  );
}
