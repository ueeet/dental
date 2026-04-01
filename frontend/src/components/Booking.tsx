"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

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
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

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
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^\+7\d{10}$/.test(cleaned);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

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

  const containerRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!patientName.trim()) {
      errs.patientName = "Введите имя пациента";
    }

    if (!phone.trim()) {
      errs.phone = "Введите номер телефона";
    } else if (!validatePhone(phone)) {
      errs.phone = "Формат: +7XXXXXXXXXX (11 цифр)";
    }

    if (!doctorId) {
      errs.doctorId = "Выберите врача";
    }

    if (!serviceId) {
      errs.serviceId = "Выберите услугу";
    }

    if (!date) {
      errs.date = "Выберите дату";
    }

    if (!time) {
      errs.time = "Выберите время";
    }

    if (!consentGiven) {
      errs.consentGiven = "Необходимо дать согласие на обработку данных";
    }

    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);

    try {
      await api.post("/bookings", {
        patientName: patientName.trim(),
        phone: phone.trim(),
        doctorId,
        serviceId,
        date,
        time,
        comment: comment.trim(),
        consentGiven,
      });

      setSuccessMessage("Заявка отправлена! Мы скоро свяжемся с вами");
      setPatientName("");
      setPhone("");
      setDoctorId("");
      setServiceId("");
      setDate("");
      setTime("");
      setComment("");
      setConsentGiven(false);
      setErrors({});
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Произошла ошибка. Попробуйте позже.";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* Entrance animations */
  useGSAP(
    () => {
      gsap.from("[data-animate='heading']", {
        autoAlpha: 0,
        y: 24,
        duration: 0.5,
        scrollTrigger: {
          trigger: "[data-animate='heading']",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-animate='form']", {
        autoAlpha: 0,
        x: -30,
        duration: 0.5,
        delay: 0.1,
        scrollTrigger: {
          trigger: "[data-animate='form']",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-animate='info']", {
        autoAlpha: 0,
        x: 30,
        duration: 0.5,
        delay: 0.2,
        scrollTrigger: {
          trigger: "[data-animate='info']",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  /* Animate success / error messages when they appear */
  useEffect(() => {
    if (successMessage && successRef.current) {
      gsap.from(successRef.current, { autoAlpha: 0, y: -10, duration: 0.3 });
    }
  }, [successMessage]);

  useEffect(() => {
    if (apiError && errorRef.current) {
      gsap.from(errorRef.current, { autoAlpha: 0, y: -10, duration: 0.3 });
    }
  }, [apiError]);

  /* Shared input styles */
  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500/20";
  const inputNormal = "border-slate-200";

  return (
    <section
      id="booking"
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-20 md:py-28"
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          data-animate="heading"
          className="mx-auto max-w-2xl text-center"
          style={{ visibility: "hidden" }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Запись на приём
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Оставьте заявку и мы перезвоним в течение 15 минут
          </p>
        </div>

        {/* Content: form + info card */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Form */}
          <div
            data-animate="form"
            className="lg:col-span-3"
            style={{ visibility: "hidden" }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl shadow-blue-900/20 sm:p-8"
            >
              {/* Success message */}
              {successMessage && (
                <div
                  ref={successRef}
                  className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700"
                >
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                  {successMessage}
                </div>
              )}

              {/* API error */}
              {apiError && (
                <div
                  ref={errorRef}
                  className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Имя пациента */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Имя пациента <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className={cn(inputBase, errors.patientName ? inputError : inputNormal)}
                  />
                  {errors.patientName && (
                    <p className="mt-1 text-xs text-red-500">{errors.patientName}</p>
                  )}
                </div>

                {/* Телефон */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className={cn(inputBase, errors.phone ? inputError : inputNormal)}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Выбор врача */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Выбор врача <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className={cn(inputBase, errors.doctorId ? inputError : inputNormal)}
                  >
                    <option value="">Выберите врача</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.doctorId && (
                    <p className="mt-1 text-xs text-red-500">{errors.doctorId}</p>
                  )}
                </div>

                {/* Выбор услуги */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Выбор услуги <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className={cn(inputBase, errors.serviceId ? inputError : inputNormal)}
                  >
                    <option value="">Выберите услугу</option>
                    {serviceCategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && (
                    <p className="mt-1 text-xs text-red-500">{errors.serviceId}</p>
                  )}
                </div>

                {/* Дата */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Дата <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getTodayString()}
                    className={cn(inputBase, errors.date ? inputError : inputNormal)}
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                  )}
                </div>

                {/* Время */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Время <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={cn(inputBase, errors.time ? inputError : inputNormal)}
                  >
                    <option value="">Выберите время</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="mt-1 text-xs text-red-500">{errors.time}</p>
                  )}
                </div>

                {/* Комментарий */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Комментарий
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Опишите вашу проблему или пожелания..."
                    className={cn(inputBase, inputNormal, "resize-none")}
                  />
                </div>

                {/* Согласие */}
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-muted-foreground">
                      Я даю{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                      >
                        согласие на обработку персональных данных
                      </a>{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.consentGiven && (
                    <p className="mt-1 text-xs text-red-500">{errors.consentGiven}</p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  isSubmitting && "cursor-not-allowed opacity-60"
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Записаться на приём
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info card */}
          <div
            data-animate="info"
            className="lg:col-span-2"
            style={{ visibility: "hidden" }}
          >
            <div className="sticky top-8 space-y-6">
              {/* Contact info card */}
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md sm:p-8">
                <h3 className="text-lg font-bold text-white">Контактная информация</h3>

                <div className="mt-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Телефон</p>
                      <a
                        href="tel:+79061232727"
                        className="text-base font-semibold text-white transition-colors hover:text-blue-200"
                      >
                        +7 (906) 123-27-27
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Адрес</p>
                      <p className="text-base font-semibold text-white">
                        просп. Мира, 34, Набережные Челны
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Время работы</p>
                      <p className="text-base font-semibold text-white">
                        Пн-Пт: 08:00 - 20:00
                      </p>
                      <p className="text-sm text-blue-200">Сб-Вс: 09:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="relative h-52 w-full bg-blue-800/40">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/60">
                    <MapPin className="h-8 w-8" />
                    <span className="text-sm font-medium">Яндекс Карта</span>
                    <span className="text-xs text-white/40">
                      просп. Мира, 34, Набережные Челны
                    </span>
                  </div>
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=56.044,54.735&z=16&pt=56.044,54.735,pm2blm"
                    className="absolute inset-0 h-full w-full opacity-70"
                    allowFullScreen
                    title="IQ Dental на карте"
                  />
                </div>
              </div>

              {/* Quick note */}
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm leading-relaxed text-blue-100">
                  <span className="font-semibold text-white">Бесплатная консультация</span>{" "}
                  — запишитесь на первичный осмотр и получите индивидуальный план лечения
                  без каких-либо обязательств.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
