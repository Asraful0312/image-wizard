import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Provider from "@/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Free images to text or code conversions",
  description: "Convert images to text or code with our powerful AI tools",
  keywords:
    "image conversion, AI tools, image to text, image to code, ImageToTextNow",
  openGraph: {
    title: "Free images to text or code conversions",
    description: "Convert images to text or code with our powerful AI tools",
    siteName: "Free images to text or code conversions",
    url: process.env.NEXT_PUBLIC_URL, // Replace with your domain
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/og-image.jpg`, // Add an OG image
        width: 1200,
        height: 630,
        alt: "ImageToTextNow Preview",
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
                  name: "ImageToTextNow",
                  url: `${process.env.NEXT_PUBLIC_URL}`,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${process.env.NEXT_PUBLIC_URL}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                }),
              }}
            />
            <meta
              name="google-site-verification"
              content="sX4zMfEvkW61LuTRt8qj5nkXHP5woMXgX4X7YozlBoo"
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
