import { Product } from "./product.model";
import { User } from "./user.model";

export enum ProposalStatus {
  PENDING   = 'pending',
  ACCEPTED  = 'accepted',
  REJECTED  = 'rejected',
  COMPLETED = 'completed',
  CANCELED  = 'canceled'
}

export interface Proposal {
  id: number;
  productOffered: Product;         // relacionamento com Product
  productRequested: Product;       // relacionamento com Product
  fromUser: User;                  // relacionamento com User
  toUser: User;                    // relacionamento com User
  message: string;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
}