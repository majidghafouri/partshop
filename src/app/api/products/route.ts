import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProducts, createProduct } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import type { FilterState } from "@/lib/types";

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[\s\u200c]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters: FilterState = {
    category: searchParams.get("category") || undefined,
    brand: searchParams.get("brand") || undefined,
    carModel: searchParams.get("carModel") || undefined,
    carYear: searchParams.get("carYear") ? Number(searchParams.get("carYear")) : undefined,
    condition: searchParams.get("condition") || undefined,
    city: searchParams.get("city") || undefined,
    seller: searchParams.get("seller") || undefined,
    search: searchParams.get("search") || undefined,
  };
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const { products, total } = await getProducts(filters, sort, page, limit);

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

const createProductSchema = z.object({
  title: z.string().min(3, "عنوان محصول الزامی است"),
  description: z.string().optional(),
  price: z.number().int().positive("قیمت نامعتبر است"),
  originalPrice: z.number().int().positive().optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]).default("NEW"),
  brand: z.string().optional(),
  origin: z.string().optional(),
  warranty: z.string().optional(),
  partNumber: z.string().optional(),
  oemNumber: z.string().optional(),
  categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
  carModelId: z.string().optional(),
  yearFrom: z.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
  yearTo: z.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
}).refine((d) => !d.yearFrom || !d.yearTo || d.yearFrom <= d.yearTo, {
  message: "سال شروع باید کوچکتر از سال پایان باشد",
  path: ["yearFrom"],
});

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "برای افزودن محصول ابتدا وارد شوید" }, { status: 401 });
  }
  if (!user.sellerProfileId) {
    return NextResponse.json({ error: "این قابلیت مخصوص حساب‌های فروشنده است" }, { status: 403 });
  }
  const sellerId = user.sellerProfileId;

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: parsed.data.categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: "دسته‌بندی نامعتبر است" }, { status: 400 });
    }

    const product = await createProduct({
      ...parsed.data,
      slug: slugify(parsed.data.title),
      sellerId,
    });

    return NextResponse.json(
      {
        message: "محصول با موفقیت ایجاد شد",
        product: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          createdAt: product.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
