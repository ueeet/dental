"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect } from "@/components/ui/custom-select";
import { Phone, MapPin, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const doctors = [
  { id: "1", name: "Нигматуллин Марат Хамзаевич — Ортопед, директор" },
  { id: "2", name: "Шайхелисламов Раушан Рафисович — Хирург-имплантолог" },
  { id: "3", name: "Гумеров Артур Рафаэлевич — Ортопед" },
  { id: "4", name: "Нигматуллина Лилия Марселевна — Терапевт" },
  { id: "5", name: "Ногманов Фарид Флюрович — Хирург-имплантолог" },
  { id: "6", name: "Гараев Альберт Радикович — Хирург-имплантолог" },
  { id: "7", name: "Бакирова Диляра Фаритовна — Терапевт" },
];

const serviceCategories = [
  { id: "therapy", name: "Терапия (лечение кариеса, пульпита)" },
  { id: "surgery", name: "Хирургия (удаление, имплантация)" },
  { id: "orthopedics", name: "Ортопедия (коронки, виниры, протезы)" },
  { id: "hygiene", name: "Гигиена (чистка, отбеливание)" },
  { id: "aesthetics", name: "Эстетика (реставрация зубов)" },
  { id: "consultation", name: "Консультация" },
];

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 8; h < 20; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  slots.push("20:00");
  return slots;
}

const timeSlots = generateTimeSlots();

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface FormErrors {
  patientName?: string;
  phone?: string;
  doctorId?: string;
  serviceId?: string;
  date?: string;
  time?: string;
  consentGiven?: string;
}

function validatePhone(phone: string): boolean {
  return /^\+7\d{10}$/.test(phone.replace(/[\s\-()]/g, ""));
}

