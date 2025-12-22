// Maker Support feature module - mock data and helpers

export interface MakerSupportCase {
  id: string;
  caseId: string;
  shortTitle: string;
  type: 'Print Failure' | 'Reprint' | 'QC Dispute' | 'Shipping' | 'File Issue' | 'Other';
  title: string;
  description: string;
  status: 'Open' | 'Waiting on Maker' | 'Waiting on Seller' | 'In Review' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  createdDate: string;
  updatedDate: string;
  linkedJobId?: string;
  assignedTo?: string;
  sla: {
    status: 'Due' | 'Overdue';
    daysLeft?: number;
    daysOverdue?: number;
    dueDate: string;
  };
  statusClass: string;
  priorityClass: string;
  typeClass: string;
  slaClass: string;
}

// SLA calculation helper functions
const getSLATargetDays = (priority: MakerSupportCase['priority']): number => {
  const slaTargets = {
    'Low': 7,
    'Normal': 5,
    'High': 3,
    'Urgent': 1
  };
  return slaTargets[priority];
};

const calculateSLADueDate = (createdDate: string, priority: MakerSupportCase['priority']): string => {
  const created = new Date(createdDate);
  const targetDays = getSLATargetDays(priority);
  const dueDate = new Date(created);
  dueDate.setDate(created.getDate() + targetDays);
  return dueDate.toISOString().split('T')[0];
};

const calculateSLAStatus = (createdDate: string, priority: MakerSupportCase['priority'], status: MakerSupportCase['status']) => {
  // Resolved and Closed cases don't have SLA calculations
  if (status === 'Resolved' || status === 'Closed') {
    return {
      status: 'Due' as const,
      daysLeft: 0,
      dueDate: calculateSLADueDate(createdDate, priority)
    };
  }

  const dueDate = calculateSLADueDate(createdDate, priority);
  const today = new Date();
  const due = new Date(dueDate);

  // Reset time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const timeDiff = due.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff >= 0) {
    return {
      status: 'Due' as const,
      daysLeft: daysDiff,
      dueDate
    };
  } else {
    return {
      status: 'Overdue' as const,
      daysOverdue: Math.abs(daysDiff),
      dueDate
    };
  }
};

const getSLAClass = (slaStatus: 'Due' | 'Overdue', daysLeft?: number): string => {
  if (slaStatus === 'Overdue') {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }

  if (daysLeft !== undefined) {
    if (daysLeft <= 1) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
    if (daysLeft <= 2) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
  }

  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
};

// Mock support cases data - updated with proper SLA calculations
const createMockCase = (caseData: Omit<MakerSupportCase, 'sla' | 'statusClass' | 'priorityClass' | 'typeClass' | 'slaClass'>): MakerSupportCase => {
  const slaInfo = calculateSLAStatus(caseData.createdDate, caseData.priority, caseData.status);

  return {
    ...caseData,
    sla: {
      ...slaInfo
    },
    statusClass: caseData.status === 'Open' || caseData.status === 'In Review' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : caseData.status === 'Waiting on Maker' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : caseData.status === 'Waiting on Seller' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : caseData.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    priorityClass: caseData.priority === 'Urgent' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : caseData.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : caseData.priority === 'Normal' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    typeClass: caseData.type === 'Print Failure' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : caseData.type === 'Reprint' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : caseData.type === 'QC Dispute' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : caseData.type === 'Shipping' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      : caseData.type === 'File Issue' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    slaClass: getSLAClass(slaInfo.status, slaInfo.daysLeft)
  };
};

