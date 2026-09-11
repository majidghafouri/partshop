import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, ArrowLeft, ChevronLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/data";
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES, formatDate } from "@/lib/orderStatus";

export const metadata = { title: "سفارش‌های من | پارت شاپ" };

export default async function MyOrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <span>/</span>
        <span className="text-foreground">سفارش‌های من</span>
      </div>

      <h1 className="text-xl font-black mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-primary" />
        سفارش‌های من
        <span className="text-sm font-normal text-muted">({orders.length} سفارش)</span>
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-20 h-20 mx-auto text-border mb-4" />
          <h3 className="text-lg font-bold mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-sm text-muted mb-4">اولین خرید خود را انجام دهید.</p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            مشاهده محصولات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block bg-surface rounded-2xl border border-border p-5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted" dir="ltr">
                    #{order.id.slice(-8)}
                  </span>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${ORDER_STATUS_CLASSES[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <span className="text-sm font-black text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted min-w-0">
                  <span className="truncate">
                    {order.items[0]?.product.title ?? ""}
                    {order.items.length > 1 && ` + ${order.items.length - 1} کالای دیگر`}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted shrink-0">
                  <span>{formatDate(order.createdAt)}</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
