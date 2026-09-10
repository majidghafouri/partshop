"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, Grid3X3, LayoutList, ArrowUpDown } from "lucide-react";
import { products, categories, carBrands } from "@/lib/data";
import type { FilterState } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import PlaqueSearch from "@/components/PlaqueSearch";

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheapest", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "popular", label: "پرفروش‌ترین" },
  { value: "rated", label: "بهترین امتیاز" },
];

export default function BrowsePage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category) {
      result = result.filter((p) => p.category.slug === filters.category);
    }
    if (filters.brand) {
      result = result.filter((p) =>
        p.compatibleCars?.some((c) => c.carModel.brand.slug === filters.brand)
      );
    }
    if (filters.condition) {
      result = result.filter((p) => p.condition === filters.condition);
    }
    if (filters.priceMin !== undefined) {
      result = result.filter((p) => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      result = result.filter((p) => p.price <= filters.priceMax!);
    }
    if (filters.city) {
      result = result.filter((p) => p.seller.city === filters.city);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "cheapest":
        result.sort((a, b) => a.price - b.price);
        break;
      case "expensive":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case "rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [filters, sortBy]);

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-4">
        <span className="hover:text-primary cursor-pointer transition-colors">خانه</span>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer transition-colors">خودرو و سایر وسایل نقلیه</span>
        {activeCategory && (
          <>
            <span>/</span>
            <span className="text-foreground font-medium">{activeCategory.name}</span>
          </>
        )}
      </div>

      {/* Plaque search (collapsible) */}
      <div className="mb-6">
        <PlaqueSearch onSearch={(p) => setFilters({ ...filters, plaque: p || undefined })} />
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          mobileOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 bg-surface rounded-xl border border-border p-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-hover text-sm hover:bg-border transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                فیلترها
              </button>
              <span className="text-sm text-muted">
                {new Intl.NumberFormat("fa-IR").format(filteredProducts.length)} محصول
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-hover border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* View mode */}
              <div className="hidden sm:flex items-center bg-surface-hover rounded-lg border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter tags */}
          {(filters.category || filters.brand || filters.condition || filters.city || filters.search || filters.plaque) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.search && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-lg">
                  جستجو: {filters.search}
                  <button onClick={() => setFilters({ ...filters, search: undefined })}>×</button>
                </span>
              )}
              {activeCategory && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-lg">
                  {activeCategory.name}
                  <button onClick={() => setFilters({ ...filters, category: undefined, subcategory: undefined })}>×</button>
                </span>
              )}
              {filters.brand && (
                <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-3 py-1.5 rounded-lg">
                  {carBrands.find((b) => b.slug === filters.brand)?.name}
                  <button onClick={() => setFilters({ ...filters, brand: undefined, carModel: undefined })}>×</button>
                </span>
              )}
              {filters.condition && (
                <span className="inline-flex items-center gap-1 bg-success/10 text-success text-xs px-3 py-1.5 rounded-lg">
                  {filters.condition === "NEW" ? "نو" : filters.condition === "USED" ? "کارکرده" : "بازسازی شده"}
                  <button onClick={() => setFilters({ ...filters, condition: undefined })}>×</button>
                </span>
              )}
              {filters.city && (
                <span className="inline-flex items-center gap-1 bg-warning/10 text-warning text-xs px-3 py-1.5 rounded-lg">
                  {filters.city}
                  <button onClick={() => setFilters({ ...filters, city: undefined })}>×</button>
                </span>
              )}
              {filters.plaque && (
                <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-3 py-1.5 rounded-lg">
                  پلاک: {filters.plaque}
                  <button onClick={() => setFilters({ ...filters, plaque: undefined })}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-bold mb-2">محصولی یافت نشد</h3>
              <p className="text-sm text-muted">
                فیلترهای خود را تغییر دهید یا عبارت جستجو را اصلاح کنید.
              </p>
              <button
                onClick={() => setFilters({})}
                className="mt-4 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors"
              >
                پاک کردن فیلترها
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
