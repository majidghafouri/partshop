"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, Lock, User, Eye, EyeOff, ArrowLeft, Store, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("phone");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    identifier: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    city: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیست");
      return;
    }
    if (form.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }
    if (role === "seller" && !form.shopName.trim()) {
      setError("نام فروشگاه الزامی است");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: method === "email" ? form.identifier.trim() : undefined,
          phone: method === "phone" ? form.identifier.trim() : undefined,
          password: form.password,
          role: role === "seller" ? "SELLER" : "BUYER",
          shopName: role === "seller" ? form.shopName : undefined,
          city: form.city || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت‌نام");
        return;
      }
      router.push(role === "seller" ? "/seller/dashboard" : "/");
      router.refresh();
    } catch {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl mb-4">
            پ
          </div>
          <h1 className="text-2xl font-black">ثبت‌نام در پارت شاپ</h1>
          <p className="text-sm text-muted mt-2">حساب کاربری جدید بسازید</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
          {/* Role tabs */}
          <div className="flex bg-surface-hover rounded-xl p-1 mb-6">
            <button
              onClick={() => setRole("buyer")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                role === "buyer" ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              خریدار
            </button>
            <button
              onClick={() => setRole("seller")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                role === "seller" ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
            >
              <Store className="w-4 h-4" />
              فروشنده
            </button>
          </div>

          {/* Method tabs */}
          <div className="flex bg-surface-hover rounded-xl p-1 mb-6">
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                method === "phone" ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              <Phone className="w-4 h-4" />
              موبایل
            </button>
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                method === "email" ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              <Mail className="w-4 h-4" />
              ایمیل
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">نام و نام خانوادگی</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="نام خود را وارد کنید"
                  className="w-full h-12 pr-12 pl-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            {/* Identifier */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                {method === "phone" ? "شماره موبایل" : "آدرس ایمیل"}
              </label>
              <div className="relative">
                <input
                  type={method === "phone" ? "tel" : "email"}
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  placeholder={method === "phone" ? "۰۹۱۲۱۲۳۴۵۶۷" : "example@email.com"}
                  className="w-full h-12 pr-12 pl-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  dir={method === "phone" ? "ltr" : "rtl"}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  {method === "phone" ? <Phone className="w-4 h-4 text-muted" /> : <Mail className="w-4 h-4 text-muted" />}
                </span>
              </div>
            </div>

            {/* Seller fields */}
            {role === "seller" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">نام فروشگاه</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.shopName}
                      onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                      placeholder="نام فروشگاه خود را وارد کنید"
                      className="w-full h-12 pr-12 pl-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                    <Store className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">شهر</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="شهر فعالیت"
                    className="w-full h-12 pr-4 pl-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="حداقل ۸ کاراکتر"
                  className="w-full h-12 pr-12 pl-12 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">تکرار رمز عبور</label>
              <div className="relative">
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="رمز عبور را مجدداً وارد کنید"
                  className="w-full h-12 pr-12 pl-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-border accent-primary" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                با{" "}
                <span className="text-primary hover:text-primary-hover">شرایط استفاده</span>{" "}
                و{" "}
                <span className="text-primary hover:text-primary-hover">حریم خصوصی</span>{" "}
                موافقم
              </span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {role === "seller" ? "ثبت‌نام فروشنده" : "ثبت‌نام"}
              {!saving && <ArrowLeft className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-muted mt-6">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
