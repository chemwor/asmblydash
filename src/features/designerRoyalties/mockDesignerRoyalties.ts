// Mock data module for Designer Royalties
export interface KPIData {
  royalties30d: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  printsCompleted30d: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  activeListings: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  topDesignEarnings30d: {
    value: number;
    change: number;
    trend: 'up' | 'down';
    designName: string;
  };
}

export interface TopDesign {
  id: number;
  name: string;
  prints: number;
  earnings: number;
  trend: 'up' | 'down';
  trendPercent: number;
}

export interface DesignTableItem {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  printsCompleted30d: number;
  activeSellers: number;
  revenue30d: number;
  lifetimeRevenue: number;
}

export interface RoyaltyTransaction {
  id: string;
  date: string;
  design: string;
  designId: string;
  source: 'Seller' | 'Marketplace' | 'Direct License';
  reference: string;
  qty: number;
  rate: number;
  amount: number;
  status: 'Pending' | 'Available' | 'Paid';
}

export interface RecentTransaction {
  id: string;
  date: string;
  design: string;
  client: string;
  prints: number;
  rate: number;
  earnings: number;
  status: 'paid' | 'pending';
}

export interface PayoutSummary {
  availableBalance: number;
  pendingBalance: number;
  nextPayoutDate: string;
  estimatedNextPayout: number;
  payoutMethod: {
    type: string;
    masked: string;
  };
}

export interface PayoutMethodPayload {
  type: 'Bank' | 'Stripe' | 'PayPal';
  accountHolder: string;
  accountDetails: string;
}

export interface TimeSeriesPoint {
  x: number;
  y: number;
}

// KPI Data (30-day period)
export const kpis: KPIData = {
  royalties30d: {
    value: 2847.52,
    change: 18.5,
    trend: 'up'
  },
  printsCompleted30d: {
    value: 342,
    change: 12.3,
    trend: 'up'
  },
  activeListings: {
    value: 156,
    change: -2.1,
    trend: 'down'
  },
  topDesignEarnings30d: {
    value: 485.30,
    change: 24.7,
    trend: 'up',
    designName: "Minimalist Logo Pack"
  }
};

// Recent transactions for summary view
export const recentTransactions: RecentTransaction[] = [
  {
    id: 'ROY-001',
    date: '2025-12-20',
    design: 'Minimalist Logo Pack',
    client: 'TechStart Inc.',
    prints: 15,
    rate: 0.85,
    earnings: 12.75,
    status: 'paid'
  },
  {
    id: 'ROY-002',
    date: '2025-12-19',
    design: 'Business Card Template Set',
    client: 'Marketing Pro LLC',
    prints: 8,
    rate: 1.20,
    earnings: 9.60,
    status: 'paid'
  },
  {
    id: 'ROY-003',
    date: '2025-12-18',
    design: 'Brand Identity Kit',
    client: 'Creative Solutions',
    prints: 25,
    rate: 2.15,
    earnings: 53.75,
    status: 'pending'
  },
  {
    id: 'ROY-004',
    date: '2025-12-17',
    design: 'Social Media Templates',
    client: 'Digital Agency Co.',
    prints: 12,
    rate: 0.95,
    earnings: 11.40,
    status: 'paid'
  },
  {
    id: 'ROY-005',
    date: '2025-12-16',
    design: 'Website Banner Collection',
    client: 'E-commerce Store',
    prints: 30,
    rate: 1.50,
    earnings: 45.00,
    status: 'paid'
  }
];

// Top performing designs
export const topDesigns: TopDesign[] = [
  {
    id: 1,
    name: 'Minimalist Logo Pack',
    prints: 128,
    earnings: 485.30,
    trend: 'up',
    trendPercent: 24.7
  },
  {
    id: 2,
    name: 'Business Card Template Set',
    prints: 96,
    earnings: 362.80,
    trend: 'up',
    trendPercent: 15.2
  },
  {
    id: 3,
    name: 'Brand Identity Kit',
    prints: 74,
    earnings: 298.50,
    trend: 'down',
    trendPercent: -8.1
  },
  {
    id: 4,
    name: 'Social Media Templates',
    prints: 65,
    earnings: 247.25,
    trend: 'up',
    trendPercent: 31.4
  },
  {
    id: 5,
    name: 'Website Banner Collection',
    prints: 58,
    earnings: 219.60,
    trend: 'up',
    trendPercent: 18.9
  }
];

