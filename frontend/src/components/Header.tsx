"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "О клинике", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Специалисты", href: "#doctors" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Акции", href: "#promotions" },
  { label: "Контакты", href: "#contacts" },
];

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 110"
      fill="none"
      stroke="currentColor"
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Tooth outline */}
      <path d="M50 8C35 8 25 15 20 25c-5 10-6 22-4 35 2 12 6 22 10 30 2 4 5 6 9 6s6-3 8-7c2 4 5 7 8 7s7-2 9-6c4-8 8-18 10-30 2-13 1-25-4-35C61 15 65 8 50 8z" />
      {/* Inner curve (gum line) */}
      <path d="M35 45c4 12 12 18 15 18s11-6 15-18" />
      {/* Smile below */}
      <path d="M30 98c8 5 24 5 40 0" />
    </svg>
  );
}

function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) {
  e.preventDefault();
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  // No animation — header stays centered

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) {
          current = id;
        }
      }
      setActiveSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-2xl rounded-2xl border border-border bg-card/95 px-6 py-3 backdrop-blur-sm transition-all duration-300",
        scrolled ? "shadow-lg shadow-black/10" : "shadow-none"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight cursor-pointer"
        >
          <img
            src="/logo_iq.png"
            alt="IQ Dental"
            className="logo-themed h-11 w-auto transition-[filter] duration-300"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                activeSection === link.href.replace("#", "") ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+79061232727"
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            +7 (906) 123-27-27
          </a>
          <ThemeToggle />
          <Button
            asChild
            className="rounded-xl bg-primary px-6 font-semibold"
          >
            <a
              href="#booking"
              onClick={(e) => handleSmoothScroll(e, "#booking")}
            >
              Записаться
            </a>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Открыть меню">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" showClose>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <ToothIcon className="h-6 w-6" />
                  IQ Dental
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4 py-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        handleSmoothScroll(e, link.href);
                        setOpen(false);
                      }}
                      className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t p-4">
                <div className="flex items-center justify-between">
                  <a
                    href="tel:+79061232727"
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    +7 (906) 123-27-27
                  </a>
                  <ThemeToggle />
                </div>
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full rounded-xl bg-primary font-semibold"
                  >
                    <a
                      href="#booking"
                      onClick={(e) => {
                        handleSmoothScroll(e, "#booking");
                        setOpen(false);
                      }}
                    >
                      Записаться
                    </a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
