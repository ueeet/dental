"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { onSSE } from "@/lib/sse";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "next-themes";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, Sector,
} from "recharts";

gsap.registerPlugin(useGSAP);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, isDark } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={isDark ? "#e4e7ec" : "#2a3250"} fontSize={17} fontWeight={700}>{value}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fill="#9ca3af" fontSize={9}>{payload.name}</text>
    </g>
  );
}

interface Stats {
  totalBookings: number;
  newBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  todayBookings: number;
  totalDoctors: number;
  totalServices: number;
  totalReviews: number;
  pendingReviews: number;
  popularServices: { serviceName: string; count: number }[];
}

interface Booking {
  id: number;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  status: string;
  doctor: { name: string };
  service: { name: string };
}

interface BookingsResponse { bookings: Booking[]; total: number; }

const STATUS_COLORS: Record<string, string> = { new: "#f59e0b", confirmed: "#3b82f6", completed: "#22c55e", cancelled: "#ef4444" };
const STATUS_LABELS: Record<string, string> = { new: "Новые", confirmed: "Подтверждённые", completed: "Завершённые", cancelled: "Отменённые" };
const PIE_COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [activePieIndex, setActivePieIndex] = useState(-1);
  const [pieHovered, setPieHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const loadDashboard = () => {
    api.get<Stats>("/stats").then(setStats).catch(console.error);
    api.get<BookingsResponse>("/bookings?limit=7").then((d) => setRecentBookings(d.bookings)).catch(console.error);
  };

  const loadRef = useRef(loadDashboard);
  loadRef.current = loadDashboard;

  useEffect(() => { loadDashboard(); }, []);
  useEffect(() => { return onSSE(() => loadRef.current()); }, []);

  // GSAP entrance animations
  useGSAP(() => {
    if (!stats) return;
    gsap.from(".dash-header", { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.from(".dash-card", { y: 30, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.1 });
    gsap.from(".dash-stat-row", { x: -15, opacity: 0, duration: 0.4, stagger: 0.06, delay: 0.5, ease: "power2.out" });
    gsap.from(".dash-mini-stat", { y: 10, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.4, ease: "power2.out" });
    gsap.from(".dash-pie", { scale: 0, opacity: 0, duration: 0.8, delay: 0.6, ease: "back.out(1.4)", transformOrigin: "center center" });
    gsap.from(".dash-legend-item", { x: 20, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.8, ease: "power2.out" });
    gsap.from(".dash-table", { y: 40, opacity: 0, duration: 0.7, delay: 0.5, ease: "power3.out" });
    gsap.from(".dash-table-row", { x: -20, opacity: 0, duration: 0.4, stagger: 0.06, delay: 0.7, ease: "power2.out" });
  }, { scope: containerRef });

  if (!stats) return <div className="flex h-96 items-center justify-center text-muted-foreground">Загрузка...</div>;

  const statusData = [
    { name: "Новые", value: stats.newBookings },
    { name: "Подтверждённые", value: stats.confirmedBookings },
    { name: "Завершённые", value: stats.completedBookings },
    { name: "Отменённые", value: stats.cancelledBookings },
  ].filter((d) => d.value > 0);

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const trendData = weekDays.map((day, i) => ({ day, value: i === todayIdx ? stats.todayBookings : 0 }));

  const chartColor = isDark ? "#8b9cc7" : "#2a3250";

  return (
    <div ref={containerRef}>
      <div className="dash-header mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Дашборд</h1>
          <p className="mt-1 text-sm text-muted-foreground">Общая статистика клиники</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        <div className="dash-card rounded-2xl bg-card p-5 shadow-sm sm:p-6 lg:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Всего записей</p>
          <p className="mt-3 text-5xl font-bold text-foreground">{stats.totalBookings}</p>
          <div className="mt-4 space-y-1.5">
            {[{ label: "Новые", value: stats.newBookings, color: "#f59e0b" }, { label: "Подтверждённые", value: stats.confirmedBookings, color: "#3b82f6" }, { label: "Завершённые", value: stats.completedBookings, color: "#22c55e" }, { label: "Отменённые", value: stats.cancelledBookings, color: "#ef4444" }].map((s) => (
              <div key={s.label} className="dash-stat-row flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />{s.label}</span>
                <span className="font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card rounded-2xl bg-card p-5 shadow-sm sm:p-6 lg:col-span-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Записей сегодня</p>
              <p className="mt-3 text-5xl font-bold text-foreground">{stats.todayBookings}</p>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-right">
              {[{ l: "Врачей", v: stats.totalDoctors }, { l: "Услуг", v: stats.totalServices }, { l: "Отзывов", v: stats.totalReviews }].map((d) => (
                <div key={d.l} className="dash-mini-stat"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.l}</p><p className="text-lg font-bold text-foreground">{d.v}</p></div>
              ))}
            </div>
          </div>
          <div className="mt-4 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}><Area type="monotone" dataKey="value" stroke={chartColor} fill={chartColor} fillOpacity={0.06} strokeWidth={2} dot={false} /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/50">{weekDays.map((d) => <span key={d}>{d}</span>)}</div>
        </div>

        <div className="dash-card rounded-2xl bg-card p-5 shadow-sm sm:col-span-2 sm:p-6 lg:col-span-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статусы записей</p>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="dash-pie h-40 w-40 shrink-0" style={{ transform: pieHovered ? "scale(1.15)" : "scale(1)", transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)", transformOrigin: "center center", willChange: "transform" }} onMouseEnter={() => setPieHovered(true)} onMouseLeave={() => { setPieHovered(false); setActivePieIndex(-1); }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none" activeShape={(props: any) => <RenderActiveShape {...props} isDark={isDark} />} onMouseEnter={(_, i) => setActivePieIndex(i)} onMouseLeave={() => setActivePieIndex(-1)}>
                      {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} style={{ cursor: "pointer" }} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2.5">
                {statusData.map((d, i) => (
                  <div key={d.name} className="dash-legend-item flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />{d.name}</span>
                    <span className="text-sm font-bold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center text-sm text-muted-foreground/50">Нет записей</div>
          )}
          {stats.pendingReviews > 0 && <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-600 dark:bg-amber-950 dark:text-amber-400">{stats.pendingReviews} отзывов ждут модерации</div>}
        </div>
      </div>

      {/* Последние записи */}
      <div className="dash-table mt-6 rounded-2xl bg-card shadow-sm">
        <div className="px-6 py-5"><p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Последние записи</p></div>
        {recentBookings.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead><tr className="border-y border-border text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-6 py-2.5 font-medium">Пациент</th><th className="px-6 py-2.5 font-medium">Врач</th><th className="px-6 py-2.5 font-medium">Услуга</th><th className="px-6 py-2.5 font-medium">Дата / Время</th><th className="px-6 py-2.5 font-medium">Статус</th></tr></thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="dash-table-row border-b border-border/50 last:border-0 transition-colors hover:bg-accent/50">
                  <td className="px-6 py-3.5"><div className="font-medium text-foreground">{b.patientName}</div><div className="text-[11px] text-muted-foreground">{b.phone}</div></td>
                  <td className="px-6 py-3.5 text-muted-foreground">{b.doctor.name.split(" ").slice(0, 2).join(" ")}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{b.service.name}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{new Date(b.date).toLocaleDateString("ru-RU")} <span className="text-muted-foreground/60">{b.time}</span></td>
                  <td className="px-6 py-3.5"><span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: (STATUS_COLORS[b.status] || "#999") + "15", color: STATUS_COLORS[b.status] || "#666" }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[b.status] || "#666" }} />{STATUS_LABELS[b.status] || b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="px-6 pb-6 text-sm text-muted-foreground/50">Записей пока нет</div>}
      </div>
    </div>
  );
}
