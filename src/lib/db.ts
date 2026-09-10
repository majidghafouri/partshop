import "server-only";
import { prisma } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { Product, Category, CarBrand, CarModel, FilterState, SellerProfile } from "./types";

const productInclude = {
  category: true,
  seller: true,
  images: { orderBy: { order: "asc" as const } },
  compatibleCars: {
    include: {
      carModel: {
        include: { brand: true },
      },
    },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export async function getCategories(): Promise<Category[]> {
  const dbCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: { _count: { select: { products: true } } },
      },
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon ?? undefined,
    productCount: c._count.products,
    children: c.children.map((ch) => ({
      id: ch.id,
      name: ch.name,
      slug: ch.slug,
      parentId: ch.parentId ?? undefined,
      productCount: ch._count.products,
    })),
  }));
}

export async function getCarBrands(): Promise<CarBrand[]> {
  const dbBrands = await prisma.carBrand.findMany({
    include: { _count: { select: { models: true } } },
    orderBy: { name: "asc" },
  });

  return dbBrands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo ?? undefined,
    country: b.country ?? undefined,
    modelCount: b._count.models,
  }));
}

export async function getCarModels(): Promise<CarModel[]> {
  const dbModels = await prisma.carModel.findMany({
    include: { brand: true },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });

  return dbModels.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    yearStart: m.yearStart ?? undefined,
    yearEnd: m.yearEnd ?? undefined,
    brand: {
      id: m.brand.id,
      name: m.brand.name,
      slug: m.brand.slug,
      country: m.brand.country ?? undefined,
    },
  }));
}

export async function getProducts(
  filters?: FilterState,
  sort?: string,
  page = 1,
  limit = 20
): Promise<{ products: Product[]; total: number }> {
  const where: Prisma.ProductWhereInput = { active: true };
  const orClauses: Prisma.ProductWhereInput[] = [];

  if (filters?.category) {
    const cat = await prisma.category.findUnique({
      where: { slug: filters.category },
      select: { id: true, parentId: true },
    });
    if (cat) {
      if (cat.parentId) {
        where.categoryId = cat.id;
      } else {
        // parent category: include it and its subcategories
        const children = await prisma.category.findMany({
          where: { parentId: cat.id },
          select: { id: true },
        });
        where.category = { id: { in: [cat.id, ...children.map((c) => c.id)] } };
      }
    } else {
      where.category = { slug: filters.category };
    }
  }

  // Car model + year compatibility
  if (filters?.carModel) {
    const modelCond: Prisma.ProductCarWhereInput = { carModel: { slug: filters.carModel } };
    if (filters?.carYear) {
      modelCond.yearFrom = { lte: filters.carYear };
      modelCond.yearTo = { gte: filters.carYear };
      // year given: only ProductCar entries (with year bounds) can confirm compatibility
      orClauses.push({ compatibleCars: { some: modelCond } });
    } else {
      orClauses.push({ compatibleCars: { some: modelCond } }, { carModel: { slug: filters.carModel } });
    }
  } else if (filters?.brand) {
    orClauses.push(
      { compatibleCars: { some: { carModel: { brand: { slug: filters.brand } } } } },
      { carModel: { brand: { slug: filters.brand } } }
    );
  }
  if (filters?.condition) {
    where.condition = filters.condition as Product["condition"];
  }
  if (filters?.city) {
    where.seller = { city: filters.city };
  }
  if (filters?.seller) {
    where.seller = { ...(where.seller as Prisma.SellerProfileWhereInput), id: filters.seller };
  }
  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    where.price = {
      ...(filters.priceMin !== undefined ? { gte: filters.priceMin } : {}),
      ...(filters.priceMax !== undefined ? { lte: filters.priceMax } : {}),
    };
  }
  if (filters?.search) {
    orClauses.push(
      { title: { contains: filters.search, mode: "insensitive" } },
      { brand: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } }
    );
  }
  if (orClauses.length > 0) {
    where.OR = orClauses;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case "cheapest":
        return { price: "asc" };
      case "expensive":
        return { price: "desc" };
      case "popular":
        return { salesCount: "desc" };
      case "rated":
        return { rating: "desc" };
      default:
        return { createdAt: "desc" };
    }
  })();

  const [dbProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: dbProducts.map(mapDbProduct),
    total,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  if (!dbProduct) return null;
  return mapDbProduct(dbProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!dbProduct) return null;
  return mapDbProduct(dbProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: productInclude,
    orderBy: { salesCount: "desc" },
    take: 10,
  });
  return dbProducts.map(mapDbProduct);
}

export async function getLatestProducts(limit = 10): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return dbProducts.map(mapDbProduct);
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { sellerId },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return dbProducts.map(mapDbProduct);
}

export async function getFirstSellerProfile(): Promise<SellerProfile | null> {
  const seller = await prisma.sellerProfile.findFirst({
    orderBy: { totalSales: "desc" },
  });
  if (!seller) return null;
  return {
    id: seller.id,
    shopName: seller.shopName,
    description: seller.description ?? undefined,
    logo: seller.logo ?? undefined,
    rating: seller.rating,
    totalSales: seller.totalSales,
    verified: seller.verified,
    city: seller.city ?? undefined,
  };
}

