import type { Metadata } from "next";
import "./globals.css";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "پارت شاپ | بازار آنلاین لوازم یدکی خودرو",
  description: "خرید و فروش لوازم یدکی خودرو با ضمانت اصالت کالا. قطعات موتوری، بدنه، ترمز، برقی و تمامی لوازم یدکی خودروهای ایرانی و خارجی.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
        <HeaderServer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
