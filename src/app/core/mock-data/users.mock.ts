import { User } from '../models/user.model';

export const usersMock: User[] = [
  {
    id: 1,
    username: 'usuario',
    email: 'usuario@exemplo.com',
    fullName: 'Usuário Demo',
    avatar: 'assets/images/placeholder.svg',
    reputationLevel: 3,
    reputationScore: 4.2,
    createdAt: new Date('2023-01-15'),
    bio: 'Entusiasta de tecnologia e produtos sustentáveis. Adoro trocar itens ao invés de comprar novos!',
    location: 'São Paulo, SP',
    phone: '11999887766',
    products: [1, 5, 9]
  },
  {
    id: 2,
    username: 'mariasantos',
    email: 'mariasantos@example.com',
    fullName: 'Maria Santos',
    avatar: 'assets/images/placeholder.svg',
    reputationLevel: 4,
    reputationScore: 4.8,
    createdAt: new Date('2022-11-22'),
    bio: 'Amo ler, trocar livros e acessórios. Sempre em busca de novos itens interessantes!',
    location: 'Rio de Janeiro, RJ',
    phone: '21988776655',
    products: [2, 6, 10]
  },
  {
    id: 3,
    username: 'pedrosilva',
    email: 'pedrosilva@example.com',
    fullName: 'Pedro Silva',
    avatar: 'assets/images/placeholder.svg',
    reputationLevel: 2,
    reputationScore: 3.6,
    createdAt: new Date('2023-03-10'),
    bio: 'Colecionador de gadgets e apaixonado por tecnologia. Estou sempre procurando itens para trocar.',
    location: 'Belo Horizonte, MG',
    phone: '31977665544',
    products: [3, 7]
  },
  {
    id: 4,
    username: 'anamartins',
    email: 'anamartins@example.com',
    fullName: 'Ana Martins',
    avatar: 'assets/images/placeholder.svg',
    reputationLevel: 1,
    reputationScore: 0,
    createdAt: new Date('2023-05-05'),
    bio: 'Nova na plataforma! Adoro artigos feitos à mão e produtos para casa.',
    location: 'Curitiba, PR',
    phone: '41966554433',
    products: [4, 8]
  },
  {
    id: 5,
    username: 'lucasoliveira',
    email: 'lucasoliveira@example.com',
    fullName: 'Lucas Oliveira',
    avatar: 'assets/images/placeholder.svg',
    reputationLevel: 2,
    reputationScore: 3.2,
    createdAt: new Date('2023-02-20'),
    bio: 'Gosto de esportes e eletrônicos. Procuro sempre itens em bom estado para trocar.',
    location: 'Salvador, BA',
    phone: '71955443322',
    products: [11, 12]
  },
  {
    id: 6,
    username: 'carolferreira',
    email: 'carolferreira@example.com',
    fullName: 'Carolina Ferreira',
    avatar: 'assets/images/placeholder.svg',
    reputationLevel: 3,
    reputationScore: 4.0,
    createdAt: new Date('2022-10-15'),
    bio: 'Adoro moda, cosméticos e decoração. Busco sempre produtos interessantes para trocar!',
    location: 'Fortaleza, CE',
    phone: '85944332211',
    products: [13, 14]
  }
];
