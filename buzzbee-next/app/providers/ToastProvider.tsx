"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { toast, Toast as ToastType } from "@/lib/toast-service";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const TOAST_DURATION = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, TOAST_DURATION);
    });
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto
              flex items-start gap-3 p-4 rounded-2xl shadow-xl border
              animate-in slide-in-from-right-10 fade-in duration-300
              ${
                t.type === "success"
                  ? "bg-white border-green-100 text-green-900"
                  : t.type === "error"
                  ? "bg-white border-red-100 text-red-900"
                  : t.type === "warning"
                  ? "bg-white border-amber-100 text-amber-900"
                  : "bg-white border-blue-100 text-blue-900"
              }
            `}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="text-green-500" size={20} />}
              {t.type === "error" && <AlertCircle className="text-red-500" size={20} />}
              {t.type === "warning" && <AlertTriangle className="text-amber-500" size={20} />}
              {t.type === "info" && <Info className="text-blue-500" size={20} />}
            </div>
            
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
