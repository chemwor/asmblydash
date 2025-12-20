import React, { useState } from 'react';
import { conversations, getThread, sendMessage, getSenderRole, type Conversation, type Message } from '../../features/sellerMessages/mockMessages';

const SellerMessages: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'orders' | 'stl' | 'system'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [conversationsData, setConversationsData] = useState<Conversation[]>(conversations);

  // Filter conversations based on search and filters
  const filteredConversations = conversationsData.filter(conv => {
    const matchesSearchQuery =
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.orderId && conv.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (conv.stlRequestId && conv.stlRequestId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTypeFilter = filterType === 'all' ||
      (filterType === 'orders' && conv.orderId) ||
      (filterType === 'stl' && conv.stlRequestId) ||
      (filterType === 'system' && conv.participantType === 'support');

    const matchesUnreadFilter = !showUnreadOnly || conv.unreadCount > 0;

    return matchesSearchQuery && matchesTypeFilter && matchesUnreadFilter;
  });

  const selectedConversation = selectedConversationId
    ? getThread(selectedConversationId)
    : null;

  // Helper functions
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.orderId) {
      return `Order #${conversation.orderId}`;
    } else if (conversation.stlRequestId) {
      return `STL Request #${conversation.stlRequestId}`;
    } else if (conversation.participantType === 'support') {
      return 'System Notification';
    } else {
      return conversation.participantName;
    }
  };

  const getConversationType = (conversation: Conversation) => {
    if (conversation.orderId) {
      return 'Order';
    } else if (conversation.stlRequestId) {
      return 'STL';
    } else if (conversation.participantType === 'support') {
      return 'System';
    } else {
      return 'Message';
    }
  };

  const getConversationTypeColor = (conversation: Conversation) => {
    if (conversation.orderId) {
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
    } else if (conversation.stlRequestId) {
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
    } else if (conversation.participantType === 'support') {
      return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
    } else {
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getOrderStatus = (orderId: string) => {
    // Mock order statuses based on order ID
    const statuses: Record<string, string> = {
      'A-1042': 'Printing',
      'A-1038': 'QC',
      'A-1035': 'Cancelled',
      'A-1033': 'Delivered',
      'A-1031': 'Printing',
      'A-1028': 'Shipping',
      'A-1025': 'Delivered',
      'A-1022': 'Shipped'
    };
    return statuses[orderId] || 'Processing';
  };

  const getStlStatus = (stlRequestId: string) => {
    // Mock STL request statuses
    const statuses: Record<string, string> = {
      'R-2201': 'In Design',
      'R-2198': 'Review',
      'R-2195': 'Submitted',
      'R-2190': 'Review',
      'R-2185': 'In Design'
    };
    return statuses[stlRequestId] || 'Submitted';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'printing':
      case 'processing':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'qc':
      case 'review':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'shipping':
      case 'shipped':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'submitted':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
      case 'in design':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const handleViewOrder = (orderId: string) => {
    // Navigate to order detail page
    console.log('Navigate to order:', orderId);
    // In real app: navigate(`/seller/orders/${orderId}`);
  };

  const handleViewStlRequest = (stlRequestId: string) => {
    // Navigate to STL request detail page
    console.log('Navigate to STL request:', stlRequestId);
    // In real app: navigate(`/seller/stl-requests/${stlRequestId}`);
  };

  const getSenderDisplayName = (message: Message) => {
    if (message.isFromSeller) {
      return 'You';
    }
    return message.senderName;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getParticipantTypeIcon = (type: string) => {
    switch (type) {
      case 'customer': return 'ri-user-line';
      case 'designer': return 'ri-pencil-ruler-2-line';
      case 'support': return 'ri-notification-2-line';
      default: return 'ri-user-line';
    }
  };

  const getParticipantTypeBadge = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'designer':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'support':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileThread(true);
  };

  const handleBackToList = () => {
    setShowMobileThread(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const result = sendMessage(selectedConversationId!, newMessage.trim());

    if (result.success && result.conversation) {
      // Update local state with the updated conversation
      setConversationsData(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversationId ? result.conversation! : conv
        )
      );
    }

    // Clear input
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.stl,.obj,.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx';

    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        console.log('Files selected:', Array.from(files).map(f => f.name));
        // In real app: handle file upload
      }
    };

    fileInput.click();
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px]">
        <h4 className="text-[20px] font-semibold text-black dark:text-white mb-2">
          Messages
        </h4>
        <p className="text-gray-500 dark:text-gray-400">
          Conversations for orders and custom STL requests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List - Hide on mobile when thread is shown */}
        <div className={`lg:col-span-1 ${showMobileThread ? 'hidden lg:block' : 'block'}`}>
          <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md h-full flex flex-col">
            {/* Search Header */}
            <div className="p-[20px] border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Filter and Sort Options */}
            <div className="p-[20px] border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Type Filter */}
                <div className="flex-1 min-w-0">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'orders' | 'stl' | 'system')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Conversations</option>
                    <option value="orders">Order Conversations</option>
                    <option value="stl">STL Request Conversations</option>
                    <option value="system">System Notifications</option>
                  </select>
                </div>

                {/* Unread Filter */}
                <div className="flex items-center gap-2">
                  <input
                    id="showUnreadOnly"
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                  <label htmlFor="showUnreadOnly" className="text-sm text-gray-700 dark:text-gray-300">
                    Unread Only
                  </label>
                </div>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        selectedConversationId === conversation.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <i className={`${getParticipantTypeIcon(conversation.participantType)} text-gray-600 dark:text-gray-400`}></i>
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Title and Timestamp */}
                          <div className="flex items-center justify-between mb-1">
                            <h6 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {getConversationTitle(conversation)}
                            </h6>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>

                          {/* Type Badge and Participant Name */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getConversationTypeColor(conversation)}`}>
                              {getConversationType(conversation)}
                            </span>
                            {conversation.participantType !== 'support' && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {conversation.participantName}
                              </span>
                            )}
                          </div>

                          {/* Last Message and Unread Count */}
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <i className="ri-message-3-line text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                  {searchQuery || filterType !== 'all' || showUnreadOnly ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No conversations found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterType('all');
                          setShowUnreadOnly(false);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        <i className="ri-refresh-line"></i>
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No conversations yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Start conversations with customers and designers here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversation Thread - Show on mobile when selected */}
        <div className={`${showMobileThread ? 'lg:col-span-2' : 'lg:col-span-2 hidden lg:block'} ${showMobileThread ? 'col-span-1' : ''}`}>
          <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  {/* Mobile Back Button Row */}
                  <div className="flex items-center gap-3 mb-3 lg:mb-0">
                    <button
                      onClick={handleBackToList}
                      className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <i className="ri-arrow-left-line text-xl"></i>
                    </button>
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white lg:hidden">
                      {getConversationTitle(selectedConversation)}
                    </h5>
                  </div>

                  {/* Main Header Content */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Participant Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <i className={`${getParticipantTypeIcon(selectedConversation.participantType)} text-gray-600 dark:text-gray-400`}></i>
                        </div>
                        {selectedConversation.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title - Hidden on mobile, shown on desktop */}
                        <h5 className="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {getConversationTitle(selectedConversation)}
                        </h5>

                        {/* Participant Name */}
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedConversation.participantName}
                        </p>

                        {/* Context Chips Row */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {/* Participant Type Badge */}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getParticipantTypeBadge(selectedConversation.participantType)}`}>
                            {selectedConversation.participantType}
                          </span>

                          {/* Order Status Chip */}
                          {selectedConversation.orderId && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getOrderStatus(selectedConversation.orderId))}`}>
                              {getOrderStatus(selectedConversation.orderId)}
                            </span>
                          )}

                          {/* STL Status Chip */}
                          {selectedConversation.stlRequestId && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getStlStatus(selectedConversation.stlRequestId))}`}>
                              {getStlStatus(selectedConversation.stlRequestId)}
                            </span>
                          )}

                          {/* Online Status */}
                          {selectedConversation.isOnline && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Online
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {selectedConversation.orderId && (
                        <button
                          onClick={() => handleViewOrder(selectedConversation.orderId!)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        >
                          <i className="ri-external-link-line"></i>
                          <span className="hidden sm:inline">View Order</span>
                        </button>
                      )}

                      {selectedConversation.stlRequestId && (
                        <button
                          onClick={() => handleViewStlRequest(selectedConversation.stlRequestId!)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-md transition-colors"
                        >
                          <i className="ri-external-link-line"></i>
                          <span className="hidden sm:inline">View Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromSeller ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.isFromSeller ? 'order-2' : 'order-1'}`}>
                        {/* Sender Name - Only show for non-seller messages */}
                        {!message.isFromSeller && (
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {message.senderName}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              message.senderId.includes('customer') 
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : message.senderId.includes('designer')
                                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                                : message.senderId.includes('system')
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {getSenderRole(message.senderId)}
                            </span>
                          </div>
                        )}

                        <div className={`p-3 rounded-lg ${
                          message.isFromSeller
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                          {/* Mock Attachment Support */}
                          {(message.content.includes('attached') || message.content.includes('file') || message.content.includes('render')) && (
                            <div className="mt-2 space-y-2">
                              {message.content.includes('render') && (
                                <div className="flex items-center gap-2 p-2 bg-black/10 dark:bg-white/10 rounded border border-dashed border-gray-300 dark:border-gray-600">
                                  <i className="ri-image-line text-base"></i>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">controller_stand_render.jpg</p>
                                    <p className="text-xs opacity-75">2.4 MB</p>
                                  </div>
                                  <button className="text-xs hover:underline">View</button>
                                </div>
                              )}

                              {message.content.includes('design concepts') && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 p-2 bg-black/10 dark:bg-white/10 rounded border border-dashed border-gray-300 dark:border-gray-600">
                                    <i className="ri-file-3d-line text-base"></i>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">lampshade_concept_1.stl</p>
                                      <p className="text-xs opacity-75">1.8 MB</p>
                                    </div>
                                    <button className="text-xs hover:underline">Download</button>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-black/10 dark:bg-white/10 rounded border border-dashed border-gray-300 dark:border-gray-600">
                                    <i className="ri-file-3d-line text-base"></i>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">lampshade_concept_2.stl</p>
                                      <p className="text-xs opacity-75">2.1 MB</p>
                                    </div>
                                    <button className="text-xs hover:underline">Download</button>
                                  </div>
                                </div>
                              )}

                              {message.content.includes('logo file') && (
                                <div className="flex items-center gap-2 p-2 bg-black/10 dark:bg-white/10 rounded border border-dashed border-gray-300 dark:border-gray-600">
                                  <i className="ri-file-text-line text-base"></i>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">company_logo.pdf</p>
                                    <p className="text-xs opacity-75">456 KB</p>
                                  </div>
                                  <button className="text-xs hover:underline">View</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <p className={`text-xs mt-1 ${
                          message.isFromSeller 
                            ? 'text-right text-gray-500 dark:text-gray-400' 
                            : 'text-left text-gray-500 dark:text-gray-400'
                        }`}>
                          {getSenderDisplayName(message)} • {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <i className="ri-send-plane-line"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <div>
                  <i className="ri-chat-3-line text-6xl text-gray-400 dark:text-gray-600 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerMessages;
