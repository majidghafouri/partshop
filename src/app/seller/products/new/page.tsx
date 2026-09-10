"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Upload, X, Info } from "lucide-react";
import { categories, carBrands } from "@/lib/data";

export default function AddProductPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    condition: "NEW",
    brand: "",
    origin: "",
    warranty: "",
    partNumber: "",
    oemNumber: "",
    categoryId: "",
    carModelId: "",
    stock: "",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/seller/dashboard" className="hover:text-primary transition-colors">پنل فروشنده</Link>
        <span>/</span>
        <span className="text-foreground">افزودن محصول جدید</span>
      </div>

      <h1 className="text-xl font-black mb-6">افزودن محصول جدید</h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Basic info */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-bold text-sm mb-5">اطلاعات پایه</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">عنوان محصول *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثال: لنت ترمز جلو پراید امکو"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">توضیحات</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="توضیحات کامل محصول شامل ویژگی‌ها، مزایا و سازگاری با خودروها..."
                className="w-full h-32 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Category & Car */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-bold text-sm mb-5">دسته‌بندی و خودرو</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">دسته‌بندی *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">خودروی سازگار</label>
              <select
                value={form.carModelId}
                onChange={(e) => setForm({ ...form, carModelId: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">انتخاب خودرو</option>
                {carBrands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price & stock */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-bold text-sm mb-5">قیمت و موجودی</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">قیمت (تومان) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="۰"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">قیمت قبلی (اختیاری)</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="۰"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">موجودی *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="۰"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-bold text-sm mb-5">مشخصات فنی</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">برند</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="مثال: امکو"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">کشور مبدأ</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                placeholder="مثال: ایران"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">شماره فنی</label>
              <input
                type="text"
                value={form.partNumber}
                onChange={(e) => setForm({ ...form, partNumber: e.target.value })}
                placeholder="شماره فنی محصول"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">شماره OEM</label>
              <input
                type="text"
                value={form.oemNumber}
                onChange={(e) => setForm({ ...form, oemNumber: e.target.value })}
                placeholder="شماره OEM"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">گارانتی</label>
              <input
                type="text"
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                placeholder="مثال: ۱۲ ماه"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">وضعیت کالا</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="NEW">نو</option>
                <option value="USED">کارکرده</option>
                <option value="REFURBISHED">بازسازی شده</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-bold text-sm mb-5">تصاویر محصول</h2>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 mx-auto text-muted mb-3" />
            <p className="text-sm text-muted-foreground mb-1">تصاویر محصول را اینجا بکشید</p>
            <p className="text-xs text-muted">یا کلیک کنید تا فایل انتخاب کنید (حداکثر ۵ تصویر)</p>
            <p className="text-[10px] text-muted mt-2 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" />
              فرمت‌های مجاز: JPG, PNG - حداکثر ۲ مگابایت
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="h-12 px-8 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors"
          >
            ذخیره و انتشار محصول
          </button>
          <Link
            href="/seller/dashboard"
            className="h-12 px-6 border border-border hover:bg-surface-hover text-foreground rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
          >
            انصراف
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </form>
    </div>
  );
}
