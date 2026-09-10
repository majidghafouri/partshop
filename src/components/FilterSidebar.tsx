"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import { categories, subCategories, carBrands, cities, conditions, priceRanges, formatPrice } from "@/lib/data";
import type { FilterState } from "@/lib/types";

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-bold mb-3 hover:text-primary transition-colors">
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="animate-fade-in">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  mobileOpen,
  onClose,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const [brandExpanded, setBrandExpanded] = useState(false);
  const activeCount = Object.values(filters).filter(Boolean).length;

  const content = (
    <div className="space-y-0">
      {/* Active filters */}
      {activeCount > 0 && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <span className="text-xs text-muted">
            {activeCount} فیلتر فعال
          </span>
          <button
            onClick={() => onChange({})}
            className="text-xs text-danger hover:text-danger/80 transition-colors"
          >
            پاک کردن همه
          </button>
        </div>
      )}

      {/* Category */}
      <FilterSection title="دسته‌بندی">
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: filters.category === cat.slug ? undefined : cat.slug, subcategory: undefined })}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors text-right ${
                filters.category === cat.slug
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="flex-1 text-right">{cat.name}</span>
              <span className="text-[10px] text-muted">{cat.productCount}</span>
            </button>
          ))}
        </div>
        {filters.category && subCategories[filters.category] && (
          <div className="mt-2 mr-6 border-r-2 border-border pr-3 space-y-1">
            {subCategories[filters.category]!.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onChange({ ...filters, subcategory: filters.subcategory === sub.slug ? undefined : sub.slug })}
                className={`block w-full text-right px-2 py-1.5 rounded-md text-xs transition-colors ${
                  filters.subcategory === sub.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-surface-hover text-muted-foreground"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </FilterSection>

      {/* Car Brand */}
      <FilterSection title="برند خودرو">
        <div className="space-y-1">
          {carBrands.slice(0, brandExpanded ? carBrands.length : 5).map((brand) => (
            <button
              key={brand.id}
              onClick={() => onChange({ ...filters, brand: filters.brand === brand.slug ? undefined : brand.slug, carModel: undefined })}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors text-right ${
                filters.brand === brand.slug
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              <span className="flex-1 text-right">{brand.name}</span>
              <span className="text-[10px] text-muted">{brand.modelCount} مدل</span>
            </button>
          ))}
        </div>
        {carBrands.length > 5 && (
          <button onClick={() => setBrandExpanded(!brandExpanded)} className="text-xs text-primary hover:text-primary-hover mt-2 transition-colors">
            {brandExpanded ? "کمتر" : "بیشتر..."}
          </button>
        )}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="محدوده قیمت">
        <div className="space-y-1">
          {priceRanges.map((range, i) => {
            const isActive = filters.priceMin === range.min && filters.priceMax === range.max;
            return (
              <button
                key={i}
                onClick={() => onChange({ ...filters, priceMin: isActive ? undefined : range.min, priceMax: isActive ? undefined : range.max })}
                className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-surface-hover text-muted-foreground"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="وضعیت کالا">
        <div className="space-y-1">
          {conditions.map((c) => (
            <button
              key={c.value}
              onClick={() => onChange({ ...filters, condition: filters.condition === c.value ? undefined : c.value })}
              className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.condition === c.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* City */}
      <FilterSection title="شهر" defaultOpen={false}>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => onChange({ ...filters, city: filters.city === city ? undefined : city })}
              className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.city === city
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="bg-surface rounded-2xl border border-border p-5 sticky top-32">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-sm">فیلترها</h2>
          </div>
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface overflow-y-auto animate-slide-down">
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-sm">فیلترها</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
