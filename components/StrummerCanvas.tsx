"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  drawStaticStrings,
  initStrings,
  pluckString,
  resetCanvas,
  updateStrings,
  type StringModel,
} from "@/lib/stringPhysics";

type StrummerCanvasProps = {
  onPluck?: (stringIndex: number, velocity: number) => void;
  reducedMotion?: boolean;
};

export default function StrummerCanvas({
  onPluck,
  reducedMotion = false,
}: StrummerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stringsRef = useRef<StringModel[]>([]);
  const animationRef = useRef<number>(0);
  const lastXRef = useRef(0);
  const lastFrameRef = useRef<number>(0);

  const handlePluckNearby = useCallback(
    (x: number, velocity: number, threshold: number) => {
      const strings = stringsRef.current;
      strings.forEach((string, index) => {
        if (Math.abs(string.x - x) < threshold) {
          if (!reducedMotion) {
            pluckString(strings, index, velocity);
          }
          onPluck?.(index, velocity);
        }
      });
    },
    [onPluck, reducedMotion],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetCanvas(ctx, width, height);
      stringsRef.current = initStrings(width, height);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const velocity = Math.min(Math.abs(currentX - lastXRef.current) * 0.2, 10);
      lastXRef.current = currentX;
      handlePluckNearby(currentX, velocity, 30);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      const currentX = touch.clientX - rect.left;
      const velocity = Math.min(Math.abs(currentX - lastXRef.current) * 0.3, 10);
      lastXRef.current = currentX;
      handlePluckNearby(currentX, velocity, 40);
    };

    const onPointerDown = () => {
      onPluck?.(0, 0);
    };

    const render = (timestamp: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }
      const deltaSeconds = Math.min((timestamp - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = timestamp;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      resetCanvas(ctx, width, height);
      if (reducedMotion) {
        drawStaticStrings(ctx, stringsRef.current);
      } else {
        updateStrings(ctx, stringsRef.current, false, deltaSeconds);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    resize();
    animationRef.current = requestAnimationFrame(render);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement!);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, [handlePluckNearby, onPluck, reducedMotion]);

  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        role="img"
        aria-label="Interactive electronic bağlama strings — drag to play"
      />
    </div>
  );
}
