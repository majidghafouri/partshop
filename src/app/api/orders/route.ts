import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import type { Prisma, OrderStatus } from "@/generated/prisma/client";

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

const updateOrderSchema = z.object({
  orderId: z.string(),
  action: z.enum(["receive", "cancel"]),
});

const ALLOWED_BUYER_TRANSITIONS: Record<string, OrderStatus> = {
  receive: "DELIVERED",
  cancel: "CANCELLED",
};

// Cancel restores stock that was decremented at order time
async function restoreStock(tx: Prisma.TransactionClient, orderId: string) {
  const items = await tx.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: { increment: item.quantity },
        salesCount: { decrement: item.quantity },
      },
    });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { orderId, action } = parsed.data;
    const nextStatus = ALLOWED_BUYER_TRANSITIONS[action];

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    // receive: only SHIPPED orders; cancel: only PENDING/CONFIRMED orders
    const valid =
      (action === "receive" && order.status === "SHIPPED") ||
      (action === "cancel" && (order.status === "PENDING" || order.status === "CONFIRMED"));
    if (!valid) {
      return NextResponse.json(
        { error: "این تغییر وضعیت در وضعیت فعلی سفارش ممکن نیست" },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });
      if (action === "cancel") {
        await restoreStock(tx, orderId);
      }
      return result;
    });

    return NextResponse.json({
      message: action === "receive" ? "سفارش تحویل داده شد" : "سفارش لغو شد",
      order: { id: updated.id, status: updated.status },
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

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
