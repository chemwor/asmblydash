export interface Message {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isFromSeller: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantType: 'customer' | 'designer' | 'support';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  orderId?: string;
  stlRequestId?: string;
  avatar?: string;
  isOnline?: boolean;
  messages: Message[];
}

let mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participantName: 'Sarah Johnson',
    participantType: 'customer',
    lastMessage: 'When will my order be shipped?',
    lastMessageTime: '2024-12-20 2:30 PM',
    unreadCount: 2,
    orderId: 'A-1042',
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'customer-001',
        senderName: 'Sarah Johnson',
        content: 'Hi! I placed an order yesterday and wondering about the shipping timeline.',
        timestamp: '2024-12-20 1:15 PM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'seller-001',
        senderName: 'You',
        content: 'Hello Sarah! Thanks for your order. Your items are currently being prepared and should ship within 24-48 hours.',
        timestamp: '2024-12-20 1:45 PM',
        isFromSeller: true
      },
      {
        id: 3,
        senderId: 'customer-001',
        senderName: 'Sarah Johnson',
        content: 'That\'s great! Will I receive tracking information?',
        timestamp: '2024-12-20 2:15 PM',
        isFromSeller: false
      },
      {
        id: 4,
        senderId: 'customer-001',
        senderName: 'Sarah Johnson',
        content: 'When will my order be shipped?',
        timestamp: '2024-12-20 2:30 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-002',
    participantName: 'Mike Rodriguez',
    participantType: 'designer',
    lastMessage: 'I\'ve completed the initial design for your STL request',
    lastMessageTime: '2024-12-20 11:20 AM',
    unreadCount: 1,
    stlRequestId: 'R-2201',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'designer-002',
        senderName: 'Mike Rodriguez',
        content: 'Hi! I\'m the designer assigned to your gaming controller stand request.',
        timestamp: '2024-12-19 3:00 PM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'seller-001',
        senderName: 'You',
        content: 'Great! Looking forward to seeing your work. Please make sure it supports the controllers mentioned in the brief.',
        timestamp: '2024-12-19 3:15 PM',
        isFromSeller: true
      },
      {
        id: 3,
        senderId: 'designer-002',
        senderName: 'Mike Rodriguez',
        content: 'I\'ve completed the initial design for your STL request. The stand accommodates all three controller types with adjustable angles. Would you like me to send preview renders?',
        timestamp: '2024-12-20 11:20 AM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-003',
    participantName: 'Emma Chen',
    participantType: 'customer',
    lastMessage: 'Perfect! Thanks for the quick response.',
    lastMessageTime: '2024-12-19 4:45 PM',
    unreadCount: 0,
    orderId: 'A-1038',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'customer-003',
        senderName: 'Emma Chen',
        content: 'Hi! I have a question about customization options for the phone case.',
        timestamp: '2024-12-19 2:30 PM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'seller-001',
        senderName: 'You',
        content: 'Hello Emma! I\'d be happy to help with customization. What specific modifications are you looking for?',
        timestamp: '2024-12-19 3:00 PM',
        isFromSeller: true
      },
      {
        id: 3,
        senderId: 'customer-003',
        senderName: 'Emma Chen',
        content: 'I\'d like to add my company logo and change the color to match our branding.',
        timestamp: '2024-12-19 3:15 PM',
        isFromSeller: false
      },
      {
        id: 4,
        senderId: 'seller-001',
        senderName: 'You',
        content: 'That\'s definitely possible! Please send me your logo file and the Pantone color code, and I can create a custom version for you.',
        timestamp: '2024-12-19 4:30 PM',
        isFromSeller: true
      },
      {
        id: 5,
        senderId: 'customer-003',
        senderName: 'Emma Chen',
        content: 'Perfect! Thanks for the quick response.',
        timestamp: '2024-12-19 4:45 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-004',
    participantName: 'System Notification',
    participantType: 'support',
    lastMessage: 'Your payout has been processed successfully.',
    lastMessageTime: '2024-12-18 10:15 AM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'system-001',
        senderName: 'System',
        content: 'Your payout request of $524.00 has been processed successfully. The funds should appear in your account within 1-2 business days.',
        timestamp: '2024-12-18 10:15 AM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-005',
    participantName: 'David Park',
    participantType: 'customer',
    lastMessage: 'Can I get a refund for this item?',
    lastMessageTime: '2024-12-17 6:20 PM',
    unreadCount: 1,
    orderId: 'A-1035',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'customer-005',
        senderName: 'David Park',
        content: 'Hi, I received my order but the print quality isn\'t what I expected. Can I get a refund for this item?',
        timestamp: '2024-12-17 6:20 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-006',
    participantName: 'Lisa Martinez',
    participantType: 'designer',
    lastMessage: 'Updated design files are ready for review',
    lastMessageTime: '2024-12-17 3:45 PM',
    unreadCount: 0,
    stlRequestId: 'R-2198',
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'designer-006',
        senderName: 'Lisa Martinez',
        content: 'Hi! I\'ve made the revisions you requested for the decorative vase design. The wall thickness has been adjusted and the base is now more stable.',
        timestamp: '2024-12-17 2:30 PM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'seller-001',
        senderName: 'You',
        content: 'That looks much better! Could you also add some drainage holes at the bottom?',
        timestamp: '2024-12-17 3:00 PM',
        isFromSeller: true
      },
      {
        id: 3,
        senderId: 'designer-006',
        senderName: 'Lisa Martinez',
        content: 'Updated design files are ready for review',
        timestamp: '2024-12-17 3:45 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-007',
    participantName: 'James Wilson',
    participantType: 'customer',
    lastMessage: 'Great quality! Will definitely order again.',
    lastMessageTime: '2024-12-17 1:20 PM',
    unreadCount: 0,
    orderId: 'A-1033',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'customer-007',
        senderName: 'James Wilson',
        content: 'Just received my custom miniatures. The detail is incredible! Great quality! Will definitely order again.',
        timestamp: '2024-12-17 1:20 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-008',
    participantName: 'System Notification',
    participantType: 'support',
    lastMessage: 'New order received: Kitchen organizer set',
    lastMessageTime: '2024-12-16 9:30 AM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'system-002',
        senderName: 'System',
        content: 'New order received from customer Alex Thompson. Order #A-1044: Kitchen organizer set - $45.99. Customer notes: "Please use white PLA material"',
        timestamp: '2024-12-16 9:30 AM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-009',
    participantName: 'Rachel Kim',
    participantType: 'designer',
    lastMessage: 'Starting work on your mechanical keyboard case',
    lastMessageTime: '2024-12-16 8:15 AM',
    unreadCount: 3,
    stlRequestId: 'R-2195',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'designer-009',
        senderName: 'Rachel Kim',
        content: 'Hi! I\'ve been assigned to design your custom mechanical keyboard case. I\'ll start working on the initial concept based on your specifications.',
        timestamp: '2024-12-16 8:15 AM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'designer-009',
        senderName: 'Rachel Kim',
        content: 'Quick question - do you prefer a minimalist design or something with more decorative elements?',
        timestamp: '2024-12-16 9:20 AM',
        isFromSeller: false
      },
      {
        id: 3,
        senderId: 'designer-009',
        senderName: 'Rachel Kim',
        content: 'Starting work on your mechanical keyboard case',
        timestamp: '2024-12-16 8:15 AM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-010',
    participantName: 'Tom Anderson',
    participantType: 'customer',
    lastMessage: 'When can I expect delivery?',
    lastMessageTime: '2024-12-15 7:45 PM',
    unreadCount: 1,
    orderId: 'A-1031',
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'customer-010',
        senderName: 'Tom Anderson',
        content: 'Hi! I placed an order for the desk organizers yesterday. When can I expect delivery?',
        timestamp: '2024-12-15 7:45 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-011',
    participantName: 'System Notification',
    participantType: 'support',
    lastMessage: 'Low inventory alert: PLA filament running low',
    lastMessageTime: '2024-12-15 2:00 PM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'system-003',
        senderName: 'System',
        content: 'Inventory Alert: Your PLA filament stock is running low (2 rolls remaining). Consider restocking to avoid delays in order fulfillment.',
        timestamp: '2024-12-15 2:00 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-012',
    participantName: 'Carlos Rodriguez',
    participantType: 'designer',
    lastMessage: 'Prototype ready for testing',
    lastMessageTime: '2024-12-15 11:30 AM',
    unreadCount: 2,
    stlRequestId: 'R-2190',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'designer-012',
        senderName: 'Carlos Rodriguez',
        content: 'I\'ve completed the prototype for your custom drone mount. The design includes adjustable angles and quick-release mechanism as requested.',
        timestamp: '2024-12-15 10:15 AM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'designer-012',
        senderName: 'Carlos Rodriguez',
        content: 'Prototype ready for testing',
        timestamp: '2024-12-15 11:30 AM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-013',
    participantName: 'Maria Garcia',
    participantType: 'customer',
    lastMessage: 'Could you make it slightly larger?',
    lastMessageTime: '2024-12-14 4:20 PM',
    unreadCount: 0,
    orderId: 'A-1028',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'customer-013',
        senderName: 'Maria Garcia',
        content: 'Hi! I received the jewelry box but it\'s a bit smaller than I expected. Could you make it slightly larger?',
        timestamp: '2024-12-14 3:45 PM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'seller-001',
        senderName: 'You',
        content: 'Of course! I can create a larger version for you. What dimensions would work better?',
        timestamp: '2024-12-14 4:00 PM',
        isFromSeller: true
      },
      {
        id: 3,
        senderId: 'customer-013',
        senderName: 'Maria Garcia',
        content: 'Could you make it slightly larger?',
        timestamp: '2024-12-14 4:20 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-014',
    participantName: 'Alex Thompson',
    participantType: 'customer',
    lastMessage: 'Perfect! Exactly what I needed.',
    lastMessageTime: '2024-12-14 10:15 AM',
    unreadCount: 0,
    orderId: 'A-1025',
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'customer-014',
        senderName: 'Alex Thompson',
        content: 'Just received the phone stand. Perfect! Exactly what I needed. The adjustable angle works great.',
        timestamp: '2024-12-14 10:15 AM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-015',
    participantName: 'System Notification',
    participantType: 'support',
    lastMessage: 'Monthly sales report is ready',
    lastMessageTime: '2024-12-13 6:00 PM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'system-004',
        senderName: 'System',
        content: 'Your monthly sales report for November is now available. Total revenue: $2,847.50 from 47 orders. View detailed analytics in your dashboard.',
        timestamp: '2024-12-13 6:00 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-016',
    participantName: 'Jennifer Lee',
    participantType: 'designer',
    lastMessage: 'Design concepts attached for review',
    lastMessageTime: '2024-12-13 2:45 PM',
    unreadCount: 1,
    stlRequestId: 'R-2185',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'designer-016',
        senderName: 'Jennifer Lee',
        content: 'Hi! I\'ve created three different design concepts for your custom lamp shade. Each has a unique pattern that will create interesting light effects.',
        timestamp: '2024-12-13 1:30 PM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'designer-016',
        senderName: 'Jennifer Lee',
        content: 'Design concepts attached for review',
        timestamp: '2024-12-13 2:45 PM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-017',
    participantName: 'Robert Kim',
    participantType: 'customer',
    lastMessage: 'Tracking number for my order?',
    lastMessageTime: '2024-12-12 8:30 AM',
    unreadCount: 2,
    orderId: 'A-1022',
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 'customer-017',
        senderName: 'Robert Kim',
        content: 'Hi, could you provide the tracking number for my order? It was supposed to ship yesterday.',
        timestamp: '2024-12-12 8:30 AM',
        isFromSeller: false
      },
      {
        id: 2,
        senderId: 'customer-017',
        senderName: 'Robert Kim',
        content: 'Tracking number for my order?',
        timestamp: '2024-12-12 8:30 AM',
        isFromSeller: false
      }
    ]
  },
  {
    id: 'conv-018',
    participantName: 'System Notification',
    participantType: 'support',
    lastMessage: 'New STL request: Custom chess set',
    lastMessageTime: '2024-12-11 3:15 PM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 'system-005',
        senderName: 'System',
        content: 'New STL design request received: Custom chess set with medieval theme. Budget: $150. Deadline: 2 weeks. Designer matching in progress.',
        timestamp: '2024-12-11 3:15 PM',
        isFromSeller: false
      }
    ]
  }
];

