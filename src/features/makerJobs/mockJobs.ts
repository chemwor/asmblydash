// Job type definition
export interface Job {
  id: string;
  orderId: string | null;
  product: string;
  thumbnail: string;
  qty: number;
  material: string;
  color: string;
  status: string;
  dueDate: string;
  priority: string;
  payout: number;
  completedAt: string | null;
  requiresQcPhotos?: boolean;
  qcPhotos?: string[];
  productionChecklist?: {
    printStarted: boolean;
    printCompleted: boolean;
    qcCompleted: boolean;
    packaged: boolean;
    labelCreated: boolean;
    trackingAdded: boolean;
  };
  activity?: ActivityEntry[];
  blockedReason?: string;
  blockedDetails?: string;
  shipping?: {
    carrier: string;
    trackingNumber: string;
    shippedAt?: string;
  };
}

// Activity entry interface for status timeline
export interface ActivityEntry {
  id: string;
  status: string;
  timestamp: string;
  note?: string;
}

// QC Photo metadata interface
export interface QcPhotoMeta {
  filename: string;
  uploadedAt: string;
  size?: number;
  type?: string;
}

// Checklist patch interface
export interface ChecklistPatch {
  printStarted?: boolean;
  printCompleted?: boolean;
  qcCompleted?: boolean;
  packaged?: boolean;
  labelCreated?: boolean;
  trackingAdded?: boolean;
}

// Filter interface for getJobs function
export interface JobFilters {
  status?: string;
  statusGroup?: 'All' | 'Active' | 'Blocked' | 'Shipped' | 'Completed';
  searchQuery?: string;
  material?: string;
  priority?: string;
  sortBy?: 'due-date-soonest' | 'due-date-latest' | 'payout-highest' | 'updated-latest';
}

