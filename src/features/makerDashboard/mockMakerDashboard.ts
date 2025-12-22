// Mock data for Maker Dashboard
export interface Job {
  id: string;
  title: string;
  product: string;
  customer: string;
  dueDate: string;
  priority: string;
  status: string;
  statusColor: string;
  priorityColor: string;
  progress: number;
  qty: number;
  material: string;
}

export interface Alert {
  id: string;
  type: 'urgent' | 'blocked' | 'qc' | 'payout';
  icon: string;
  title: string;
  description: string;
  action: string;
  actionLink: string;
  timestamp: string;
}

export interface Finance {
  availableBalance: string;
  pendingBalance: string;
  nextPayoutDate: string;
  estimatedNextPayout: string;
  payoutFrequency: string;
}

// Mock jobs data
export const jobs: Job[] = [
  // Recent jobs format
  {
    id: 'MJ-2024-001',
    title: 'Custom Phone Case - iPhone 15',
    product: 'Custom Phone Case - iPhone 15',
    customer: 'TechStore Pro',
    dueDate: '2024-12-22',
    priority: 'High',
    status: 'In Progress',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    priorityColor: 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-300',
    progress: 75,
    qty: 1,
    material: 'PLA Black'
  },
  {
    id: 'MJ-2024-002',
    title: 'Miniature Figurine Set (12 pieces)',
    product: 'Miniature Figurine Set (12 pieces)',
    customer: 'GameCraft Studios',
    dueDate: '2024-12-24',
    priority: 'Medium',
    status: 'Quality Check',
    statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 90,
    qty: 12,
    material: 'Resin Grey'
  },
  {
    id: 'MJ-2024-003',
    title: 'Replacement Part - Drone Propeller',
    product: 'Replacement Part - Drone Propeller',
    customer: 'AeroTech Solutions',
    dueDate: '2024-12-21',
    priority: 'Urgent',
    status: 'Ready to Ship',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    progress: 100,
    qty: 8,
    material: 'PETG Clear'
  },
  {
    id: 'MJ-2024-004',
    title: 'Architectural Model - Building Section',
    product: 'Architectural Model - Building Section',
    customer: 'Design Studios Inc',
    dueDate: '2024-12-25',
    priority: 'Low',
    status: 'Queued',
    statusColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 0,
    qty: 15,
    material: 'PLA Grey'
  },
  // Work queue jobs
  {
    id: 'MJ-2024-015',
    title: 'Custom Phone Case - Galaxy S24',
    product: 'Custom Phone Case - Galaxy S24',
    customer: 'Mobile Accessories Inc',
    dueDate: '2024-12-20',
    priority: 'Rush',
    status: 'Printing',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    progress: 60,
    qty: 5,
    material: 'PLA Black'
  },
  {
    id: 'MJ-2024-016',
    title: 'Drone Propeller Replacement',
    product: 'Drone Propeller Replacement',
    customer: 'AeroTech Solutions',
    dueDate: '2024-12-20',
    priority: 'Standard',
    status: 'QC',
    statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 85,
    qty: 8,
    material: 'PETG Clear'
  },
  {
    id: 'MJ-2024-017',
    title: 'Miniature Character Set',
    product: 'Miniature Character Set',
    customer: 'GameCraft Studios',
    dueDate: '2024-12-20',
    priority: 'Standard',
    status: 'Packing',
    statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 95,
    qty: 12,
    material: 'Resin Grey'
  },
  {
    id: 'MJ-2024-018',
    title: 'Mechanical Keyboard Keycaps',
    product: 'Mechanical Keyboard Keycaps',
    customer: 'Tech Peripherals Co',
    dueDate: '2024-12-21',
    priority: 'Rush',
    status: 'Queued',
    statusColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    progress: 0,
    qty: 104,
    material: 'PLA White'
  },
  {
    id: 'MJ-2024-019',
    title: 'Cable Management Clips',
    product: 'Cable Management Clips',
    customer: 'Office Solutions Ltd',
    dueDate: '2024-12-21',
    priority: 'Standard',
    status: 'Printing',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 40,
    qty: 25,
    material: 'TPU Black'
  },
  {
    id: 'MJ-2024-020',
    title: 'Architectural Model Parts',
    product: 'Architectural Model Parts',
    customer: 'Design Studios Inc',
    dueDate: '2024-12-21',
    priority: 'Standard',
    status: 'Shipped',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 100,
    qty: 15,
    material: 'PLA Grey'
  },
  {
    id: 'MJ-2024-021',
    title: 'Custom Lamp Shade',
    product: 'Custom Lamp Shade',
    customer: 'Interior Design Co',
    dueDate: '2024-12-22',
    priority: 'Rush',
    status: 'Blocked',
    statusColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    progress: 0,
    qty: 2,
    material: 'PLA Wood Fill'
  },
  {
    id: 'MJ-2024-022',
    title: 'Jewelry Display Stand',
    product: 'Jewelry Display Stand',
    customer: 'Luxury Jewelry Store',
    dueDate: '2024-12-22',
    priority: 'Standard',
    status: 'QC',
    statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 88,
    qty: 6,
    material: 'Resin Clear'
  },
  {
    id: 'MJ-2024-023',
    title: 'Prosthetic Hand Components',
    product: 'Prosthetic Hand Components',
    customer: 'Medical Devices Inc',
    dueDate: '2024-12-22',
    priority: 'Rush',
    status: 'Printing',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    progress: 70,
    qty: 4,
    material: 'PETG Medical'
  },
  {
    id: 'MJ-2024-024',
    title: 'Garden Tool Handle',
    product: 'Garden Tool Handle',
    customer: 'Gardening Tools LLC',
    dueDate: '2024-12-23',
    priority: 'Standard',
    status: 'Queued',
    statusColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 0,
    qty: 3,
    material: 'PETG Green'
  },
  {
    id: 'MJ-2024-025',
    title: 'Electronic Enclosure',
    product: 'Electronic Enclosure',
    customer: 'Electronics Corp',
    dueDate: '2024-12-23',
    priority: 'Standard',
    status: 'Packing',
    statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 92,
    qty: 10,
    material: 'ABS Black'
  },
  {
    id: 'MJ-2024-026',
    title: 'Toy Car Parts',
    product: 'Toy Car Parts',
    customer: 'Kids Toys Manufacturing',
    dueDate: '2024-12-23',
    priority: 'Rush',
    status: 'Queued',
    statusColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    progress: 0,
    qty: 20,
    material: 'PLA Multi-Color'
  },
  {
    id: 'MJ-2024-027',
    title: 'Custom Bracket Set',
    product: 'Custom Bracket Set',
    customer: 'Hardware Solutions',
    dueDate: '2024-12-24',
    priority: 'Standard',
    status: 'Printing',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 50,
    qty: 8,
    material: 'PETG Clear'
  },
  {
    id: 'MJ-2024-028',
    title: 'Decorative Vase',
    product: 'Decorative Vase',
    customer: 'Art Gallery',
    dueDate: '2024-12-24',
    priority: 'Standard',
    status: 'QC',
    statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 100,
    qty: 1,
    material: 'PLA Silk Gold'
  },
  {
    id: 'MJ-2024-029',
    title: 'Replacement Gears',
    product: 'Replacement Gears',
    customer: 'Mechanical Parts Co',
    dueDate: '2024-12-24',
    priority: 'Rush',
    status: 'Shipped',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    progress: 100,
    qty: 16,
    material: 'Nylon PA12'
  },
  // Historical jobs for on-time rate calculation
  {
    id: 'MJ-2024-030',
    title: 'Historical Job 1',
    product: 'Historical Job 1',
    customer: 'Customer A',
    dueDate: '2024-12-10',
    priority: 'Standard',
    status: 'Shipped',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 100,
    qty: 5,
    material: 'PLA Black'
  },
  {
    id: 'MJ-2024-031',
    title: 'Historical Job 2',
    product: 'Historical Job 2',
    customer: 'Customer B',
    dueDate: '2024-12-08',
    priority: 'Standard',
    status: 'Shipped',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    priorityColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    progress: 100,
    qty: 3,
    material: 'PLA White'
  }
].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

