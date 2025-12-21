// Support feature module - mock data and helpers

export interface SupportIssue {
  id: string;
  caseId: string;
  shortTitle: string;
  type: 'Defect' | 'Reprint' | 'Shipping' | 'Refund' | 'Licensing' | 'Other';
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Waiting on Seller' | 'Waiting on Maker' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  createdDate: string;
  updatedDate: string;
  created_at: string;
  updated_at: string;
  linkedTo?: {
    type: 'Order' | 'STL Request';
    id: string;
  };
  productId?: string;
  assignedTo?: string;
  sla?: {
    status: 'Due' | 'Overdue';
    timeLeft?: string;
  };
  statusClass: string;
  priorityClass: string;
  typeClass: string;
  slaClass?: string;
}

export interface AddCasePayload {
  type: 'Defect' | 'Reprint' | 'Shipping' | 'Refund' | 'Licensing' | 'Other';
  subject: string;
  description: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  linkedToType?: 'Order' | 'STL Request' | 'None';
  linkedId?: string;
  productId?: string;
}

export interface ConversationMessage {
  id: number;
  author: string;
  type: 'customer' | 'support' | 'seller';
  message: string;
  timestamp: string;
  avatar: string;
}

export interface CaseAttachment {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AddMessagePayload {
  author: string;
  type: 'customer' | 'support' | 'seller';
  message: string;
}

export interface SupportFilters {
  searchTerm?: string;
  type?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
}

// Mock support cases data
const mockSupportCases: SupportIssue[] = [
  {
    id: 'SUP-2025-001',
    caseId: 'CS-001',
    shortTitle: 'Print quality issue with custom mug',
    type: 'Defect',
    title: 'Print quality issue with custom mug order',
    description: 'Customer reported blurry image quality on the printed mug. Image resolution appears degraded.',
    status: 'Open',
    priority: 'High',
    createdDate: 'Dec 19, 2025',
    updatedDate: 'Dec 19, 2025',
    created_at: '2025-12-19T10:00:00Z',
    updated_at: '2025-12-19T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1892' },
    assignedTo: 'Sarah Chen',
    statusClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    priorityClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    typeClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
  },
  {
    id: 'SUP-2025-002',
    caseId: 'CS-002',
    shortTitle: 'Package delivered to wrong address',
    type: 'Shipping',
    title: 'Package delivered to wrong address',
    description: 'Customer reports package was delivered to incorrect address. Tracking shows delivered but customer did not receive.',
    status: 'In Progress',
    priority: 'Normal',
    createdDate: 'Dec 16, 2025',
    updatedDate: 'Dec 19, 2025',
    created_at: '2025-12-16T10:00:00Z',
    updated_at: '2025-12-19T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1889' },
    assignedTo: 'Mike Rodriguez',
    statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    priorityClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    typeClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
  },
  {
    id: 'SUP-2025-003',
    caseId: 'CS-003',
    shortTitle: 'Reprint request for damaged t-shirt',
    type: 'Reprint',
    title: 'Reprint request for damaged t-shirt',
    description: 'T-shirt arrived with ink smudge. Customer requesting replacement with same design.',
    status: 'Waiting on Seller',
    priority: 'Normal',
    createdDate: 'Dec 13, 2025',
    updatedDate: 'Dec 18, 2025',
    created_at: '2025-12-13T10:00:00Z',
    updated_at: '2025-12-18T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1885' },
    statusClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    priorityClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    typeClass: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
  },
  {
    id: 'SUP-2025-004',
    caseId: 'CS-004',
    shortTitle: 'Customer complaint escalation - order delay',
    type: 'Other',
    title: 'Customer complaint escalation - order delay',
    description: 'Customer unhappy with 2-week delay in order fulfillment. Requesting compensation and expedited shipping.',
    status: 'Open',
    priority: 'Urgent',
    createdDate: 'Dec 20, 2025',
    updatedDate: 'Dec 20, 2025',
    created_at: '2025-12-20T08:00:00Z',
    updated_at: '2025-12-20T08:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1878' },
    assignedTo: 'Lisa Park',
    statusClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    typeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
  },
  {
    id: 'SUP-2025-005',
    caseId: 'CS-005',
    shortTitle: 'Design approval process inquiry',
    type: 'Other',
    title: 'Design approval process inquiry',
    description: 'Customer asking about status of custom design approval for bulk order.',
    status: 'Resolved',
    priority: 'Low',
    createdDate: 'Dec 15, 2025',
    updatedDate: 'Dec 16, 2025',
    created_at: '2025-12-15T10:00:00Z',
    updated_at: '2025-12-16T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1875' },
    statusClass: 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
    priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
    typeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
  },
  {
    id: 'SUP-2025-006',
    caseId: 'CS-006',
    shortTitle: 'Refund request for cancelled order',
    type: 'Refund',
    title: 'Refund request for cancelled order',
    description: 'Customer wants to cancel order and receive full refund within 24 hours of order placement.',
    status: 'In Progress',
    priority: 'Normal',
    createdDate: 'Dec 18, 2025',
    updatedDate: 'Dec 19, 2025',
    created_at: '2025-12-18T10:00:00Z',
    updated_at: '2025-12-19T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1895' },
    assignedTo: 'David Kim',
    statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    priorityClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    typeClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
  },
  {
    id: 'SUP-2025-007',
    caseId: 'CS-007',
    shortTitle: 'STL file not printing correctly',
    type: 'Defect',
    title: 'STL file not printing correctly on customer printer',
    description: 'Customer reports STL file has mesh issues causing print failures on their 3D printer.',
    status: 'Waiting on Maker',
    priority: 'High',
    createdDate: 'Dec 18, 2025',
    updatedDate: 'Dec 19, 2025',
    created_at: '2025-12-18T10:00:00Z',
    updated_at: '2025-12-19T10:00:00Z',
    linkedTo: { type: 'STL Request', id: 'STL-2025-0234' },
    assignedTo: 'Alex Turner',
    statusClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    priorityClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    typeClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
  },
  {
    id: 'SUP-2025-008',
    caseId: 'CS-008',
    shortTitle: 'International shipping delay',
    type: 'Shipping',
    title: 'International shipping taking longer than expected',
    description: 'Package to international destination is delayed beyond estimated delivery time.',
    status: 'Open',
    priority: 'Normal',
    createdDate: 'Dec 14, 2025',
    updatedDate: 'Dec 19, 2025',
    created_at: '2025-12-14T10:00:00Z',
    updated_at: '2025-12-19T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1865' },
    statusClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    priorityClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    typeClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
  },
  {
    id: 'SUP-2025-009',
    caseId: 'CS-009',
    shortTitle: 'Missing items in order',
    type: 'Defect',
    title: 'Missing items in completed order shipment',
    description: 'Customer received package but some ordered items are missing from the shipment.',
    status: 'Waiting on Seller',
    priority: 'Urgent',
    createdDate: 'Dec 20, 2025',
    updatedDate: 'Dec 20, 2025',
    created_at: '2025-12-20T09:00:00Z',
    updated_at: '2025-12-20T09:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1893' },
    statusClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    typeClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
  },
  {
    id: 'SUP-2025-010',
    caseId: 'CS-010',
    shortTitle: 'Delayed shipping notification issue',
    type: 'Shipping',
    title: 'Customer not receiving shipping notifications',
    description: 'Customer reports not receiving any shipping updates or tracking information.',
    status: 'Resolved',
    priority: 'Low',
    createdDate: 'Dec 14, 2025',
    updatedDate: 'Dec 15, 2025',
    created_at: '2025-12-14T10:00:00Z',
    updated_at: '2025-12-15T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1860' },
    statusClass: 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
    priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
    typeClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
  },
  {
    id: 'SUP-2025-011',
    caseId: 'CS-011',
    shortTitle: 'Bulk order pricing inquiry',
    type: 'Other',
    title: 'Bulk order pricing and discount inquiry',
    description: 'Customer asking about volume discounts for orders over 100 units.',
    status: 'Open',
    priority: 'Normal',
    createdDate: 'Dec 19, 2025',
    updatedDate: 'Dec 19, 2025',
    created_at: '2025-12-19T10:00:00Z',
    updated_at: '2025-12-19T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1875' },
    statusClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    priorityClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    typeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
  },
  {
    id: 'SUP-2025-012',
    caseId: 'CS-012',
    shortTitle: 'Address change request',
    type: 'Shipping',
    title: 'Customer requesting shipping address change',
    description: 'Customer moved and needs to update delivery address for pending order.',
    status: 'Closed',
    priority: 'Normal',
    createdDate: 'Dec 16, 2025',
    updatedDate: 'Dec 17, 2025',
    created_at: '2025-12-16T10:00:00Z',
    updated_at: '2025-12-17T10:00:00Z',
    linkedTo: { type: 'Order', id: 'ORD-2025-1877' },
    statusClass: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
    priorityClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    typeClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
  }
];