// Mock jobs data
const mockJobsData: Job[] = [
  {
    id: 'J-2031',
    orderId: 'A-1042',
    product: 'Custom Phone Case - iPhone 15 Pro',
    thumbnail: '/images/products/phone-case.jpg',
    qty: 2,
    material: 'PLA',
    color: 'Midnight Black',
    status: 'Printing',
    dueDate: '2025-12-22',
    priority: 'Rush',
    payout: 24.50,
    completedAt: null,
    requiresQcPhotos: true
  },
  {
    id: 'J-2032',
    orderId: 'A-1043',
    product: 'Miniature Dragon Figurine',
    thumbnail: '/images/products/dragon.jpg',
    qty: 1,
    material: 'Resin',
    color: 'Forest Green',
    status: 'QC',
    dueDate: '2025-12-21',
    priority: 'Rush',
    payout: 45.00,
    completedAt: null,
    requiresQcPhotos: true,
    qcPhotos: ['/images/qc/dragon_front.jpg', '/images/qc/dragon_back.jpg']
  },
  {
    id: 'J-2033',
    orderId: null,
    product: 'Replacement Drone Propeller Set',
    thumbnail: '/images/products/propeller.jpg',
    qty: 4,
    material: 'PETG',
    color: 'Clear',
    status: 'Shipped',
    dueDate: '2025-12-19',
    priority: 'Standard',
    payout: 18.75,
    completedAt: '2025-12-19'
  },
  {
    id: 'J-2034',
    orderId: 'A-1044',
    product: 'Architectural Scale Model',
    thumbnail: '/images/products/building.jpg',
    qty: 1,
    material: 'PLA',
    color: 'White',
    status: 'Queued',
    dueDate: '2025-12-25',
    priority: 'Standard',
    payout: 89.00,
    completedAt: null
  },
  {
    id: 'J-2035',
    orderId: 'A-1045',
    product: 'Gaming Dice Set (7 pieces)',
    thumbnail: '/images/products/dice.jpg',
    qty: 7,
    material: 'Resin',
    color: 'Translucent Blue',
    status: 'Packing',
    dueDate: '2025-12-23',
    priority: 'Standard',
    payout: 32.25,
    completedAt: null
  },
  {
    id: 'J-2036',
    orderId: 'A-1046',
    product: 'Custom Cookie Cutter - Star',
    thumbnail: '/images/products/cookie-cutter.jpg',
    qty: 3,
    material: 'PLA',
    color: 'Food Safe White',
    status: 'Delivered',
    dueDate: '2025-12-19',
    priority: 'Rush',
    payout: 15.60,
    completedAt: '2025-12-18'
  },
  {
    id: 'J-2037',
    orderId: 'A-1047',
    product: 'Jewelry Display Stand',
    thumbnail: '/images/products/jewelry-stand.jpg',
    qty: 2,
    material: 'PETG',
    color: 'Crystal Clear',
    status: 'Printing',
    dueDate: '2025-12-24',
    priority: 'Standard',
    payout: 28.40,
    completedAt: null
  },
  {
    id: 'J-2038',
    orderId: null,
    product: 'Miniature Plant Pot Set',
    thumbnail: '/images/products/plant-pot.jpg',
    qty: 6,
    material: 'PLA',
    color: 'Terracotta',
    status: 'Blocked',
    dueDate: '2025-12-22',
    priority: 'Standard',
    payout: 36.00,
    completedAt: null
  },
  {
    id: 'J-2039',
    orderId: 'A-1048',
    product: 'Phone Stand - Adjustable',
    thumbnail: '/images/products/phone-stand.jpg',
    qty: 1,
    material: 'PLA',
    color: 'Space Gray',
    status: 'QC',
    dueDate: '2025-12-21',
    priority: 'Rush',
    payout: 22.80,
    completedAt: null
  },
  {
    id: 'J-2040',
    orderId: 'A-1049',
    product: 'Board Game Token Set',
    thumbnail: '/images/products/tokens.jpg',
    qty: 20,
    material: 'Resin',
    color: 'Metallic Gold',
    status: 'Shipped',
    dueDate: '2025-12-20',
    priority: 'Standard',
    payout: 42.00,
    completedAt: '2025-12-20'
  },
  {
    id: 'J-2041',
    orderId: 'A-1050',
    product: 'Custom Keychain - Logo',
    thumbnail: '/images/products/keychain.jpg',
    qty: 10,
    material: 'PLA',
    color: 'Royal Blue',
    status: 'Queued',
    dueDate: '2025-12-26',
    priority: 'Standard',
    payout: 25.50,
    completedAt: null
  },
  {
    id: 'J-2042',
    orderId: 'A-1051',
    product: 'Mechanical Keyboard Key Set',
    thumbnail: '/images/products/keycaps.jpg',
    qty: 12,
    material: 'Resin',
    color: 'Cherry Red',
    status: 'Printing',
    dueDate: '2025-12-23',
    priority: 'Rush',
    payout: 67.20,
    completedAt: null
  },
  {
    id: 'J-2043',
    orderId: null,
    product: 'Desk Organizer Tray',
    thumbnail: '/images/products/organizer.jpg',
    qty: 1,
    material: 'PETG',
    color: 'Smoke Black',
    status: 'Packing',
    dueDate: '2025-12-22',
    priority: 'Standard',
    payout: 34.75,
    completedAt: null
  },
  {
    id: 'J-2044',
    orderId: 'A-1052',
    product: 'Halloween Mask - Custom',
    thumbnail: '/images/products/mask.jpg',
    qty: 1,
    material: 'PLA',
    color: 'Orange',
    status: 'Delivered',
    dueDate: '2025-11-30',
    priority: 'Rush',
    payout: 58.00,
    completedAt: '2025-11-29'
  },
  {
    id: 'J-2045',
    orderId: 'A-1053',
    product: 'Garden Tool Holder',
    thumbnail: '/images/products/tool-holder.jpg',
    qty: 3,
    material: 'PETG',
    color: 'Forest Green',
    status: 'QC',
    dueDate: '2025-12-24',
    priority: 'Standard',
    payout: 41.25,
    completedAt: null
  },
  {
    id: 'J-2046',
    orderId: 'A-1054',
    product: 'Custom Pendant - Heart Shape',
    thumbnail: '/images/products/pendant.jpg',
    qty: 2,
    material: 'Resin',
    color: 'Rose Gold',
    status: 'Blocked',
    dueDate: '2025-12-21',
    priority: 'Rush',
    payout: 29.90,
    completedAt: null
  },
  {
    id: 'J-2047',
    orderId: 'A-1055',
    product: 'Wall Mount - Camera Bracket',
    thumbnail: '/images/products/bracket.jpg',
    qty: 4,
    material: 'PETG',
    color: 'Matte Black',
    status: 'Shipped',
    dueDate: '2025-12-19',
    priority: 'Standard',
    payout: 33.60,
    completedAt: '2025-12-19'
  },
  {
    id: 'J-2048',
    orderId: null,
    product: 'Miniature Furniture Set',
    thumbnail: '/images/products/furniture.jpg',
    qty: 8,
    material: 'PLA',
    color: 'Wood Brown',
    status: 'Queued',
    dueDate: '2025-12-27',
    priority: 'Standard',
    payout: 48.00,
    completedAt: null
  },
  {
    id: 'J-2049',
    orderId: 'A-1056',
    product: 'Custom Coaster Set',
    thumbnail: '/images/products/coasters.jpg',
    qty: 6,
    material: 'PLA',
    color: 'Marble White',
    status: 'Printing',
    dueDate: '2025-12-23',
    priority: 'Standard',
    payout: 19.80,
    completedAt: null
  },
  {
    id: 'J-2050',
    orderId: 'A-1057',
    product: 'Replacement Car Part - Clip',
    thumbnail: '/images/products/car-clip.jpg',
    qty: 5,
    material: 'ABS',
    color: 'Black',
    status: 'Delivered',
    dueDate: '2025-12-15',
    priority: 'Rush',
    payout: 27.50,
    completedAt: '2025-12-14'
  },
  {
    id: 'J-2051',
    orderId: 'A-1058',
    product: 'Artistic Sculpture - Abstract',
    thumbnail: '/images/products/sculpture.jpg',
    qty: 1,
    material: 'Resin',
    color: 'Metallic Silver',
    status: 'QC',
    dueDate: '2025-12-25',
    priority: 'Standard',
    payout: 78.00,
    completedAt: null
  },
  {
    id: 'J-2052',
    orderId: 'A-1059',
    product: 'Cable Management Clips',
    thumbnail: '/images/products/cable-clips.jpg',
    qty: 15,
    material: 'TPU',
    color: 'Clear',
    status: 'Packing',
    dueDate: '2025-12-22',
    priority: 'Standard',
    payout: 22.50,
    completedAt: null
  },
  {
    id: 'J-2053',
    orderId: null,
    product: 'Custom Vase - Geometric',
    thumbnail: '/images/products/vase.jpg',
    qty: 1,
    material: 'PLA',
    color: 'Gradient Blue',
    status: 'Blocked',
    dueDate: '2025-12-24',
    priority: 'Rush',
    payout: 52.00,
    completedAt: null
  },
  {
    id: 'J-2054',
    orderId: 'A-1060',
    product: 'Prototype Housing - Electronics',
    thumbnail: '/images/products/housing.jpg',
    qty: 3,
    material: 'ABS',
    color: 'Industrial Gray',
    status: 'Shipped',
    dueDate: '2025-12-21',
    priority: 'Rush',
    payout: 95.25,
    completedAt: '2025-12-20'
  },
  {
    id: 'J-2055',
    orderId: 'A-1061',
    product: 'Decorative Lampshade',
    thumbnail: '/images/products/lampshade.jpg',
    qty: 1,
    material: 'PLA',
    color: 'Warm White',
    status: 'Queued',
    dueDate: '2025-12-28',
    priority: 'Standard',
    payout: 44.00,
    completedAt: null
  },
  {
    id: 'J-2056',
    orderId: 'A-1062',
    product: 'Medical Device Prototype',
    thumbnail: '/images/products/medical.jpg',
    qty: 2,
    material: 'Medical Grade Resin',
    color: 'Clear',
    status: 'Printing',
    dueDate: '2025-12-23',
    priority: 'Rush',
    payout: 125.00,
    completedAt: null
  },
  // Add some overdue jobs for testing
  {
    id: 'J-2057',
    orderId: 'A-1063',
    product: 'Overdue Test Job 1',
    thumbnail: '/images/products/test.jpg',
    qty: 1,
    material: 'PLA',
    color: 'Red',
    status: 'Printing',
    dueDate: '2025-12-18',
    priority: 'Rush',
    payout: 30.00,
    completedAt: null
  },
  {
    id: 'J-2058',
    orderId: 'A-1064',
    product: 'Overdue Test Job 2',
    thumbnail: '/images/products/test.jpg',
    qty: 2,
    material: 'ABS',
    color: 'Blue',
    status: 'QC',
    dueDate: '2025-12-19',
    priority: 'Standard',
    payout: 25.00,
    completedAt: null
  }
];

