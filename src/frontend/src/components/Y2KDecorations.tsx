import { cn } from "@/lib/utils";
import type React from "react";

interface Y2KProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
  glow?: boolean;
}

export function SparkleStarFour({
  className,
  size = 24,
  color = "#7181c8",
  opacity = 0.7,
  style,
  glow = false,
}: Y2KProps) {
  const id = `glow-${color.replace("#", "")}-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {glow && (
        <defs>
          <radialGradient id={id} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
      )}
      {glow && <ellipse cx="12" cy="12" rx="10" ry="10" fill={`url(#${id})`} />}
      <path
        d="M12 1.5 L13.5 10.5 L22.5 12 L13.5 13.5 L12 22.5 L10.5 13.5 L1.5 12 L10.5 10.5 Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

export function SparkleStarSix({
  className,
  size = 20,
  color = "#ababdc",
  opacity = 0.7,
  style,
}: Y2KProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 2 L13.5 8.5 L20 7 L15.5 12 L20 17 L13.5 15.5 L12 22 L10.5 15.5 L4 17 L8.5 12 L4 7 L10.5 8.5 Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

export function ShootingStar({
  className,
  size = 40,
  color = "#7181c8",
  opacity = 0.5,
  style,
}: Y2KProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 40 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Star body */}
      <path
        d="M33 12 L34.4 7.5 L39 6 L34.4 4.5 L33 0 L31.6 4.5 L27 6 L31.6 7.5 Z"
        fill={color}
        opacity={opacity}
      />
      {/* Trail lines */}
      <path
        d="M31 6 Q20 9 6 13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity={opacity * 0.7}
      />
      <path
        d="M29 8.5 Q18 11 3 16"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity={opacity * 0.4}
      />
    </svg>
  );
}

export function CrescentMoon({
  className,
  size = 28,
  color = "#ababdc",
  opacity = 0.65,
  style,
}: Y2KProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill={color}
        opacity={opacity}
      />
      {/* Inner highlight to give 3D feel */}
      <path
        d="M15.5 5.5 A5 5 0 0 0 10 14"
        stroke="white"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity={opacity * 0.5}
        fill="none"
      />
    </svg>
  );
}

export function OrbitEllipse({
  className,
  size = 50,
  color = "#7181c8",
  opacity = 0.35,
  style,
}: Y2KProps) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 50 25"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <ellipse
        cx="25"
        cy="12.5"
        rx="23"
        ry="10"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        opacity={opacity}
      />
      {/* Planet dot */}
      <circle cx="43" cy="9.5" r="3" fill={color} opacity={opacity * 1.3} />
      {/* Highlight on planet */}
      <circle cx="42.2" cy="8.7" r="1" fill="white" opacity={opacity * 0.8} />
    </svg>
  );
}

