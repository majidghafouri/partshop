import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    orders: [],
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, shippingAddress, city, postalCode, phone } = body;

  return NextResponse.json({
    message: "سفارش با موفقیت ثبت شد",
    order: {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      status: "PENDING",
      totalAmount: 0,
      items,
      shippingAddress,
      city,
      postalCode,
      phone,
      createdAt: new Date().toISOString(),
    },
  }, { status: 201 });
}
