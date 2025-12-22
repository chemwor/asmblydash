export interface Job {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'paused';
  requiresQcPhotos?: boolean;
  productName?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  source: 'Maker' | 'Seller' | 'Designer' | 'System';
  linkedJobId?: string;
  proofType?: 'QC Photos' | 'Packaging Photo' | 'Label Photo' | 'Other';
  updated: string;
  url: string;
}

export interface FilterState {
  search: string;
  type: string;
  source: string;
  job: string;
  qcRequiredOnly: boolean;
}

export interface ProofUploadPayload {
  linkedJobId: string;
  proofType: 'QC Photos' | 'Packaging Photo' | 'Label Photo' | 'Other';
  notes: string;
  files: File[];
}

// Mock data
export const mockJobs: Job[] = [
  { id: 'job-001', title: 'Custom Phone Case - iPhone 15', status: 'active', requiresQcPhotos: true, productName: 'iPhone 15 Case' },
  { id: 'job-002', title: 'Miniature Dragon Figure', status: 'active', requiresQcPhotos: false, productName: 'Dragon Figure' },
  { id: 'job-003', title: 'Automotive Part - Brake Mount', status: 'active', requiresQcPhotos: true, productName: 'Brake Mount' },
  { id: 'job-004', title: 'Jewelry Display Stand', status: 'active', requiresQcPhotos: false, productName: 'Display Stand' },
  { id: 'job-005', title: 'Custom Keychain Set', status: 'completed', requiresQcPhotos: true, productName: 'Keychain Set' },
];

let mockFiles: FileItem[] = [
  {
    id: 'file-001',
    name: 'phone-case-design.stl',
    type: 'STL',
    size: '2.4 MB',
    source: 'Seller',
    linkedJobId: 'job-001',
    updated: '2 hours ago',
    url: '#'
  },
  {
    id: 'file-002',
    name: 'dragon-reference.jpg',
    type: 'IMAGE',
    size: '845 KB',
    source: 'Designer',
    linkedJobId: 'job-002',
    updated: '1 day ago',
    url: '#'
  },
  {
    id: 'file-003',
    name: 'brake-mount-specs.pdf',
    type: 'PDF',
    size: '1.2 MB',
    source: 'System',
    linkedJobId: 'job-003',
    updated: '3 days ago',
    url: '#'
  },
  {
    id: 'file-004',
    name: 'assembly-instructions.zip',
    type: 'ZIP',
    size: '5.1 MB',
    source: 'Seller',
    linkedJobId: 'job-004',
    updated: '1 week ago',
    url: '#'
  }
];

// Helper functions
export const getFiles = (filters: FilterState): FileItem[] => {
  return mockFiles.filter(file => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const job = mockJobs.find(j => j.id === file.linkedJobId);
      const matchesName = file.name.toLowerCase().includes(searchTerm);
      const matchesJobId = file.linkedJobId?.toLowerCase().includes(searchTerm);
      const matchesProductName = job?.productName?.toLowerCase().includes(searchTerm);

      if (!matchesName && !matchesJobId && !matchesProductName) {
        return false;
      }
    }

    // Type filter
    if (filters.type !== 'All' && file.type !== filters.type) {
      return false;
    }

    // Source filter
    if (filters.source !== 'All' && file.source !== filters.source) {
      return false;
    }

    // Job filter
    if (filters.job !== 'All' && file.linkedJobId !== filters.job) {
      return false;
    }

    // QC Required Only filter
    if (filters.qcRequiredOnly) {
      const job = mockJobs.find(j => j.id === file.linkedJobId);
      const hasQcProof = mockFiles.some(f =>
        f.linkedJobId === file.linkedJobId &&
        f.proofType === 'QC Photos' &&
        f.source === 'Maker'
      );

      if (!job?.requiresQcPhotos || hasQcProof) {
        return false;
      }
    }

    return true;
  });
};

export const addProofUpload = (payload: ProofUploadPayload): FileItem[] => {
  const newFiles: FileItem[] = payload.files.map((file, index) => ({
    id: `file-${Date.now()}-${index}`,
    name: file.name,
    type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
    size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
    source: 'Maker',
    linkedJobId: payload.linkedJobId,
    proofType: payload.proofType,
    updated: 'Just now',
    url: '#'
  }));

  // Add new files to the beginning of the array
  mockFiles = [...newFiles, ...mockFiles];
  return mockFiles;
};

export const getQcRequiredCount = (jobs: Job[], files: FileItem[]): number => {
  return jobs.filter(job => {
    if (!job.requiresQcPhotos || job.status !== 'active') return false;

    const hasQcProof = files.some(f =>
      f.linkedJobId === job.id &&
      f.proofType === 'QC Photos' &&
      f.source === 'Maker'
    );

    return !hasQcProof;
  }).length;
};

export const deleteMakerFiles = (ids: string[]): FileItem[] => {
  mockFiles = mockFiles.filter(file =>
    !ids.includes(file.id) || file.source !== 'Maker'
  );
  return mockFiles;
};

// Export the files array (getter function to always return current state)
export const getAllFiles = (): FileItem[] => {
  return [...mockFiles];
};