// Top designs table data
export const topDesignsTable: DesignTableItem[] = [
  {
    id: 'DES-001',
    name: 'Minimalist Logo Pack',
    thumbnail: '/images/designs/logo-pack.jpg',
    category: 'Logo Design',
    printsCompleted30d: 128,
    activeSellers: 15,
    revenue30d: 485.30,
    lifetimeRevenue: 2847.50
  },
  {
    id: 'DES-002',
    name: 'Business Card Template Set',
    thumbnail: '/images/designs/business-cards.jpg',
    category: 'Business Cards',
    printsCompleted30d: 96,
    activeSellers: 12,
    revenue30d: 362.80,
    lifetimeRevenue: 1925.40
  },
  {
    id: 'DES-003',
    name: 'Brand Identity Kit',
    thumbnail: '/images/designs/brand-kit.jpg',
    category: 'Branding',
    printsCompleted30d: 74,
    activeSellers: 8,
    revenue30d: 298.50,
    lifetimeRevenue: 1654.20
  },
  {
    id: 'DES-004',
    name: 'Social Media Templates',
    thumbnail: '/images/designs/social-media.jpg',
    category: 'Social Media',
    printsCompleted30d: 65,
    activeSellers: 18,
    revenue30d: 247.25,
    lifetimeRevenue: 1384.75
  },
  {
    id: 'DES-005',
    name: 'Website Banner Collection',
    thumbnail: '/images/designs/web-banners.jpg',
    category: 'Web Design',
    printsCompleted30d: 58,
    activeSellers: 9,
    revenue30d: 219.60,
    lifetimeRevenue: 1247.80
  },
  {
    id: 'DES-006',
    name: 'Restaurant Menu Design',
    thumbnail: '/images/designs/menu-design.jpg',
    category: 'Print Design',
    printsCompleted30d: 52,
    activeSellers: 7,
    revenue30d: 195.40,
    lifetimeRevenue: 987.65
  },
  {
    id: 'DES-007',
    name: 'Corporate Presentation Template',
    thumbnail: '/images/designs/presentation.jpg',
    category: 'Presentation',
    printsCompleted30d: 47,
    activeSellers: 11,
    revenue30d: 184.75,
    lifetimeRevenue: 845.30
  },
  {
    id: 'DES-008',
    name: 'E-commerce Product Labels',
    thumbnail: '/images/designs/product-labels.jpg',
    category: 'Labels & Stickers',
    printsCompleted30d: 43,
    activeSellers: 14,
    revenue30d: 172.85,
    lifetimeRevenue: 724.90
  },
  {
    id: 'DES-009',
    name: 'Wedding Invitation Suite',
    thumbnail: '/images/designs/wedding-invite.jpg',
    category: 'Invitations',
    printsCompleted30d: 38,
    activeSellers: 6,
    revenue30d: 158.20,
    lifetimeRevenue: 695.80
  },
  {
    id: 'DES-010',
    name: 'Tech Startup Branding',
    thumbnail: '/images/designs/startup-brand.jpg',
    category: 'Branding',
    printsCompleted30d: 35,
    activeSellers: 10,
    revenue30d: 147.65,
    lifetimeRevenue: 612.45
  },
  {
    id: 'DES-011',
    name: 'Food Truck Graphics',
    thumbnail: '/images/designs/food-truck.jpg',
    category: 'Vehicle Graphics',
    printsCompleted30d: 31,
    activeSellers: 5,
    revenue30d: 134.90,
    lifetimeRevenue: 578.20
  },
  {
    id: 'DES-012',
    name: 'Real Estate Flyer Template',
    thumbnail: '/images/designs/real-estate.jpg',
    category: 'Flyers',
    printsCompleted30d: 28,
    activeSellers: 13,
    revenue30d: 125.40,
    lifetimeRevenue: 534.85
  },
  {
    id: 'DES-013',
    name: 'Fitness Center Poster Set',
    thumbnail: '/images/designs/fitness-poster.jpg',
    category: 'Posters',
    printsCompleted30d: 25,
    activeSellers: 8,
    revenue30d: 118.75,
    lifetimeRevenue: 487.20
  },
  {
    id: 'DES-014',
    name: 'Coffee Shop Branding Kit',
    thumbnail: '/images/designs/coffee-brand.jpg',
    category: 'Branding',
    printsCompleted30d: 22,
    activeSellers: 7,
    revenue30d: 109.60,
    lifetimeRevenue: 445.30
  },
  {
    id: 'DES-015',
    name: 'Music Festival Graphics',
    thumbnail: '/images/designs/music-festival.jpg',
    category: 'Event Graphics',
    printsCompleted30d: 19,
    activeSellers: 4,
    revenue30d: 98.45,
    lifetimeRevenue: 398.75
  },
  {
    id: 'DES-016',
    name: 'Medical Practice Logo Set',
    thumbnail: '/images/designs/medical-logo.jpg',
    category: 'Logo Design',
    printsCompleted30d: 17,
    activeSellers: 9,
    revenue30d: 89.25,
    lifetimeRevenue: 356.80
  },
  {
    id: 'DES-017',
    name: 'Beauty Salon Brochure',
    thumbnail: '/images/designs/beauty-brochure.jpg',
    category: 'Brochures',
    printsCompleted30d: 15,
    activeSellers: 6,
    revenue30d: 78.90,
    lifetimeRevenue: 312.45
  },
  {
    id: 'DES-018',
    name: 'Construction Company Assets',
    thumbnail: '/images/designs/construction.jpg',
    category: 'Industrial Design',
    printsCompleted30d: 13,
    activeSellers: 3,
    revenue30d: 67.75,
    lifetimeRevenue: 289.60
  },
  {
    id: 'DES-019',
    name: 'Pet Store Marketing Kit',
    thumbnail: '/images/designs/pet-store.jpg',
    category: 'Marketing Materials',
    printsCompleted30d: 11,
    activeSellers: 5,
    revenue30d: 58.40,
    lifetimeRevenue: 245.85
  },
  {
    id: 'DES-020',
    name: 'Travel Agency Branding',
    thumbnail: '/images/designs/travel-agency.jpg',
    category: 'Branding',
    printsCompleted30d: 9,
    activeSellers: 4,
    revenue30d: 47.20,
    lifetimeRevenue: 198.40
  },
  {
    id: 'DES-021',
    name: 'Educational Course Graphics',
    thumbnail: '/images/designs/education.jpg',
    category: 'Educational',
    printsCompleted30d: 8,
    activeSellers: 7,
    revenue30d: 39.80,
    lifetimeRevenue: 167.30
  },
  {
    id: 'DES-022',
    name: 'Automotive Service Signage',
    thumbnail: '/images/designs/automotive.jpg',
    category: 'Signage',
    printsCompleted30d: 7,
    activeSellers: 2,
    revenue30d: 34.65,
    lifetimeRevenue: 145.20
  },
  {
    id: 'DES-023',
    name: 'Nonprofit Organization Kit',
    thumbnail: '/images/designs/nonprofit.jpg',
    category: 'Nonprofit',
    printsCompleted30d: 6,
    activeSellers: 3,
    revenue30d: 28.75,
    lifetimeRevenue: 123.90
  }
];

