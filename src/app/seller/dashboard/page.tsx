import { getProductsBySeller, getSellerStats } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SellerDashboard from "./SellerDashboardClient";

export default async function SellerDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-surface rounded-2xl border border-border p-8 text-center">
          <h1 className="text-lg font-bold mb-2">برای دسترسی به داشبورد وارد شوید</h1>
          <p className="text-sm text-muted mb-4">ابتدا با حساب کاربری خود لاگین کنید.</p>
          <a href="/auth/login" className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-colors">
            ورود / ثبت‌نام
          </a>
        </div>
      </div>
    );
  }

  const dbSeller = user.sellerProfileId
    ? await prisma.sellerProfile.findUnique({ where: { id: user.sellerProfileId } })
    : null;

  if (!dbSeller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-surface rounded-2xl border border-border p-8 text-center">
          <h1 className="text-lg font-bold mb-2">حساب فروشنده‌ای یافت نشد</h1>
          <p className="text-sm text-muted">این داشبورد مخصوص فروشندگان است. برای فروش، ثبت‌نام فروشنده انجام دهید.</p>
        </div>
      </div>
    );
  }

  const seller = {
    id: dbSeller.id,
    shopName: dbSeller.shopName,
    description: dbSeller.description ?? undefined,
    logo: dbSeller.logo ?? undefined,
    rating: dbSeller.rating,
    totalSales: dbSeller.totalSales,
    verified: dbSeller.verified,
    city: dbSeller.city ?? undefined,
  };

  const [products, stats] = await Promise.all([
    getProductsBySeller(seller.id),
    getSellerStats(seller.id),
  ]);

  return <SellerDashboard seller={seller} products={products} stats={stats} />;
}