// Mock finance data
export const finance: Finance = {
  availableBalance: '$1,247.80',
  pendingBalance: '$924.35',
  nextPayoutDate: 'December 27, 2024',
  estimatedNextPayout: '$1,247.80',
  payoutFrequency: 'Weekly'
};

// Mock alerts data
export const alerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'urgent',
    icon: 'schedule',
    title: '2 jobs due within 24 hours',
    description: 'Phone Case batch and Drone Propeller need immediate attention',
    action: 'Review Jobs',
    actionLink: '/maker/jobs?filter=due-soon',
    timestamp: '2024-12-20T10:30:00Z'
  },
  {
    id: 'alert-002',
    type: 'blocked',
    icon: 'block',
    title: '1 job blocked: missing STL file',
    description: 'Custom Lamp Shade - waiting for updated design files',
    action: 'Contact Customer',
    actionLink: '/maker/jobs/MJ-2024-021',
    timestamp: '2024-12-20T08:15:00Z'
  },
  {
    id: 'alert-003',
    type: 'qc',
    icon: 'photo_camera',
    title: 'QC photo required for Job #MJ-2024-028',
    description: 'Decorative Vase completed - upload quality check photos',
    action: 'Upload Photos',
    actionLink: '/maker/jobs/MJ-2024-028/qc',
    timestamp: '2024-12-20T07:45:00Z'
  },
  {
    id: 'alert-004',
    type: 'payout',
    icon: 'payments',
    title: 'Payout scheduled for Friday',
    description: '$1,247.80 will be transferred to your account',
    action: 'View Details',
    actionLink: '/maker/payouts',
    timestamp: '2024-12-20T06:00:00Z'
  }
];

