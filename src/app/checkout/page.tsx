"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/data";

interface CartItem {
  productId: string;
  quantity: number;
  product: { id: string; title: string; slug: string; price: number; stock: number };
}

interface FormState {
  shippingAddress: string;
  city: string;
  postalCode: string;
  phone: string;
  description: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<{ id: string; totalAmount: number } | null>(null);
  const [form, setForm] = useState<FormState>({
    shippingAddress: "",
    city: "",
    postalCode: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data: { items: CartItem[] }) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoadingCart(false));
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal > 5000000 ? 0 : 250000;
  const total = subtotal + shipping;

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.shippingAddress.trim() || form.shippingAddress.trim().length < 5) {
      setError("آدرس تحویل الزامی است (حداقل ۵ کاراکتر)");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: form.shippingAddress.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
          phone: form.phone.trim(),
          description: form.description.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت سفارش");
        if (res.status === 401) {
          router.push(`/auth/login?next=${encodeURIComponent("/checkout")}`);
        }
        return;
      }
      setPlacedOrder({ id: data.order.id, totalAmount: data.order.totalAmount });
      router.refresh();
    } catch {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  }

  // Order success screen
  if (placedOrder) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="w-20 h-20 mx-auto text-success mb-6" />
        <h1 className="text-2xl font-black mb-3">سفارش شما با موفقیت ثبت شد</h1>
        <p className="text-sm text-muted mb-2">کد سفارش شما:</p>
        <p className="font-mono font-bold text-primary mb-6" dir="ltr">{placedOrder.id}</p>
        <div className="bg-surface rounded-2xl border border-border p-5 mb-6 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted">مبلغ سفارش</span>
            <span className="font-bold">{formatPrice(placedOrder.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">وضعیت</span>
            <span className="text-warning font-medium">در انتظار تایید</span>
          </div>
        </div>
        <p className="text-xs text-muted mb-8">
          پس از تایید فروشنده، جزئیات ارسال به شماره تماس شما اطلاع‌رسانی می‌شود.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-colors">
            بازگشت به فروشگاه
          </Link>
          <Link href="/browse" className="px-6 py-3 border border-border hover:bg-surface-hover rounded-xl text-sm font-medium transition-colors">
            ادامه خرید
          </Link>
        </div>
      </div>
    );
  }

  if (loadingCart) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-center py-20 text-sm text-muted">در حال بارگذاری...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-center py-20">
          <ShoppingBag className="w-20 h-20 mx-auto text-border mb-4" />
          <h3 className="text-lg font-bold mb-2">سبد خرید شما خالی است</h3>
          <p className="text-sm text-muted mb-4">برای تکمیل خرید ابتدا محصولی به سبد اضافه کنید.</p>
          <Link href="/browse" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">
            مشاهده محصولات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-primary transition-colors">سبد خرید</Link>
        <span>/</span>
        <span className="text-foreground">تکمیل خرید</span>
      </div>

      <h1 className="text-xl font-black mb-6">تکمیل خرید</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-bold text-sm">اطلاعات ارسال</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">آدرس تحویل *</label>
              <textarea
                value={form.shippingAddress}
                onChange={(e) => set("shippingAddress", e.target.value)}
                placeholder="خیابان، کوچه، پلاک، واحد"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">شهر *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="مثلاً تهران"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">کد پستی (۱۰ رقم) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.postalCode}
                  onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                  className={inputClass}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">شماره تماس *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                className={inputClass}
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">توضیحات سفارش (اختیاری)</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="هر نکته‌ای که لازم است فروشنده بداند"
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-border p-6 sticky top-32">
            <h2 className="font-bold text-sm mb-5">خلاصه سفارش</h2>

            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex items-start justify-between gap-2 text-xs">
                  <span className="flex-1 line-clamp-2">{item.product.title}</span>
                  <span className="text-muted shrink-0">
                    {new Intl.NumberFormat("fa-IR").format(item.quantity)} ×
                  </span>
                  <span className="font-medium shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="text-muted">جمع کالا‌ها</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">هزینه ارسال</span>
                <span className={`font-medium ${shipping === 0 ? "text-success" : ""}`}>
                  {shipping === 0 ? "رایگان" : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold">مبلغ قابل پرداخت</span>
                <span className="font-black text-primary text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-colors mt-6 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              ثبت سفارش
              {!submitting && <ArrowLeft className="w-4 h-4" />}
            </button>

            <p className="text-[10px] text-muted text-center mt-3">
              پرداخت پس از تایید سفارش توسط فروشنده انجام می‌شود
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
