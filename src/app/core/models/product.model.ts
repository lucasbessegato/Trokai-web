import { User } from "./user.model";

export enum ProductStatus {
  AVAILABLE = 'available',
  RESERVED  = 'reserved',
  EXCHANGED = 'exchanged'
}

export interface ProductImage {
  id?: number;
  url: string;
  isMain: boolean;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  images?: ProductImage[];         // todas as imagens
  category: Category;              // relacionamento com Category
  user: User;                      // relacionamento com User (dono)
  acceptableExchanges: string[];
  status: ProductStatus;
  created_at: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}