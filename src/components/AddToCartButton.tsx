"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, Check } from "lucide-react";

interface Props {
  productId: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export default function AddToCartButton({ productId, disabled, className, label }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || status === "loading") return;

    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "خطا در افزودن به سبد خرید");
        setStatus("error");
        if (res.status === 401) {
          router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
        }
        return;
      }
      setStatus("added");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setErrorMsg("خطا در برقراری ارتباط با سرور");
      setStatus("error");
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={disabled || status === "loading"}
        className={
          className ||
          "flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-colors"
        }
      >
        {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
        {status === "added" && <Check className="w-5 h-5" />}
        {status === "idle" && <ShoppingCart className="w-5 h-5" />}
        {status === "loading" ? "در حال افزودن..." : status === "added" ? "به سبد اضافه شد" : (label ?? "افزودن به سبد خرید")}
      </button>
      {errorMsg && <p className="text-danger text-xs mt-2">{errorMsg}</p>}
    </div>
  );
}
