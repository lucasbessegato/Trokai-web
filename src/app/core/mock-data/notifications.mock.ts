import { Notification, NotificationType } from '../models/notification.model';

export const notificationsMock: Notification[] = [
  {
    id: 1,
    userId: 1,
    type: NotificationType.NEW_PROPOSAL,
    title: 'Nova proposta de troca',
    message: 'Pedro Silva ofereceu um Relógio de Pulso pelo seu Fone de Ouvido Bluetooth',
    read: false,
    created_at: new Date('2023-06-20'),
    relatedId: 1,
    link_to: '/proposals/1'
  },
  {
    id: 2,
    userId: 2,
    type: NotificationType.NEW_PROPOSAL,
    title: 'Nova proposta de troca',
    message: 'Ana Martins ofereceu um Kit de Skincare pelo seu Kit de Maquiagem Novo',
    read: true,
    created_at: new Date('2023-06-22'),
    relatedId: 2,
    link_to: '/proposals/2'
  },
  {
    id: 3,
    userId: 2,
    type: NotificationType.NEW_PROPOSAL,
    title: 'Nova proposta de troca',
    message: 'Lucas Oliveira ofereceu uma Jaqueta Jeans pelo seu Vestido de Festa',
    read: false,
    created_at: new Date('2023-07-02'),
    relatedId: 5,
    link_to: '/proposals/5'
  },
  {
    id: 4,
    userId: 4,
    type: NotificationType.PROPOSAL_ACCEPTED,
    title: 'Proposta aceita',
    message: 'Maria Santos aceitou sua proposta de troca para Kit de Maquiagem Novo',
    read: true,
    created_at: new Date('2023-06-23'),
    relatedId: 2,
    link_to: '/proposals/2'
  },
  {
    id: 5,
    userId: 3,
    type: NotificationType.NEW_PROPOSAL,
    title: 'Nova proposta de troca',
    message: 'Carolina Ferreira ofereceu um Tablet 10 polegadas pelo seu Câmera Digital',
    read: false,
    created_at: new Date('2023-07-05'),
    relatedId: 6,
    link_to: '/proposals/6'
  },
  {
    id: 6,
    userId: 3,
    type: NotificationType.PROPOSAL_ACCEPTED,
    title: 'Proposta aceita',
    message: 'Você aceitou a proposta de troca de Carolina Ferreira',
    read: true,
    created_at: new Date('2023-07-06'),
    relatedId: 6,
    link_to: '/proposals/6'
  },
  {
    id: 7,
    userId: 5,
    type: NotificationType.NEW_PROPOSAL,
    title: 'Nova proposta de troca',
    message: 'John Doe ofereceu uma Raquete de Tênis pelo seu Tênis para Corrida',
    read: false,
    created_at: new Date('2023-06-25'),
    relatedId: 3,
    link_to: '/proposals/3'
  },
  {
    id: 8,
    userId: 1,
    type: NotificationType.PROPOSAL_REJECTED,
    title: 'Proposta recusada',
    message: 'Lucas Oliveira recusou sua proposta de troca para Tênis para Corrida',
    read: true,
    created_at: new Date('2023-06-26'),
    relatedId: 3,
    link_to: '/proposals/3'
  },
  {
    id: 9,
    userId: 4,
    type: NotificationType.NEW_PROPOSAL,
    title: 'Nova proposta de troca',
    message: 'Maria Santos ofereceu uma Luminária de Mesa pelo seu Caderno de Anotações',
    read: true,
    created_at: new Date('2023-06-28'),
    relatedId: 4,
    link_to: '/proposals/4'
  },
  {
    id: 10,
    userId: 4,
    type: NotificationType.EXCHANGE_COMPLETED,
    title: 'Troca concluída',
    message: 'A troca de Kit de Skincare por Kit de Maquiagem Novo foi concluída',
    read: false,
    created_at: new Date('2023-06-30'),
    relatedId: 4,
    link_to: '/proposals/4'
  },
  {
    id: 11,
    userId: 6,
    type: NotificationType.PROPOSAL_ACCEPTED,
    title: 'Proposta aceita',
    message: 'Pedro Silva aceitou sua proposta de troca para Câmera Digital',
    read: false,
    created_at: new Date('2023-07-06'),
    relatedId: 6,
    link_to: '/proposals/6'
  },
  {
    id: 12,
    userId: 3,
    type: NotificationType.LEVEL_UP,
    title: 'Subiu de nível!',
    message: 'Parabéns! Você alcançou o nível Intermediário no sistema de reputação',
    read: false,
    created_at: new Date('2023-07-10'),
    link_to: '/profile'
  }
];
