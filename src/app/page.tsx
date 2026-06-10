import { Header } from "@/components/Header";
import { Hero, HeroBackground } from "@/components/Hero";
import { TargetAudience } from "@/components/TargetAudience";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { AppScreenshots } from "@/components/AppScreenshots";
import { PlatformScreenshots } from "@/components/PlatformScreenshots";
import { TrustMetrics } from "@/components/TrustMetrics";
import { Experts } from "@/components/Experts";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="relative overflow-hidden" style={{ minHeight: "100dvh" }}>
        <HeroBackground />
        <div className="relative z-10">
          <Header />
          <Hero />
        </div>
      </div>
      <main>
        <TargetAudience />
        <HowItWorks />
        <Pricing />
        <PlatformFeatures />
        <AppScreenshots />
        <PlatformScreenshots />
        <TrustMetrics />
        <Experts />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
