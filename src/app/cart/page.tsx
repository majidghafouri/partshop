"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Truck, Shield } from "lucide-react";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data: { items: { productId: string; quantity: number; product: { id: string; title: string; slug: string; price: number; stock: number } }[] }) => {
        // TODO (auth): API returns basic product info; extend once session cart is wired (Priority 2/5)
        setItems(
          data.items.map((item) => ({
            product: {
              id: item.product.id,
              title: item.product.title,
              slug: item.product.slug,
              price: item.product.price,
            } as Product,
            quantity: item.quantity,
          }))
        );
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== id) return item;
        const max = item.product.stock ?? 99;
        const next = Math.min(max, Math.max(1, item.quantity + delta));
        if (next !== item.quantity) {
          fetch("/api/cart", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id, quantity: next }),
          })
            .then(() => router.refresh())
            .catch(() => {});
        }
        return { ...item, quantity: next };
      })
    );
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== id));
    await fetch(`/api/cart?productId=${id}`, { method: "DELETE" }).catch(() => {});
    router.refresh();
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 5000000 ? 0 : 250000;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-black mb-6 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-primary" />
        سبد خرید
        <span className="text-sm font-normal text-muted">({items.length} کالا)</span>
      </h1>

      {loading ? (
        <div className="text-center py-20 text-sm text-muted">در حال بارگذاری...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart className="w-20 h-20 mx-auto text-border mb-4" />
          <h3 className="text-lg font-bold mb-2">سبد خرید شما خالی است</h3>
          <p className="text-sm text-muted mb-4">محصولات مورد نظر خود را به سبد اضافه کنید.</p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            مشاهده محصولات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-4">
                {/* Image placeholder */}
                <div className="w-20 h-20 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.slug}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                    {item.product.title}
                  </Link>
                  <div className="text-xs text-muted mt-1">
                    {item.product.brand && <span>{item.product.brand}</span>}
                  </div>
                  <div className="text-sm font-bold text-primary mt-2">
                    {formatPrice(item.product.price)}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.product.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-surface-hover hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">
                    {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                  </span>
                  <button
                    onClick={() => updateQty(item.product.id, 1)}
                    disabled={item.quantity >= (item.product.stock ?? 99)}
                    className="w-8 h-8 rounded-lg bg-surface-hover hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Total */}
                <div className="text-sm font-bold shrink-0 hidden sm:block">
                  {formatPrice(item.product.price * item.quantity)}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 rounded-lg hover:bg-danger/10 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-danger" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl border border-border p-6 sticky top-32">
              <h2 className="font-bold text-sm mb-5">خلاصه سفارش</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">جمع کل ({items.length} کالا)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">هزینه ارسال</span>
                  <span className={`font-medium ${shipping === 0 ? "text-success" : ""}`}>
                    {shipping === 0 ? "رایگان" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-muted bg-surface-hover rounded-lg px-3 py-2">
                    ارسال رایگان برای خریدهای بالای ۵ میلیون تومان
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold">مبلغ قابل پرداخت</span>
                  <span className="font-black text-primary text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors mt-6 flex items-center justify-center gap-2"
              >
                تکمیل خرید
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* Guarantees */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-[10px] text-muted">
                  <Shield className="w-3 h-3" />
                  ضمانت اصالت
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted">
                  <Truck className="w-3 h-3" />
                  ارسال سریع
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