export async function getSellerStats(sellerId: string): Promise<{
  totalSales: number;
  activeProducts: number;
  totalStock: number;
}> {
  const [activeProducts, stockAgg] = await Promise.all([
    prisma.product.count({ where: { sellerId, active: true } }),
    prisma.product.aggregate({
      where: { sellerId },
      _sum: { stock: true, salesCount: true },
    }),
  ]);
  return {
    totalSales: stockAgg._sum.salesCount ?? 0,
    activeProducts,
    totalStock: stockAgg._sum.stock ?? 0,
  };
}

export async function createProduct(data: {
  title: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  condition?: string;
  brand?: string;
  origin?: string;
  warranty?: string;
  partNumber?: string;
  oemNumber?: string;
  categoryId: string;
  sellerId: string;
  stock: number;
  carModelId?: string;
  yearFrom?: number;
  yearTo?: number;
  featured?: boolean;
}) {
  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      condition: (data.condition as Product["condition"]) || "NEW",
      brand: data.brand,
      origin: data.origin,
      warranty: data.warranty,
      partNumber: data.partNumber,
      oemNumber: data.oemNumber,
      categoryId: data.categoryId,
      sellerId: data.sellerId,
      stock: data.stock,
      carModelId: data.carModelId,
      featured: data.featured ?? false,
    },
  });

  if (data.carModelId) {
    const model = await prisma.carModel.findUnique({
      where: { id: data.carModelId },
      select: { yearStart: true, yearEnd: true },
    });
    await prisma.productCar.create({
      data: {
        productId: product.id,
        carModelId: data.carModelId,
        yearFrom: data.yearFrom ?? model?.yearStart ?? undefined,
        yearTo: data.yearTo ?? model?.yearEnd ?? undefined,
      },
    });
  }

  return product;
}

export async function createUser(data: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role?: string;
  city?: string;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: (data.role as "BUYER" | "SELLER" | "ADMIN") || "BUYER",
      city: data.city,
    },
  });
}

export async function createSellerProfile(
  userId: string,
  data: {
    shopName: string;
    description?: string;
    city?: string;
    address?: string;
  }
) {
  return prisma.sellerProfile.create({
    data: {
      userId,
      shopName: data.shopName,
      description: data.description,
      city: data.city,
      address: data.address,
    },
  });
}

export async function createOrder(data: {
  userId: string;
  totalAmount: number;
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  description?: string;
  items: { productId: string; quantity: number; price: number }[];
}) {
  return prisma.order.create({
    data: {
      userId: data.userId,
      totalAmount: data.totalAmount,
      shippingAddress: data.shippingAddress,
      city: data.city,
      postalCode: data.postalCode,
      phone: data.phone,
      description: data.description,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });
}

export async function addToCart(userId: string, productId: string, quantity = 1) {
  return prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });
}

export async function getCartItems(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: productInclude,
      },
    },
    orderBy: { id: "asc" },
  });
}

export async function getCartCount(userId: string): Promise<number> {
  const agg = await prisma.cartItem.aggregate({
    where: { userId },
    _sum: { quantity: true },
  });
  return agg._sum.quantity ?? 0;
}

export async function setCartQuantity(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) {
    await removeFromCart(userId, productId);
    return null;
  }
  return prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity },
    create: { userId, productId, quantity },
  });
}

export async function removeFromCart(userId: string, productId: string) {
  return prisma.cartItem.deleteMany({
    where: { userId, productId },
  });
}

export function mapDbProduct(p: ProductWithRelations): Product {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description ?? undefined,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    currency: p.currency,
    condition: p.condition,
    partNumber: p.partNumber ?? undefined,
    oemNumber: p.oemNumber ?? undefined,
    brand: p.brand ?? undefined,
    origin: p.origin ?? undefined,
    warranty: p.warranty ?? undefined,
    stock: p.stock,
    salesCount: p.salesCount,
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.featured,
    createdAt: p.createdAt,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
      icon: p.category.icon ?? undefined,
    },
    seller: {
      id: p.seller.id,
      shopName: p.seller.shopName,
      description: p.seller.description ?? undefined,
      logo: p.seller.logo ?? undefined,
      rating: p.seller.rating,
      totalSales: p.seller.totalSales,
      verified: p.seller.verified,
      city: p.seller.city ?? undefined,
    },
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? undefined,
      primary: img.primary,
    })),
    compatibleCars: p.compatibleCars.map((pc) => ({
      carModel: {
        id: pc.carModel.id,
        name: pc.carModel.name,
        slug: pc.carModel.slug,
        yearStart: pc.carModel.yearStart ?? undefined,
        yearEnd: pc.carModel.yearEnd ?? undefined,
        brand: {
          id: pc.carModel.brand.id,
          name: pc.carModel.brand.name,
          slug: pc.carModel.brand.slug,
          country: pc.carModel.brand.country ?? undefined,
        },
      },
      yearFrom: pc.yearFrom ?? undefined,
      yearTo: pc.yearTo ?? undefined,
    })),
  };
}
