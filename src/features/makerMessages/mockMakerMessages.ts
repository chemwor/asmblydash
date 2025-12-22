// Mock data types for maker messages
export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: string;
  }[];
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'active' | 'resolved' | 'pending';
  type: 'job' | 'support' | 'system';
  relatedId?: string;
  relatedTitle?: string;
  jobStatus?: 'printing' | 'qc' | 'blocked' | 'shipped' | 'completed';
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    initials?: string;
  }[];
  messages: Message[];
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Job #J-2031',
    lastMessage: 'The customer wants to confirm the exact material finish...',
    timestamp: '2025-12-20T10:30:00',
    unreadCount: 2,
    status: 'active',
    type: 'job',
    jobStatus: 'printing',
    relatedId: 'J-2031',
    relatedTitle: 'Custom iPhone 15 Case - Marble Design',
    participants: [
      { id: 'customer-1', name: 'Sarah Wilson', role: 'Customer', initials: 'SW' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-1',
        content: 'Hi! I just wanted to confirm the material finish for my custom phone case order. Will it have a matte or glossy finish?',
        timestamp: '2025-12-20T09:15:00',
        isFromUser: false
      },
      {
        id: 'msg-2',
        content: 'Hello Sarah! Based on your order specifications, it will have a matte finish which provides better grip and reduces fingerprints. Would you prefer glossy instead?',
        timestamp: '2025-12-20T09:45:00',
        isFromUser: true
      },
      {
        id: 'msg-3',
        content: 'That sounds perfect! Matte finish is exactly what I wanted. When can I expect the delivery?',
        timestamp: '2025-12-20T10:30:00',
        isFromUser: false
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Support Case #C-1102',
    lastMessage: 'Thank you for the troubleshooting steps, I will try them...',
    timestamp: '2025-12-20T08:45:00',
    unreadCount: 0,
    status: 'pending',
    type: 'support',
    relatedId: 'C-1102',
    relatedTitle: 'Printer Calibration Issue',
    participants: [
      { id: 'support-1', name: 'Tech Support Team', role: 'Support', initials: 'TS' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-4',
        content: 'I\'m having issues with my 3D printer calibration. The first layer isn\'t adhering properly.',
        timestamp: '2025-12-19T16:30:00',
        isFromUser: true
      },
      {
        id: 'msg-5',
        content: 'Thanks for reaching out! Let\'s troubleshoot this step by step. First, please check your bed leveling and clean the print surface with isopropyl alcohol.',
        timestamp: '2025-12-19T17:15:00',
        isFromUser: false
      },
      {
        id: 'msg-6',
        content: 'I also recommend checking your nozzle temperature settings. For PLA, try 200°C for the hotend and 60°C for the heated bed.',
        timestamp: '2025-12-19T17:20:00',
        isFromUser: false
      },
      {
        id: 'msg-7',
        content: 'Thank you for the troubleshooting steps, I will try them and get back to you with results.',
        timestamp: '2025-12-20T08:45:00',
        isFromUser: true
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'Job #J-2028',
    lastMessage: 'Perfect! That clarifies everything. Proceeding with production.',
    timestamp: '2025-12-19T15:22:00',
    unreadCount: 0,
    status: 'resolved',
    type: 'job',
    jobStatus: 'completed',
    relatedId: 'J-2028',
    relatedTitle: 'Custom Keychain Set - Logo Design',
    participants: [
      { id: 'designer-1', name: 'Mike Chen', role: 'Designer', initials: 'MC' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-7',
        content: 'Hi! I need clarification on the logo placement for the keychain order. Should it be centered or offset to the left?',
        timestamp: '2025-12-19T14:30:00',
        isFromUser: true
      },
      {
        id: 'msg-8',
        content: 'Please center the logo on each keychain. Also, make sure the minimum thickness is 3mm for durability.',
        timestamp: '2025-12-19T14:45:00',
        isFromUser: false
      },
      {
        id: 'msg-9',
        content: 'Perfect! That clarifies everything. Proceeding with production.',
        timestamp: '2025-12-19T15:22:00',
        isFromUser: true
      }
    ]
  },
  {
    id: 'conv-4',
    title: 'Job #J-2025',
    lastMessage: 'The PETG alternative sounds good. Please proceed.',
    timestamp: '2025-12-19T11:30:00',
    unreadCount: 1,
    status: 'active',
    type: 'job',
    jobStatus: 'qc',
    relatedId: 'J-2025',
    relatedTitle: 'Prototype Parts - Engineering Sample',
    participants: [
      { id: 'customer-2', name: 'Engineering Dept', role: 'Customer', initials: 'ED' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-10',
        content: 'We\'re temporarily out of ABS material. Would PETG be an acceptable substitute for your prototype parts?',
        timestamp: '2025-12-19T10:15:00',
        isFromUser: true
      },
      {
        id: 'msg-11',
        content: 'The PETG alternative sounds good. Please proceed with the substitute material.',
        timestamp: '2025-12-19T11:30:00',
        isFromUser: false
      }
    ]
  },
  {
    id: 'conv-5',
    title: 'System Notification',
    lastMessage: 'Your printer maintenance reminder is due tomorrow.',
    timestamp: '2025-12-19T09:00:00',
    unreadCount: 0,
    status: 'active',
    type: 'system',
    participants: [
      { id: 'system-1', name: 'Trezo System', role: 'System', initials: 'SY' }
    ],
    messages: [
      {
        id: 'msg-15',
        content: 'Your printer maintenance reminder is due tomorrow. Please schedule your routine maintenance check.',
        timestamp: '2025-12-19T09:00:00',
        isFromUser: false
      }
    ]
  },
  {
    id: 'conv-6',
    title: 'Job #J-2024',
    lastMessage: 'Quality check passed! Ready for shipping.',
    timestamp: '2025-12-19T08:15:00',
    unreadCount: 0,
    status: 'resolved',
    type: 'job',
    jobStatus: 'shipped',
    relatedId: 'J-2024',
    relatedTitle: 'Custom Miniatures - Fantasy Set',
    participants: [
      { id: 'customer-3', name: 'David Park', role: 'Customer', initials: 'DP' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-16',
        content: 'Quality check passed! Ready for shipping.',
        timestamp: '2025-12-19T08:15:00',
        isFromUser: true
      }
    ]
  },
  {
    id: 'conv-7',
    title: 'Support Case #C-1099',
    lastMessage: 'Issue resolved. Thank you for your patience.',
    timestamp: '2025-12-18T16:45:00',
    unreadCount: 0,
    status: 'resolved',
    type: 'support',
    relatedId: 'C-1099',
    relatedTitle: 'Material Quality Question',
    participants: [
      { id: 'qc-team', name: 'Quality Control Team', role: 'QC Team', initials: 'QC' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-12',
        content: 'We\'ve noticed some inconsistencies in recent deliveries. Please review the updated quality checklist.',
        timestamp: '2025-12-18T14:20:00',
        isFromUser: false
      }
    ]
  },
  {
    id: 'conv-8',
    title: 'Job #J-2021',
    lastMessage: 'Print failed due to material jam. Restarting...',
    timestamp: '2025-12-18T14:30:00',
    unreadCount: 3,
    status: 'active',
    type: 'job',
    jobStatus: 'blocked',
    relatedId: 'J-2021',
    relatedTitle: 'Architectural Model - Office Building',
    participants: [
      { id: 'customer-4', name: 'Architecture Firm', role: 'Customer', initials: 'AF' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-17',
        content: 'Print failed due to material jam. Restarting the job now.',
        timestamp: '2025-12-18T14:30:00',
        isFromUser: true
      }
    ]
  },
  {
    id: 'conv-9',
    title: 'Job #J-2019',
    lastMessage: 'Customer approved the design changes.',
    timestamp: '2025-12-18T12:20:00',
    unreadCount: 0,
    status: 'active',
    type: 'job',
    jobStatus: 'printing',
    relatedId: 'J-2019',
    relatedTitle: 'Custom Jewelry Box',
    participants: [
      { id: 'customer-5', name: 'Emma Rodriguez', role: 'Customer', initials: 'ER' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-18',
        content: 'Customer approved the design changes. Starting print now.',
        timestamp: '2025-12-18T12:20:00',
        isFromUser: true
      }
    ]
  },
  {
    id: 'conv-10',
    title: 'System Notification',
    lastMessage: 'Material inventory low: PLA White (2kg remaining).',
    timestamp: '2025-12-18T10:00:00',
    unreadCount: 1,
    status: 'active',
    type: 'system',
    participants: [
      { id: 'system-1', name: 'Trezo System', role: 'System', initials: 'SY' }
    ],
    messages: [
      {
        id: 'msg-19',
        content: 'Material inventory low: PLA White (2kg remaining). Consider reordering soon.',
        timestamp: '2025-12-18T10:00:00',
        isFromUser: false
      }
    ]
  },
  {
    id: 'conv-11',
    title: 'Job #J-2017',
    lastMessage: 'Delivery confirmed by customer.',
    timestamp: '2025-12-17T17:45:00',
    unreadCount: 0,
    status: 'resolved',
    type: 'job',
    jobStatus: 'completed',
    relatedId: 'J-2017',
    relatedTitle: 'Replacement Parts Set',
    participants: [
      { id: 'customer-6', name: 'Tech Solutions Inc', role: 'Customer', initials: 'TS' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-20',
        content: 'Delivery confirmed by customer. Job completed successfully.',
        timestamp: '2025-12-17T17:45:00',
        isFromUser: true
      }
    ]
  },
  {
    id: 'conv-12',
    title: 'Support Case #C-1095',
    lastMessage: 'New printer setup guide attached.',
    timestamp: '2025-12-17T15:30:00',
    unreadCount: 0,
    status: 'resolved',
    type: 'support',
    relatedId: 'C-1095',
    relatedTitle: 'Printer Setup Assistance',
    participants: [
      { id: 'support-2', name: 'Hardware Support', role: 'Support', initials: 'HS' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-21',
        content: 'New printer setup guide attached. This should help with the calibration process.',
        timestamp: '2025-12-17T15:30:00',
        isFromUser: false,
        attachments: [
          { id: 'att-2', name: 'printer-setup-guide.pdf', type: 'pdf', size: '1.2 MB' }
        ]
      }
    ]
  },
  {
    id: 'conv-13',
    title: 'Job #J-2015',
    lastMessage: 'Rush order - needs completion by tomorrow.',
    timestamp: '2025-12-17T13:20:00',
    unreadCount: 2,
    status: 'active',
    type: 'job',
    jobStatus: 'printing',
    relatedId: 'J-2015',
    relatedTitle: 'Emergency Prototype',
    participants: [
      { id: 'customer-7', name: 'StartupCo', role: 'Customer', initials: 'SC' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-22',
        content: 'This is a rush order - we need completion by tomorrow for our investor meeting.',
        timestamp: '2025-12-17T13:20:00',
        isFromUser: false
      }
    ]
  },
  {
    id: 'conv-14',
    title: 'Job #J-2013',
    lastMessage: 'Post-processing completed, ready for QC.',
    timestamp: '2025-12-17T11:10:00',
    unreadCount: 0,
    status: 'active',
    type: 'job',
    jobStatus: 'qc',
    relatedId: 'J-2013',
    relatedTitle: 'Medical Device Components',
    participants: [
      { id: 'customer-8', name: 'MedTech Solutions', role: 'Customer', initials: 'MS' },
      { id: 'maker-1', name: 'You', role: 'Maker', initials: 'ME' }
    ],
    messages: [
      {
        id: 'msg-23',
        content: 'Post-processing completed, moving to quality control phase.',
        timestamp: '2025-12-17T11:10:00',
        isFromUser: true
      }
    ]
  },
  {
    id: 'conv-15',
    title: 'System Notification',
    lastMessage: 'Weekly production report is ready for review.',
    timestamp: '2025-12-16T09:00:00',
    unreadCount: 0,
    status: 'active',
    type: 'system',
    participants: [
      { id: 'system-1', name: 'Trezo System', role: 'System', initials: 'SY' }
    ],
    messages: [
      {
        id: 'msg-24',
        content: 'Weekly production report is ready for review. Access it from your dashboard.',
        timestamp: '2025-12-16T09:00:00',
        isFromUser: false
      }
    ]
  }
];

// Internal mutable state for conversations
let conversations: Conversation[] = [...mockConversations];

/**
 * Get all conversations
 */
export const getConversations = (): Conversation[] => {
  return conversations.map(conv => ({ ...conv }));
};

/**
 * Get a specific conversation thread by ID
 */
export const getThread = (conversationId: string): Conversation | null => {
  const conversation = conversations.find(conv => conv.id === conversationId);
  return conversation ? { ...conversation } : null;
};

/**
 * Send a message to a conversation
 */
export const sendMessage = (conversationId: string, content: string): Message | null => {
  const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);

  if (conversationIndex === -1) {
    console.error(`Conversation with ID ${conversationId} not found`);
    return null;
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    isFromUser: true
  };

  // Add message to conversation
  conversations[conversationIndex].messages.push(newMessage);

  // Update conversation metadata
  conversations[conversationIndex].lastMessage = content.trim();
  conversations[conversationIndex].timestamp = newMessage.timestamp;
  conversations[conversationIndex].unreadCount = 0;

  return newMessage;
};

/**
 * Mark a conversation as read (set unreadCount to 0)
 */
export const markRead = (conversationId: string): boolean => {
  const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);

  if (conversationIndex === -1) {
    console.error(`Conversation with ID ${conversationId} not found`);
    return false;
  }

  conversations[conversationIndex].unreadCount = 0;
  return true;
};

/**
 * Update conversation job status (for clarification modal integration)
 */
export const updateConversationJobStatus = (conversationId: string, jobStatus: string): boolean => {
  const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);

  if (conversationIndex === -1) {
    console.error(`Conversation with ID ${conversationId} not found`);
    return false;
  }

  if (conversations[conversationIndex].type === 'job') {
    conversations[conversationIndex].jobStatus = jobStatus as any;
    return true;
  }

  return false;
};

/**
 * Reset conversations to original mock data (for testing)
 */
export const resetConversations = (): void => {
  conversations = [...mockConversations];
};
