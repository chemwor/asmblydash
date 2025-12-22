// Designer Files feature module - centralized mock data and helpers

export interface DesignerFile {
  id: string;
  name: string;
  type: 'STL' | 'Render' | 'Notes' | 'Source';
  size: string;
  uploadDate: string;
  updatedDate: string;
  requestId: string;
  requestTitle: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Revision Needed';
  tags: string[];
  version: number;
  downloadUrl: string;
  thumbnailUrl?: string;
  description?: string;
  clientName: string;
  priority: 'Normal' | 'High' | 'Rush';
  isSuperseded?: boolean;
  required?: boolean;
  content?: string; // For Notes type
}

// Filter interface
export interface FileFilters {
  status?: string;
  type?: string;
  requestId?: string;
  required?: string; // 'all' | 'required' | 'optional'
  search?: string;
}

// Mock files data
const mockFiles: DesignerFile[] = [
  {
    id: 'file-001',
    name: 'logo-concept-v2.ai',
    type: 'Source',
    size: '2.4 MB',
    uploadDate: '2025-12-21',
    updatedDate: '2025-12-21',
    requestId: 'DR-2025-001',
    requestTitle: 'Logo Design for Tech Startup',
    status: 'Draft',
    tags: ['logo', 'vector', 'source'],
    version: 2,
    downloadUrl: '/files/logo-concept-v2.ai',
    clientName: 'Sarah Johnson',
    priority: 'High',
    required: true,
    description: 'Latest logo concept with revised color scheme'
  },
  {
    id: 'file-002',
    name: 'logo-render-final.png',
    type: 'Render',
    size: '1.8 MB',
    uploadDate: '2025-12-21',
    updatedDate: '2025-12-21',
    requestId: 'DR-2025-001',
    requestTitle: 'Logo Design for Tech Startup',
    status: 'Submitted',
    tags: ['logo', 'render', 'preview'],
    version: 1,
    downloadUrl: '/files/logo-render-final.png',
    thumbnailUrl: '/images/thumbnails/logo-render-final.jpg',
    clientName: 'Sarah Johnson',
    priority: 'High',
    required: true,
    description: 'Final logo render for client review'
  },
  {
    id: 'file-003',
    name: 'product-model.stl',
    type: 'STL',
    size: '15.2 MB',
    uploadDate: '2025-12-20',
    updatedDate: '2025-12-21',
    requestId: 'DR-2025-002',
    requestTitle: '3D Product Visualization',
    status: 'Approved',
    tags: ['3d', 'stl', 'product'],
    version: 3,
    downloadUrl: '/files/product-model.stl',
    thumbnailUrl: '/images/thumbnails/product-model.jpg',
    clientName: 'Mike Chen',
    priority: 'Normal',
    required: true,
    description: 'Finalized 3D model ready for printing'
  },
  {
    id: 'file-004',
    name: 'Assembly Instructions',
    type: 'Notes',
    size: '2.1 KB',
    uploadDate: '2025-12-20',
    updatedDate: '2025-12-20',
    requestId: 'DR-2025-002',
    requestTitle: '3D Product Visualization',
    status: 'Approved',
    tags: ['assembly', 'instructions'],
    version: 1,
    downloadUrl: '/files/assembly-instructions.txt',
    clientName: 'Mike Chen',
    priority: 'Normal',
    required: false,
    content: 'Step 1: Remove support material\nStep 2: Sand rough edges\nStep 3: Test fit components',
    description: 'Step-by-step assembly guide'
  },
  {
    id: 'file-005',
    name: 'ui-wireframes.sketch',
    type: 'Source',
    size: '8.7 MB',
    uploadDate: '2025-12-19',
    updatedDate: '2025-12-19',
    requestId: 'DR-2025-003',
    requestTitle: 'Mobile App UI Design',
    status: 'Submitted',
    tags: ['ui', 'wireframes'],
    version: 1,
    downloadUrl: '/files/ui-wireframes.sketch',
    clientName: 'Lisa Anderson',
    priority: 'High',
    required: true,
    description: 'Initial wireframes for mobile app'
  },
  {
    id: 'file-006',
    name: 'app-mockup-render.png',
    type: 'Render',
    size: '3.2 MB',
    uploadDate: '2025-12-18',
    updatedDate: '2025-12-18',
    requestId: 'DR-2025-003',
    requestTitle: 'Mobile App UI Design',
    status: 'Revision Needed',
    tags: ['ui', 'mockup'],
    version: 1,
    downloadUrl: '/files/app-mockup-render.png',
    thumbnailUrl: '/images/thumbnails/app-mockup-render.jpg',
    clientName: 'Lisa Anderson',
    priority: 'High',
    required: true,
    description: 'App mockup needs color adjustments'
  }
];