const mockSupportCases: MakerSupportCase[] = [
  createMockCase({
    id: '1',
    caseId: 'CS-2024-001',
    shortTitle: 'Layer separation in complex geometry',
    type: 'Print Failure',
    title: 'Print failure - layer separation in complex geometry',
    description: 'Customer reporting layer separation issues in complex geometrical parts. Print quality degraded after temperature adjustment.',
    status: 'Open',
    priority: 'High',
    createdDate: '2024-12-20',
    updatedDate: '2024-12-21',
    linkedJobId: 'JOB-2024-145',
    assignedTo: 'Support Team'
  }),
  createMockCase({
    id: '2',
    caseId: 'CS-2024-002',
    shortTitle: 'Missing support material caused failure',
    type: 'Print Failure',
    title: 'Print failure due to missing support material',
    description: 'Print failed due to inadequate support structure. Customer requires reprint with proper support generation.',
    status: 'Waiting on Seller',
    priority: 'High',
    createdDate: '2024-12-17',
    updatedDate: '2024-12-19',
    linkedJobId: 'JOB-2024-132',
    assignedTo: 'Quality Team'
  }),
  createMockCase({
    id: '3',
    caseId: 'CS-2024-003',
    shortTitle: 'Customer requests part reprint',
    type: 'Reprint',
    title: 'Reprint request for damaged parts',
    description: 'Customer received damaged parts during shipping. Requesting complete reprint of 5 components.',
    status: 'Waiting on Maker',
    priority: 'Normal',
    createdDate: '2024-12-19',
    updatedDate: '2024-12-20',
    linkedJobId: 'JOB-2024-149',
    assignedTo: 'Production Team'
  }),
  createMockCase({
    id: '4',
    caseId: 'CS-2024-004',
    shortTitle: 'Dimensional accuracy dispute',
    type: 'QC Dispute',
    title: 'Quality control dispute - dimensional accuracy',
    description: 'Customer disputes part dimensions claiming they do not meet specification tolerances. QC review required.',
    status: 'In Review',
    priority: 'High',
    createdDate: '2024-12-17',
    updatedDate: '2024-12-18',
    linkedJobId: 'JOB-2024-128',
    assignedTo: 'QC Manager'
  }),
  createMockCase({
    id: '5',
    caseId: 'CS-2024-005',
    shortTitle: 'Delayed shipment inquiry',
    type: 'Shipping',
    title: 'Shipping delay notification and tracking',
    description: 'Customer inquiring about delayed shipment. Package appears to be stuck in transit for 3 days.',
    status: 'Open',
    priority: 'Normal',
    createdDate: '2024-12-16',
    updatedDate: '2024-12-17',
    linkedJobId: 'JOB-2024-115',
    assignedTo: 'Shipping Team'
  }),
  createMockCase({
    id: '6',
    caseId: 'CS-2024-006',
    shortTitle: 'STL file corrupted on upload',
    type: 'File Issue',
    title: 'File upload corruption - STL parsing error',
    description: 'STL file appears corrupted after upload. Geometry errors preventing proper slicing and print preparation.',
    status: 'Waiting on Seller',
    priority: 'Normal',
    createdDate: '2024-12-13',
    updatedDate: '2024-12-16',
    linkedJobId: 'JOB-2024-108',
    assignedTo: 'Tech Support'
  }),
  createMockCase({
    id: '7',
    caseId: 'CS-2024-007',
    shortTitle: 'Payment processing issue',
    type: 'Other',
    title: 'Payment processing failure',
    description: 'Customer payment failed to process. Payment gateway reported insufficient funds but customer claims account has balance.',
    status: 'In Review',
    priority: 'High',
    createdDate: '2024-12-18',
    updatedDate: '2024-12-21',
    assignedTo: 'Finance Team'
  }),
  createMockCase({
    id: '8',
    caseId: 'CS-2024-008',
    shortTitle: 'Surface finish quality issue',
    type: 'Print Failure',
    title: 'Poor surface finish quality',
    description: 'Customer reports poor surface finish on printed parts. Layer lines visible and surface rough to touch.',
    status: 'Resolved',
    priority: 'Normal',
    createdDate: '2024-12-10',
    updatedDate: '2024-12-14',
    linkedJobId: 'JOB-2024-095',
    assignedTo: 'Quality Team'
  }),
  createMockCase({
    id: '9',
    caseId: 'CS-2024-009',
    shortTitle: 'Express shipping not processed',
    type: 'Shipping',
    title: 'Express shipping upgrade not applied',
    description: 'Customer paid for express shipping but package was sent via standard shipping. Refund or credit required.',
    status: 'Open',
    priority: 'High',
    createdDate: '2024-12-18',
    updatedDate: '2024-12-21',
    linkedJobId: 'JOB-2024-142',
    assignedTo: 'Shipping Team'
  }),
  createMockCase({
    id: '10',
    caseId: 'CS-2024-010',
    shortTitle: 'Wrong material used in print',
    type: 'Print Failure',
    title: 'Incorrect material selection - reprint required',
    description: 'Parts were printed in PLA instead of requested PETG material. Customer requires complete reprint.',
    status: 'Waiting on Maker',
    priority: 'Urgent',
    createdDate: '2024-12-20',
    updatedDate: '2024-12-20',
    linkedJobId: 'JOB-2024-135',
    assignedTo: 'Production Manager'
  }),
  createMockCase({
    id: '11', caseId: 'CS-2024-011', shortTitle: 'Warping in large flat parts', type: 'Print Failure',
    title: 'Print warping issue', description: 'Large flat parts showing significant warping.', status: 'Open', priority: 'Normal',
    createdDate: '2024-12-15', updatedDate: '2024-12-16', linkedJobId: 'JOB-2024-101', assignedTo: 'Tech Support'
  }),
  createMockCase({
    id: '12', caseId: 'CS-2024-012', shortTitle: 'Reprint for damaged packaging', type: 'Reprint',
    title: 'Reprint due to shipping damage', description: 'Parts damaged due to inadequate packaging.', status: 'In Review', priority: 'Normal',
    createdDate: '2024-12-14', updatedDate: '2024-12-15', linkedJobId: 'JOB-2024-098', assignedTo: 'Quality Team'
  }),
  createMockCase({
    id: '13', caseId: 'CS-2024-013', shortTitle: 'Color mismatch dispute', type: 'QC Dispute',
    title: 'Color does not match sample', description: 'Customer claims printed color differs from provided sample.', status: 'Waiting on Seller', priority: 'Low',
    createdDate: '2024-12-13', updatedDate: '2024-12-14', linkedJobId: 'JOB-2024-092', assignedTo: 'QC Team'
  }),
  createMockCase({
    id: '14', caseId: 'CS-2024-014', shortTitle: 'Lost package investigation', type: 'Shipping',
    title: 'Package lost in transit', description: 'Package tracking shows delivered but customer never received it.', status: 'Open', priority: 'High',
    createdDate: '2024-12-12', updatedDate: '2024-12-13', linkedJobId: 'JOB-2024-088', assignedTo: 'Shipping Team'
  }),
  createMockCase({
    id: '15', caseId: 'CS-2024-015', shortTitle: 'Unsupported file format', type: 'File Issue',
    title: 'File format not supported', description: 'Customer uploaded .blend file instead of STL format.', status: 'Resolved', priority: 'Low',
    createdDate: '2024-12-11', updatedDate: '2024-12-12', linkedJobId: 'JOB-2024-085', assignedTo: 'Tech Support'
  }),
  createMockCase({
    id: '16', caseId: 'CS-2024-016', shortTitle: 'Account access issue', type: 'Other',
    title: 'Cannot access customer account', description: 'Customer unable to log into their account to view order status.', status: 'Waiting on Maker', priority: 'Normal',
    createdDate: '2024-12-10', updatedDate: '2024-12-11', assignedTo: 'Tech Support'
  }),
  createMockCase({
    id: '17', caseId: 'CS-2024-017', shortTitle: 'Infill percentage incorrect', type: 'Print Failure',
    title: 'Wrong infill density used', description: 'Parts printed with 20% infill instead of requested 80% infill.', status: 'Closed', priority: 'High',
    createdDate: '2024-12-09', updatedDate: '2024-12-10', linkedJobId: 'JOB-2024-078', assignedTo: 'Production Team'
  }),
  createMockCase({
    id: '18', caseId: 'CS-2024-018', shortTitle: 'Rush order reprint needed', type: 'Reprint',
    title: 'Urgent reprint for trade show', description: 'Customer needs emergency reprint for upcoming trade show presentation.', status: 'Open', priority: 'Urgent',
    createdDate: '2024-12-21', updatedDate: '2024-12-21', linkedJobId: 'JOB-2024-156', assignedTo: 'Production Manager'
  }),
  createMockCase({
    id: '19', caseId: 'CS-2024-019', shortTitle: 'Tolerance specification dispute', type: 'QC Dispute',
    title: 'Part tolerance outside specifications', description: 'Customer claims part tolerances exceed acceptable limits for application.', status: 'In Review', priority: 'High',
    createdDate: '2024-12-08', updatedDate: '2024-12-09', linkedJobId: 'JOB-2024-074', assignedTo: 'QC Manager'
  }),
  createMockCase({
    id: '20', caseId: 'CS-2024-020', shortTitle: 'International shipping delay', type: 'Shipping',
    title: 'Customs clearance delayed', description: 'International shipment held up in customs for additional documentation.', status: 'Waiting on Seller', priority: 'Normal',
    createdDate: '2024-12-07', updatedDate: '2024-12-08', linkedJobId: 'JOB-2024-069', assignedTo: 'Shipping Team'
  })
];

