"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  delay: number;
}

function TestimonialCard({ quote, name, role, delay }: TestimonialCardProps) {
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
        "border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105",
        "transform transition-all duration-700 ease-out",
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-[-50px] opacity-0"
      )}
    >
      <CardContent className="pt-6">
        <Quote className="h-8 w-8 text-purple-600 mb-4 opacity-70" />
        <p className="text-gray-600 italic mb-6">&quot;{quote}&quot;</p>
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsSection() {
  const [isHeadlineVisible, setIsHeadlineVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadlineVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      quote:
        "Image to text now saved me hours of manual typing! The AI conversion is incredibly accurate.",
      name: "Sarah M.",
      role: "Developer",
    },
    {
      quote:
        "I love how easy it is to convert PDFs to text. The credit system is fair and affordable.",
      name: "John D.",
      role: "Content Creator",
    },
    {
      quote:
        "The code extraction feature is a game-changer for my projects. Highly recommend!",
      name: "Emily R.",
      role: "Software Engineer",
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
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              delay={500 + index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
