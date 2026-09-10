export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  condition: "NEW" | "USED" | "REFURBISHED";
  partNumber?: string;
  oemNumber?: string;
  brand?: string;
  origin?: string;
  warranty?: string;
  category: Category;
  carModel?: CarModel;
  seller: SellerProfile;
  stock: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  images: ProductImage[];
  compatibleCars?: ProductCar[];
  createdAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  primary: boolean;
}

export interface ProductCar {
  carModel: CarModel;
  yearFrom?: number;
  yearTo?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
}

export interface CarBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  country?: string;
  models?: CarModel[];
  modelCount?: number;
}

export interface CarModel {
  id: string;
  name: string;
  slug: string;
  brand: CarBrand;
  yearStart?: number;
  yearEnd?: number;
}

export interface SellerProfile {
  id: string;
  shopName: string;
  description?: string;
  logo?: string;
  rating: number;
  totalSales: number;
  verified: boolean;
  city?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userName: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface FilterState {
  category?: string;
  subcategory?: string;
  brand?: string;
  carModel?: string;
  carYear?: number;
  yearFrom?: number;
  yearTo?: number;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  city?: string;
  seller?: string;
  sort?: string;
  search?: string;
  plaque?: string;
}

export interface PlaqueInfo {
  digits1: string;
  letter: string;
  digits2: string;
  regionCode: string;
}