// Combine all cases
const allMockCases = [...mockSupportCases];

export interface GetCasesParams {
  searchTerm?: string;
  type?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
}

// Helper function to get filtered and sorted cases
export const getMakerSupportCases = (params: GetCasesParams = {}): MakerSupportCase[] => {
  const {
    searchTerm = '',
    type = 'All',
    status = 'All',
    priority = 'All',
    sortBy = 'Updated (desc)'
  } = params;

  let filtered = [...allMockCases];

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (case_) =>
        case_.caseId.toLowerCase().includes(term) ||
        case_.title.toLowerCase().includes(term) ||
        case_.shortTitle.toLowerCase().includes(term) ||
        case_.linkedJobId?.toLowerCase().includes(term)
    );
  }

  // Filter by type
  if (type !== 'All') {
    filtered = filtered.filter((case_) => case_.type === type);
  }

  // Filter by status
  if (status !== 'All') {
    if (status === 'Open') {
      filtered = filtered.filter((case_) => case_.status === 'Open' || case_.status === 'In Review');
    } else if (status === 'Waiting') {
      filtered = filtered.filter((case_) => case_.status === 'Waiting on Maker' || case_.status === 'Waiting on Seller');
    } else if (status === 'Waiting on You') {
      filtered = filtered.filter((case_) => case_.status === 'Waiting on Maker');
    } else if (status === 'Waiting on Seller') {
      filtered = filtered.filter((case_) => case_.status === 'Waiting on Seller');
    } else if (status === 'Resolved') {
      filtered = filtered.filter((case_) => case_.status === 'Resolved' || case_.status === 'Closed');
    } else {
      filtered = filtered.filter((case_) => case_.status === status);
    }
  }

  // Filter by priority
  if (priority !== 'All') {
    filtered = filtered.filter((case_) => case_.priority === priority);
  }

  // Sort results
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'Created (asc)':
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      case 'Created (desc)':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case 'Updated (asc)':
        return new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime();
      case 'Updated (desc)':
      default:
        return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
      case 'SLA (overdue)':
        // Sort by SLA status first (overdue first), then by days
        const aOverdue = a.sla.status === 'Overdue' ? -1 : 1;
        const bOverdue = b.sla.status === 'Overdue' ? -1 : 1;
        if (aOverdue !== bOverdue) return aOverdue - bOverdue;
        // If both overdue, sort by days overdue (most overdue first)
        if (a.sla.status === 'Overdue' && b.sla.status === 'Overdue') {
          return (b.sla.daysOverdue || 0) - (a.sla.daysOverdue || 0);
        }
        // If both due, sort by days left (least time first)
        return (a.sla.daysLeft || 0) - (b.sla.daysLeft || 0);
      case 'Priority (urgent)':
        // Sort by priority: Urgent, High, Normal, Low
        const priorityOrder = { 'Urgent': 0, 'High': 1, 'Normal': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  });

  return filtered;
};

