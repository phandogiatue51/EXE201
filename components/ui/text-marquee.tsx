"use client";

import { useState, useRef, useEffect, useId } from "react";
import { cn } from "@/lib/utils";

interface TextMarqueeProps {
  children: string;
  className?: string;
  maxLines?: number;
}

export function TextMarquee({
  children,
  className,
  maxLines = 1,
}: TextMarqueeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [needsMarquee, setNeedsMarquee] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "-");

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        // Create a temporary element to measure full text width
        const temp = document.createElement("span");
        temp.style.visibility = "hidden";
        temp.style.position = "absolute";
        temp.style.whiteSpace = "nowrap";
        temp.textContent = children;
        document.body.appendChild(temp);
        const textWidth = temp.offsetWidth;
        document.body.removeChild(temp);

        const containerWidth = containerRef.current.offsetWidth;
        setNeedsMarquee(textWidth > containerWidth);
      }
    };

    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(checkOverflow, 0);
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [children]);

  const lineClampClass =
    maxLines === 1
      ? "truncate"
      : maxLines === 2
        ? "line-clamp-2"
        : maxLines === 3
          ? "line-clamp-3"
          : "";

  useEffect(() => {
    if (isHovered && textRef.current && containerRef.current && needsMarquee) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;
      const distance = textWidth - containerWidth;
      const duration = Math.max(3, distance / 30);

      // Create dynamic keyframes
      const styleId = `marquee-${uniqueId}`;
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = `
        @keyframes marquee-${uniqueId} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${distance}px); }
        }
      `;

      return () => {
        // Cleanup on unmount
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };
    }
  }, [isHovered, children, needsMarquee, uniqueId]);

  if (!needsMarquee) {
    return (
      <div ref={containerRef} className={cn(lineClampClass, className)}>
        {children}
      </div>
    );
  }

  const textWidth = textRef.current?.scrollWidth || 0;
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const distance = textWidth - containerWidth;
  const duration = Math.max(3, distance / 30);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden relative", lineClampClass, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        ref={textRef}
        className="inline-block whitespace-nowrap"
        style={
          isHovered
            ? {
                animation: `marquee-${uniqueId} ${duration}s linear infinite`,
              }
            : {}
        }
      >
        {children}
      </span>
    </div>
  );
}
