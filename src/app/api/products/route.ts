import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  return NextResponse.json({
    products: [],
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 0,
    },
    filters: {
      category,
      brand,
      search,
      sort,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    message: "محصول با موفقیت ایجاد شد",
    product: {
      id: "new-product-id",
      ...body,
      createdAt: new Date().toISOString(),
    },
  }, { status: 201 });
}
