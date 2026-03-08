import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ArchivePage } from "./components/ArchivePage";
import { BottomNav, SideNav } from "./components/Navigation";
import { TimetablePage } from "./components/TimetablePage";
import { PageDecorations } from "./components/Y2KDecorations";

// ─── Date helpers ──────────────────────────────────────────────────────────────
function getLocalDate(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  // Use local date parts to avoid UTC offset issues
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── PWA service worker registration ──────────────────────────────────────────
function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silently ignore SW registration failures in dev
      });
    });
  }
}

// ─── Root layout ──────────────────────────────────────────────────────────────
function RootLayout() {
  useEffect(() => {
    registerSW();
  }, []);

  return (
    <div className="relative min-h-screen min-h-dvh">
      {/* Floating background decorations */}
      <PageDecorations />

      {/* Desktop side navigation */}
      <SideNav />

      {/* Main content area */}
      <main
        className="relative z-10 md:ml-64 min-h-screen min-h-dvh pb-20 md:pb-0"
        id="main-content"
      >
        <div className="max-w-2xl mx-auto">
          <Outlet />
          {/* Mobile footer attribution */}
          <div className="md:hidden px-4 py-4 text-center">
            <p className="font-nunito text-[11px] text-[#c0b0d8] leading-relaxed">
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
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(171,171,220,0.35)",
            borderRadius: "16px",
            color: "#3a3060",
            fontFamily: "'Nunito', sans-serif",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 8px 24px rgba(113,129,200,0.18)",
          },
        }}
      />
    </div>
  );
}

// ─── Page components ──────────────────────────────────────────────────────────
function TodayRoute() {
  return (
    <TimetablePage
      date={getLocalDate(0)}
      displayDate={formatDisplayDate(0)}
      subtitle="Today"
      showArchiveButton
    />
  );
}

function TomorrowRoute() {
  return (
    <TimetablePage
      date={getLocalDate(1)}
      displayDate={formatDisplayDate(1)}
      subtitle="Tomorrow"
      showArchiveButton
    />
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

const todayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TodayRoute,
});

const tomorrowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tomorrow",
  component: TomorrowRoute,
});

const archiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/archive",
  component: ArchivePage,
});

const routeTree = rootRoute.addChildren([
  todayRoute,
  tomorrowRoute,
  archiveRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
