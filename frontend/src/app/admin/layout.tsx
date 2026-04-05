"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { isAuthenticated, clearTokens } from "@/lib/api";
import gsap from "gsap";
import SSEToast from "@/components/admin/SSEToast";
import SoundControl from "@/components/admin/SoundControl";
import { Moon, Sun } from "lucide-react";

const NAV = [
  { href: "/admin/bookings", label: "Записи", icon: "📋" },
  { href: "/admin/doctors", label: "Врачи", icon: "👨‍⚕️" },
  { href: "/admin/schedule", label: "График", icon: "📅" },
  { href: "/admin/services", label: "Услуги", icon: "🦷" },
  { href: "/admin/reviews", label: "Отзывы", icon: "⭐" },
  { href: "/admin/promotions", label: "Акции", icon: "🎉" },
  { href: "/admin", label: "Дашборд", icon: "📊" },
  { href: "/admin/settings", label: "Настройки", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const prevPath = useRef(pathname);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-full w-60 flex-col border-r border-border bg-card">
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

      {/* Main content */}
      <main ref={mainRef} className="ml-60 flex-1 p-8">
        {children}
      </main>
      <SSEToast />
    </div>
  );
}
