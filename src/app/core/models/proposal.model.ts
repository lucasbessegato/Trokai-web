import { Product } from "./product.model";
import { User } from "./user.model";

export enum ProposalStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

export interface Proposal {
  id: number;
  product_offered: Product;
  product_requested: Product;
  from_user: User;
  to_user: User;
  message: string;
  status: ProposalStatus;
  created_at: Date;
  updated_at: Date;
}

export type ProposalType = 'recebidas' | 'enviadas';