// Mock conversation data
const mockConversations: { [caseId: string]: ConversationMessage[] } = {
  'SUP-2025-001': [
    {
      id: 1,
      author: 'John Customer',
      type: 'customer',
      message: 'The printed mug I received has very blurry text. The image quality is much lower than what I expected based on the preview.',
      timestamp: 'Dec 19, 2025 - 2:15 PM',
      avatar: '/images/users/user1.jpg'
    },
    {
      id: 2,
      author: 'Sarah Chen',
      type: 'support',
      message: 'Thank you for reporting this issue. I\'ve escalated this to our quality team for review. Could you please provide photos of the received item?',
      timestamp: 'Dec 19, 2025 - 2:45 PM',
      avatar: '/images/users/user2.jpg'
    },
    {
      id: 3,
      author: 'You (Seller)',
      type: 'seller',
      message: 'I\'ve reviewed the original design file and it meets our resolution requirements. This might be a printing issue. I can offer a reprint with enhanced settings.',
      timestamp: 'Dec 19, 2025 - 3:20 PM',
      avatar: '/images/users/user3.jpg'
    }
  ]
};

// Mock attachments data
const mockAttachments: { [caseId: string]: CaseAttachment[] } = {
  'SUP-2025-001': [
    {
      id: 1,
      name: 'mug_received_photo1.jpg',
      size: '2.3 MB',
      type: 'image',
      uploadedBy: 'John Customer',
      uploadedAt: 'Dec 19, 2025'
    },
    {
      id: 2,
      name: 'mug_received_photo2.jpg',
      size: '1.8 MB',
      type: 'image',
      uploadedBy: 'John Customer',
      uploadedAt: 'Dec 19, 2025'
    },
    {
      id: 3,
      name: 'original_design_file.png',
      size: '4.1 MB',
      type: 'image',
      uploadedBy: 'You (Seller)',
      uploadedAt: 'Dec 19, 2025'
    }
  ]
};

