"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  isActive: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const load = () => api.get<Service[]>("/services?active=false").then(setServices);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (editing.id) {
      await api.put(`/services/${editing.id}`, editing);
    } else {
      await api.post("/services", editing);
    }
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить услугу?")) return;
    await api.delete(`/services/${id}`);
    load();
  };

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    const cat = s.category || "Без категории";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2a3250]">Услуги</h1>
        <button onClick={() => setEditing({ name: "", price: 0, duration: 30, isActive: true })} className="rounded-xl bg-[#2a3250] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#353d5c]">
          Добавить
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">{cat}</h2>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {items.map((s, i) => (
                <div key={s.id} className={`flex items-center justify-between px-5 py-3.5 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{s.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{s.duration} мин</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#2a3250]">{s.price.toLocaleString("ru-RU")} &#8381;</span>
                    <button onClick={() => setEditing(s)} className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Ред.</button>
                    <button onClick={() => remove(s.id)} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100">Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#2a3250]">{editing.id ? "Редактирование" : "Новая услуга"}</h2>
            <div className="mt-4 space-y-3">
              <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Название" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
              <input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Категория" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
              <div className="flex gap-3">
                <input type="number" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} placeholder="Цена" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
                <input type="number" value={editing.duration || 30} onChange={(e) => setEditing({ ...editing, duration: Number(e.target.value) })} placeholder="Минут" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
              </div>
              <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Описание" rows={2} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={save} className="rounded-xl bg-[#2a3250] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#353d5c]">Сохранить</button>
              <button onClick={() => setEditing(null)} className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