export function TinySparkle({
  className,
  size = 12,
  color = "#ababdc",
  opacity = 0.8,
  style,
}: Y2KProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M6 0.5 L6.7 5.3 L11.5 6 L6.7 6.7 L6 11.5 L5.3 6.7 L0.5 6 L5.3 5.3 Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

/** Full-page background decorations — visible and beautifully placed */
export function PageDecorations({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden z-0",
        className,
      )}
      aria-hidden="true"
    >
      {/* ── Top-left cluster ── */}
      {/* Large glowing sparkle — anchor piece */}
      <SparkleStarFour
        size={52}
        color="#7181c8"
        opacity={0.55}
        glow
        className="absolute top-10 left-6 animate-float"
        style={{
          animationDelay: "0s",
          filter: "drop-shadow(0 0 8px rgba(113,129,200,0.5))",
        }}
      />
      <TinySparkle
        size={16}
        color="#ababdc"
        opacity={0.75}
        className="absolute top-16 left-20 animate-pulse-soft"
        style={{ animationDelay: "0.8s" }}
      />
      <CrescentMoon
        size={38}
        color="#c8b4e0"
        opacity={0.55}
        className="absolute top-5 left-36 animate-float"
        style={{
          animationDelay: "2s",
          filter: "drop-shadow(0 0 6px rgba(200,180,224,0.4))",
        }}
      />
      <TinySparkle
        size={10}
        color="#f1cfed"
        opacity={0.8}
        className="absolute top-28 left-10 animate-pulse-soft"
        style={{ animationDelay: "3s" }}
      />

      {/* ── Top-right cluster ── */}
      <ShootingStar
        size={64}
        color="#7181c8"
        opacity={0.45}
        className="absolute top-14 right-8 rotate-6 animate-float"
        style={{
          animationDelay: "0.5s",
          filter: "drop-shadow(0 0 5px rgba(113,129,200,0.35))",
        }}
      />
      <SparkleStarSix
        size={30}
        color="#ababdc"
        opacity={0.6}
        className="absolute top-6 right-28 animate-sparkle"
        style={{ animationDelay: "3s" }}
      />
      <TinySparkle
        size={12}
        color="#b7d3f4"
        opacity={0.85}
        className="absolute top-32 right-16 animate-pulse-soft"
        style={{ animationDelay: "1.5s" }}
      />

      {/* ── Mid-left ── */}
      <OrbitEllipse
        size={88}
        color="#7181c8"
        opacity={0.38}
        className="absolute top-[30%] -left-6 animate-float"
        style={{
          animationDelay: "1.5s",
          filter: "drop-shadow(0 0 4px rgba(113,129,200,0.25))",
        }}
      />
      <SparkleStarFour
        size={28}
        color="#f4c2d8"
        opacity={0.6}
        glow
        className="absolute top-[42%] left-10 animate-pulse-soft"
        style={{
          animationDelay: "2.5s",
          filter: "drop-shadow(0 0 6px rgba(244,194,216,0.45))",
        }}
      />
      <TinySparkle
        size={9}
        color="#ababdc"
        opacity={0.7}
        className="absolute top-[38%] left-28 animate-sparkle"
        style={{ animationDelay: "4s" }}
      />

      {/* ── Mid-right ── */}
      <SparkleStarFour
        size={34}
        color="#b7d3f4"
        opacity={0.55}
        glow
        className="absolute top-[48%] right-6 animate-float"
        style={{
          animationDelay: "4s",
          filter: "drop-shadow(0 0 8px rgba(183,211,244,0.5))",
        }}
      />
      <CrescentMoon
        size={26}
        color="#ababdc"
        opacity={0.5}
        className="absolute top-[55%] right-28 animate-float"
        style={{ animationDelay: "0.3s" }}
      />

      {/* ── Bottom clusters ── */}
      <CrescentMoon
        size={44}
        color="#7181c8"
        opacity={0.4}
        className="absolute bottom-20 left-4 animate-float"
        style={{
          animationDelay: "1s",
          filter: "drop-shadow(0 0 6px rgba(113,129,200,0.3))",
        }}
      />
      <SparkleStarSix
        size={26}
        color="#ababdc"
        opacity={0.55}
        className="absolute bottom-12 right-14 animate-sparkle"
        style={{ animationDelay: "2s" }}
      />
      <TinySparkle
        size={14}
        color="#f4c2d8"
        opacity={0.7}
        className="absolute bottom-28 right-5 animate-pulse-soft"
        style={{ animationDelay: "3.5s" }}
      />
      <OrbitEllipse
        size={60}
        color="#b7d3f4"
        opacity={0.38}
        className="absolute bottom-6 left-1/3 animate-float"
        style={{ animationDelay: "0.8s" }}
      />
      <SparkleStarFour
        size={20}
        color="#c8b4e0"
        opacity={0.6}
        className="absolute bottom-40 left-20 animate-pulse-soft"
        style={{ animationDelay: "5s" }}
      />
    </div>
  );
}

/** Decorative arrangement for empty states */
export function EmptyStateDecoration({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      aria-hidden="true"
    >
      <OrbitEllipse
        size={140}
        color="#ababdc"
        opacity={0.45}
        className="absolute"
      />
      <SparkleStarFour
        size={56}
        color="#7181c8"
        opacity={0.7}
        glow
        className="animate-sparkle"
        style={{ filter: "drop-shadow(0 0 12px rgba(113,129,200,0.55))" }}
      />
      <TinySparkle
        size={16}
        color="#ababdc"
        opacity={0.8}
        className="absolute -top-2 right-6 animate-pulse-soft"
      />
      <CrescentMoon
        size={28}
        color="#c8b4e0"
        opacity={0.65}
        className="absolute bottom-0 left-2 animate-float"
      />
      <ShootingStar
        size={40}
        color="#7181c8"
        opacity={0.45}
        className="absolute -top-5 left-0 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <TinySparkle
        size={10}
        color="#f4c2d8"
        opacity={0.9}
        className="absolute top-2 -right-2 animate-sparkle"
        style={{ animationDelay: "0.5s" }}
      />
    </div>
  );
}