// Helper functions
export const getCases = (filters?: SupportFilters): SupportIssue[] => {
  let filteredCases = [...mockSupportCases];

  if (!filters) {
    return filteredCases;
  }

  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredCases = filteredCases.filter(issue =>
      issue.caseId.toLowerCase().includes(searchLower) ||
      issue.title.toLowerCase().includes(searchLower) ||
      issue.shortTitle.toLowerCase().includes(searchLower)
    );
  }

  if (filters.type && filters.type !== 'All') {
    filteredCases = filteredCases.filter(issue => issue.type === filters.type);
  }

  return filteredCases;
};

export const addCase = (payload: AddCasePayload): SupportIssue => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const newCase: SupportIssue = {
    id: `SUP-2025-${String(mockSupportCases.length + 1).padStart(3, '0')}`,
    caseId: `CS-${String(mockSupportCases.length + 1).padStart(3, '0')}`,
    shortTitle: payload.subject.length > 50 ? payload.subject.substring(0, 50) + '...' : payload.subject,
    type: payload.type,
    title: payload.subject,
    description: payload.description,
    status: 'Open',
    priority: payload.priority,
    createdDate: dateStr,
    updatedDate: dateStr,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    linkedTo: payload.linkedToType && payload.linkedToType !== 'None' && payload.linkedId ? {
      type: payload.linkedToType,
      id: payload.linkedId
    } : undefined,
    statusClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    priorityClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    typeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
  };

  mockSupportCases.unshift(newCase);
  return newCase;
};

export const getCaseById = (id: string): SupportIssue | undefined => {
  return mockSupportCases.find(issue => issue.id === id);
};

export const getConversations = (caseId: string): ConversationMessage[] => {
  return mockConversations[caseId] || [];
};

export const getAttachments = (caseId: string): CaseAttachment[] => {
  return mockAttachments[caseId] || [];
};

export const addMessage = (caseId: string, payload: AddMessagePayload): ConversationMessage => {
  if (!mockConversations[caseId]) {
    mockConversations[caseId] = [];
  }

  const now = new Date();
  const timestamp = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) + ' - ' + now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const maxId = mockConversations[caseId].reduce((max, msg) => Math.max(max, msg.id), 0);

  const newMessage: ConversationMessage = {
    id: maxId + 1,
    author: payload.author,
    type: payload.type,
    message: payload.message,
    timestamp,
    avatar: '/images/users/user1.jpg'
  };

  mockConversations[caseId].push(newMessage);
  return newMessage;
};

