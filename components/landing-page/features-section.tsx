"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Zap, FileText, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function FeatureCard({ title, description, icon, delay }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={cn(
        "border border-gray-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "transform transition-all duration-700 ease-out",
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-[-50px] opacity-0"
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <div className="text-[#6B46C1]">{icon}</div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function FeaturesSection() {
  const [isHeadlineVisible, setIsHeadlineVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadlineVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "AI-Powered Conversions",
      description: "Extract text or code from images using AI",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Multiple Conversion Types",
      description:
        "Convert images, PDFs, or use AI for enhanced text extraction",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Credit System",
      description:
        "Earn credits via coupons or purchase them securely with Lemon Squeezy",
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      title: "Secure Authentication",
      description: "Sign in with Clerk for a safe and seamless experience",
      icon: <Shield className="h-6 w-6" />,
    },
  ];

  return (
    <section className="bg-[#F9FAFB] py-20">
      <div className="max-w-[1100px] mx-auto px-4">
        <h2
          className={cn(
            "text-3xl font-bold text-gray-900 text-center mb-12 transition-opacity duration-1000",
            isHeadlineVisible ? "opacity-100" : "opacity-0"
          )}
        >
          Why Choose <span className="text-purple-600">Image to text now?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={500 + index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
