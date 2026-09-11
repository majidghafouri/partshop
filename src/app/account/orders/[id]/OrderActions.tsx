"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  canReceive: boolean;
  canCancel: boolean;
}

export default function OrderActions({ orderId, canReceive, canCancel }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: "receive" | "cancel") {
    setLoading(action);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا");
        return;
      }
      router.refresh();
    } catch {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(null);
    }
  }

  if (!canReceive && !canCancel) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {canReceive && (
          <button
            onClick={() => handleAction("receive")}
            disabled={loading !== null}
            className="flex items-center gap-2 px-5 py-2.5 bg-success/10 text-success hover:bg-success/20 disabled:opacity-50 rounded-xl text-sm font-bold transition-colors"
          >
            {loading === "receive" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            تحویل گرفتم
          </button>
        )}
        {canCancel && (
          <button
            onClick={() => {
              if (confirm("این سفارش لغو شود؟ موجودی محصولات به انبار بازمی‌گردد.")) {
                handleAction("cancel");
              }
            }}
            disabled={loading !== null}
            className="flex items-center gap-2 px-5 py-2.5 bg-danger/10 text-danger hover:bg-danger/20 disabled:opacity-50 rounded-xl text-sm font-bold transition-colors"
          >
            {loading === "cancel" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            لغو سفارش
          </button>
        )}
      </div>
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
