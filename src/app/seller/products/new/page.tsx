import { getCategories } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import AddProductClient from "./AddProductClient";

export default async function AddProductPage() {
  const [categories, carModels] = await Promise.all([
    getCategories(),
    prisma.carModel.findMany({
      include: { brand: true },
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    }),
  ]);

  return (
    <AddProductClient
      categories={categories}
      carModels={carModels.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        yearStart: m.yearStart ?? undefined,
        yearEnd: m.yearEnd ?? undefined,
        brand: {
          id: m.brand.id,
          name: m.brand.name,
          slug: m.brand.slug,
          country: m.brand.country ?? undefined,
        },
      }))}
    />
  );
}
