import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  console.log("  Creating categories...");
  const categoryData = [
    { name: "قطعات موتوری", slug: "engine-parts", icon: "⚙️" },
    { name: "سیستم ترمز", slug: "brake-system", icon: "🛑" },
    { name: "قطعات بدنه", slug: "body-parts", icon: "🚗" },
    { name: "چراغ و روشنایی", slug: "lighting", icon: "💡" },
    { name: "جلوبندی و تعلیق", slug: "suspension", icon: "🔧" },
    { name: "لوازم برقی", slug: "electrical", icon: "⚡" },
    { name: "لاستیک و رینگ", slug: "tires-rims", icon: "🛞" },
    { name: "فیلتر و صافی", slug: "filters", icon: "🔄" },
    { name: "روغن و مایعات", slug: "oils-fluids", icon: "🛢️" },
    { name: "لوازم جانبی", slug: "accessories", icon: "📱" },
    { name: "سیستم فرمان", slug: "steering", icon: "🎯" },
    { name: "گیربکس و انتقال قدرت", slug: "transmission", icon: "⚙️" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    });
    categories[cat.slug] = result.id;
  }

  // Subcategories
  console.log("  Creating subcategories...");
  const subCategoryData: Record<string, { name: string; slug: string }[]> = {    "engine-parts": [
      { name: "فیلتر روغن", slug: "oil-filter" },
      { name: "فیلتر هوا", slug: "air-filter" },
      { name: "شمع موتور", slug: "spark-plug" },
      { name: "تسمه تایم", slug: "timing-belt" },
      { name: "واتر پمپ", slug: "water-pump" },
      { name: "رادیاتور", slug: "radiator" },
    ],
    "brake-system": [
      { name: "لنت ترمز", slug: "brake-pad" },
      { name: "دیسک ترمز", slug: "brake-disc" },
      { name: "سیلندر ترمز", slug: "brake-cylinder" },
      { name: "لاک ترمز", slug: "brake-fluid" },
    ],
    "body-parts": [
      { name: "سپر", slug: "bumper" },
      { name: "گلگیر", slug: "fender" },
      { name: "درب جانبی", slug: "door" },
      { name: "آینه بغل", slug: "side-mirror" },
      { name: "جلوپنجره", slug: "grille" },
      { name: "کاپوت", slug: "hood" },
    ],
    "lighting": [
      { name: "چراغ جلو", slug: "headlight" },
      { name: "چراغ عقب", slug: "taillight" },
      { name: "دیلایت", slug: "daytime-light" },
      { name: "مه شکن", slug: "fog-light" },
    ],
    suspension: [
      { name: "کمک فنر", slug: "shock-absorber" },
      { name: "طبق", slug: "control-arm" },
      { name: "سیبک", slug: "ball-joint" },
      { name: "میل تعادل", slug: "sway-bar" },
    ],
  };

  for (const [parentSlug, subs] of Object.entries(subCategoryData)) {
    const parentId = categories[parentSlug];
    for (const sub of subs) {
      const result = await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, parentId },
        create: { name: sub.name, slug: sub.slug, parentId },
      });
      categories[sub.slug] = result.id;
    }
  }

  // Car brands
  console.log("  Creating car brands...");
  const brandData = [
    { name: "پژو", slug: "peugeot", country: "فرانسه" },
    { name: "ایران خودرو", slug: "ikco", country: "ایران" },
    { name: "سایپا", slug: "saipa", country: "ایران" },
    { name: "تویوتا", slug: "toyota", country: "ژاپن" },
    { name: "هیوندای", slug: "hyundai", country: "کره جنوبی" },
    { name: "کیا", slug: "kia", country: "کره جنوبی" },
    { name: "MVM", slug: "mvm", country: "چین" },
    { name: "چری", slug: "chery", country: "چین" },
    { name: "فوتون", slug: "foton", country: "چین" },
    { name: "KMC", slug: "kmc", country: "ایران" },
  ];

  const brands: Record<string, string> = {};
  for (const brand of brandData) {
    const result = await prisma.carBrand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name, country: brand.country },
      create: brand,
    });
    brands[brand.slug] = result.id;
  }

  // Car models
  console.log("  Creating car models...");
  const modelData = [
    { name: "پراید ۱۳۱", slug: "pride-131", brandSlug: "saipa", yearStart: 2005, yearEnd: 2024 },
    { name: "پراید ۱۱۱", slug: "pride-111", brandSlug: "saipa", yearStart: 2008, yearEnd: 2024 },
    { name: "پژو ۲۰۶", slug: "peugeot-206", brandSlug: "peugeot", yearStart: 2001, yearEnd: 2024 },
    { name: "سمند", slug: "samand", brandSlug: "ikco", yearStart: 2002, yearEnd: 2024 },
    { name: "پژو ۴۰۵", slug: "peugeot-405", brandSlug: "peugeot", yearStart: 1995, yearEnd: 2024 },
    { name: "تیبا", slug: "tiba", brandSlug: "saipa", yearStart: 2009, yearEnd: 2024 },
    { name: "ساینا", slug: "saina", brandSlug: "saipa", yearStart: 2015, yearEnd: 2024 },
    { name: "کوییک", slug: "quick", brandSlug: "saipa", yearStart: 2020, yearEnd: 2024 },
    { name: "دنگ فنگ", slug: "dfo", brandSlug: "kmc", yearStart: 2018, yearEnd: 2024 },
    { name: "KMC J7", slug: "kmc-j7", brandSlug: "kmc", yearStart: 2022, yearEnd: 2024 },
  ];

  const models: Record<string, string> = {};
  for (const model of modelData) {
    const result = await prisma.carModel.upsert({
      where: { slug: model.slug },
      update: { name: model.name, yearStart: model.yearStart, yearEnd: model.yearEnd },
      create: {
        name: model.name,
        slug: model.slug,
        brandId: brands[model.brandSlug],
        yearStart: model.yearStart,
        yearEnd: model.yearEnd,
      },
    });
    models[model.slug] = result.id;
  }

  // Users & seller profiles
  console.log("  Creating users and seller profiles...");
  const sellerData = [
    { name: "علی رضایی", email: "ali@parsian.ir", shopName: "قطعات یدکی پارسیان", city: "تهران", rating: 4.8, totalSales: 1250, verified: true },
    { name: "رضا حسینی", email: "reza@rad.ir", shopName: "فروشگاه آنلاین راد", city: "اصفهان", rating: 4.6, totalSales: 890, verified: true },
    { name: "مریم احمدی", email: "meryam@market.ir", shopName: "یدک مارکت", city: "تهران", rating: 4.9, totalSales: 2100, verified: true },
    { name: "محمد کریمی", email: "mohammad@kargah.ir", shopName: "قطعات خودرو کارگاه", city: "مشهد", rating: 4.3, totalSales: 450, verified: false },
    { name: "سارا محمدی", email: "sara@parstirek.ir", shopName: "پارستیدک", city: "تبریز", rating: 4.7, totalSales: 1680, verified: true },
  ];

  const sellerIds: string[] = [];
  for (const s of sellerData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, role: "SELLER", city: s.city },
      create: {
        name: s.name,
        email: s.email,
        password: "$2b$10$placeholder", // placeholder hash
        role: "SELLER",
        city: s.city,
      },
    });

    const profile = await prisma.sellerProfile.upsert({
      where: { userId: user.id },
      update: {
        shopName: s.shopName,
        rating: s.rating,
        totalSales: s.totalSales,
        verified: s.verified,
        city: s.city,
      },
      create: {
        userId: user.id,
        shopName: s.shopName,
        rating: s.rating,
        totalSales: s.totalSales,
        verified: s.verified,
        city: s.city,
      },
    });
    sellerIds.push(profile.id);
  }

  // Products
  console.log("  Creating products...");
  const productData = [
    {
      title: "لنت ترمز جلو پراید امکو",
      slug: "prayad-front-brake-pad-omco",
      description: "لنت ترمز جلو خودرو پراید برند امکو با کیفیت بالا و عمر طولانی. مناسب برای پراید ۱۳۱، ۱۳۲، ۱۱۱ و سایر مدل‌ها.",
      price: 1245000,
      originalPrice: 1450000,
      condition: "NEW" as const,
      brand: "امکو",
      origin: "ایران",
      warranty: "۶ ماه",
      categorySlug: "brake-pad",
      sellerIndex: 0,
      stock: 45,
      salesCount: 320,
      rating: 4.5,
      reviewCount: 89,
      featured: true,
      images: [
        { url: "/placeholder/brake-pad-1.jpg", alt: "لنت ترمز جلو پراید", primary: true, order: 0 },
        { url: "/placeholder/brake-pad-2.jpg", alt: "لنت ترمز جلو پراید - نمای جانبی", primary: false, order: 1 },
      ],
      compatibleCars: [
        { modelSlug: "pride-131", yearFrom: 2005, yearTo: 2024 },
        { modelSlug: "pride-111", yearFrom: 2008, yearTo: 2024 },
      ],
    },
    {
      title: "باتری خودرو صبا باتری واریان ۶۰ آمپر",
      slug: "saba-battery-variant-60ah",
      description: "باتری خودرو صبا باتری مدل واریان با ظرفیت ۶۰ آمپر ساعت. مناسب برای خودروهای پراید، تیبا، ساینا و ۲۰۶.",
      price: 4174000,
      condition: "NEW" as const,
      brand: "صبا باتری",
      origin: "ایران",
      warranty: "۱۸ ماه",
      categorySlug: "electrical",
      sellerIndex: 2,
      stock: 30,
      salesCount: 890,
      rating: 4.7,
      reviewCount: 234,
      featured: true,
      images: [{ url: "/placeholder/battery-1.jpg", alt: "باتری صبا واریان", primary: true, order: 0 }],
      compatibleCars: [],
    },
    {
      title: "لاستیک بارز مدل P648 سایز ۱۸۵/۶۵R۱۴ چهارفصل",
      slug: "barez-p648-185-65r14",
      description: "لاستیک خودرو بارز مدل P648 با سایز ۱۸۵/۶۵R۱۴ چهار فصل. مناسب برای پژو ۲۰۶، پارس و سمند.",
      price: 7950000,
      originalPrice: 8500000,
      condition: "NEW" as const,
      brand: "بارز",
      origin: "ایران",
      warranty: "۴۸ ماه",
      categorySlug: "tires-rims",
      sellerIndex: 0,
      stock: 15,
      salesCount: 450,
      rating: 4.6,
      reviewCount: 178,
      featured: true,
      images: [{ url: "/placeholder/tire-1.jpg", alt: "لاستیک بارز", primary: true, order: 0 }],
      compatibleCars: [
        { modelSlug: "peugeot-206", yearFrom: 2001, yearTo: 2024 },
        { modelSlug: "samand", yearFrom: 2002, yearTo: 2024 },
      ],
    },
    {
      title: "دیسک و صفحه پراید والئو",
      slug: "pride-clutch-disc-valeo",
      description: "دیسک و صفحه کلاچ پراید برند والئو اصل فرانسه. مناسب برای تمامی مدل‌های پراید.",
      price: 8200000,
      condition: "NEW" as const,
      brand: "والئو",
      origin: "فرانسه",
      warranty: "۱۲ ماه",
      categorySlug: "transmission",
      sellerIndex: 1,
      stock: 22,
      salesCount: 670,
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      images: [{ url: "/placeholder/clutch-1.jpg", alt: "دیسک و صفحه پراید", primary: true, order: 0 }],
      compatibleCars: [],
    },
    {
      title: "هدلایت M8 Pro کانکس پایه H1",
      slug: "headlight-m8-pro-h1",
      description: "هدلایت LED مدل M8 Pro با شدت نور ۱۲۰۰۰۰ لومن. نصب آسان بدون نیاز به تغییر سیم‌کشی.",
      price: 1840000,
      condition: "NEW" as const,
      brand: "کانکس",
      origin: "چین",
      warranty: "۱۲ ماه",
      categorySlug: "lighting",
      sellerIndex: 2,
      stock: 80,
      salesCount: 1200,
      rating: 4.4,
      reviewCount: 310,
      featured: true,
      images: [{ url: "/placeholder/headlight-1.jpg", alt: "هدلایت M8 Pro", primary: true, order: 0 }],
      compatibleCars: [],
    },
    {
      title: "فیلتر روغن پراید فیکس",
      slug: "pride-oil-filter-fix",
      description: "فیلتر روغن خودرو پراید برند فیکس. تصفیه عالی روغن موتور و افزایش عمر موتور.",
      price: 320000,
      originalPrice: 380000,
      condition: "NEW" as const,
      brand: "فیکس",
      origin: "ایران",
      warranty: "۶ ماه",
      categorySlug: "oil-filter",
      sellerIndex: 0,
      stock: 200,
      salesCount: 2100,
      rating: 4.3,
      reviewCount: 420,
      featured: false,
      images: [{ url: "/placeholder/filter-1.jpg", alt: "فیلتر روغن پراید", primary: true, order: 0 }],
      compatibleCars: [],
    },
    {
      title: "کمک فنر جلو سمند",
      slug: "samand-front-shock-absorber",
      description: "کمک فنر جلو خودرو سمند مناسب برای سمند LX و EF7. کیفیت بالا و نصب آسان.",
      price: 1850000,
      condition: "NEW" as const,
      brand: "کاییان",
      origin: "ایران",
      warranty: "۱۲ ماه",
      categorySlug: "shock-absorber",
      sellerIndex: 3,
      stock: 35,
      salesCount: 280,
      rating: 4.5,
      reviewCount: 67,
      featured: false,
      images: [{ url: "/placeholder/shock-1.jpg", alt: "کمک فنر جلو سمند", primary: true, order: 0 }],
      compatibleCars: [{ modelSlug: "samand", yearFrom: 2002, yearTo: 2024 }],
    },
    {
      title: "روغن موتور بهران ۱۰W-40 حجم ۴ لیتر",
      slug: "bahrain-engine-oil-10w40-4l",
      description: "روغن موتور بهران با گرانروی ۱۰W-40 و حجم ۴ لیتر. مناسب برای اکثر خودروهای سواری.",
      price: 680000,
      condition: "NEW" as const,
      brand: "بهران",
      origin: "ایران",
      warranty: "اصالت کالا",
      categorySlug: "oils-fluids",
      sellerIndex: 2,
      stock: 100,
      salesCount: 1800,
      rating: 4.6,
      reviewCount: 530,
      featured: false,
      images: [{ url: "/placeholder/oil-1.jpg", alt: "روغن موتور بهران", primary: true, order: 0 }],
      compatibleCars: [],
    },
    {
      title: "سپر جلو پژو ۲۰۶",
      slug: "peugeot-206-front-bumper",
      description: "سپر جلو خودرو پژو ۲۰۶ رنگ مشکی. ساخته شده از پلاستیک ABS با کیفیت بالا.",
      price: 3200000,
      condition: "NEW" as const,
      brand: "Aftermarket",
      origin: "ایران",
      warranty: "۳ ماه",
      categorySlug: "bumper",
      sellerIndex: 4,
      stock: 12,
      salesCount: 180,
      rating: 4.2,
      reviewCount: 45,
      featured: false,
      images: [{ url: "/placeholder/bumper-1.jpg", alt: "سپر جلو پژو ۲۰۶", primary: true, order: 0 }],
      compatibleCars: [{ modelSlug: "peugeot-206", yearFrom: 2001, yearTo: 2024 }],
    },
    {
      title: "لاستیک کویرتایر مدل KB26 سایز ۱۶۵/۶۵R۱۳ چهارفصل",
      slug: "kavir-tire-kb26-165-65r13",
      description: "لاستیک خودرو کویرتایر مدل KB26 سایز ۱۶۵/۶۵R۱۳ چهار فصل. مناسب برای پراید.",
      price: 5425000,
      condition: "NEW" as const,
      brand: "کویر تایر",
      origin: "ایران",
      warranty: "۴۸ ماه",
      categorySlug: "tires-rims",
      sellerIndex: 1,
      stock: 20,
      salesCount: 340,
      rating: 4.4,
      reviewCount: 98,
      featured: false,
      images: [{ url: "/placeholder/tire-2.jpg", alt: "لاستیک کویرتایر", primary: true, order: 0 }],
      compatibleCars: [{ modelSlug: "pride-131", yearFrom: 2005, yearTo: 2024 }],
    },
    {
      title: "شمع پراید NGK",
      slug: "pride-spark-plug-ngk",
      description: "شمع خودرو پراید برند NGK ژاپن. احتراق بهتر و کاهش مصرف سوخت.",
      price: 180000,
      condition: "NEW" as const,
      brand: "NGK",
      origin: "ژاپن",
      warranty: "۶ ماه",
      categorySlug: "spark-plug",
      sellerIndex: 0,
      stock: 150,
      salesCount: 2400,
      rating: 4.7,
      reviewCount: 560,
      featured: false,
      images: [{ url: "/placeholder/spark-plug-1.jpg", alt: "شمع NGK پراید", primary: true, order: 0 }],
      compatibleCars: [],
    },
    {
      title: "رادیاتور آب پژو ۴۰۵",
      slug: "peugeot-405-water-radiator",
      description: "رادیاتور آب خودرو پژو ۴۰۵. خنک‌کاری عالی موتور با جنس آلومینیوم اصل.",
      price: 2900000,
      originalPrice: 3200000,
      condition: "NEW" as const,
      brand: "تکنو",
      origin: "ایران",
      warranty: "۱۲ ماه",
      categorySlug: "radiator",
      sellerIndex: 2,
      stock: 18,
      salesCount: 420,
      rating: 4.5,
      reviewCount: 110,
      featured: false,
      images: [{ url: "/placeholder/radiator-1.jpg", alt: "رادیاتور آب پژو ۴۰۵", primary: true, order: 0 }],
      compatibleCars: [{ modelSlug: "peugeot-405", yearFrom: 1995, yearTo: 2024 }],
    },
  ];

  for (const p of productData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        condition: p.condition,
        brand: p.brand,
        origin: p.origin,
        warranty: p.warranty,
        stock: p.stock,
        salesCount: p.salesCount,
        rating: p.rating,
        reviewCount: p.reviewCount,
        featured: p.featured,
      },
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        condition: p.condition,
        brand: p.brand,
        origin: p.origin,
        warranty: p.warranty,
        categoryId: categories[p.categorySlug] || categories["engine-parts"],
        sellerId: sellerIds[p.sellerIndex],
        stock: p.stock,
        salesCount: p.salesCount,
        rating: p.rating,
        reviewCount: p.reviewCount,
        featured: p.featured,
      },
    });

    // Images
    for (const img of p.images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          alt: img.alt,
          primary: img.primary,
          order: img.order,
        },
      });
    }

    // Compatible cars
    for (const cc of p.compatibleCars) {
      const modelId = models[cc.modelSlug];
      if (modelId) {
        await prisma.productCar.upsert({
          where: { productId_carModelId: { productId: product.id, carModelId: modelId } },
          update: { yearFrom: cc.yearFrom, yearTo: cc.yearTo },
          create: {
            productId: product.id,
            carModelId: modelId,
            yearFrom: cc.yearFrom,
            yearTo: cc.yearTo,
          },
        });
      }
    }
  }

  // Buyer user for testing
  console.log("  Creating test buyer...");
  await prisma.user.upsert({
    where: { email: "buyer@test.com" },
    update: {},
    create: {
      name: "خریدار تست",
      email: "buyer@test.com",
      password: "$2b$10$placeholder",
      role: "BUYER",
      city: "تهران",
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
