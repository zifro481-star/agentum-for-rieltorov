"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { scrollToSection } from "@/lib/utils";

export function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-md md:hidden">
      <Button
        size="lg"
        className="w-full"
        onClick={() => scrollToSection("lead-form")}
      >
        Стать партнёром
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
