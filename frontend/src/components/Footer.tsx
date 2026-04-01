"use client";

import React from "react";
import Link from "next/link";
import { Phone, Clock, MapPin, Mail } from "lucide-react";

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C9.5 2 7 3 7 6c0 2-2 4-2 7 0 3.5 1.5 6 3 8 .5.7 1.2 1 2 1s1.3-.5 2-1.5c.7 1 1.2 1.5 2 1.5s1.5-.3 2-1c1.5-2 3-4.5 3-8 0-3-2-5-2-7 0-3-2.5-4-5-4z" />
    </svg>
  );
}

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.596-.19 1.363 1.26 2.175 1.817.614.42 1.08.328 1.08.328l2.172-.03s1.136-.07.597-.964c-.044-.073-.314-.661-1.618-1.869-1.365-1.263-1.183-1.058.462-3.242.999-1.328 1.398-2.139 1.273-2.485-.12-.33-.856-.243-.856-.243l-2.445.015s-.182-.025-.316.056c-.131.079-.215.263-.215.263s-.387 1.028-.903 1.903c-1.089 1.85-1.524 1.948-1.702 1.834-.415-.267-.311-1.07-.311-1.641 0-1.784.271-2.528-.527-2.72-.265-.063-.46-.105-1.138-.112-.87-.009-1.606.003-2.023.207-.278.136-.492.438-.361.455.161.021.527.099.72.362.25.34.24 1.103.24 1.103s.144 2.098-.335 2.358c-.328.179-.779-.186-1.746-1.856-.495-.856-.869-1.804-.869-1.804s-.072-.176-.2-.271c-.155-.115-.372-.151-.372-.151l-2.322.015s-.349.01-.477.161c-.114.135-.009.413-.009.413s1.818 4.244 3.876 6.384c1.887 1.963 4.029 1.834 4.029 1.834h.971z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const footerSections = [
  {
    label: "Навигация",
    links: [
      { title: "О клинике", href: "#about" },
      { title: "Услуги", href: "#services" },
      { title: "Специалисты", href: "#doctors" },
      { title: "Отзывы", href: "#reviews" },
    ],
  },
  {
    label: "Информация",
    links: [
      { title: "Политика конфиденциальности", href: "/privacy" },
      { title: "Пользовательское соглашение", href: "/terms" },
      { title: "Акции", href: "#promotions" },
      { title: "FAQ", href: "#faq" },
    ],
  },
  {
    label: "Контакты",
    links: [
      { title: "+7 (906) 123-27-27", href: "tel:+79061232727", icon: Phone },
      { title: "+7 (967) 872-25-94", href: "tel:+79678722594", icon: Phone },
      { title: "info@iq-dental.ru", href: "mailto:info@iq-dental.ru", icon: Mail },
    ],
  },
  {
    label: "Мы в соцсетях",
    links: [
      { title: "ВКонтакте", href: "https://vk.com/iq.dental", icon: VkIcon },
      { title: "Instagram", href: "https://instagram.com/iq.dental", icon: InstagramIcon },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      id="contacts"
      className="relative w-full rounded-t-[2.5rem] md:rounded-t-[3.5rem] border-t border-white/10 bg-[#0a0f1a] bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.06),transparent)] px-6 py-12 lg:py-16"
    >
      {/* Top glow line */}
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-sm" />

      <div className="mx-auto max-w-7xl w-full grid gap-8 xl:grid-cols-3 xl:gap-8">
        {/* Logo + info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <ToothIcon className="h-8 w-8 text-gray-400" />
            <span className="font-[var(--font-heading)] text-2xl font-bold text-white">
              IQ Dental
            </span>
          </Link>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed mt-4">
            Современная стоматология в Набережных Челнах.
            Качественное лечение и индивидуальный подход.
          </p>
          <div className="flex items-start gap-2 text-sm text-slate-500 mt-4">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>просп. Мира, 34, Набережные Челны</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Пн-Пт: 08:00-20:00, Сб-Вс: 09:00-18:00</span>
          </div>
          <p className="text-xs text-slate-600 mt-6">
            © 2019–{new Date().getFullYear()} IQ Dental. Все права защищены.
          </p>
        </div>

        {/* Link columns */}
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerSections.map((section) => (
            <div key={section.label} className="mb-10 md:mb-0">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-[var(--font-mono)]">
                {section.label}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                {section.links.map((link) => (
                  <li key={link.title}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="hover:text-white inline-flex items-center gap-2 transition-all duration-300"
                      >
                        {"icon" in link && link.icon && <link.icon className="h-4 w-4" />}
                        {link.title}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="hover:text-white inline-flex items-center gap-2 transition-all duration-300"
                      >
                        {"icon" in link && link.icon && <link.icon className="h-4 w-4" />}
                        {link.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom legal line */}
      <div className="mx-auto max-w-7xl mt-12 w-full border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-[var(--font-mono)]">
        <span>ООО «Айкьюдентал», Лицензия № Л041-01181-16/00361643</span>
        <span>Сайт не является публичной офертой</span>
      </div>
    </footer>
  );
}
