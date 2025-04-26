import CTASection from "@/components/landing-page/cta-section";
import FeaturesSection from "@/components/landing-page/features-section";
import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import HowItWorksSection from "@/components/landing-page/how-it-works-section";
import Navbar from "@/components/landing-page/navbar";
import PricingSection from "@/components/landing-page/pricing-section";
import TestimonialsSection from "@/components/landing-page/testimonials-section";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen mx-auto w-full bg-[#F9FAFB]">
      <Navbar />

      {/* Hero Section */}
      <Suspense>
        <HeroSection />
      </Suspense>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section - New Implementation */}
      <CTASection />

      <Footer />
    </div>
  );
}
