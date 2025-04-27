import { Product } from "./product.model";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  reputationLevel: number;
  reputationScore: number;
  createdAt: Date;
  bio?: string;
  location?: string;
  phone?: string;
  products?: Product[];            // agora a lista completa de produtos, não só IDs
}
export interface UserRating {
  id: number;
  fromUser: User;                  // relacionamento com User
  toUser: User;                    // relacionamento com User
  rating: number;                  // 1–5
  comment: string;
  createdAt: Date;
}
