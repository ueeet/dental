"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  CalendarDays, Clock, CheckCircle2, XCircle, Users, Stethoscope, Star, FileEdit,
} from "lucide-react";

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
  createdAt: string;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#f59e0b",
  confirmed: "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новые",
  confirmed: "Подтверждённые",
  completed: "Завершённые",
  cancelled: "Отменённые",
};

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

const CARDS = [
  { key: "todayBookings", label: "Сегодня", icon: CalendarDays, color: "text-blue-600 bg-blue-50" },
  { key: "newBookings", label: "Новые заявки", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { key: "confirmedBookings", label: "Подтверждённые", icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  { key: "completedBookings", label: "Завершённые", icon: CheckCircle2, color: "text-gray-600 bg-gray-100" },
  { key: "cancelledBookings", label: "Отменённые", icon: XCircle, color: "text-red-500 bg-red-50" },
  { key: "totalDoctors", label: "Врачей", icon: Users, color: "text-indigo-600 bg-indigo-50" },
  { key: "totalServices", label: "Услуг", icon: Stethoscope, color: "text-purple-600 bg-purple-50" },
  { key: "totalReviews", label: "Отзывов", icon: Star, color: "text-yellow-600 bg-yellow-50" },
  { key: "pendingReviews", label: "На модерации", icon: FileEdit, color: "text-rose-600 bg-rose-50" },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get<Stats>("/stats").then(setStats).catch(console.error);
    api.get<BookingsResponse>("/bookings?limit=5").then((d) => setRecentBookings(d.bookings)).catch(console.error);
  }, []);

  if (!stats) return <div className="flex h-64 items-center justify-center text-gray-400">Загрузка...</div>;

  const statusData = [
    { name: "Новые", value: stats.newBookings, color: STATUS_COLORS.new },
    { name: "Подтв.", value: stats.confirmedBookings, color: STATUS_COLORS.confirmed },
    { name: "Заверш.", value: stats.completedBookings, color: STATUS_COLORS.completed },
    { name: "Отмен.", value: stats.cancelledBookings, color: STATUS_COLORS.cancelled },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2a3250]">Дашборд</h1>
      <p className="mt-1 text-sm text-gray-500">Общая статистика клиники</p>

      {/* Карточки */}
      <div className="mt-6 grid grid-cols-3 gap-4 lg:grid-cols-5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-[#2a3250]">
                {stats[card.key as keyof Stats] as number}
              </div>
              <div className="mt-0.5 text-xs text-gray-500">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Популярные услуги — бар */}
        {stats.popularServices.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Популярные услуги</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.popularServices} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis type="category" dataKey="serviceName" width={140} tick={{ fontSize: 12, fill: "#374151" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  formatter={(value: number) => [`${value} записей`, "Кол-во"]}
                />
                <Bar dataKey="count" fill="#2a3250" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Статусы записей — пай */}
        {statusData.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Статусы записей</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  formatter={(value: number) => [`${value}`, "Записей"]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 text-center text-sm text-gray-500">
              Всего: {stats.totalBookings} записей
            </div>
          </div>
        )}
      </div>

      {/* Последние записи */}
      {recentBookings.length > 0 && (
        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Последние записи</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-3">Пациент</th>
                <th className="px-6 py-3">Врач</th>
                <th className="px-6 py-3">Услуга</th>
                <th className="px-6 py-3">Дата</th>
                <th className="px-6 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-gray-900">{b.patientName}</div>
                    <div className="text-xs text-gray-400">{b.phone}</div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-600">{b.doctor.name.split(" ").slice(0, 2).join(" ")}</td>
                  <td className="px-6 py-3.5 text-gray-600">{b.service.name}</td>
                  <td className="px-6 py-3.5 text-gray-600">
                    {new Date(b.date).toLocaleDateString("ru-RU")} {b.time}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: (STATUS_COLORS[b.status] || "#gray") + "18",
                        color: STATUS_COLORS[b.status] || "#666",
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[b.status] || "#666" }}
                      />
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
