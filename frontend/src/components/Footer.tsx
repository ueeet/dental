"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, Mail, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

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

/* ---------- Contact info items ---------- */

const contactItems = [
  {
    icon: MapPin,
    title: "Адрес",
    content: (
      <p className="text-slate-400">
        просп. Мира, 34, Набережные Челны,
        <br />
        Республика Татарстан
      </p>
    ),
  },
  {
    icon: Phone,
    title: "Телефон",
    content: (
      <div className="flex flex-col gap-1.5">
        <a
          href="tel:+79061232727"
          className="font-[var(--font-mono)] text-2xl font-semibold text-white transition-colors hover:text-blue-400"
        >
          +7 (906) 123-27-27
        </a>
        <a
          href="tel:+79678722594"
          className="font-[var(--font-mono)] text-lg text-slate-400 transition-colors hover:text-white"
        >
          +7 (967) 872-25-94
        </a>
      </div>
    ),
  },
  {
    icon: Clock,
    title: "Время работы",
    content: (
      <div className="font-[var(--font-mono)] text-slate-400 space-y-0.5">
        <p>Пн-Пт: 08:00-20:00</p>
        <p>Сб-Вс: 09:00-18:00</p>
        <p>Обед: 13:00-14:00</p>
      </div>
    ),
  },
  {
    icon: Mail,
    title: "Email",
    content: (
      <a
        href="mailto:info@iq-dental.ru"
        className="text-slate-400 hover:text-white transition-colors"
      >
        info@iq-dental.ru
      </a>
    ),
  },
  {
    icon: Navigation,
    title: "Как добраться",
    content: (
      <p className="text-slate-400">
        Маршрутки №7, 13, 22, 26,
        <br />
        остановка &laquo;7-й комплекс&raquo;
      </p>
    ),
  },
];

/* ========== VK Icon ========== */
function VkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.596-.19 1.363 1.26 2.175 1.817.614.42 1.08.328 1.08.328l2.172-.03s1.136-.07.597-.964c-.044-.073-.314-.661-1.618-1.869-1.365-1.263-1.183-1.058.462-3.242.999-1.328 1.398-2.139 1.273-2.485-.12-.33-.856-.243-.856-.243l-2.445.015s-.182-.025-.316.056c-.131.079-.215.263-.215.263s-.387 1.028-.903 1.903c-1.089 1.85-1.524 1.948-1.702 1.834-.415-.267-.311-1.07-.311-1.641 0-1.784.271-2.528-.527-2.72-.265-.063-.46-.105-1.138-.112-.87-.009-1.606.003-2.023.207-.278.136-.492.438-.361.455.161.021.527.099.72.362.25.34.24 1.103.24 1.103s.144 2.098-.335 2.358c-.328.179-.779-.186-1.746-1.856-.495-.856-.869-1.804-.869-1.804s-.072-.176-.2-.271c-.155-.115-.372-.151-.372-.151l-2.322.015s-.349.01-.477.161c-.114.135-.009.413-.009.413s1.818 4.244 3.876 6.384c1.887 1.963 4.029 1.834 4.029 1.834h.971z" />
    </svg>
  );
}

/* ========== Instagram Icon ========== */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ========================================
   CONTACTS SECTION + FOOTER
   ======================================== */

export default function Footer() {
  return (
    <>
      {/* ---------- Contacts Section ---------- */}
      <section
        id="contacts"
        className="bg-[#0a0f1a] py-[var(--space-section)]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div
            className="mb-16"
          >
            <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-slate-500">
              Связаться с нами
            </span>
            <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-white">
              Контакты
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left column — contact info */}
            <div className="space-y-8">
              {contactItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="mb-1.5 font-[var(--font-mono)] text-fluid-small uppercase tracking-wider text-slate-500">
                      {item.title}
                    </p>
                    <div className="text-fluid-body">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column — Map */}
            <div
              className="overflow-hidden rounded-2xl border border-white/5 min-h-[420px] bg-slate-900 flex flex-col"
            >
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A&source=constructor"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="flex-1 min-h-[420px]"
                title="IQ Dental на карте"
              />
              <div className="px-5 py-3.5 text-center text-sm text-slate-500 bg-slate-900/80">
                <a
                  href="https://2gis.ru/naberezhnye_chelny/search/%D0%BF%D1%80%D0%BE%D1%81%D0%BF.%20%D0%9C%D0%B8%D1%80%D0%B0%2C%2034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Открыть в 2ГИС
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-[#0a0f1a] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Col 1 — Logo + description */}
            <div
              className="space-y-5"
            >
              <Link href="/" className="flex items-center gap-3">
                <ToothIcon className="h-9 w-9 text-blue-400" />
                <span className="font-[var(--font-heading)] text-2xl font-bold text-white">
                  IQ Dental
                </span>
              </Link>
              <p className="text-fluid-small leading-relaxed text-slate-500 max-w-xs">
                Современная стоматология в Набережных Челнах. Качественное
                лечение, профессиональные специалисты и индивидуальный подход к
                каждому пациенту.
              </p>
            </div>

            {/* Col 2 — Navigation */}
            <div>
              <h3 className="mb-5 font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-slate-500">
                Навигация
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="text-fluid-small text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Socials */}
            <div>
              <h3 className="mb-5 font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-slate-500">
                Мы в соцсетях
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://vk.com/iq.dental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    "bg-white/5 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                  )}
                  aria-label="VK"
                >
                  <VkIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/iq.dental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    "bg-white/5 text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-200"
                  )}
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>

              {/* Legal links */}
              <div className="mt-8 space-y-2.5">
                <Link
                  href="/privacy"
                  className="block font-[var(--font-mono)] text-fluid-small text-slate-500 hover:text-white transition-colors duration-200"
                >
                  Политика конфиденциальности
                </Link>
                <Link
                  href="/terms"
                  className="block font-[var(--font-mono)] text-fluid-small text-slate-500 hover:text-white transition-colors duration-200"
                >
                  Пользовательское соглашение
                </Link>
              </div>
            </div>

            {/* Col 4 — Contact shortcut */}
            <div>
              <h3 className="mb-5 font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-slate-500">
                Контакты
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+79061232727"
                  className="block font-[var(--font-mono)] text-lg text-white hover:text-blue-400 transition-colors duration-200"
                >
                  +7 (906) 123-27-27
                </a>
                <a
                  href="tel:+79678722594"
                  className="block font-[var(--font-mono)] text-fluid-body text-slate-400 hover:text-white transition-colors duration-200"
                >
                  +7 (967) 872-25-94
                </a>
                <a
                  href="mailto:info@iq-dental.ru"
                  className="block text-fluid-small text-slate-400 hover:text-white transition-colors duration-200"
                >
                  info@iq-dental.ru
                </a>
              </div>
            </div>
          </div>

          {/* Divider + bottom bar */}
          <div className="section-line mt-14" />
          <div className="pt-8">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
              <div className="space-y-1.5">
                <p className="font-[var(--font-mono)] text-fluid-small text-slate-600">
                  ООО &laquo;Айкьюдентал&raquo;, Лицензия №
                  Л041-01181-16/00361643
                </p>
                <p className="font-[var(--font-mono)] text-fluid-small text-slate-600">
                  &copy; 2019-2026 IQ Dental. Все права защищены.
                </p>
              </div>
              <p className="font-[var(--font-mono)] text-fluid-small text-slate-600">
                Сайт не является публичной офертой
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
