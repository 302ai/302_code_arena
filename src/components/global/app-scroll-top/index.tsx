"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpToLine } from "lucide-react";
import { useState, useEffect } from "react";

export default function AppScrollTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="motion-safe:animate-bounce-slow fixed bottom-24 right-8 z-50 rounded-full shadow-lg hover:shadow-xl"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUpToLine className="h-4 w-4" />
    </Button>
  );
}
