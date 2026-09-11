"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  BarChart3,
  Settings,
  DollarSign,
  ShoppingBag,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Store,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
  PackageCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/data";
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES, formatDate } from "@/lib/orderStatus";
import type { Product, SellerProfile } from "@/lib/types";

interface SellerStats {
  totalSales: number;
  activeProducts: number;
  totalStock: number;
}

interface SellerOrder {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: { name: string; phone: string | null };
  items: { id: string; quantity: number; price: number; title: string }[];
}

const STATUS_FILTERS = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

// seller actions per status
const SELLER_ACTIONS: Record<string, { action: string; label: string; icon: typeof CheckCircle2; className: string }[]> = {
  PENDING: [
    { action: "confirm", label: "تایید", icon: CheckCircle2, className: "bg-success/10 text-success hover:bg-success/20" },
    { action: "cancel", label: "لغو", icon: XCircle, className: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  CONFIRMED: [
    { action: "ship", label: "ارسال", icon: Truck, className: "bg-accent/10 text-accent hover:bg-accent/20" },
    { action: "cancel", label: "لغو", icon: XCircle, className: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  SHIPPED: [
    { action: "deliver", label: "تحویل شد", icon: PackageCheck, className: "bg-success/10 text-success hover:bg-success/20" },
  ],
};

export default function SellerDashboard({
  seller,
  products,
  stats,
  orders,
  statusCounts,
}: {
  seller: SellerProfile;
  products: Product[];
  stats: SellerStats;
  orders: SellerOrder[];
  statusCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("ALL");
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredOrders = statusFilter === "ALL" ? orders : orders.filter((o) => o.status === statusFilter);
  const pendingCount = statusCounts.PENDING ?? 0;

  async function handleOrderAction(orderId: string, action: string) {
    if (action === "cancel" && !confirm("این سفارش لغو شود؟ موجودی محصولات به انبار بازمی‌گردد.")) {
      return;
    }
    setLoadingOrderId(orderId);
    setActionError(null);
    try {
      const res = await fetch("/api/seller/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "خطا");
        return;
      }
      router.refresh();
    } catch {
      setActionError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoadingOrderId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black">پنل فروشنده</h1>
            <p className="text-xs text-muted">{seller.shopName}</p>
          </div>
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن محصول
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: "overview" as const, label: "نمای کلی", icon: BarChart3 },
          { id: "products" as const, label: "محصولات", icon: Package },
          { id: "orders" as const, label: `سفارشات${pendingCount > 0 ? ` (${new Intl.NumberFormat("fa-IR").format(pendingCount)})` : ""}`, icon: ShoppingBag },
          { id: "settings" as const, label: "تنظیمات", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-surface border border-border hover:bg-surface-hover text-muted-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "کل فروش", value: new Intl.NumberFormat("fa-IR").format(stats.totalSales), icon: DollarSign, color: "text-primary" },
              { label: "سفارشات", value: new Intl.NumberFormat("fa-IR").format(orders.length), icon: ShoppingBag, color: "text-accent" },
              { label: "محصولات فعال", value: new Intl.NumberFormat("fa-IR").format(stats.activeProducts), icon: Package, color: "text-success" },
              { label: "امتیاز فروشگاه", value: seller.rating.toLocaleString("fa-IR"), icon: Star, color: "text-warning" },
            ].map((stat, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="bg-surface rounded-2xl border border-border">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-sm">آخرین سفارشات</h2>
              <button onClick={() => setActiveTab("orders")} className="text-xs text-primary hover:text-primary-hover transition-colors">
                مشاهده همه
              </button>
            </div>
            {orders.length > 0 ? (
              <div className="divide-y divide-border">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {order.items[0]?.title}
                        {order.items.length > 1 && ` + ${order.items.length - 1}`}
                      </div>
                      <div className="text-xs text-muted">
                        {order.customer.name} • {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary shrink-0">{formatPrice(order.totalAmount)}</div>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg shrink-0 ${ORDER_STATUS_CLASSES[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted">هنوز سفارشی ثبت نشده است</div>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === "products" && (
        <div className="bg-surface rounded-2xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-sm">محصولات من</h2>
            <span className="text-xs text-muted">{products.length.toLocaleString("fa-IR")} محصول</span>
          </div>
          <div className="divide-y divide-border">
            {products.map((product) => (
              <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{product.title}</div>
                  <div className="text-xs text-muted">{product.category.name} • موجودی: {product.stock.toLocaleString("fa-IR")}</div>
                </div>
                <div className="text-sm font-bold text-primary shrink-0">{formatPrice(product.price)}</div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/product/${product.slug}`} className="p-2 rounded-lg hover:bg-background transition-colors">
                    <Eye className="w-4 h-4 text-muted" />
                  </Link>
                  <button className="p-2 rounded-lg hover:bg-background transition-colors">
                    <Edit className="w-4 h-4 text-muted" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-danger/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-danger" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Status filter chips with counts */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((status) => {
              const count = status === "ALL" ? orders.length : statusCounts[status] ?? 0;
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "bg-surface border border-border hover:bg-surface-hover text-muted-foreground"
                  }`}
                >
                  {status === "ALL" ? "همه" : ORDER_STATUS_LABELS[status]}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${active ? "bg-white/20" : "bg-surface-hover"}`}>
                    {new Intl.NumberFormat("fa-IR").format(count)}
                  </span>
                </button>
              );
            })}
          </div>

          {actionError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl px-4 py-3 text-sm">
              {actionError}
            </div>
          )}

          <div className="bg-surface rounded-2xl border border-border">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">سفارشی با این وضعیت وجود ندارد</div>
            ) : (
              <div className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="font-mono text-xs text-muted" dir="ltr">#{order.id.slice(-8)}</span>
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${ORDER_STATUS_CLASSES[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <div className="flex-1 min-w-0 text-xs text-muted">
                        {order.customer.name}
                        {order.customer.phone && <span dir="ltr" className="mx-1">{order.customer.phone}</span>} • {formatDate(order.createdAt)}
                      </div>
                      <span className="text-sm font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                    </div>

                    <div className="mt-2 text-xs text-muted">
                      {order.items.map((item, i) => (
                        <span key={item.id}>
                          {i > 0 && "، "}
                          {item.title} ({new Intl.NumberFormat("fa-IR").format(item.quantity)} عدد)
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    {SELLER_ACTIONS[order.status] && (
                      <div className="flex items-center gap-2 mt-3">
                        {loadingOrderId === order.id && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
                        {SELLER_ACTIONS[order.status].map((act) => (
                          <button
                            key={act.action}
                            onClick={() => handleOrderAction(order.id, act.action)}
                            disabled={loadingOrderId !== null}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${act.className}`}
                          >
                            <act.icon className="w-3.5 h-3.5" />
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="bg-surface rounded-2xl border border-border p-6 max-w-2xl">
          <h2 className="font-bold text-sm mb-6">اطلاعات فروشگاه</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">نام فروشگاه</label>
              <input
                type="text"
                defaultValue={seller.shopName}
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">توضیحات</label>
              <textarea
                defaultValue={seller.description ?? ""}
                className="w-full h-24 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">شهر</label>
                <input
                  type="text"
                  defaultValue={seller.city ?? ""}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">آدرس</label>
                <input
                  type="text"
                  defaultValue=""
                  placeholder="خیابان ولیعصر"
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>
            <button className="h-12 px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors">
              ذخیره تغییرات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
