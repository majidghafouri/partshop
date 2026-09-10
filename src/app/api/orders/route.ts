import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().max(99),
      })
    )
    .min(1, "سبد خرید خالی است"),
  shippingAddress: z.string().min(5, "آدرس الزامی است"),
  city: z.string().min(2, "شهر الزامی است"),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  phone: z.string().regex(/^0\d{10}$/, "شماره تماس نامعتبر است"),
  description: z.string().optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, title: true, slug: true, price: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "برای ثبت سفارش ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { items, shippingAddress, city, postalCode, phone, description } = parsed.data;

    // Validate products and compute total from DB prices
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
      select: { id: true, price: true, stock: true },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: "محصول یافت نشد" }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: "موجودی کافی نیست" }, { status: 400 });
      }
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + (productMap.get(item.productId)?.price ?? 0) * item.quantity,
      0
    );

    // Create order + decrement stock atomically
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          shippingAddress,
          city,
          postalCode,
          phone,
          description,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      return created;
    });

    return NextResponse.json(
      {
        message: "سفارش با موفقیت ثبت شد",
        order: {
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount,
          items: order.items,
          shippingAddress,
          city,
          postalCode,
          phone,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