// Helper to get all cases (for calculating KPIs)
export const getAllMakerSupportCases = (): MakerSupportCase[] => {
  return [...allMockCases];
};

// Helper to add a new case
export const addMakerSupportCase = (caseData: {
  type: MakerSupportCase['type'];
  priority: MakerSupportCase['priority'];
  subject: string;
  description: string;
  linkedJobId?: string;
}): MakerSupportCase => {
  const createdDate = new Date().toISOString().split('T')[0];
  const slaInfo = calculateSLAStatus(createdDate, caseData.priority, 'Open');

  const newCase: MakerSupportCase = {
    id: (allMockCases.length + 1).toString(),
    caseId: `CS-2024-${String(allMockCases.length + 1).padStart(3, '0')}`,
    shortTitle: caseData.subject,
    type: caseData.type,
    title: caseData.subject,
    description: caseData.description,
    status: 'Open',
    priority: caseData.priority,
    createdDate,
    updatedDate: createdDate,
    linkedJobId: caseData.linkedJobId,
    sla: slaInfo,
    statusClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    priorityClass: caseData.priority === 'Urgent' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : caseData.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : caseData.priority === 'Normal' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    typeClass: caseData.type === 'Print Failure' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : caseData.type === 'Reprint' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : caseData.type === 'QC Dispute' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : caseData.type === 'Shipping' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      : caseData.type === 'File Issue' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    slaClass: getSLAClass(slaInfo.status, slaInfo.daysLeft)
  };

  allMockCases.push(newCase);
  return newCase;
};

// Helper to get a case by ID
export const getMakerSupportCaseById = (caseId: string): MakerSupportCase | null => {
  return allMockCases.find(supportCase => supportCase.id === caseId) || null;
};

// Helper to update case status
export const updateMakerSupportCaseStatus = (caseId: string, newStatus: MakerSupportCase['status']): boolean => {
  const caseIndex = allMockCases.findIndex(supportCase => supportCase.id === caseId);

  if (caseIndex === -1) {
    return false;
  }

  const caseToUpdate = allMockCases[caseIndex];
  caseToUpdate.status = newStatus;
  caseToUpdate.updatedDate = new Date().toISOString().split('T')[0];

  // Recalculate SLA based on new status
  const slaInfo = calculateSLAStatus(caseToUpdate.createdDate, caseToUpdate.priority, newStatus);
  caseToUpdate.sla = slaInfo;
  caseToUpdate.slaClass = getSLAClass(slaInfo.status, slaInfo.daysLeft);

  // Update status class based on new status
  const statusClasses = {
    'Open': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Waiting on Maker': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Waiting on Seller': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'In Review': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  caseToUpdate.statusClass = statusClasses[newStatus];

  return true;
};

// Export SLA helper functions for use in components
export { getSLATargetDays, calculateSLAStatus, getSLAClass };
