"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser, SignInButton } from "@clerk/nextjs";

interface PricingCardProps {
  title: string;
  price: string;
  credits: number;
  description: string;
  isHighlighted?: boolean;
  delay: number;
}

function PricingCard({
  title,
  price,
  credits,
  description,
  isHighlighted = false,
  delay,
}: PricingCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleBuyCredits = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate credit purchase");
    }
  };

  return (
    <Card
      className={cn(
        "border transition-all duration-300 hover:scale-105 hover:shadow-lg",
        isHighlighted
          ? "border-purple-600 shadow-md"
          : "border-gray-200 shadow-sm",
        "transform transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-2xl font-bold text-purple-600">{price}</span>
        </div>
        <div className="mb-4 text-sm font-medium bg-purple-50 text-purple-700 py-1 px-3 rounded-full inline-block">
          {credits} credits
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        {isSignedIn ? (
          <Button
            onClick={handleBuyCredits}
            className="w-full bg-[#6B46C1] hover:bg-purple-700 transition-transform hover:scale-105"
            variant="default"
          >
            Buy Now
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button className="w-full bg-[#6B46C1] hover:bg-purple-700 transition-transform hover:scale-105">
              Sign In
            </Button>
          </SignInButton>
        )}
      </CardFooter>
    </Card>
  );
}

export default function PricingSection() {
  const [isHeadlineVisible, setIsHeadlineVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadlineVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const pricingPlans = [
    {
      title: "Starter Pack",
      price: "$5",
      credits: 50,
      description: "Perfect for occasional users",
      isHighlighted: false,
    },
    {
      title: "Basic Pack",
      price: "$10",
      credits: 150,
      description: "Great for frequent conversions",
      isHighlighted: false,
    },
    {
      title: "Pro Pack",
      price: "$25",
      credits: 500,
      description: "Best value for heavy users",
      isHighlighted: true,
    },
    {
      title: "Elite Pack",
      price: "$50",
      credits: 1500,
      description: "Ideal for businesses and teams",
      isHighlighted: false,
    },
  ];

  return (
    <section className="bg-[#F9FAFB] py-20">
      <div className="max-w-[1100px] mx-auto px-4">
        <div
          className={cn(
            "text-center mb-12 transition-opacity duration-1000",
            isHeadlineVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Purchase credits to unlock unlimited conversions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              credits={plan.credits}
              description={plan.description}
              isHighlighted={plan.isHighlighted}
              delay={500 + index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
