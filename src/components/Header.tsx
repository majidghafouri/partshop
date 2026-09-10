"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Store,
  Package,
} from "lucide-react";
import { categories } from "@/lib/data";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-md bg-opacity-95">
      {/* Top bar */}
      <div className="bg-primary/10 border-b border-border text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span>فروشندگان عزیز می‌توانند محصولات خود را اینجا ثبت کنند</span>
            <Link href="/seller/dashboard" className="text-primary hover:text-primary-hover font-medium">
              فروش در مکان
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
              م
            </div>
            <span className="text-xl font-bold hidden sm:block">مکان</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی قطعات خودرو، لنت، فیلتر، باتری..."
                className="w-full h-12 pr-12 pl-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <button className="absolute left-1 top-1/2 -translate-y-1/2 h-10 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors">
                جستجو
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl hover:bg-surface-hover transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                ۳
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-surface-hover transition-colors text-sm"
            >
              <User className="w-5 h-5" />
              <span>ورود | ثبت‌نام</span>
            </Link>
            <Link
              href="/seller/dashboard"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <Store className="w-5 h-5" />
              <span>فروشگاه من</span>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-surface-hover transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categories nav */}
        <nav className="hidden md:flex items-center gap-1 mt-3 overflow-x-auto pb-1">
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-surface-hover transition-colors text-sm whitespace-nowrap">
              <Menu className="w-4 h-4" />
              همه دسته‌بندی‌ها
              <ChevronDown className="w-3 h-3" />
            </button>
            {categoriesOpen && (
              <div className="absolute top-full right-0 w-64 bg-surface-elevated border border-border rounded-xl shadow-2xl py-2 mt-1 animate-fade-in z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/browse?category=${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors text-sm"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="mr-auto text-xs text-muted">{cat.productCount}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="h-4 w-px bg-border" />
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.slug}`}
              className="px-3 py-1.5 rounded-lg hover:bg-surface-hover transition-colors text-sm whitespace-nowrap text-muted-foreground hover:text-foreground"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-elevated border-t border-border animate-slide-down">
          <div className="p-4 space-y-2">
            <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors">
              <User className="w-5 h-5" />
              <span>ورود | ثبت‌نام</span>
            </Link>
            <Link href="/seller/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors">
              <Store className="w-5 h-5" />
              <span>فروشگاه من</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span>سبد خرید</span>
            </Link>
            <div className="border-t border-border pt-2 mt-2">
              <p className="px-4 py-2 text-xs text-muted font-medium">دسته‌بندی‌ها</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/browse?category=${cat.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-surface-hover transition-colors text-sm"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
