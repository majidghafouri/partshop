import Link from "next/link";
import { Star, ShoppingCart, Eye, Plus } from "lucide-react";
import { formatPrice, getDiscountPercent } from "@/lib/data";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const primaryImage = product.images.find((img) => img.primary) || product.images[0];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-surface rounded-2xl border border-border hover:border-border-hover hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-surface-hover overflow-hidden">
          {/* Placeholder gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-primary/30" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {discount && (
              <span className="bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                {discount}%-
              </span>
            )}
            {product.condition === "NEW" && (
              <span className="bg-success/20 text-success text-[10px] font-bold px-2 py-1 rounded-lg border border-success/30">
                نو
              </span>
            )}
            {product.condition === "USED" && (
              <span className="bg-warning/20 text-warning text-[10px] font-bold px-2 py-1 rounded-lg border border-warning/30">
                کارکرده
              </span>
            )}
          </div>

          {/* Quick view */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-medium">
              <Eye className="w-4 h-4" />
              مشاهده سریع
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Seller info */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] text-muted bg-surface-hover px-2 py-0.5 rounded-md">
              {product.seller.shopName}
            </span>
            {product.seller.verified && (
              <span className="text-[10px] text-primary">✓ تأیید شده</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[40px]">
            {product.title}
          </h3>

          {/* Brand & condition */}
          <div className="flex items-center gap-2 mb-3 text-xs text-muted">
            {product.brand && <span>{product.brand}</span>}
            {product.brand && product.origin && <span>•</span>}
            {product.origin && <span>{product.origin}</span>}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(product.rating)
                      ? "fill-warning text-warning"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted">
              ({new Intl.NumberFormat("fa-IR").format(product.reviewCount)})
            </span>
          </div>

          {/* Spacer */}
          <div className="mt-auto" />

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-muted line-through block">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            <span className="text-[10px] text-muted">
              در {new Intl.NumberFormat("fa-IR").format(product.stock)} فروشگاه
            </span>
          </div>

          {/* Add to cart */}
          <div className="mt-3 pt-3 border-t border-border">
            <AddToCartButton
              productId={product.id}
              disabled={product.stock <= 0}
              label="افزودن به سبد"
              className="w-full flex items-center justify-center gap-2 h-10 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-xs transition-colors"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