// Create a copy of jobs data that can be modified
const jobsData = [...mockJobsData];

/**
 * Get all jobs as read-only array
 */
export const jobs = mockJobsData;

/**
 * Get jobs with filtering and sorting
 */
export const getJobs = (filters?: JobFilters): Job[] => {
  let filtered = [...jobsData];

  if (!filters) {
    return filtered;
  }

  // Filter by status group
  if (filters.statusGroup && filters.statusGroup !== 'All') {
    switch (filters.statusGroup) {
      case 'Active':
        filtered = filtered.filter(job => ['Queued', 'Printing', 'QC', 'Packing'].includes(job.status));
        break;
      case 'Blocked':
        filtered = filtered.filter(job => job.status === 'Blocked');
        break;
      case 'Shipped':
        filtered = filtered.filter(job => job.status === 'Shipped');
        break;
      case 'Completed':
        filtered = filtered.filter(job => job.status === 'Delivered');
        break;
    }
  }

  // Filter by specific status
  if (filters.status) {
    filtered = filtered.filter(job => job.status === filters.status);
  }

  // Filter by search query (Job ID, product name, order ID)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(job =>
      job.id.toLowerCase().includes(query) ||
      job.product.toLowerCase().includes(query) ||
      (job.orderId && job.orderId.toLowerCase().includes(query))
    );
  }

  // Filter by material
  if (filters.material && filters.material !== 'All') {
    filtered = filtered.filter(job => job.material === filters.material);
  }

  // Filter by priority
  if (filters.priority && filters.priority !== 'All') {
    filtered = filtered.filter(job => job.priority === filters.priority);
  }

  // Sort results
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'due-date-soonest':
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'due-date-latest':
        filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        break;
      case 'payout-highest':
        filtered.sort((a, b) => b.payout - a.payout);
        break;
      case 'updated-latest':
        // For demo purposes, sort by ID (newest first)
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }
  }

  return filtered;
};

