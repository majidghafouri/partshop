import Header from "./Header";
import { getCategories } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HeaderServer() {
  const user = await getSessionUser();
  const [categories, cartCount] = await Promise.all([
    getCategories(),
    user ? prisma.cartItem.aggregate({ where: { userId: user.id }, _sum: { quantity: true } }) : null,
  ]);
  return (
    <Header
      categories={categories}
      user={user}
      cartCount={user ? cartCount?._sum.quantity ?? 0 : 0}
    />
  );
}