export default function Booking() {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".booking-heading", {
      y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".booking-heading", start: "top 88%", once: true },
    });

    gsap.from(".booking-form-col", {
      x: -60, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".booking-cols", start: "top 85%", once: true },
    });

    gsap.from(".booking-info-col", {
      x: 60, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".booking-cols", start: "top 85%", once: true },
    });
  }, { scope: sectionRef });

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!patientName.trim()) errs.patientName = "Введите имя пациента";
    if (!phone.trim()) errs.phone = "Введите номер телефона";
    else if (!validatePhone(phone)) errs.phone = "Формат: +7XXXXXXXXXX (11 цифр)";
    if (!doctorId) errs.doctorId = "Выберите врача";
    if (!serviceId) errs.serviceId = "Выберите услугу";
    if (!date) errs.date = "Выберите дату";
    if (!time) errs.time = "Выберите время";
    if (!consentGiven) errs.consentGiven = "Необходимо дать согласие на обработку данных";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(""); setSuccessMessage("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    try {
      await api.post("/bookings", { patientName: patientName.trim(), phone: phone.trim(), doctorId, serviceId, date, time, comment: comment.trim(), consentGiven });
      setSuccessMessage("Заявка отправлена! Мы скоро свяжемся с вами");
      setPatientName(""); setPhone(""); setDoctorId(""); setServiceId(""); setDate(""); setTime(""); setComment(""); setConsentGiven(false); setErrors({});
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Произошла ошибка. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (successMessage && successRef.current) gsap.from(successRef.current, { opacity: 0, y: -10, duration: 0.3 });
  }, [successMessage]);

  useEffect(() => {
    if (apiError && errorRef.current) gsap.from(errorRef.current, { opacity: 0, y: -10, duration: 0.3 });
  }, [apiError]);

  const inputBase = "w-full rounded-xl border bg-white/80 px-5 pr-10 py-3.5 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white";
  const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500/20";
  const inputNormal = "border-slate-200/80";

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="relative overflow-hidden bg-gradient-to-br from-[#1a1f2e] via-[#2a3250] to-[#1e2540] pb-28 pt-20"
    >
      {/* Decorative orbs */}
      <div className="orb-1 pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/4 blur-3xl" aria-hidden="true" />
      <div className="orb-2 pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-white/3 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="booking-heading mx-auto mb-16 max-w-2xl text-center">
          <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-gray-400">
            Онлайн-запись
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-white">Запись на приём</h2>
          <p className="mt-4 text-fluid-body text-gray-300/80">Оставьте заявку и мы перезвоним в течение 15 минут</p>
        </div>

        {/* Cols */}
        <div className="booking-cols grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="booking-form-col lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl shadow-black/20 sm:p-10 lg:p-12"
            >
              {/* Inner glass accent */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />

              <div className="relative z-10">
                {successMessage && (
                  <div ref={successRef} className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
                    <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                    {successMessage}
                  </div>
                )}
                {apiError && (
                  <div ref={errorRef} className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                    {apiError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-foreground">Имя пациента <span className="text-red-500">*</span></label>
                    <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Иванов Иван Иванович" className={cn(inputBase, errors.patientName ? inputError : inputNormal)} />
                    {errors.patientName && <p className="mt-1.5 text-xs text-red-500">{errors.patientName}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Телефон <span className="text-red-500">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" className={cn(inputBase, "font-[var(--font-mono)]", errors.phone ? inputError : inputNormal)} />
                    {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Выбор врача <span className="text-red-500">*</span></label>
                    <CustomSelect value={doctorId} onChange={setDoctorId} placeholder="Выберите врача" options={doctors.map((d) => ({ value: d.id, label: d.name }))} className={cn(errors.doctorId ? "ring-2 ring-red-400" : "")} />
                    {errors.doctorId && <p className="mt-1.5 text-xs text-red-500">{errors.doctorId}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Выбор услуги <span className="text-red-500">*</span></label>
                    <CustomSelect value={serviceId} onChange={setServiceId} placeholder="Выберите услугу" options={serviceCategories.map((s) => ({ value: s.id, label: s.name }))} className={cn(errors.serviceId ? "ring-2 ring-red-400" : "")} />
                    {errors.serviceId && <p className="mt-1.5 text-xs text-red-500">{errors.serviceId}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Дата <span className="text-red-500">*</span></label>
                    <DatePicker value={date} onChange={setDate} min={getTodayString()} className={cn(errors.date ? "ring-2 ring-red-400" : "")} />
                    {errors.date && <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Время <span className="text-red-500">*</span></label>
                    <CustomSelect value={time} onChange={setTime} placeholder="Выберите время" options={timeSlots.map((slot) => ({ value: slot, label: slot }))} className={cn(errors.time ? "ring-2 ring-red-400" : "")} />
                    {errors.time && <p className="mt-1.5 text-xs text-red-500">{errors.time}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-foreground">Комментарий</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Опишите вашу проблему или пожелания..." className={cn(inputBase, inputNormal, "resize-none")} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-muted-foreground">
                        Я даю{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-[#353d5c]">согласие на обработку персональных данных</a>{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.consentGiven && <p className="mt-1.5 text-xs text-red-500">{errors.consentGiven}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-[#353d5c] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isSubmitting && "cursor-not-allowed opacity-60"
                  )}
                >
                  {isSubmitting ? (
                    <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Отправка...</>
                  ) : (
                    <><Send className="h-4 w-4" />Записаться на приём</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="booking-info-col lg:col-span-2">
            <div className="sticky top-8 flex h-full flex-col gap-6">
              <div className="liquid-glass-dark rounded-3xl p-8 sm:p-10">
                <h3 className="font-[var(--font-heading)] text-fluid-h3 text-white">Контактная информация</h3>
                <div className="mt-8 space-y-6">
                  {[
                    { Icon: Phone, label: "Телефон", content: <a href="tel:+79061232727" className="font-[var(--font-mono)] text-lg font-semibold text-white transition-colors hover:text-gray-300">+7 (906) 123-27-27</a> },
                    { Icon: MapPin, label: "Адрес", content: <p className="text-base font-semibold text-white">просп. Мира, 34, Набережные Челны</p> },
                    { Icon: Clock, label: "Время работы", content: <><p className="font-[var(--font-mono)] text-base font-semibold text-white">Пн-Пт: 08:00 - 20:00</p><p className="font-[var(--font-mono)] text-fluid-small text-gray-400/70">Сб-Вс: 09:00 - 18:00</p></> },
                  ].map(({ Icon, label, content }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-fluid-small text-gray-400/70">{label}</p>
                        {content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-h-[200px] flex-1 overflow-hidden rounded-3xl border border-white/10">
                <div className="relative h-full w-full bg-white/10">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=56.044,54.735&z=16&pt=56.044,54.735,pm2blm"
                    className="absolute inset-0 h-full w-full opacity-70"
                    allowFullScreen
                    title="IQ Dental на карте"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave → FAQ (white) */}
    </section>
  );
}
