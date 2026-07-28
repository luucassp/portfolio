"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  lines: { text: string; className?: string }[];
  speed?: number;
  startDelay?: number;
}

export default function TypewriterText({ lines, speed = 120, startDelay = 400 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ""));
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fullText = lines.map((l) => l.text);
    const current = fullText.map(() => "");
    let lineIndex = 0;
    let charIndex = 0;

    setDisplayed(fullText.map(() => ""));
    setDone(false);

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (lineIndex >= fullText.length) {
          clearInterval(intervalRef.current!);
          setDone(true);
          return;
        }

        if (charIndex < fullText[lineIndex].length) {
          current[lineIndex] = fullText[lineIndex].slice(0, charIndex + 1);
          setDisplayed([...current]);
          charIndex++;
        } else {
          lineIndex++;
          charIndex = 0;
        }
      }, speed);
    }, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lines, speed, startDelay]);

  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`block ${line.className ?? ""}`}>
          {displayed[i]}
          {!done && i === lines.findIndex((_, j) => displayed[j] !== lines[j].text) && (
            <span className="animate-pulse opacity-70">|</span>
          )}
        </span>
      ))}
    </>
  );
}
