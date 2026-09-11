import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import type { Prisma, OrderStatus } from "@/generated/prisma/client";

const updateSchema = z.object({
  orderId: z.string(),
  action: z.enum(["confirm", "ship", "deliver", "cancel"]),
});

// seller-allowed transitions by current status
const SELLER_TRANSITIONS: Record<string, Record<string, OrderStatus>> = {
  PENDING: { confirm: "CONFIRMED", cancel: "CANCELLED" },
  CONFIRMED: { ship: "SHIPPED", cancel: "CANCELLED" },
  SHIPPED: { deliver: "DELIVERED" },
};

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
  if (!user || !user.sellerProfileId) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { orderId, action } = parsed.data;

    // ownership: at least one order item belongs to this seller
    const ownedItem = await prisma.orderItem.findFirst({
      where: { orderId, product: { sellerId: user.sellerProfileId } },
      select: { id: true },
    });
    if (!ownedItem) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    const nextStatus = SELLER_TRANSITIONS[order.status]?.[action];
    if (!nextStatus) {
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

    const messages: Record<string, string> = {
      confirm: "سفارش تایید شد",
      ship: "سفارش ارسال شد",
      deliver: "سفارش تحویل شد",
      cancel: "سفارش لغو شد",
    };

    return NextResponse.json({
      message: messages[action],
      order: { id: updated.id, status: updated.status },
    });
  } catch (error) {
    console.error("Seller order update error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
