import Link from "next/link";
import { getCategories } from "@/lib/db";

export default async function Footer() {
  const categories = (await getCategories()).slice(0, 6);
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
                پ
              </div>
              <span className="text-xl font-bold">پارت شاپ</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              بازار آنلاین لوازم یدکی خودرو. خرید مطمئن قطعات اصل با ضمانت اصالت کالا و ارسال به سراسر کشور.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm mb-4">دسته‌بندی‌ها</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/browse?category=${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-sm mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  مشاهده همه محصولات
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  فروشنده شوید
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ثبت‌نام خریدار
                </Link>
              </li>
              <li>
                <Link href="/browse?plaque=true" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  جستجو با پلاک خودرو
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm mb-4">پشتیبانی</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li className="text-sm text-muted-foreground">ایمیل: support@partshop.ir</li>
              <li className="text-sm text-muted-foreground">ساعات کاری: ۹ الی ۱۸</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted">
            © ۱۴۰۵ پارت شاپ. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>حریم خصوصی</span>
            <span>شرایط استفاده</span>
            <span>قوانین بازگشت کالا</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
