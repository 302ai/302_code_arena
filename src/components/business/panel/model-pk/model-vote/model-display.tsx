"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa6";

interface ModelDisplayProps {
  label: string;
  modelName: string;
  isWinner: boolean;
  showModelName: boolean;
  hiddenPlaceholder?: string;
}

export function ModelDisplay({
  label,
  modelName,
  isWinner,
  showModelName,
  hiddenPlaceholder = "******",
}: ModelDisplayProps) {
  const crownAnimation = {
    initial: { rotate: 0, opacity: 0, scale: 0 },
    animate: {
      opacity: isWinner ? 1 : 0,
      scale: isWinner ? 1 : 0,
      rotate: isWinner ? [0, -15, 15, -10, 10, -5, 5, 0] : 0,
    },
    transition: {
      opacity: { duration: 0.15 },
      scale: { duration: 0.15 },
      rotate: {
        duration: 0.5,
        times: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
        ease: "easeInOut",
        delay: 0.15,
      },
    },
  };

  return (
    <div className="flex items-center justify-center gap-x-2 text-xl">
      <span
        className={cn("text-muted-foreground", isWinner && "text-foreground")}
      >
        {label}
      </span>
      <span className={cn("text-muted-foreground", isWinner && "text-primary")}>
        {showModelName ? modelName : hiddenPlaceholder}
      </span>
      <motion.div
        initial={crownAnimation.initial}
        animate={crownAnimation.animate}
        transition={crownAnimation.transition}
      >
        <FaCrown className="text-primary" />
      </motion.div>
    </div>
  );
}
