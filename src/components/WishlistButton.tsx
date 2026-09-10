"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";

interface Props {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className }: Props) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => (res.ok ? res.json() : { productIds: [] }))
      .then((data: { productIds: string[] }) => setWishlisted(data.productIds.includes(productId)))
      .catch(() => setWishlisted(false));
  }, [productId]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading || wishlisted === null) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا");
        if (res.status === 401) {
          router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
        }
        return;
      }
      setWishlisted(data.wishlisted);
    } catch {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label="علاقه‌مندی"
        className={
          className ||
          "h-12 w-12 flex items-center justify-center rounded-xl border border-border hover:border-danger hover:text-danger transition-colors"
        }
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart
            className={`w-5 h-5 transition-colors ${
              wishlisted ? "fill-danger text-danger" : wishlisted === null ? "text-foreground" : "text-foreground"
            }`}
          />
        )}
      </button>
      {error && (
        <p className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-danger text-[10px] whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
