"use client";

import { useRef } from "react";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CalculatorForm from "./components/CalculatorForm";
import Footer from "./components/Footer";

export default function Home() {
  const calcRef = useRef<HTMLDivElement>(null);

  function scrollToCalc() {
    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <HeroSection onCalcClick={scrollToCalc} />
      <FeaturesSection />
      <div ref={calcRef} className="scroll-mt-8 pt-8">
        <div className="mx-auto max-w-2xl px-4 mb-10">
          <h2 className="text-xl font-bold text-foreground">Estimate your breach cost</h2>
          <p className="text-sm text-muted mt-1">
            Answer four questions about your business. Get a personalised cost range, regulatory exposure, and an action plan — in seconds.
          </p>
        </div>
        <CalculatorForm />
      </div>
      <Footer />
    </main>
  );
}
