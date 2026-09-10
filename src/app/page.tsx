import Link from "next/link";
import { Search, Shield, Truck, CreditCard, Star, ArrowLeft } from "lucide-react";
import { categories, products, carBrands, formatPrice, formatPriceShort, getDiscountPercent } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import PlaqueSearch from "@/components/PlaqueSearch";

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-background to-accent/5" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              بازار بزرگ
              <span className="text-primary"> لوازم یدکی </span>
              خودرو
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
              خرید مطمئن قطعات یدکی اصل با ضمانت اصالت کالا. از بین هزاران محصول از فروشندگان معتبر، قطعه مورد نظر خودروی خود را پیدا کنید.
            </p>

            {/* Plaque search */}
            <div className="max-w-xl mx-auto mb-8">
              <PlaqueSearch />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-primary">۱۵,۰۰۰+</div>
                <div className="text-xs text-muted mt-1">محصول</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-accent">۵۰۰+</div>
                <div className="text-xs text-muted mt-1">فروشنده</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-success">۳۰+</div>
                <div className="text-xs text-muted mt-1">شهر</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "ضمانت اصالت کالا", desc: "بازگشت در صورت اصل نبودن" },
              { icon: Truck, label: "ارسال به سراسر کشور", desc: "ارسال سریع و مطمئن" },
              { icon: CreditCard, label: "خرید اقساطی", desc: "بدون سود و ضامن" },
              { icon: Star, label: "پشتیبانی تخصصی", desc: "مشاوره انتخاب قطعه" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-muted">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">دسته‌بندی قطعات</h2>
          <Link href="/browse" className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.slug}`}
              className="group bg-surface rounded-2xl border border-border hover:border-primary/30 p-5 text-center transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-sm font-medium group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-[10px] text-muted mt-1">{cat.productCount?.toLocaleString("fa-IR")} محصول</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">محصولات ویژه</h2>
          <Link href="/browse?featured=true" className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Car brands */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">قطعات بر اساس خودرو</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {carBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/browse?brand=${brand.slug}`}
              className="group bg-surface rounded-2xl border border-border hover:border-primary/30 p-5 text-center transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-surface-hover flex items-center justify-center text-2xl font-bold text-primary/30 group-hover:text-primary/60 transition-colors mb-3">
                {brand.name.charAt(0)}
              </div>
              <h3 className="text-sm font-medium group-hover:text-primary transition-colors">{brand.name}</h3>
              <p className="text-[10px] text-muted mt-1">{brand.modelCount} مدل</p>
            </Link>
          ))}
        </div>
      </section>

      {/* All products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">جدیدترین محصولات</h2>
          <Link href="/browse" className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA for sellers */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-l from-primary/20 via-surface to-accent/10 rounded-3xl border border-border p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            در <span className="text-primary">پارت شاپ</span> بفروشید!
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
            فروشندگان قطعات خودرو، فروشگاه خود را به هزاران مشتری معرفی کنید. ثبت‌نام رایگان، بدون هزینه اولیه.
          </p>
          <Link
            href="/seller/dashboard"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            شروع فروش
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
