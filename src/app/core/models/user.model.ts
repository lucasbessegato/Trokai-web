import { Product } from "./product.model";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  reputation_level: number;
  reputation_score: number;
  created_at: Date;
  city?: string;
  state?: string;
  phone?: string;
  products?: Product[];
  password?: string;
}
export interface UserRating {
  id: number;
  fromUser: User;                  // relacionamento com User
  toUser: User;                    // relacionamento com User
  rating: number;                  // 1–5
  comment: string;
  created_at: Date;
}
