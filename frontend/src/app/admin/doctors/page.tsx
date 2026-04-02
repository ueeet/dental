"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  photo: string | null;
  description: string | null;
  isActive: boolean;
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editing, setEditing] = useState<Partial<Doctor> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get<Doctor[]>("/doctors?active=false").then(setDoctors);
  useEffect(() => { load(); }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      setEditing({ ...editing, photo: url });
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing as Doctor & Record<string, unknown>;
    const body = { name: rest.name, specialty: rest.specialty, experience: rest.experience, photo: rest.photo, description: rest.description, isActive: rest.isActive };
    try {
      if (id) {
        await api.put(`/doctors/${id}`, body);
      } else {
        await api.post("/doctors", body);
      }
      setEditing(null);
      load();
    } catch (err) {
      console.error("Save error:", err);
      alert(err instanceof Error ? err.message : "Ошибка сохранения");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить врача?")) return;
    await api.delete(`/doctors/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2a3250]">Врачи</h1>
        <button onClick={() => setEditing({ name: "", specialty: "", experience: 0, isActive: true })} className="rounded-xl bg-[#2a3250] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#353d5c]">
          Добавить
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <div key={d.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {d.photo ? (
                  <img src={d.photo} alt={d.name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl text-gray-300">👨‍⚕️</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <p className="mt-0.5 text-sm text-[#2a3250]">{d.specialty}</p>
                    <p className="mt-0.5 text-xs text-gray-500">Опыт: {d.experience} лет</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {d.isActive ? "Активен" : "Неактивен"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(d)} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100">Редактировать</button>
              <button onClick={() => remove(d.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Удалить</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#2a3250]">{editing.id ? "Редактирование" : "Новый врач"}</h2>
            <div className="mt-4 space-y-3">
              {/* Фото */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Фото</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {editing.photo ? (
                      <img src={editing.photo} alt="Фото" className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl text-gray-300">👨‍⚕️</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer rounded-xl bg-gray-50 px-4 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                      {uploading ? "Загрузка..." : "Загрузить фото"}
                      <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
                    </label>
                    {editing.photo && (
                      <button onClick={() => setEditing({ ...editing, photo: null })} className="text-xs text-red-500 hover:text-red-700">Удалить фото</button>
                    )}
                  </div>
                </div>
              </div>

              <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="ФИО" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
              <input value={editing.specialty || ""} onChange={(e) => setEditing({ ...editing, specialty: e.target.value })} placeholder="Специальность" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
              <input type="number" value={editing.experience || 0} onChange={(e) => setEditing({ ...editing, experience: Number(e.target.value) })} placeholder="Опыт (лет)" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
              <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Описание" rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.isActive ?? true} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="rounded" />
                Активен
              </label>
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
