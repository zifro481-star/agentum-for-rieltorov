import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TargetAudience } from "@/components/TargetAudience";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { TrustMetrics } from "@/components/TrustMetrics";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TargetAudience />
        <HowItWorks />
        <Pricing />
        <PlatformFeatures />
        <TrustMetrics />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
