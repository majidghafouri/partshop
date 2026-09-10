"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [method, setMethod] = useState<"email" | "phone">("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl mb-4">
            م
          </div>
          <h1 className="text-2xl font-black">ورود به مکان</h1>
          <p className="text-sm text-muted mt-2">حساب کاربری خود را باز کنید</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
          {/* Method tabs */}
          <div className="flex bg-surface-hover rounded-xl p-1 mb-6">
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                method === "phone" ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
            >
              <Phone className="w-4 h-4" />
              شماره موبایل
            </button>
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                method === "email" ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
            >
              <Mail className="w-4 h-4" />
              ایمیل
            </button>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                {method === "phone" ? "شماره موبایل" : "آدرس ایمیل"}
              </label>
              <div className="relative">
                <input
                  type={method === "phone" ? "tel" : "email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={method === "phone" ? "۰۹۱۲۱۲۳۴۵۶۷" : "example@email.com"}
                  className="w-full h-12 pr-12 pl-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  dir={method === "phone" ? "ltr" : "rtl"}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  {method === "phone" ? <Phone className="w-4 h-4 text-muted" /> : <Mail className="w-4 h-4 text-muted" />}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full h-12 pr-12 pl-12 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-muted" />
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-muted-foreground">مرا به خاطر بسپار</span>
              </label>
              <button type="button" className="text-primary hover:text-primary-hover transition-colors">
                فراموشی رمز عبور
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              ورود
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">یا</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* OTP option */}
          <button className="w-full h-12 border border-border hover:bg-surface-hover text-foreground rounded-xl text-sm font-medium transition-colors">
            ورود با کد یکبار مصرف (OTP)
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-muted mt-6">
          حساب کاربری ندارید؟{" "}
          <Link href="/auth/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
