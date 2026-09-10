"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import type { Category, CarBrand, CarModel, FilterState, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import PlaqueSearch from "@/components/PlaqueSearch";

export default function BrowseClient({
  initialProducts,
  initialFilters,
  categories,
  carBrands,
  carModels,
}: {
  initialProducts: Product[];
  initialFilters: FilterState;
  categories: Category[];
  carBrands: CarBrand[];
  carModels: CarModel[];
}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCategory = categories.find((c) => c.slug === filters.category);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (filters.subcategory) {
      result = result.filter((p) => p.category.slug === filters.subcategory);
    } else if (filters.category) {
      const cat = categories.find((c) => c.slug === filters.category);
      const subSlugs = cat?.children?.map((ch) => ch.slug) ?? [];
      result = result.filter(
        (p) => p.category.slug === filters.category || subSlugs.includes(p.category.slug)
      );
    }

    return result;
  }, [initialProducts, filters, categories]);

  const activeModel = carModels.find((m) => m.slug === filters.carModel);

  return (
    <>
      {/* Plaque search */}
      <div className="mb-6">
        <PlaqueSearch onSearch={(p) => setFilters((f) => ({ ...f, plaque: p || undefined }))} />
      </div>

      <div className="flex gap-6">
      <FilterSidebar
        filters={filters}
        onChange={setFilters}
        mobileOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categories={categories}
        carBrands={carBrands}
        carModels={carModels}
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
        {(filters.category || filters.brand || filters.carModel || filters.carYear || filters.condition || filters.city || filters.search || filters.plaque) && (
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
                <button onClick={() => setFilters({ ...filters, brand: undefined, carModel: undefined, carYear: undefined })}>×</button>
              </span>
            )}
            {activeModel && (
              <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-3 py-1.5 rounded-lg">
                {activeModel.brand.name} {activeModel.name}
                <button onClick={() => setFilters({ ...filters, carModel: undefined, carYear: undefined })}>×</button>
              </span>
            )}
            {activeModel && filters.carYear && (
              <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-3 py-1.5 rounded-lg">
                سال {filters.carYear}
                <button onClick={() => setFilters({ ...filters, carYear: undefined })}>×</button>
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
    </>
  );
}
