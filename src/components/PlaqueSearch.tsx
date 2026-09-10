"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { plaqueLetters } from "@/lib/data";

export default function PlaqueSearch({ onSearch }: { onSearch?: (plaque: string) => void }) {
  const [digits1, setDigits1] = useState("");
  const [letter, setLetter] = useState("");
  const [digits2, setDigits2] = useState("");
  const [regionCode, setRegionCode] = useState("");

  const handleSearch = () => {
    const plaque = `${digits1} ${letter} ${digits2} - ${regionCode}`;
    onSearch?.(plaque);
  };

  const handleClear = () => {
    setDigits1("");
    setLetter("");
    setDigits2("");
    setRegionCode("");
    onSearch?.("");
  };

  const isValid = digits1.length === 2 && letter && digits2.length === 3 && regionCode.length === 2;

  return (
    <div className="bg-surface-elevated rounded-2xl border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Search className="w-4 h-4 text-accent" />
        </div>
        <h3 className="font-bold text-sm">جستجو با پلاک خودرو</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        شماره پلاک خودرو را وارد کنید تا قطعات سازگار با خودروی شما نمایش داده شود.
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {/* 2 digits */}
        <input
          type="text"
          maxLength={2}
          value={digits1}
          onChange={(e) => setDigits1(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="۱۲"
          className="w-14 h-12 text-center rounded-xl bg-background border border-border text-foreground text-lg font-bold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />

        {/* Letter */}
        <select
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          className="h-12 px-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent appearance-none cursor-pointer min-w-[60px]"
        >
          <option value="">ح</option>
          {plaqueLetters.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* 3 digits */}
        <input
          type="text"
          maxLength={3}
          value={digits2}
          onChange={(e) => setDigits2(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="۳۴۵"
          className="w-[72px] h-12 text-center rounded-xl bg-background border border-border text-foreground text-lg font-bold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />

        <div className="w-px h-6 bg-border" />

        {/* Region code */}
        <input
          type="text"
          maxLength={2}
          value={regionCode}
          onChange={(e) => setRegionCode(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="۱۱"
          className="w-14 h-12 text-center rounded-xl bg-background border border-border text-foreground text-lg font-bold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <span className="text-xs text-muted">ایران</span>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={!isValid}
          className="h-12 px-5 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          جستجو
        </button>

        {/* Clear */}
        {(digits1 || letter || digits2 || regionCode) && (
          <button
            onClick={handleClear}
            className="h-12 px-3 rounded-xl bg-surface-hover hover:bg-border text-muted text-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
