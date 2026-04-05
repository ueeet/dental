"use client";

import { useState, useEffect } from "react";
import { getSoundEnabled, getSoundVolume, setSoundEnabled, setSoundVolume, playNotification } from "@/lib/sound";

export default function SoundControl() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEnabled(getSoundEnabled());
    setVolume(getSoundVolume());
  }, []);

  const toggleSound = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) playNotification();
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    setSoundVolume(v);
    if (v > 0 && enabled) playNotification();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
      >
        <span className="text-base">{enabled && volume > 0 ? "🔔" : "🔕"}</span>
        Звук
        <span className="ml-auto text-xs text-gray-400">{enabled ? `${volume}%` : "Выкл"}</span>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl bg-white p-4 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Уведомления</span>
            <button
              onClick={toggleSound}
              className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-[#2a3250]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          {enabled && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">Громкость</span>
                <span className="text-xs font-semibold text-[#2a3250]">{volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-full accent-[#2a3250]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>Тихо</span>
                <span>Громко</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
