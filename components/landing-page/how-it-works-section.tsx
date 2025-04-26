"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

function StepCard({ number, title, description, delay }: StepCardProps) {
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
        "border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-md",
        "transform transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-[#6B46C1] text-white flex items-center justify-center mb-4 text-xl font-bold">
            {number}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HowItWorksSection() {
  const [isHeadlineVisible, setIsHeadlineVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadlineVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      number: "01",
      title: "Upload Your File",
      description: "Upload an image or PDF to start the conversion process",
    },
    {
      number: "02",
      title: "Choose Conversion Type",
      description:
        "Select from options like Image to Text, Image to Code, or AI-Enhanced Text",
    },
    {
      number: "03",
      title: "Get Your Result",
      description:
        "Receive your converted text or code instantly, ready to use",
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
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1">
              <StepCard
                number={step.number}
                title={step.title}
                description={step.description}
                delay={500 + index * 300}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
