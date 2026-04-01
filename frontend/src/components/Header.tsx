"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
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
  { label: "Специалисты", href: "#specialists" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2C9.5 2 7 3 7 6c0 2-2 4-2 7 0 3.5 1.5 6 3 8 .5.7 1.2 1 2 1s1.3-.5 2-1.5c.7 1 1.2 1.5 2 1.5s1.5-.3 2-1c1.5-2 3-4.5 3-8 0-3-2-5-2-7 0-3-2.5-4-5-4z" />
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
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  });

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-xl rounded-2xl border border-gray-200/60 bg-white/90 px-6 py-3 backdrop-blur-lg transition-shadow duration-300",
        scrolled ? "shadow-lg shadow-blue-100/40" : "shadow-none"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight"
        >
          <ToothIcon className="h-7 w-7" />
          <span>IQ Dental</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-6">
          <a
            href="tel:+79061232727"
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            +7 (906) 123-27-27
          </a>
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
                <a
                  href="tel:+79061232727"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +7 (906) 123-27-27
                </a>
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
