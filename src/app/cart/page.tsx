"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Truck, Shield } from "lucide-react";
import { products, formatPrice } from "@/lib/data";

const cartItems = [
  { product: products[0], quantity: 2 },
  { product: products[1], quantity: 1 },
  { product: products[4], quantity: 3 },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== id));
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

      {items.length === 0 ? (
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
                    {item.product.seller && <span> • {item.product.seller.shopName}</span>}
                  </div>
                  <div className="text-sm font-bold text-primary mt-2">
                    {formatPrice(item.product.price)}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.product.id, -1)}
                    className="w-8 h-8 rounded-lg bg-surface-hover hover:bg-border flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">
                    {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                  </span>
                  <button
                    onClick={() => updateQty(item.product.id, 1)}
                    className="w-8 h-8 rounded-lg bg-surface-hover hover:bg-border flex items-center justify-center transition-colors"
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

              <button className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors mt-6 flex items-center justify-center gap-2">
                تکمیل خرید
                <ArrowLeft className="w-4 h-4" />
              </button>

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
