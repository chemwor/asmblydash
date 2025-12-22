// Mock data and helpers for designer messages

export interface Participant {
  id: string;
  name: string;
  role: 'Designer' | 'Client' | 'Seller' | 'Maker' | 'Support';
  avatar?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  size: string;
  url: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Designer' | 'Client' | 'Seller' | 'Maker' | 'Support';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  type: 'Request' | 'Support' | 'System';
  priority: 'Normal' | 'High' | 'Rush';
  participants: Participant[];
  lastMessage: Message;
  updatedAt: string;
  unreadCount: number;
  requestId?: string;
  requestTitle?: string;
  requestStatus?: 'New' | 'In Progress' | 'In Review' | 'Revision Needed' | 'Approved';
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    title: 'Logo Design Project - TechStart Inc.',
    type: 'Request',
    priority: 'High',
    participants: [
      {
        id: 'user-designer-001',
        name: 'Alex Thompson',
        role: 'Designer',
        avatar: '/images/users/user1.jpg'
      },
      {
        id: 'client-001',
        name: 'Sarah Johnson',
        role: 'Client',
        avatar: '/images/users/user2.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-001-003',
      senderId: 'client-001',
      senderName: 'Sarah Johnson',
      senderRole: 'Client',
      content: 'Could you make the logo a bit more modern? I love the concept but want it to feel more contemporary.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      attachments: [
        {
          id: 'att-001',
          name: 'reference-design.jpg',
          type: 'image',
          size: '245 KB',
          url: '/images/reference-design.jpg'
        }
      ]
    },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    requestId: 'REQ-2024-001',
    requestTitle: 'Modern Logo Design',
    requestStatus: 'Revision Needed'
  },
  {
    id: 'conv-002',
    title: 'Business Card Layout Review',
    type: 'Request',
    priority: 'Normal',
    participants: [
      {
        id: 'user-designer-001',
        name: 'Alex Thompson',
        role: 'Designer'
      },
      {
        id: 'client-002',
        name: 'Michael Chen',
        role: 'Client',
        avatar: '/images/users/user3.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-002-005',
      senderId: 'user-designer-001',
      senderName: 'Alex Thompson',
      senderRole: 'Designer',
      content: 'I\'ve uploaded the final business card designs. Please review and let me know if you need any adjustments.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    requestId: 'REQ-2024-002',
    requestTitle: 'Business Card Design',
    requestStatus: 'In Review'
  },
  {
    id: 'conv-003',
    title: 'Support: File Format Question',
    type: 'Support',
    priority: 'Normal',
    participants: [
      {
        id: 'user-designer-001',
        name: 'Alex Thompson',
        role: 'Designer'
      },
      {
        id: 'support-001',
        name: 'Jennifer Wilson',
        role: 'Support',
        avatar: '/images/users/support1.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-003-002',
      senderId: 'support-001',
      senderName: 'Jennifer Wilson',
      senderRole: 'Support',
      content: 'For print-ready files, we recommend providing PDF, AI, and high-resolution PNG files. Let me know if you need help with export settings.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'conv-004',
    title: 'Website Banner Design - E-commerce Store',
    type: 'Request',
    priority: 'Rush',
    participants: [
      {
        id: 'user-designer-001',
        name: 'Alex Thompson',
        role: 'Designer'
      },
      {
        id: 'client-003',
        name: 'Lisa Rodriguez',
        role: 'Client'
      }
    ],
    lastMessage: {
      id: 'msg-004-001',
      senderId: 'client-003',
      senderName: 'Lisa Rodriguez',
      senderRole: 'Client',
      content: 'Hi Alex! I need a banner design for our holiday sale. It\'s urgent - we need it by tomorrow for the campaign launch.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    unreadCount: 2,
    requestId: 'REQ-2024-003',
    requestTitle: 'Holiday Sale Banner',
    requestStatus: 'New'
  },
  {
    id: 'conv-005',
    title: 'System: Payment Processed',
    type: 'System',
    priority: 'Normal',
    participants: [
      {
        id: 'user-designer-001',
        name: 'Alex Thompson',
        role: 'Designer'
      },
      {
        id: 'system-001',
        name: 'System',
        role: 'Support'
      }
    ],
    lastMessage: {
      id: 'msg-005-001',
      senderId: 'system-001',
      senderName: 'System',
      senderRole: 'Support',
      content: 'Payment of $150.00 for project REQ-2024-001 has been processed and will be available in your account within 2-3 business days.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0
  }
];

// Mock messages for each conversation
const mockMessages: { [conversationId: string]: Message[] } = {
  'conv-001': [
    {
      id: 'msg-001-001',
      senderId: 'client-001',
      senderName: 'Sarah Johnson',
      senderRole: 'Client',
      content: 'Hi Alex! I\'m excited to work with you on our logo design. We\'re a tech startup focused on AI solutions for small businesses.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-001-002',
      senderId: 'user-designer-001',
      senderName: 'Alex Thompson',
      senderRole: 'Designer',
      content: 'Hi Sarah! Great to work with you. I\'ve reviewed your brief and have some initial concepts. Could you share any color preferences or existing brand elements?',
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-001-003',
      senderId: 'client-001',
      senderName: 'Sarah Johnson',
      senderRole: 'Client',
      content: 'Could you make the logo a bit more modern? I love the concept but want it to feel more contemporary.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      attachments: [
        {
          id: 'att-001',
          name: 'reference-design.jpg',
          type: 'image',
          size: '245 KB',
          url: '/images/reference-design.jpg'
        }
      ]
    }
  ],
  'conv-002': [
    {
      id: 'msg-002-001',
      senderId: 'client-002',
      senderName: 'Michael Chen',
      senderRole: 'Client',
      content: 'Hi Alex, I need business cards that match the logo you created. Clean, professional design.',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-002-002',
      senderId: 'user-designer-001',
      senderName: 'Alex Thompson',
      senderRole: 'Designer',
      content: 'Perfect! I\'ll create a design that complements your existing logo. What information needs to be included?',
      timestamp: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-002-003',
      senderId: 'client-002',
      senderName: 'Michael Chen',
      senderRole: 'Client',
      content: 'Name, title, phone, email, and website. Keep it minimal and elegant.',
      timestamp: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-002-004',
      senderId: 'user-designer-001',
      senderName: 'Alex Thompson',
      senderRole: 'Designer',
      content: 'Got it! I\'ll have the first concepts ready by tomorrow.',
      timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-002-005',
      senderId: 'user-designer-001',
      senderName: 'Alex Thompson',
      senderRole: 'Designer',
      content: 'I\'ve uploaded the final business card designs. Please review and let me know if you need any adjustments.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      attachments: [
        {
          id: 'att-002',
          name: 'business-cards-final.pdf',
          type: 'file',
          size: '1.2 MB',
          url: '/files/business-cards-final.pdf'
        },
        {
          id: 'att-003',
          name: 'business-card-preview.jpg',
          type: 'image',
          size: '180 KB',
          url: '/images/business-card-preview.jpg'
        }
      ]
    }
  ],
  'conv-003': [
    {
      id: 'msg-003-001',
      senderId: 'user-designer-001',
      senderName: 'Alex Thompson',
      senderRole: 'Designer',
      content: 'Hi, I have a question about file formats. What\'s the best format to deliver print-ready designs to clients?',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-003-002',
      senderId: 'support-001',
      senderName: 'Jennifer Wilson',
      senderRole: 'Support',
      content: 'For print-ready files, we recommend providing PDF, AI, and high-resolution PNG files. Let me know if you need help with export settings.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    }
  ],
  'conv-004': [
    {
      id: 'msg-004-001',
      senderId: 'client-003',
      senderName: 'Lisa Rodriguez',
      senderRole: 'Client',
      content: 'Hi Alex! I need a banner design for our holiday sale. It\'s urgent - we need it by tomorrow for the campaign launch.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    }
  ],
  'conv-005': [
    {
      id: 'msg-005-001',
      senderId: 'system-001',
      senderName: 'System',
      senderRole: 'Support',
      content: 'Payment of $150.00 for project REQ-2024-001 has been processed and will be available in your account within 2-3 business days.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    }
  ]
};

// Helper functions
export const getConversations = (): Conversation[] => {
  return [...mockConversations];
};

export const getThread = (conversationId: string): Message[] => {
  return mockMessages[conversationId] || [];
};

export const sendMessage = (
  conversationId: string,
  content: string,
  attachments?: Attachment[]
): Message => {
  const newMessage: Message = {
    id: `msg-${conversationId}-${Date.now()}`,
    senderId: 'user-designer-001',
    senderName: 'Alex Thompson',
    senderRole: 'Designer',
    content,
    timestamp: new Date().toISOString(),
    attachments
  };

  // Add to messages
  if (!mockMessages[conversationId]) {
    mockMessages[conversationId] = [];
  }
  mockMessages[conversationId].push(newMessage);

  return newMessage;
};

export const markRead = (conversationId: string): void => {
  const conversation = mockConversations.find(c => c.id === conversationId);
  if (conversation) {
    conversation.unreadCount = 0;
  }
};
