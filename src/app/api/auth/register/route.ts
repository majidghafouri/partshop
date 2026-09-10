import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, password, role, shopName, city } = body;

  if (!name) {
    return NextResponse.json({ error: "نام الزامی است" }, { status: 400 });
  }

  if (!email && !phone) {
    return NextResponse.json({ error: "ایمیل یا شماره موبایل الزامی است" }, { status: 400 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "رمز عبور باید حداقل ۸ کاراکتر باشد" }, { status: 400 });
  }

  return NextResponse.json({
    message: "ثبت‌نام با موفقیت انجام شد",
    user: {
      id: "new-user-id",
      name,
      email: email || null,
      phone: phone || null,
      role: role || "BUYER",
      shopName: shopName || null,
      city: city || null,
      createdAt: new Date().toISOString(),
    },
  }, { status: 201 });
}