// Export conversations array
export const conversations = mockConversations;

// Get a specific conversation thread by ID
export const getThread = (conversationId: string): Conversation | undefined => {
  return mockConversations.find(conv => conv.id === conversationId);
};

// Send a message to a conversation
export const sendMessage = (conversationId: string, messageContent: string): { success: boolean; conversation?: Conversation } => {
  const conversationIndex = mockConversations.findIndex(conv => conv.id === conversationId);

  if (conversationIndex === -1) {
    return { success: false };
  }

  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const newMessage: Message = {
    id: Date.now(),
    senderId: 'seller-001',
    senderName: 'You',
    content: messageContent,
    timestamp,
    isFromSeller: true
  };

  // Update the conversation
  mockConversations[conversationIndex] = {
    ...mockConversations[conversationIndex],
    messages: [...mockConversations[conversationIndex].messages, newMessage],
    lastMessage: messageContent,
    lastMessageTime: timestamp,
    unreadCount: 0
  };

  return {
    success: true,
    conversation: mockConversations[conversationIndex]
  };
};

// Update conversations array (for external state management)
export const updateConversations = (newConversations: Conversation[]): void => {
  mockConversations = newConversations;
};

// Get all conversations (for filtering/searching)
export const getAllConversations = (): Conversation[] => {
  return [...mockConversations];
};

// Get sender role based on sender ID
export const getSenderRole = (senderId: string): string => {
  if (senderId.includes('customer')) {
    return 'Customer';
  } else if (senderId.includes('designer')) {
    return 'Designer';
  } else if (senderId.includes('system')) {
    return 'System';
  } else if (senderId.includes('seller')) {
    return 'Seller';
  } else {
    return 'User';
  }
};