/**
 * Get job by ID
 */
export const getJobById = (id: string): Job | undefined => {
  return jobsData.find(job => job.id === id);
};

/**
 * Update job status (UI-only, no DB calls)
 */
export const updateJobStatus = (id: string, status: string): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === id);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];
    const previousStatus = job.status;

    // Update the job status
    jobsData[jobIndex] = {
      ...job,
      status,
      // Update completedAt if status is Delivered or Shipped
      completedAt: ['Delivered', 'Shipped'].includes(status)
        ? new Date().toISOString().split('T')[0]
        : job.completedAt
    };

    // Add activity entry if status changed
    if (previousStatus !== status) {
      addActivityEntry(id, status);
    }

    console.log(`Updated job ${id} status to ${status}`);
    return true;
  }
  console.error(`Job with ID ${id} not found`);
  return false;
};

/**
 * Add activity entry to job timeline
 */
export const addActivityEntry = (id: string, status: string, note?: string): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === id);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];

    // Initialize activity array if it doesn't exist
    if (!job.activity) {
      job.activity = [];
    }

    // Create new activity entry
    const activityEntry: ActivityEntry = {
      id: `${id}-${Date.now()}`,
      status,
      timestamp: new Date().toISOString(),
      note
    };

    // Add to activity array
    job.activity.unshift(activityEntry); // Add to beginning for latest first

    return true;
  }
  return false;
};

/**
 * Get job activity timeline
 */
export const getJobActivity = (id: string): ActivityEntry[] => {
  const job = getJobById(id);
  return job?.activity || [];
};

/**
 * Mark job as blocked with reason (UI-only, no DB calls)
 */
export const markBlocked = (id: string, reason: string): boolean => {
  const success = updateJobStatus(id, 'Blocked');
  if (success) {
    console.log(`Marked job ${id} as blocked. Reason: ${reason}`);
  }
  return success;
};

/**
 * Mark job as shipped with tracking (UI-only, no DB calls)
 */
export const markShipped = (id: string, trackingNumber: string): boolean => {
  const success = updateJobStatus(id, 'Shipped');
  if (success) {
    console.log(`Marked job ${id} as shipped with tracking: ${trackingNumber}`);
  }
  return success;
};

/**
 * Update job production checklist step (UI-only, no DB calls)
 */
export const updateProductionChecklistStep = (
  id: string,
  step: keyof NonNullable<Job['productionChecklist']>,
  completed: boolean
): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === id);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];

    // Initialize checklist if it doesn't exist
    if (!job.productionChecklist) {
      job.productionChecklist = {
        printStarted: false,
        printCompleted: false,
        qcCompleted: false,
        packaged: false,
        labelCreated: false,
        trackingAdded: false
      };
    }

    // Update the specific step
    job.productionChecklist[step] = completed;

    console.log(`Updated job ${id} checklist step ${step} to ${completed}`);
    return true;
  }
  console.error(`Job with ID ${id} not found`);
  return false;
};

