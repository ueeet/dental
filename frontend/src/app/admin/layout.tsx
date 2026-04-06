"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { isAuthenticated, clearTokens } from "@/lib/api";
import gsap from "gsap";
import SSEToast from "@/components/admin/SSEToast";
import SoundControl from "@/components/admin/SoundControl";
import { Moon, Sun, Menu, X } from "lucide-react";

const NAV = [
  { href: "/admin/bookings", label: "Записи", icon: "📋" },
  { href: "/admin/doctors", label: "Врачи", icon: "👨‍⚕️" },
  { href: "/admin/schedule", label: "График", icon: "📅" },
  { href: "/admin/services", label: "Услуги", icon: "🦷" },
  { href: "/admin/reviews", label: "Отзывы", icon: "⭐" },
  { href: "/admin/promotions", label: "Акции", icon: "🎉" },
  { href: "/admin", label: "Статистика", icon: "📊" },
  { href: "/admin/settings", label: "Настройки", icon: "⚙️" },
];

// Bottom tab bar items (subset for mobile)
const BOTTOM_NAV = [
  { href: "/admin/bookings", label: "Записи", icon: "📋" },
  { href: "/admin/doctors", label: "Врачи", icon: "👨‍⚕️" },
  { href: "/admin", label: "Статистика", icon: "📊" },
  { href: "/admin/services", label: "Услуги", icon: "🦷" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const prevPath = useRef(pathname);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    if (!isAuthenticated()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Плавная анимация при смене вкладок
  useEffect(() => {
    if (pathname === prevPath.current || !mainRef.current) {
      prevPath.current = pathname;
      return;
    }
    prevPath.current = pathname;
    gsap.fromTo(mainRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!ready) return <div className="flex min-h-screen items-center justify-center bg-background"><div className="text-muted-foreground">Загрузка...</div></div>;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-60 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-20 items-center justify-center">
          <Link href="/admin" className="flex items-center">
            <img src="/logo_iq.png" alt="IQ Dental" className="logo-themed h-14 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <span className="text-base">{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</span>
              {isDark ? "Светлая тема" : "Тёмная тема"}
            </button>
          )}
          <SoundControl />
          <button
            onClick={() => { clearTokens(); router.push("/admin/login"); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <span className="text-base">🚪</span>
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Link href="/admin" className="flex items-center">
          <img src="/logo_iq.png" alt="IQ Dental" className="logo-themed h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute right-0 top-14 bottom-0 w-64 border-l border-border bg-card p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-border pt-4 space-y-1">
              <SoundControl />
              <button
                onClick={() => { clearTokens(); router.push("/admin/login"); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <span className="text-lg">🚪</span>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
        {BOTTOM_NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground"
        >
          <span className="text-lg">☰</span>
          Ещё
        </button>
      </nav>

      {/* Main content */}
      <main ref={mainRef} className="flex-1 pt-16 pb-20 px-4 lg:ml-60 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
        {children}
      </main>
      <SSEToast />
    </div>
  );
}
