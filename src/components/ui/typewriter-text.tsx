"use client";

import { languageAtom } from "@/stores/slices/language_store";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function TypewriterText({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterTextProps) {
  const locale = useAtomValue(languageAtom);

  const [displayText, setDisplayText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;

    const speedMultiplier = locale === "en" ? 0.33 : 1;
    const currentSpeed = isDeleting ? deleteSpeed : speed;
    const adjustedSpeed = currentSpeed * speedMultiplier;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentText.length) {
          setDisplayText((prev) => prev + currentText[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else if (loop) {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex(0);
          setTextArrayIndex((prev) => (prev + 1) % textArray.length);
        }
      }
    }, adjustedSpeed);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    text,
    locale,
  ]);

  return (
    <span className={className}>
      {displayText}

      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}
