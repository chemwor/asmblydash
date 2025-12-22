// Designer Requests feature module - centralized mock data and helpers

export interface DesignerRequest {
  id: string;
  requestId: string;
  title: string;
  description: string;
  type: 'Logo Design' | '3D Model' | 'UI/UX Design' | 'Product Design' | 'Packaging' | 'Illustration' | 'Other';
  status: 'New' | 'In Progress' | 'In Review' | 'Revision Needed' | 'Approved' | 'Delivered' | 'Blocked';
  priority: 'Normal' | 'High' | 'Rush';
  clientName: string;
  clientEmail: string;
  budget: number;
  dueDate: string;
  createdDate: string;
  updatedDate: string;
  submittedDate?: string;
  approvedDate?: string;
  completedDate?: string;
  revisionCount: number;
  maxRevisions: number;
  files: string[];
  tags: string[];
  statusClass: string;
  priorityClass: string;
  typeClass: string;
  printabilityIssue?: boolean;
  missingReference?: boolean;
  reviewNotes?: string;
  deliverables?: {
    stlFiles: DeliverableItem[];
    renderPreviews: DeliverableItem[];
    assemblyNotes: DeliverableItem[];
    sourceFiles: DeliverableItem[];
  };
  messages?: Message[];
  notes?: Note[];
  activityLog?: ActivityEntry[];
}

export interface DeliverableItem {
  id: string;
  name: string;
  uploadDate: string;
  type: 'stl' | 'render' | 'notes' | 'source';
  size: string;
}

export interface Message {
  id: string;
  sender: 'Designer' | 'Client' | 'Support';
  timestamp: string;
  body: string;
  attachments?: string[];
}

export interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  internal: boolean;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'status' | 'deliverable' | 'message' | 'note';
}

// Filter interface
export interface RequestFilters {
  status?: string;
  priority?: string;
  type?: string;
  clientName?: string;
  search?: string;
}