/**
 * Get production checklist for a job with default values
 */
export const getProductionChecklist = (job: Job) => {
  const defaultChecklist = {
    printStarted: false,
    printCompleted: false,
    qcCompleted: false,
    packaged: false,
    labelCreated: false,
    trackingAdded: false
  };

  return { ...defaultChecklist, ...job.productionChecklist };
};

/**
 * Mark job as blocked with reason and details (UI-only, no DB calls)
 */
export const markBlockedWithDetails = (id: string, reason: string, details: string): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === id);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];
    const previousStatus = job.status;

    // Update job with blocked status and details
    jobsData[jobIndex] = {
      ...job,
      status: 'Blocked',
      blockedReason: reason,
      blockedDetails: details
    };

    // Add activity entry with details
    addActivityEntry(id, 'Blocked', `${reason}: ${details}`);

    console.log(`Marked job ${id} as blocked. Reason: ${reason}, Details: ${details}`);
    return true;
  }
  console.error(`Job with ID ${id} not found`);
  return false;
};

/**
 * Update job checklist with patch object (UI-only, no DB calls)
 */
export const updateChecklist = (jobId: string, patch: ChecklistPatch): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];

    // Initialize checklist if it doesn't exist
    if (!job.productionChecklist) {
      job.productionChecklist = {
        printStarted: false,
        printCompleted: false,
        qcCompleted: false,
        packaged: false,
        labelCreated: false,
        trackingAdded: false
      };
    }

    // Apply patch to checklist
    Object.assign(job.productionChecklist, patch);

    // Log activity for significant checklist changes
    const completedSteps = Object.entries(patch).filter(([_, value]) => value === true);
    if (completedSteps.length > 0) {
      const stepNames = completedSteps.map(([key]) => key).join(', ');
      addActivityEntry(jobId, job.status, `Completed: ${stepNames}`);
    }

    console.log(`Updated job ${jobId} checklist:`, patch);
    return true;
  }
  console.error(`Job with ID ${jobId} not found`);
  return false;
};

/**
 * Add QC photos metadata to job (UI-only, no DB calls)
 */
export const addQcPhotos = (jobId: string, photosMeta: QcPhotoMeta[]): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];

    // Initialize qcPhotos array if it doesn't exist
    if (!job.qcPhotos) {
      job.qcPhotos = [];
    }

    // Add new photo filenames
    const newFilenames = photosMeta.map(meta => meta.filename);
    job.qcPhotos.push(...newFilenames);

    // Log activity
    addActivityEntry(jobId, job.status, `Added ${photosMeta.length} QC photo(s)`);

    console.log(`Added ${photosMeta.length} QC photos to job ${jobId}:`, photosMeta);
    return true;
  }
  console.error(`Job with ID ${jobId} not found`);
  return false;
};

/**
 * Update job shipping information (UI-only, no DB calls)
 */
export const updateShipping = (jobId: string, shippingInfo: { carrier: string; tracking: string }): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];

    // Update shipping information
    job.shipping = {
      carrier: shippingInfo.carrier,
      trackingNumber: shippingInfo.tracking,
      shippedAt: job.status === 'Shipped' ? new Date().toISOString() : undefined
    };

    // Update tracking added in checklist
    updateProductionChecklistStep(jobId, 'trackingAdded', true);

    // Log activity
    addActivityEntry(jobId, job.status, `Shipping updated: ${shippingInfo.carrier} ${shippingInfo.tracking}`);

    console.log(`Updated job ${jobId} shipping:`, shippingInfo);
    return true;
  }
  console.error(`Job with ID ${jobId} not found`);
  return false;
};

/**
 * Add custom activity entry to job (UI-only, no DB calls)
 */
export const addActivity = (jobId: string, entry: Omit<ActivityEntry, 'id' | 'timestamp'>): boolean => {
  const jobIndex = jobsData.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    const job = jobsData[jobIndex];

    // Initialize activity array if it doesn't exist
    if (!job.activity) {
      job.activity = [];
    }

    // Create complete activity entry
    const activityEntry: ActivityEntry = {
      ...entry,
      id: `${jobId}-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    // Add to activity array
    job.activity.unshift(activityEntry); // Add to beginning for latest first

    console.log(`Added activity to job ${jobId}:`, activityEntry);
    return true;
  }
  console.error(`Job with ID ${jobId} not found`);
  return false;
};
