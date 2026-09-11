import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Truck, Package, MapPin, Phone, FileText, ArrowRight } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/data";
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES, formatDate } from "@/lib/orderStatus";
import OrderActions from "./OrderActions";

// progress steps for the tracking timeline
const TRACK_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/auth/login?next=/account/orders/${id}`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, slug: true } },
        },
      },
    },
  });

  if (!order || order.userId !== user.id) notFound();

  const currentStepIndex = TRACK_STEPS.indexOf(order.status as (typeof TRACK_STEPS)[number]);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <span>/</span>
        <Link href="/account/orders" className="hover:text-primary transition-colors">سفارش‌های من</Link>
        <span>/</span>
        <span className="text-foreground font-mono" dir="ltr">#{order.id.slice(-8)}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-black">جزئیات سفارش</h1>
          <p className="text-xs text-muted mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${ORDER_STATUS_CLASSES[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Tracking timeline */}
      {!isCancelled && (
        <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 right-5 left-5 h-0.5 bg-border -z-0" />
            <div
              className="absolute top-5 right-5 h-0.5 bg-success transition-all -z-0"
              style={{ width: `calc((100% - 2.5rem) * ${Math.max(0, currentStepIndex) / (TRACK_STEPS.length - 1)})` }}
            />
            {TRACK_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 relative z-10 w-20">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    i <= currentStepIndex
                      ? "bg-success border-success text-white"
                      : "bg-surface border-border text-muted"
                  }`}
                >
                  {i === 0 && <FileText className="w-4 h-4" />}
                  {i === 1 && <Package className="w-4 h-4" />}
                  {i === 2 && <Truck className="w-4 h-4" />}
                  {i === 3 && <CheckIcon />}
                </div>
                <span className={`text-[10px] ${i <= currentStepIndex ? "text-foreground font-medium" : "text-muted"}`}>
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items + shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-surface rounded-2xl border border-border">
            <div className="p-5 border-b border-border">
              <h2 className="font-bold text-sm">کالا‌های سفارش ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.product.slug}`}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-muted" />
                    </div>
                    <span className="text-sm font-medium line-clamp-1">{item.product.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-sm">
                    <span className="text-muted text-xs">
                      {new Intl.NumberFormat("fa-IR").format(item.quantity)} ×
                    </span>
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-border flex justify-between text-sm">
              <span className="text-muted">جمع کالا‌ها</span>
              <span className="font-black text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping info */}
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-sm">اطلاعات ارسال</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted text-xs mb-1">آدرس تحویل</p>
                  <p>{order.shippingAddress}</p>
                  <p className="text-muted text-xs mt-1">
                    {order.city}
                    {order.postalCode && ` — کد پستی: ${order.postalCode}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted shrink-0" />
                <span dir="ltr">{order.phone}</span>
              </div>
              {order.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-muted text-xs mb-1">توضیحات سفارش</p>
                    <p>{order.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary + actions */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 sticky top-32">
            <h2 className="font-bold text-sm">خلاصه سفارش</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">مبلغ سفارش</span>
                <span className="font-medium">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">تعداد کالا</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("fa-IR").format(order.items.reduce((s, i) => s + i.quantity, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">وضعیت</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${ORDER_STATUS_CLASSES[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <OrderActions
                orderId={order.id}
                canReceive={order.status === "SHIPPED"}
                canCancel={order.status === "PENDING" || order.status === "CONFIRMED"}
              />
            </div>

            <Link
              href="/account/orders"
              className="flex items-center justify-center gap-2 text-xs text-muted hover:text-foreground transition-colors pt-2"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به سفارش‌ها
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