// Helper to create mock request with proper styling classes
const createMockRequest = (requestData: Omit<DesignerRequest, 'statusClass' | 'priorityClass' | 'typeClass'>): DesignerRequest => {
  return {
    ...requestData,
    deliverables: requestData.deliverables || {
      stlFiles: [],
      renderPreviews: [],
      assemblyNotes: [],
      sourceFiles: []
    },
    messages: requestData.messages || [],
    notes: requestData.notes || [],
    activityLog: requestData.activityLog || [],
    statusClass: requestData.status === 'New' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      : requestData.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : requestData.status === 'In Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : requestData.status === 'Revision Needed' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : requestData.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : requestData.status === 'Delivered' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    priorityClass: requestData.priority === 'Rush' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : requestData.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    typeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  };
};

// Mock data array
export const designerRequests: DesignerRequest[] = [
  createMockRequest({
    id: 'dr-001',
    requestId: 'DR-2025-001',
    title: 'Logo Design for Tech Startup',
    description: 'Modern, minimalist logo for a new AI technology startup. Should convey innovation and reliability.',
    type: 'Logo Design',
    status: 'New',
    priority: 'High',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah.johnson@techstartup.com',
    budget: 2500,
    dueDate: '2025-12-25',
    createdDate: '2025-12-20',
    updatedDate: '2025-12-20',
    revisionCount: 0,
    maxRevisions: 3,
    files: [],
    tags: ['logo', 'branding', 'tech', 'startup']
  }),
  createMockRequest({
    id: 'dr-002',
    requestId: 'DR-2025-002',
    title: '3D Product Visualization',
    description: 'High-quality 3D renders for new product launch. Need multiple angles and lighting setups.',
    type: '3D Model',
    status: 'In Progress',
    priority: 'Normal',
    clientName: 'Mike Chen',
    clientEmail: 'mike.chen@productco.com',
    budget: 1800,
    dueDate: '2025-12-28',
    createdDate: '2025-12-18',
    updatedDate: '2025-12-21',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['initial-concept.jpg'],
    tags: ['3d', 'product', 'visualization'],
    deliverables: {
      stlFiles: [
        {
          id: 'stl-001',
          name: 'product-model.stl',
          uploadDate: '2025-12-21',
          type: 'stl',
          size: '15.2 MB'
        }
      ],
      renderPreviews: [
        {
          id: 'render-001',
          name: 'product-render-1.png',
          uploadDate: '2025-12-21',
          type: 'render',
          size: '8.5 MB'
        }
      ],
      assemblyNotes: [],
      sourceFiles: []
    }
  }),
  createMockRequest({
    id: 'dr-003',
    requestId: 'DR-2025-003',
    title: 'Mobile App UI Design',
    description: 'Complete UI/UX design for fitness tracking mobile application. iOS and Android versions needed.',
    type: 'UI/UX Design',
    status: 'In Review',
    priority: 'High',
    clientName: 'Lisa Anderson',
    clientEmail: 'lisa.anderson@fitnessapp.com',
    budget: 4200,
    dueDate: '2025-12-30',
    createdDate: '2025-12-15',
    updatedDate: '2025-12-20',
    submittedDate: '2025-12-20',
    revisionCount: 0,
    maxRevisions: 4,
    files: ['wireframes.sketch', 'user-flow.pdf'],
    tags: ['ui', 'ux', 'mobile', 'app', 'fitness']
  }),
  createMockRequest({
    id: 'dr-004',
    requestId: 'DR-2025-004',
    title: 'Product Packaging Design',
    description: 'Eco-friendly packaging design for organic skincare products. Must align with sustainability brand values.',
    type: 'Packaging',
    status: 'Revision Needed',
    priority: 'Normal',
    clientName: 'Emma Wilson',
    clientEmail: 'emma.wilson@organicskin.com',
    budget: 1500,
    dueDate: '2025-12-27',
    createdDate: '2025-12-16',
    updatedDate: '2025-12-21',
    revisionCount: 2,
    maxRevisions: 3,
    files: ['brand-guidelines.pdf', 'product-photos.zip'],
    tags: ['packaging', 'eco-friendly', 'skincare', 'branding'],
    reviewNotes: 'Color palette needs adjustment to better reflect eco-friendly theme.'
  }),
  createMockRequest({
    id: 'dr-005',
    requestId: 'DR-2025-005',
    title: 'Website Illustration Set',
    description: 'Custom illustrations for company website homepage. Need 5-6 cohesive illustrations showing different services.',
    type: 'Illustration',
    status: 'Approved',
    priority: 'Normal',
    clientName: 'David Park',
    clientEmail: 'david.park@webservices.com',
    budget: 3200,
    dueDate: '2025-12-24',
    createdDate: '2025-12-12',
    updatedDate: '2025-12-19',
    approvedDate: '2025-12-19',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['style-reference.pdf', 'content-outline.docx'],
    tags: ['illustration', 'website', 'services', 'digital']
  }),
  createMockRequest({
    id: 'dr-006',
    requestId: 'DR-2025-006',
    title: 'Rush Logo Redesign',
    description: 'Urgent logo redesign for rebranding campaign. Current logo needs modernization while maintaining brand recognition.',
    type: 'Logo Design',
    status: 'Delivered',
    priority: 'Rush',
    clientName: 'Jennifer Taylor',
    clientEmail: 'jennifer.taylor@rebrand.com',
    budget: 3500,
    dueDate: '2025-12-22',
    createdDate: '2025-12-17',
    updatedDate: '2025-12-20',
    completedDate: '2025-12-20',
    revisionCount: 2,
    maxRevisions: 3,
    files: ['current-logo.ai', 'brand-history.pdf'],
    tags: ['logo', 'redesign', 'rebranding', 'urgent']
  })
];

// Helper functions
export const getRequests = (filters?: RequestFilters): DesignerRequest[] => {
  if (!filters) return designerRequests;

  return designerRequests.filter(request => {
    const statusMatch = !filters.status || filters.status === 'all' || request.status === filters.status;
    const priorityMatch = !filters.priority || filters.priority === 'all' || request.priority === filters.priority;
    const typeMatch = !filters.type || filters.type === 'all' || request.type === filters.type;
    const clientMatch = !filters.clientName || filters.clientName === 'all' || request.clientName === filters.clientName;

    const searchMatch = !filters.search ||
      request.requestId.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.clientName.toLowerCase().includes(filters.search.toLowerCase());

    return statusMatch && priorityMatch && typeMatch && clientMatch && searchMatch;
  });
};

export const addRequest = (payload: Omit<DesignerRequest, 'id' | 'requestId' | 'createdDate' | 'updatedDate' | 'statusClass' | 'priorityClass' | 'typeClass'>): DesignerRequest => {
  // Generate new ID and request ID
  const newId = `dr-${String(designerRequests.length + 1).padStart(3, '0')}`;
  const newRequestId = `DR-2025-${String(designerRequests.length + 1).padStart(3, '0')}`;

  const newRequest = createMockRequest({
    ...payload,
    id: newId,
    requestId: newRequestId,
    createdDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0]
  });

  designerRequests.push(newRequest);
  return newRequest;
};

export const getRequestById = (requestId: string): DesignerRequest | undefined => {
  return designerRequests.find(request => request.id === requestId);
};

export const updateRequestStatus = (requestId: string, newStatus: DesignerRequest['status']): boolean => {
  const requestIndex = designerRequests.findIndex(request => request.id === requestId);
  if (requestIndex === -1) return false;

  designerRequests[requestIndex] = createMockRequest({
    ...designerRequests[requestIndex],
    status: newStatus,
    updatedDate: new Date().toISOString().split('T')[0]
  });

  // Add activity log entry for status change
  addActivity(requestId, {
    text: `Status changed to ${newStatus}`,
    type: 'status'
  });

  return true;
};

