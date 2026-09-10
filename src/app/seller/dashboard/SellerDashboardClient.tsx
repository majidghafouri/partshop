"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { formatPrice } from "@/lib/data";
import type { Product, SellerProfile } from "@/lib/types";

interface SellerStats {
  totalSales: number;
  activeProducts: number;
  totalStock: number;
}

const recentOrders: { id: string; customer: string; product: string; price: number; status: string; date: string }[] = [
  // TODO (orders): fetch real orders for this seller (Priority 6)
];

export default function SellerDashboard({
  seller,
  products,
  stats,
}: {
  seller: SellerProfile;
  products: Product[];
  stats: SellerStats;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

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
          { id: "orders" as const, label: "سفارشات", icon: ShoppingBag },
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
              { label: "سفارشات", value: new Intl.NumberFormat("fa-IR").format(recentOrders.length), icon: ShoppingBag, color: "text-accent" },
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
            <div className="p-5 border-b border-border">
              <h2 className="font-bold text-sm">آخرین سفارشات</h2>
            </div>
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {order.id.split("-")[1]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{order.product}</div>
                      <div className="text-xs text-muted">{order.customer} • {order.date}</div>
                    </div>
                    <div className="text-sm font-bold text-primary">{formatPrice(order.price)}</div>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${
                      order.status === "شده" ? "bg-success/10 text-success" :
                      order.status === "در حال ارسال" ? "bg-accent/10 text-accent" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {order.status}
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
                  <button className="p-2 rounded-lg hover:bg-background transition-colors">
                    <Eye className="w-4 h-4 text-muted" />
                  </button>
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
        <div className="bg-surface rounded-2xl border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold text-sm">همه سفارشات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="text-right p-4 font-medium">شماره سفارش</th>
                  <th className="text-right p-4 font-medium">مشتری</th>
                  <th className="text-right p-4 font-medium">محصول</th>
                  <th className="text-right p-4 font-medium">مبلغ</th>
                  <th className="text-right p-4 font-medium">تاریخ</th>
                  <th className="text-right p-4 font-medium">وضعیت</th>
                  <th className="text-right p-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="p-4 text-sm font-medium">{order.id}</td>
                    <td className="p-4 text-sm">{order.customer}</td>
                    <td className="p-4 text-sm">{order.product}</td>
                    <td className="p-4 text-sm font-bold text-primary">{formatPrice(order.price)}</td>
                    <td className="p-4 text-sm text-muted">{order.date}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${
                        order.status === "شده" ? "bg-success/10 text-success" :
                        order.status === "در حال ارسال" ? "bg-accent/10 text-accent" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-xs text-primary hover:text-primary-hover transition-colors">
                        مشاهده جزئیات
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="p-8 text-center text-sm text-muted">هنوز سفارشی ثبت نشده است</div>
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
