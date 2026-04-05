"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, clearTokens } from "@/lib/api";
import gsap from "gsap";
import SSEToast from "@/components/admin/SSEToast";

const NAV = [
  { href: "/admin/bookings", label: "Записи", icon: "📋" },
  { href: "/admin/doctors", label: "Врачи", icon: "👨‍⚕️" },
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
  if (!ready) return <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb]"><div className="text-gray-400">Загрузка...</div></div>;

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-full w-60 flex-col border-r border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-center">
          <Link href="/admin" className="flex items-center">
            <img src="/logo_iq.png" alt="IQ Dental" className="h-14 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(17%) sepia(14%) saturate(1500%) hue-rotate(190deg) brightness(92%) contrast(92%)" }} />
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
                    ? "bg-[#2a3250] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={() => { clearTokens(); router.push("/admin/login"); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
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