export const updateRequestDeliverables = (requestId: string, deliverables: DesignerRequest['deliverables']): boolean => {
  const requestIndex = designerRequests.findIndex(request => request.id === requestId);
  if (requestIndex === -1) return false;

  designerRequests[requestIndex] = {
    ...designerRequests[requestIndex],
    deliverables,
    updatedDate: new Date().toISOString().split('T')[0]
  };

  return true;
};

// New helper functions for refactored behaviors

export const addDeliverable = (requestId: string, type: 'stl' | 'render' | 'notes' | 'source', fileMeta: Omit<DeliverableItem, 'id' | 'type'>): boolean => {
  const request = getRequestById(requestId);
  if (!request || !request.deliverables) return false;

  const newDeliverable: DeliverableItem = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    ...fileMeta
  };

  const typeMapping = {
    'stl': 'stlFiles',
    'render': 'renderPreviews',
    'notes': 'assemblyNotes',
    'source': 'sourceFiles'
  } as const;

  const arrayKey = typeMapping[type];
  request.deliverables[arrayKey].push(newDeliverable);
  request.updatedDate = new Date().toISOString().split('T')[0];

  // Add activity log entry
  addActivity(requestId, {
    text: `Uploaded ${type === 'stl' ? 'STL file' : type === 'render' ? 'render preview' : type === 'notes' ? 'assembly notes' : 'source file'}: ${fileMeta.name}`,
    type: 'deliverable'
  });

  return true;
};

export const removeDeliverable = (requestId: string, deliverableId: string): boolean => {
  const request = getRequestById(requestId);
  if (!request || !request.deliverables) return false;

  // Find and remove from the appropriate array
  const arrays = ['stlFiles', 'renderPreviews', 'assemblyNotes', 'sourceFiles'] as const;
  let removedItem: DeliverableItem | null = null;

  for (const arrayKey of arrays) {
    const array = request.deliverables[arrayKey];
    const index = array.findIndex(item => item.id === deliverableId);
    if (index !== -1) {
      removedItem = array.splice(index, 1)[0];
      request.updatedDate = new Date().toISOString().split('T')[0];

      // Add activity log entry
      addActivity(requestId, {
        text: `Removed ${removedItem.type === 'stl' ? 'STL file' : removedItem.type === 'render' ? 'render preview' : removedItem.type === 'notes' ? 'assembly notes' : 'source file'}: ${removedItem.name}`,
        type: 'deliverable'
      });

      return true;
    }
  }

  return false;
};

export const addMessage = (requestId: string, message: Omit<Message, 'id' | 'timestamp'>): boolean => {
  const request = getRequestById(requestId);
  if (!request) return false;

  const newMessage: Message = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...message
  };

  if (!request.messages) request.messages = [];
  request.messages.push(newMessage);
  request.updatedDate = new Date().toISOString().split('T')[0];

  // Add activity log entry
  addActivity(requestId, {
    text: `Added message: "${message.body.slice(0, 50)}${message.body.length > 50 ? '...' : ''}"`,
    type: 'message'
  });

  return true;
};

export const addNote = (requestId: string, note: Omit<Note, 'id' | 'timestamp'>): boolean => {
  const request = getRequestById(requestId);
  if (!request) return false;

  const newNote: Note = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...note
  };

  if (!request.notes) request.notes = [];
  request.notes.push(newNote);
  request.updatedDate = new Date().toISOString().split('T')[0];

  // Add activity log entry
  const noteType = note.internal ? 'internal note' : 'note';
  addActivity(requestId, {
    text: `Added ${noteType}: "${note.content.slice(0, 50)}${note.content.length > 50 ? '...' : ''}"`,
    type: 'note'
  });

  return true;
};

export const addActivity = (requestId: string, entry: Omit<ActivityEntry, 'id' | 'timestamp'>): boolean => {
  const request = getRequestById(requestId);
  if (!request) return false;

  const newActivity: ActivityEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...entry
  };

  if (!request.activityLog) request.activityLog = [];
  request.activityLog.unshift(newActivity); // Add to beginning for most recent first
  request.updatedDate = new Date().toISOString().split('T')[0];

  return true;
};

export const canSubmitForReview = (request: DesignerRequest): { valid: boolean; missing: string[] } => {
  if (!request.deliverables) return { valid: false, missing: ['STL files', 'render previews'] };

  const hasSTL = request.deliverables.stlFiles && request.deliverables.stlFiles.length > 0;
  const hasRenders = request.deliverables.renderPreviews && request.deliverables.renderPreviews.length > 0;

  const missing = [];
  if (!hasSTL) missing.push('STL files');
  if (!hasRenders) missing.push('at least 1 render preview');

  return {
    valid: hasSTL && hasRenders,
    missing
  };
};
