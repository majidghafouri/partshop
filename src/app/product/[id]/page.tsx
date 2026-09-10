import Link from "next/link";
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Store } from "lucide-react";
import { products, formatPrice, getDiscountPercent } from "@/lib/data";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.slug === id || p.id === id) || products[0];

  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-primary transition-colors">محصولات</Link>
        <span>/</span>
        <Link href={`/browse?category=${product.category.slug}`} className="hover:text-primary transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="aspect-square bg-surface-hover flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-primary/30" />
              </div>
              {discount && (
                <div className="absolute top-4 right-4 bg-danger text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                  {discount}%-
                </div>
              )}
            </div>
          </div>
          {/* Thumbnail row */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-surface rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-colors flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-primary/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & rating */}
          <div>
            <h1 className="text-xl md:text-2xl font-black mb-3">{product.title}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.rating) ? "fill-warning text-warning" : "text-border"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted mr-1">
                  ({new Intl.NumberFormat("fa-IR").format(product.reviewCount)} نظر)
                </span>
              </div>
              <span className="text-sm text-muted">
                {new Intl.NumberFormat("fa-IR").format(product.salesCount)} فروش
              </span>
            </div>
          </div>

          {/* Price card */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <div className="flex items-end gap-3 mb-4">
              {product.originalPrice && (
                <span className="text-muted line-through text-lg">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-3xl font-black text-primary">{formatPrice(product.price)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors">
                <ShoppingCart className="w-5 h-5" />
                افزودن به سبد خرید
              </button>
              <button className="h-12 w-12 flex items-center justify-center rounded-xl border border-border hover:border-danger hover:text-danger transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {product.stock <= 0 && (
              <p className="text-danger text-sm mt-3 font-medium">ناموجود</p>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-warning text-sm mt-3">
                تنها {new Intl.NumberFormat("fa-IR").format(product.stock)} عدد در انبار باقی مانده
              </p>
            )}
          </div>

          {/* Seller info */}
          <div className="bg-surface rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{product.seller.shopName}</span>
                  {product.seller.verified && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">
                      ✓ فروشنده معتبر
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                  <span>⭐ {product.seller.rating}</span>
                  <span>{new Intl.NumberFormat("fa-IR").format(product.seller.totalSales)} فروش</span>
                  {product.seller.city && <span>📍 {product.seller.city}</span>}
                </div>
              </div>
              <Link href={`/browse?seller=${product.seller.id}`} className="text-sm text-primary hover:text-primary-hover transition-colors">
                مشاهده فروشگاه
              </Link>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-surface rounded-2xl border border-border p-5">
            <h2 className="font-bold text-sm mb-4">مشخصات محصول</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "برند", value: product.brand },
                { label: "کشور مبدأ", value: product.origin },
                { label: "وضعیت", value: product.condition === "NEW" ? "نو" : product.condition === "USED" ? "کارکرده" : "بازسازی شده" },
                { label: "گارانتی", value: product.warranty },
                { label: "شماره فنی", value: product.partNumber },
                { label: "شماره OEM", value: product.oemNumber },
                { label: "دسته‌بندی", value: product.category.name },
                { label: "موجودی", value: product.stock > 0 ? `${new Intl.NumberFormat("fa-IR").format(product.stock)} عدد` : "ناموجود" },
              ].filter((s) => s.value).map((spec) => (
                <div key={spec.label} className="flex items-center gap-2 text-sm">
                  <span className="text-muted w-24 shrink-0">{spec.label}:</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compatible cars */}
          {product.compatibleCars && product.compatibleCars.length > 0 && (
            <div className="bg-surface rounded-2xl border border-border p-5">
              <h2 className="font-bold text-sm mb-4">خودروهای سازگار</h2>
              <div className="flex flex-wrap gap-2">
                {product.compatibleCars.map((pc, i) => (
                  <span key={i} className="bg-surface-hover text-sm px-3 py-1.5 rounded-lg border border-border">
                    {pc.carModel.brand.name} {pc.carModel.name}
                    {pc.yearFrom && pc.yearTo && (
                      <span className="text-muted mr-1">({pc.yearFrom} - {pc.yearTo})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="bg-surface rounded-2xl border border-border p-5">
              <h2 className="font-bold text-sm mb-4">توضیحات</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: "ضمانت اصالت" },
              { icon: Truck, label: "ارسال سریع" },
              { icon: RotateCcw, label: "بازگشت ۷ روزه" },
            ].map((g, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-4 text-center">
                <g.icon className="w-6 h-6 mx-auto text-primary mb-2" />
                <span className="text-xs text-muted-foreground">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
