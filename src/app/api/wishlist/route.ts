import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const toggleSchema = z.object({
  productId: z.string(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ productIds: [] });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: user.id },
    select: { productId: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ productIds: wishlist.map((w) => w.productId) });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = toggleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "شناسه محصول الزامی است" }, { status: 400 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: user.id, productId: parsed.data.productId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: "از علاقه‌مندی‌ها حذف شد", wishlisted: false });
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    await prisma.wishlist.create({
      data: { userId: user.id, productId: parsed.data.productId },
    });
    return NextResponse.json({ message: "به علاقه‌مندی‌ها اضافه شد", wishlisted: true }, { status: 201 });
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