// Generate mock royalty transactions data
const generateRoyaltyTransactions = (): RoyaltyTransaction[] => {
  const sources: Array<'Seller' | 'Marketplace' | 'Direct License'> = ['Seller', 'Marketplace', 'Direct License'];
  const designs = [
    'Minimalist Logo Pack', 'Business Card Template Set', 'Brand Identity Kit',
    'Social Media Templates', 'Website Banner Collection', 'Restaurant Menu Design',
    'Corporate Presentation Template', 'E-commerce Product Labels', 'Wedding Invitation Suite',
    'Tech Startup Branding', 'Food Truck Graphics', 'Real Estate Flyer Template',
    'Fitness Center Poster Set', 'Coffee Shop Branding Kit', 'Music Festival Graphics',
    'Medical Practice Logo Set', 'Beauty Salon Brochure', 'Construction Company Assets',
    'Pet Store Marketing Kit', 'Travel Agency Branding', 'Educational Course Graphics',
    'Automotive Service Signage', 'Nonprofit Organization Kit', 'Photography Portfolio Template',
    'Fashion Brand Identity', 'Hotel Marketing Materials', 'Restaurant Chain Branding',
    'Spa & Wellness Graphics', 'Financial Services Kit', 'Legal Firm Templates'
  ];

  const transactions: RoyaltyTransaction[] = [];
  const today = new Date();

  for (let i = 0; i < 65; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    const design = designs[Math.floor(Math.random() * designs.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const qty = Math.floor(Math.random() * 50) + 1;
    const rate = parseFloat((Math.random() * 3 + 0.5).toFixed(2));
    const amount = qty * rate;

    const statusRand = Math.random();
    let status: 'Pending' | 'Available' | 'Paid';
    if (statusRand < 0.7) status = 'Paid';
    else if (statusRand < 0.9) status = 'Available';
    else status = 'Pending';

    const designId = `DES-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    const referencePrefix = source === 'Direct License' ? 'LIC-' :
                           source === 'Marketplace' ? 'MKT-' : 'ORD-';
    const reference = `${referencePrefix}${String(Math.floor(Math.random() * 99999) + 10000)}`;

    transactions.push({
      id: `ROY-${String(i + 1).padStart(3, '0')}`,
      date: date.toISOString().split('T')[0],
      design,
      designId,
      source,
      reference,
      qty,
      rate,
      amount: parseFloat(amount.toFixed(2)),
      status
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Export transactions array
export const transactions = generateRoyaltyTransactions();

// Generate time series data
const generateTimeSeriesData = (days: number): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const baseAmount = 50 + Math.random() * 100;
    const seasonalMultiplier = 1 + 0.3 * Math.sin((i / days) * 2 * Math.PI);
    const dailyRoyalties = baseAmount * seasonalMultiplier;

    data.push({
      x: date.getTime(),
      y: Math.round(dailyRoyalties * 100) / 100
    });
  }

  return data;
};

export const timeSeries30d = generateTimeSeriesData(30);
export const timeSeries90d = generateTimeSeriesData(90);

// Payout summary data
export const payoutSummary: PayoutSummary = {
  availableBalance: 1847.32,
  pendingBalance: 892.45,
  nextPayoutDate: '2025-12-28',
  estimatedNextPayout: 1847.32,
  payoutMethod: {
    type: 'Bank',
    masked: '•••• 1234'
  }
};

// Update payout method function (mock)
export const updatePayoutMethod = (payload: PayoutMethodPayload): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock validation
      if (!payload.accountHolder || !payload.accountDetails) {
        resolve({
          success: false,
          message: 'Account holder and details are required'
        });
        return;
      }

      // Mock success response
      resolve({
        success: true,
        message: 'Payout method updated successfully!'
      });
    }, 500);
  });
};
