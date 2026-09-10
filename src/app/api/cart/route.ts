import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addToCart, removeFromCart, setCartQuantity } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().max(99).default(1),
});

const updateCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(0).max(99),
});

const deleteCartSchema = z.object({
  productId: z.string(),
});

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await setCartQuantity(user.id, parsed.data.productId, parsed.data.quantity);

    return NextResponse.json({
      message: "سبد خرید به‌روزرسانی شد",
      item: item
        ? { id: item.id, productId: item.productId, quantity: item.quantity }
        : null,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const { getCartItems } = await import("@/lib/db");
  const items = await getCartItems(user.id);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        title: item.product.title,
        slug: item.product.slug,
        price: item.product.price,
        stock: item.product.stock,
      },
    })),
    total,
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "برای افزودن به سبد خرید ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await addToCart(user.id, parsed.data.productId, parsed.data.quantity);

    return NextResponse.json(
      {
        message: "محصول به سبد خرید اضافه شد",
        item: {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    const body = await request.json().catch(() => null);
    const parsed = deleteCartSchema.safeParse(body);
    if (parsed.success) {
      await removeFromCart(user.id, parsed.data.productId);
      return NextResponse.json({ message: "محصول از سبد خرید حذف شد" });
    }
    return NextResponse.json({ error: "شناسه محصول الزامی است" }, { status: 400 });
  }

  await removeFromCart(user.id, productId);

  return NextResponse.json({
    message: "محصول از سبد خرید حذف شد",
  });
}
