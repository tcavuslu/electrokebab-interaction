"use client";

import { useEffect, useState } from "react";

type CustomCursorProps = {
  enabled?: boolean;
};

export default function CustomCursor({ enabled = true }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchDevice);

    if (!enabled || touchDevice) return;

    const onMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled || isTouch) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-off-white shadow-[0_0_10px_2px_rgba(255,255,255,0.5)] transition-opacity duration-200"
      style={{
        left: position.x,
        top: position.y,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
}
