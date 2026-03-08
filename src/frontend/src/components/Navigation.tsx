import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Sparkles, Sun, Sunrise } from "lucide-react";
import { motion } from "motion/react";
import { SparkleStarFour, TinySparkle } from "./Y2KDecorations";

const NAV_ITEMS = [
  { to: "/", label: "Today", icon: Sun, activeIcon: Sun },
  { to: "/tomorrow", label: "Tomorrow", icon: Sunrise, activeIcon: Sunrise },
  { to: "/archive", label: "Archive", icon: BookOpen, activeIcon: BookOpen },
];

export function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background:
          "linear-gradient(0deg, rgba(255,255,255,0.92) 0%, rgba(248,242,255,0.88) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(171,171,220,0.4)",
        boxShadow:
          "0 -4px 28px rgba(113,129,200,0.16), inset 0 1px 0 rgba(255,255,255,0.8)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1 relative",
                "font-nunito text-xs font-semibold transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7181c8]",
                isActive ? "text-[#7181c8]" : "text-[#a090c0]",
              )}
              aria-current={isActive ? "page" : undefined}
              data-ocid={`nav.${item.label.toLowerCase()}.link`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #7181c8, #ababdc)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <TinySparkle
                    size={8}
                    color="#7181c8"
                    opacity={0.7}
                    className="absolute -top-1 -right-1.5"
                  />
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SideNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <aside
      className="hidden md:flex flex-col w-64 min-h-screen fixed left-0 top-0 bottom-0 z-40"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(241,229,246,0.72) 50%, rgba(241,207,237,0.68) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderRight: "1px solid rgba(171,171,220,0.35)",
        boxShadow:
          "4px 0 32px rgba(113,129,200,0.14), inset -1px 0 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Logo area */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7181c8, #ababdc)" }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <p
              className="font-cinzel text-base font-bold leading-tight tracking-wide"
              style={{
                background: "linear-gradient(135deg, #3a3060 0%, #7181c8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              hibiscus
            </p>
            <p className="font-nunito text-[10px] text-[#a090c0] font-medium uppercase tracking-wider">
              timetable
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1">
          <div className="h-px flex-1 bg-gradient-to-r from-[#ababdc]/30 to-transparent" />
          <SparkleStarFour size={10} color="#ababdc" opacity={0.5} />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                "font-nunito text-sm font-semibold",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7181c8]",
                isActive
                  ? "text-white"
                  : "text-[#5a4a7a] hover:text-[#7181c8] hover:bg-[#f1cfed]/40",
              )}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #7181c8 0%, #ababdc 100%)",
                      boxShadow: "0 4px 14px rgba(113,129,200,0.35)",
                    }
                  : {}
              }
              aria-current={isActive ? "page" : undefined}
              data-ocid={`nav.${item.label.toLowerCase()}.link`}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="flex-shrink-0"
              />
              {item.label}
              {isActive && (
                <TinySparkle
                  size={10}
                  color="white"
                  opacity={0.8}
                  className="ml-auto"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-1 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[#ababdc]/30 to-transparent" />
          <SparkleStarFour size={10} color="#ababdc" opacity={0.5} />
        </div>
        <p className="font-nunito text-[11px] text-[#c0b0d8] text-center leading-relaxed">
          ©{new Date().getFullYear()}. Built with{" "}
          <span className="text-[#f4c2d8]">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7181c8] hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
