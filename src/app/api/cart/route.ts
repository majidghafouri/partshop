import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    items: [],
    total: 0,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, quantity } = body;

  return NextResponse.json({
    message: "محصول به سبد خرید اضافه شد",
    item: {
      id: "cart-item-id",
      productId,
      quantity: quantity || 1,
    },
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  return NextResponse.json({
    message: "محصول از سبد خرید حذف شد",
  });
}
