import { Category, Product, ProductStatus } from '../models/product.model';
import { User } from '../models/user.model';
import { Notification, NotificationType } from '../models/notification.model';
import { Proposal, ProposalStatus } from '../models/proposal.model';

export const categoriesMock: Category[] = [
    { id: 1, name: 'Eletrônicos', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
    { id: 2, name: 'Esportes', imageUrl: 'https://images.unsplash.com/photo-1556228578-567ba127e37f' },
    { id: 3, name: 'Casa e Decoração', imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f' },
    { id: 4, name: 'Vestuário', imageUrl: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a' },
    { id: 5, name: 'Livros', imageUrl: 'https://images.unsplash.com/photo-1525904097878-94fb15835963' },
];

export const usersMock: User[] = [
    { id: 1, username: 'johndoe', email: 'johndoe@example.com', fullName: 'John Doe', avatar: 'assets/images/placeholder.svg', reputation_level: 3, reputation_score: 120, created_at: new Date('2023-05-01') },
    { id: 13, username: 'mariasantos', email: 'maria.santos@example.com', fullName: 'Maria Santos', avatar: 'assets/images/placeholder.svg', reputation_level: 4, reputation_score: 200, created_at: new Date('2023-05-05') },
    { id: 3, username: 'pedrosilva', email: 'pedro.silva@example.com', fullName: 'Pedro Silva', avatar: 'assets/images/placeholder.svg', reputation_level: 2, reputation_score: 80, created_at: new Date('2023-05-10') },
    { id: 4, username: 'anamartins', email: 'ana.martins@example.com', fullName: 'Ana Martins', avatar: 'assets/images/placeholder.svg', reputation_level: 1, reputation_score: 50, created_at: new Date('2023-05-15') },
    { id: 5, username: 'lucasoliveira', email: 'lucas.oliveira@example.com', fullName: 'Lucas Oliveira', avatar: 'assets/images/placeholder.svg', reputation_level: 2, reputation_score: 90, created_at: new Date('2023-05-20') },
    { id: 6, username: 'carolinaferreira', email: 'carolina.ferreira@example.com', fullName: 'Carolina Ferreira', avatar: 'assets/images/placeholder.svg', reputation_level: 3, reputation_score: 150, created_at: new Date('2023-05-25') },
];

export const notificationsMock: Notification[] = [
    {
        id: 1,
        user: usersMock[0],
        type: NotificationType.NEW_PROPOSAL,
        title: 'Nova proposta de troca',
        message: 'Pedro Silva ofereceu um Relógio de Pulso pelo seu Fone de Ouvido Bluetooth',
        read: false,
        created_at: new Date('2023-06-20'),
        relatedId: 1,
        linkTo: '/proposals/1',
    },
    {
        id: 2,
        user: usersMock[2],
        type: NotificationType.NEW_PROPOSAL,
        title: 'Nova proposta de troca',
        message: 'Ana Martins ofereceu um Kit de Skincare pelo seu Kit de Maquiagem Novo',
        read: true,
        created_at: new Date('2023-06-22'),
        relatedId: 2,
        linkTo: '/proposals/2',
    },
    {
        id: 3,
        user: usersMock[1],
        type: NotificationType.NEW_PROPOSAL,
        title: 'Nova proposta de troca',
        message: 'Lucas Oliveira ofereceu uma Jaqueta Jeans pelo seu Vestido de Festa',
        read: false,
        created_at: new Date('2023-07-02'),
        relatedId: 5,
        linkTo: '/proposals/5',
    },
    // ... siga o mesmo padrão para os demais ...
];

export const productsMock: Product[] = [
    {
        id: 1,
        title: 'Fone de Ouvido Bluetooth',
        description: 'Fone de ouvido bluetooth com cancelamento de ruído, ótima qualidade de som. Usado apenas algumas vezes, em perfeito estado. Acompanha estojo de carregamento e cabo USB.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[0],
        user: usersMock[0],
        acceptable_exchanges: ['Smartwatch', 'Caixa de som portátil', 'Teclado mecânico'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-05-10'),
        updated_at: new Date('2023-05-10'),
        images: []
    },
    {
        id: 2,
        title: 'Kit de Maquiagem Novo',
        description: 'Kit completo de maquiagem com paleta de sombras, batons, blush e pincéis. Todas as cores são neutras e combinam com qualquer tom de pele. Produto novo, apenas aberto para verificação.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[1],
        user: usersMock[1],
        acceptable_exchanges: ['Perfumes', 'Produtos para cabelo', 'Acessórios femininos'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-05-15'),
        updated_at: new Date('2023-05-15'),
        images: []
    },
    {
        id: 3,
        title: 'Relógio de Pulso',
        description: 'Relógio analógico masculino, pulseira de couro legítimo na cor marrom. Mostrador em preto com detalhes prateados. Usado poucas vezes, está em excelente estado. Acompanha caixa original.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[2],
        user: usersMock[3],
        acceptable_exchanges: ['Óculos de sol', 'Fone de ouvido', 'Smartwatch'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-05-20'),
        updated_at: new Date('2023-05-20'),
        images: []
    },
    {
        id: 4,
        title: 'Caderno de Anotações',
        description: 'Caderno capa dura com 200 folhas sem pauta, ideal para desenhos e anotações. Capa em couro sintético na cor azul marinho. Novo, ainda na embalagem original.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[3],
        user: usersMock[3],
        acceptable_exchanges: ['Canetas', 'Livros', 'Marca-textos'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-05-22'),
        updated_at: new Date('2023-05-22'),
        images: []
    },
    {
        id: 5,
        title: 'Raquete de Tênis',
        description: 'Raquete de tênis profissional, pouco usada. Encordoamento em perfeito estado. Acompanha capa protetora. Ideal para jogadores intermediários.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[4],
        user: usersMock[3],
        acceptable_exchanges: ['Bola de basquete', 'Luvas de boxe', 'Kettlebell'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-05-25'),
        updated_at: new Date('2023-05-25'),
        images: []
    },
    {
        id: 6,
        title: 'Vestido de Festa',
        description: 'Vestido longo de festa, cor verde esmeralda, tamanho M. Usado apenas uma vez, está em perfeito estado. Tecido em cetim com detalhes em renda. Ideal para ocasiões especiais.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[5],
        user: usersMock[0],
        acceptable_exchanges: ['Bolsa de festa', 'Sapatos femininos', 'Acessórios'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-05-27'),
        updated_at: new Date('2023-05-27'),
        images: []
    },
    {
        id: 7,
        title: 'Câmera Digital',
        description: 'Câmera digital compacta com 16MP, zoom óptico de 10x e estabilizador de imagem. Usada, mas em perfeito estado de conservação. Acompanha carregador, bateria extra e cartão de memória de 32GB.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[0],
        user: usersMock[2],
        acceptable_exchanges: ['Tablet', 'Tripé para câmera', 'Fone de ouvido bluetooth'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-05-30'),
        updated_at: new Date('2023-05-30'),
        images: []
    },
    {
        id: 8,
        title: 'Kit de Skincare',
        description: 'Kit completo de skincare contendo limpador facial, tônico, sérum de vitamina C e hidratante facial. Produtos novos, apenas o hidratante foi usado uma vez para teste.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[1],
        user: usersMock[3],
        acceptable_exchanges: ['Maquiagem', 'Perfumes', 'Produtos para cabelo'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-06-02'),
        updated_at: new Date('2023-06-02'),
        images: []
    },
    {
        id: 9,
        title: 'Óculos de Sol',
        description: 'Óculos de sol unissex, armação em acetato preto e lentes polarizadas. Proteção UV400. Usado poucas vezes, sem arranhões. Acompanha case protetor e flanela para limpeza.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[2],
        user: usersMock[0],
        acceptable_exchanges: ['Relógio', 'Bolsa', 'Carteira em couro'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-06-05'),
        updated_at: new Date('2023-06-05'),
        images: []
    },
    {
        id: 10,
        title: 'Luminária de Mesa',
        description: 'Luminária de mesa articulada, estrutura em metal na cor preta com acabamento fosco. Ideal para escritório ou mesa de estudos. Em perfeito estado de funcionamento.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[3],
        user: usersMock[3],
        acceptable_exchanges: ['Organizadores de mesa', 'Porta-canetas', 'Agenda'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-06-08'),
        updated_at: new Date('2023-06-08'),
        images: []
    },
    {
        id: 11,
        title: 'Tênis para Corrida',
        description: 'Tênis específico para corrida, tamanho 42, cor cinza com detalhes em verde. Usado apenas duas vezes, está como novo. Amortecimento de alto desempenho, ideal para corridas longas.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[4],
        user: usersMock[4],
        acceptable_exchanges: ['Camiseta esportiva', 'Bermuda fitness', 'Garrafa térmica'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-06-10'),
        updated_at: new Date('2023-06-10'),
        images: []
    },
    {
        id: 12,
        title: 'Jaqueta Jeans',
        description: 'Jaqueta jeans masculina, tamanho G, lavagem média. Usada poucas vezes, está em ótimo estado. Modelo clássico, combina com diversas ocasiões.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[5],
        user: usersMock[4],
        acceptable_exchanges: ['Camiseta', 'Calça jeans', 'Tênis casual'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-06-12'),
        updated_at: new Date('2023-06-12'),
        images: []
    },
    {
        id: 13,
        title: 'Tablet 10 polegadas',
        description: 'Tablet Android com tela de 10 polegadas, 64GB de armazenamento, 4GB de RAM. Usado por 6 meses, sem arranhões ou marcas de uso. Acompanha carregador original e capa protetora.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[0],
        user: usersMock[5],
        acceptable_exchanges: ['Fone de ouvido bluetooth', 'Smartwatch', 'E-reader'],
        status: ProductStatus.AVAILABLE,
        created_at: new Date('2023-06-15'),
        updated_at: new Date('2023-06-15'),
        images: []
    },
    {
        id: 14,
        title: 'Kit Pincéis de Maquiagem',
        description: 'Kit com 12 pincéis profissionais para maquiagem. Cerdas sintéticas de alta qualidade, cabo em madeira. Usados poucas vezes, estão em excelente estado. Acompanha estojo.',
        imageUrl: 'assets/images/placeholder.svg',
        category: categoriesMock[1],
        user: usersMock[5],
        acceptable_exchanges: ['Paleta de sombras', 'Batom', 'Produtos para sobrancelha'],
        status: ProductStatus.RESERVED,
        created_at: new Date('2023-06-18'),
        updated_at: new Date('2023-06-18'),
        images: []
    }
];

export const proposalsMock: Proposal[] = [
  {
    id: 1,
    product_offered: productsMock.find(p => p.id === 3)!,
    product_requested: productsMock.find(p => p.id === 1)!,
    from_user: usersMock.find(u => u.id === 3)!,
    to_user: usersMock.find(u => u.id === 1)!,
    message: 'Olá John! Estou interessado no seu fone de ouvido. Meu relógio está em ótimo estado e acho que seria uma troca justa. O que você acha?',
    status: ProposalStatus.PENDING,
    created_at: new Date('2023-06-20'),
    updated_at: new Date('2023-06-20'),
  },
  {
    id: 2,
    product_offered: productsMock.find(p => p.id === 8)!,
    product_requested: productsMock.find(p => p.id === 2)!,
    from_user: usersMock.find(u => u.id === 4)!,
    to_user: usersMock.find(u => u.id === 2)!,
    message: 'Oi Maria! Adorei seu kit de maquiagem e gostaria de propor uma troca pelo meu kit de skincare. Os produtos são de ótima qualidade e combinam muito com maquiagem.',
    status: ProposalStatus.ACCEPTED,
    created_at: new Date('2023-06-22'),
    updated_at: new Date('2023-06-23'),
  },
  {
    id: 3,
    product_offered: productsMock.find(p => p.id === 5)!,
    product_requested: productsMock.find(p => p.id === 11)!,
    from_user: usersMock.find(u => u.id === 1)!,
    to_user: usersMock.find(u => u.id === 5)!,
    message: 'Olá Lucas! Vi que você tem um tênis para corrida e gostaria de propor uma troca pela minha raquete de tênis que está em excelente estado. Sou tenista amador e estou mudando para corrida agora.',
    status: ProposalStatus.REJECTED,
    created_at: new Date('2023-06-25'),
    updated_at: new Date('2023-06-26'),
  },
  {
    id: 4,
    product_offered: productsMock.find(p => p.id === 10)!,
    product_requested: productsMock.find(p => p.id === 4)!,
    from_user: usersMock.find(u => u.id === 2)!,
    to_user: usersMock.find(u => u.id === 4)!,
    message: 'Oi Ana! Adorei seu caderno de anotações e gostaria de propor uma troca pela minha luminária de mesa. Ela é articulada e perfeita para estudos e leitura!',
    status: ProposalStatus.COMPLETED,
    created_at: new Date('2023-06-28'),
    updated_at: new Date('2023-06-30'),
  },
];


