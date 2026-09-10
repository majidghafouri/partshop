import { getProducts, getCategories, getCarBrands, getCarModels } from "@/lib/db";
import type { FilterState } from "@/lib/types";
import BrowseClient from "./BrowseClient";

interface SearchParams {
  category?: string;
  subcategory?: string;
  brand?: string;
  carModel?: string;
  carYear?: string;
  condition?: string;
  city?: string;
  seller?: string;
  search?: string;
  sort?: string;
  page?: string;
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filters: FilterState = {
    category: sp.category || undefined,
    subcategory: sp.subcategory || undefined,
    brand: sp.brand || undefined,
    carModel: sp.carModel || undefined,
    carYear: sp.carYear ? Number(sp.carYear) : undefined,
    condition: sp.condition || undefined,
    city: sp.city || undefined,
    seller: sp.seller || undefined,
    search: sp.search || undefined,
  };
  const sort = sp.sort || "newest";
  const page = parseInt(sp.page || "1");

  const [{ products, total }, categories, carBrands, carModels] = await Promise.all([
    getProducts(filters, sort, page, 20),
    getCategories(),
    getCarBrands(),
    getCarModels(),
  ]);

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

      <BrowseClient
        initialProducts={products}
        initialFilters={filters}
        categories={categories}
        carBrands={carBrands}
        carModels={carModels}
      />

      <div className="sr-only">
        {new Intl.NumberFormat("fa-IR").format(total)} محصول در پایگاه داده
      </div>
    </div>
  );
}
