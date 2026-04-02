"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Settings {
  clinicName: string;
  phone: string;
  address: string;
  telegramChatId: string;
  smsEnabled: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<Settings>("/settings").then(setSettings).catch(console.error);
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.put("/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (!settings) return <div className="text-gray-400">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2a3250]">Настройки</h1>

      <div className="mt-6 max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Название клиники</label>
          <input value={settings.clinicName} onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Телефон</label>
          <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Адрес</label>
          <input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Telegram Chat ID</label>
          <input value={settings.telegramChatId} onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.smsEnabled} onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })} className="rounded" />
          SMS-уведомления включены
        </label>

        <button onClick={save} disabled={saving}
          className="rounded-xl bg-[#2a3250] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#353d5c] disabled:opacity-50">
          {saving ? "Сохранение..." : saved ? "Сохранено!" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