// Helper functions
export const getActiveJobs = (): Job[] => {
  return jobs.filter(job =>
    job.status !== 'Shipped' &&
    job.status !== 'Blocked'
  );
};

export const getDueSoonJobs = (hours: number = 48): Job[] => {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));

  return jobs.filter(job => {
    const dueDate = new Date(job.dueDate);
    return dueDate <= cutoffTime &&
           dueDate > now &&
           job.status !== 'Shipped' &&
           job.status !== 'Blocked';
  });
};

export const getOverdueJobs = (): Job[] => {
  const now = new Date();

  return jobs.filter(job => {
    const dueDate = new Date(job.dueDate);
    return dueDate < now &&
           job.status !== 'Shipped';
  });
};

export const computeOnTimeRate = (days: number = 30): number => {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

  // Get completed jobs from the specified period
  const completedJobs = jobs.filter(job => {
    const dueDate = new Date(job.dueDate);
    return job.status === 'Shipped' &&
           dueDate >= cutoffDate &&
           dueDate <= now;
  });

  if (completedJobs.length === 0) return 94.2; // Default rate

  // For mock data, assume 94.2% on-time rate
  const onTimeJobs = Math.floor(completedJobs.length * 0.942);
  return parseFloat(((onTimeJobs / completedJobs.length) * 100).toFixed(1));
};

// Additional helper functions for dashboard calculations
export const getJobsByStatus = () => {
  return jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getRecentJobs = (limit: number = 4): Job[] => {
  return jobs
    .filter(job => job.status !== 'Shipped')
    .slice(0, limit);
};

export const getWorkQueue = (): Job[] => {
  return jobs.filter(job =>
    job.status !== 'Shipped'
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};
