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
    city: 'São Paulo',
    state: 'SP',
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
    city: 'Rio de Janeiro',
    state: 'RJ',
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
    city: 'Belo Horizonte',
    state: 'MG',
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
    city: 'Curitiba',
    state: 'PR',
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
    city: 'Salvador',
    state: 'BA',
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
    city: 'Fortaleza',
    state: 'CE',
    phone: '85944332211',
    products: [13, 14]
  }
];
