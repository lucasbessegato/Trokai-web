import { User } from "./user.model";

export interface Notification {
  id: number;
  user: User;                      // relacionamento com User
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  linkTo?: string;
  relatedId?: number;
}


export enum NotificationType {
  NEW_PROPOSAL = 'new_proposal',
  PROPOSAL_ACCEPTED = 'proposal_accepted',
  PROPOSAL_REJECTED = 'proposal_rejected',
  EXCHANGE_COMPLETED = 'exchange_completed',
  NEW_RATING = 'new_rating',
  LEVEL_UP = 'level_up',
  SYSTEM = 'system',
  GENERAL = 'general'
}