// Export the files array
export const files = mockFiles;

// Basic CRUD helpers
export const getFiles = (filters?: FileFilters): DesignerFile[] => {
  if (!filters) return [...mockFiles];

  return mockFiles.filter(file => {
    // Hide superseded files by default
    if (file.isSuperseded) return false;

    const statusMatch = !filters.status || filters.status === 'all' || file.status === filters.status;
    const typeMatch = !filters.type || filters.type === 'all' || file.type === filters.type;
    const requestMatch = !filters.requestId || filters.requestId === 'all' || file.requestId === filters.requestId;
    const requiredMatch = !filters.required || filters.required === 'all' ||
      (filters.required === 'required' && file.required) ||
      (filters.required === 'optional' && !file.required);
    const searchMatch = !filters.search ||
      file.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      file.requestId.toLowerCase().includes(filters.search.toLowerCase()) ||
      file.requestTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
      file.clientName.toLowerCase().includes(filters.search.toLowerCase());

    return statusMatch && typeMatch && requestMatch && requiredMatch && searchMatch;
  });
};

export const addFile = (fileData: Omit<DesignerFile, 'id' | 'uploadDate' | 'updatedDate'>): DesignerFile => {
  const newFile: DesignerFile = {
    ...fileData,
    id: `file-${Date.now()}`,
    uploadDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
  };

  mockFiles.push(newFile);
  return newFile;
};

export const replaceFile = (fileId: string, newFileData: Partial<DesignerFile>): DesignerFile | null => {
  const fileIndex = mockFiles.findIndex(f => f.id === fileId);
  if (fileIndex === -1) return null;

  const oldFile = mockFiles[fileIndex];

  // Mark old file as superseded
  oldFile.isSuperseded = true;

  // Create new file with incremented version
  const newFile: DesignerFile = {
    ...oldFile,
    ...newFileData,
    id: `file-${Date.now()}`,
    version: oldFile.version + 1,
    uploadDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    isSuperseded: false
  };

  mockFiles.push(newFile);
  return newFile;
};

export const deleteFile = (fileId: string): boolean => {
  const fileIndex = mockFiles.findIndex(f => f.id === fileId);
  if (fileIndex === -1) return false;

  mockFiles.splice(fileIndex, 1);
  return true;
};

export const getNextVersion = (requestId: string, type: DesignerFile['type']): number => {
  const files = mockFiles.filter(f => f.requestId === requestId && f.type === type && !f.isSuperseded);
  const maxVersion = files.reduce((max, file) => Math.max(max, file.version), 0);
  return maxVersion + 1;
};

// Computed helpers
export const filesLinkedToActive = (): number => {
  // Count files linked to active requests (not superseded)
  const activeFiles = mockFiles.filter(file => !file.isSuperseded);
  return activeFiles.length;
};

export const deliverablesMissingCount = (): number => {
  // Get unique requests from files
  const requestIds = new Set(mockFiles.filter(f => !f.isSuperseded).map(f => f.requestId));

  let missingCount = 0;
  requestIds.forEach(requestId => {
    const requestFiles = mockFiles.filter(f => f.requestId === requestId && !f.isSuperseded);
    const existingTypes = new Set(requestFiles.map(f => f.type));

    // Assume STL and Render are typically required
    const requiredTypes: DesignerFile['type'][] = ['STL', 'Render'];
    const missingTypes = requiredTypes.filter(type => !existingTypes.has(type));

    missingCount += missingTypes.length;
  });

  return missingCount;
};

export const uploadsLast7d = (): number => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentUploads = mockFiles.filter(file => {
    if (file.isSuperseded) return false;
    const uploadDate = new Date(file.uploadDate);
    return uploadDate >= sevenDaysAgo;
  });

  return recentUploads.length;
};

export const requestsInReviewCount = (): number => {
  // Count unique requests that have files in 'Submitted' status
  const requestsInReview = new Set();

  mockFiles.forEach(file => {
    if (!file.isSuperseded && file.status === 'Submitted') {
      requestsInReview.add(file.requestId);
    }
  });

  return requestsInReview.size;
};
