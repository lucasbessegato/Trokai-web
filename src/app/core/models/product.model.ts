import { User } from "./user.model";

export enum ProductStatus {
  AVAILABLE = 'available',
  RESERVED  = 'reserved',
  EXCHANGED = 'exchanged'
}

export interface ProductImage {
  id?: number;
  url: string;
  is_main: boolean;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  images?: ProductImage[];         // todas as imagens
  category: any;              // relacionamento com Category
  user: User;                      // relacionamento com User (dono)
  acceptable_exchanges: string[];
  status: ProductStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}