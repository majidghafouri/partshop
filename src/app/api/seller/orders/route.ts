import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const listSchema = z.object({
  status: z.enum(STATUSES).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || !user.sellerProfileId) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = listSchema.safeParse({
    status: searchParams.get("status") || undefined,
    page: searchParams.get("page") || 1,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "پارامتر نامعتبر" }, { status: 400 });
  }

  // Orders that contain at least one product of this seller
  const where = {
    items: { some: { product: { sellerId: user.sellerProfileId } } },
    ...(parsed.data.status ? { status: parsed.data.status } : {}),
  };

  const [orders, total, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: {
          where: { product: { sellerId: user.sellerProfileId } },
          include: {
            product: { select: { id: true, title: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (parsed.data.page - 1) * 20,
      take: 20,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      where: { items: { some: { product: { sellerId: user.sellerProfileId } } } },
      _count: { _all: true },
    }),
  ]);

  return NextResponse.json({
    orders,
    total,
    page: parsed.data.page,
    statusCounts: Object.fromEntries(statusCounts.map((s) => [s.status, s._count._all])),
  });
}
