import React, { useState, useEffect } from 'react';
import { markBlockedWithDetails, addActivity } from '../../features/makerJobs/mockJobs';
import {
  getConversations,
  getThread,
  sendMessage,
  markRead,
  updateConversationJobStatus,
  type Message,
  type Conversation
} from '../../features/makerMessages/mockMakerMessages';

const MakerMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'job' | 'support' | 'system'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved' | 'pending'>('all');
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Filter controls state
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    setConversations(getConversations());
  }, []);

  // Clarification modal state
  const [clarificationTemplate, setClarificationTemplate] = useState('');
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [markAsBlocked, setMarkAsBlocked] = useState(false);

  // Clarification templates
  const clarificationTemplates = [
    {
      value: 'missing_stl',
      label: 'Missing STL / wrong file',
      message: 'Hi! I need clarification regarding the STL file for this job. Either the file is missing or there seems to be an issue with the uploaded file. Could you please check and re-upload the correct STL file? This will help me proceed with your order promptly.'
    },
    {
      value: 'material_color',
      label: 'Material/color unclear',
      message: 'Hi! I need clarification on the material and color specifications for your order. The current specifications are not clear enough for me to proceed. Could you please provide more details about the exact material type, color, and any specific finish requirements?'
    },
    {
      value: 'tolerance_fit',
      label: 'Tolerance/fit question',
      message: 'Hi! I have a question about the tolerance and fit requirements for your parts. To ensure the best quality and functionality, could you please clarify the specific tolerance requirements and how these parts will be used or assembled?'
    },
    {
      value: 'qc_standard',
      label: 'QC standard question',
      message: 'Hi! I need clarification on the quality control standards expected for this job. Could you please specify any particular QC requirements, inspection criteria, or quality standards that need to be met for this order?'
    },
    {
      value: 'shipping_label',
      label: 'Shipping label issue',
      message: 'Hi! There seems to be an issue with the shipping label or address information for your order. Could you please verify and provide the correct shipping details to ensure timely and accurate delivery?'
    },
    {
      value: 'other',
      label: 'Other',
      message: 'Hi! I need some clarification regarding your order. Could you please provide additional information so I can proceed with your job effectively?'
    }
  ];

  // Enhanced filter function with search and toggles
  const filteredConversations = conversations.filter(conv => {
    // Search filter (title + last message + participant names)
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      conv.title.toLowerCase().includes(searchLower) ||
      conv.lastMessage.toLowerCase().includes(searchLower) ||
      conv.participants.some(p => p.name.toLowerCase().includes(searchLower));

    // Type filter
    const matchesType = filterType === 'all' || conv.type === filterType;

    // Status filter
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;

    // Unread only toggle
    const matchesUnread = !showUnreadOnly || conv.unreadCount > 0;

    // Blocked only toggle (only applies to job conversations)
    const matchesBlocked = !showBlockedOnly || (conv.type === 'job' && conv.jobStatus === 'blocked');

    return matchesSearch && matchesType && matchesStatus && matchesUnread && matchesBlocked;
  });

  const handleConversationSelect = (conversation: Conversation) => {
    // Mark conversation as read when selected
    if (conversation.unreadCount > 0) {
      markRead(conversation.id);
      setConversations(getConversations());
    }

    const updatedConversation = getThread(conversation.id);
    setSelectedConversation(updatedConversation);
    setShowMobileThread(true);
  };

  const handleBackToList = () => {
    setShowMobileThread(false);
    setSelectedConversation(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
    setShowUnreadOnly(false);
    setShowBlockedOnly(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const sentMessage = sendMessage(selectedConversation.id, newMessage.trim());

    if (sentMessage) {
      // Refresh conversations and selected conversation
      setConversations(getConversations());
      const updatedConversation = getThread(selectedConversation.id);
      setSelectedConversation(updatedConversation);
    }

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttachment = () => {
    // UI only - open file picker but no upload
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        console.log('Selected files:', Array.from(files).map(f => f.name));
        // In a real app, this would handle file upload
      }
    };
    input.click();
  };

  const handleMarkBlocked = () => {
    setShowBlockedModal(true);
  };

  const handleRequestClarification = () => {
    setShowClarificationModal(true);
  };

  const getSenderName = (message: Message, conversation: Conversation) => {
    if (message.isFromUser) {
      return 'You';
    }

    const sender = conversation.participants.find(p => p.id !== 'maker-1');
    return sender?.name || 'Unknown';
  };


  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'support': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'clarification': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'system': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'resolved': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getJobStatusColor = (jobStatus?: string) => {
    switch (jobStatus) {
      case 'printing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'qc': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'shipped': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleString();
    }
  };

  // Handle sending clarification request
  const handleSendClarification = () => {
    if (!clarificationMessage.trim() || !selectedConversation) return;

    // Send the clarification message
    const sentMessage = sendMessage(selectedConversation.id, clarificationMessage.trim());

    if (sentMessage) {
      // Update job status if marked as blocked
      if (markAsBlocked && selectedConversation.type === 'job') {
        updateConversationJobStatus(selectedConversation.id, 'blocked');

        // If this is a job conversation and should be marked as blocked
        if (selectedConversation.relatedId) {
          const templateLabel = clarificationTemplates.find(t => t.value === clarificationTemplate)?.label || 'Clarification needed';

          // Mark job as blocked in mockJobs
          const success = markBlockedWithDetails(
            selectedConversation.relatedId,
            templateLabel,
            clarificationMessage.trim()
          );

          if (success) {
            // Add activity log entry
            addActivity(selectedConversation.relatedId, {
              status: 'blocked',
              note: `Job blocked - ${templateLabel}: ${clarificationMessage.trim()}`
            });

            console.log(`Job ${selectedConversation.relatedId} marked as blocked due to clarification request`);
          }
        }
      }

      // Refresh conversations and selected conversation
      setConversations(getConversations());
      const updatedConversation = getThread(selectedConversation.id);
      setSelectedConversation(updatedConversation);
    }

    // Reset modal state
    setClarificationTemplate('');
    setClarificationMessage('');
    setMarkAsBlocked(false);
    setShowClarificationModal(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Messages</h1>
          <span className="ml-2 text-sm text-gray-500">{filteredConversations.length} conversations</span>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
            New Message
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700">
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          {showMobileThread ? (
            <button onClick={handleBackToList} className="text-gray-500 hover:text-gray-700 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : null}
          <h1 className="text-lg font-semibold">
            {showMobileThread && selectedConversation ? selectedConversation.title : 'Messages'}
          </h1>
        </div>
        <div className="flex space-x-2">
          {showMobileThread && selectedConversation?.type === 'job' ? (
            <>
              <button onClick={handleMarkBlocked} className="p-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </button>
              <button onClick={handleRequestClarification} className="p-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-1">
          {/* Left Sidebar - Conversation List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search and Filter Bar */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {/* Search Input */}
                <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filter Controls - Trezo Style */}
                <div className="flex flex-wrap gap-2">
                  {/* Type Filter */}
                  <div className="flex items-center">
                    <label htmlFor="filter-type" className="text-sm font-medium text-gray-700 mr-2">
                      Type:
                    </label>
                    <select
                      id="filter-type"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'job' | 'support' | 'system')}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="job">Jobs</option>
                      <option value="support">Support</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center">
                    <label htmlFor="filter-status" className="text-sm font-medium text-gray-700 mr-2">
                      Status:
                    </label>
                    <select
                      id="filter-status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'resolved' | 'pending')}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Unread Only Toggle */}
                  <div className="flex items-center">
                    <input
                      id="show-unread"
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="show-unread" className="ml-2 text-sm font-medium text-gray-700">
                      Unread Only
                    </label>
                  </div>

                  {/* Blocked Only Toggle (Jobs only) */}
                  <div className="flex items-center">
                    <input
                      id="show-blocked"
                      type="checkbox"
                      checked={showBlockedOnly}
                      onChange={(e) => setShowBlockedOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="show-blocked" className="ml-2 text-sm font-medium text-gray-700">
                      Blocked Only
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {filteredConversations.length > 0 ? (
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`cursor-pointer p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${getTypeColor(conversation.type)}`}>
                          <span className="text-xs font-semibold uppercase">{conversation.participants[0].initials}</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 truncate">{conversation.title}</span>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full flex-shrink-0">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">{formatTimestamp(conversation.timestamp)}</span>
                            {conversation.jobStatus && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(conversation.jobStatus)}`}>
                                {conversation.jobStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters to see more conversations.'
                    : 'Your conversations will appear here when you receive messages.'
                  }
                </p>
                {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Messages */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Thread Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getTypeColor(selectedConversation.type)}`}>
                        <span className="text-xs font-semibold uppercase">
                          {selectedConversation.participants.find(p => p.id !== 'maker-1')?.initials || 'U'}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{selectedConversation.title}</h2>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.participants.find(p => p.id !== 'maker-1')?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    {selectedConversation.type === 'job' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleMarkBlocked}
                          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Block
                        </button>
                        <button
                          onClick={handleRequestClarification}
                          className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Request Clarification
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thread Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {selectedConversation.messages.map(message => (
                      <div key={message.id} className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromUser 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <div className={`text-xs mb-1 ${message.isFromUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {getSenderName(message, selectedConversation)} • {formatTimestamp(message.timestamp)}
                          </div>
                          <div className="text-sm">{message.content}</div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map(attachment => (
                                <div key={attachment.id} className={`text-xs px-2 py-1 rounded ${
                                  message.isFromUser ? 'bg-blue-500' : 'bg-gray-100'
                                }`}>
                                  📎 {attachment.name} ({attachment.size})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thread Input */}
                <div className="p-6 border-t border-gray-200 bg-white">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleFileAttachment}
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Attach files"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                        title="Send message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Press Enter to send • Shift+Enter for new line • Click attach to add files
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation to view messages</h3>
                <p className="text-gray-500">
                  Choose a conversation from the sidebar to start reading and replying to messages.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex-1 flex flex-col">
          {!showMobileThread ? (
            // Mobile Conversation List
            <>
              {/* Mobile Search and Filter Bar */}
              <div className="p-4 bg-white border-b border-gray-200">
                {/* Search Input */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filter Controls Row 1 */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'job' | 'support' | 'system')}
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="job">Jobs</option>
                    <option value="support">Support</option>
                    <option value="system">System</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'resolved' | 'pending')}
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Filter Controls Row 2 - Toggles */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      id="mobile-show-unread"
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="mobile-show-unread" className="ml-2 text-sm font-medium text-gray-700">
                      Unread Only
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="mobile-show-blocked"
                      type="checkbox"
                      checked={showBlockedOnly}
                      onChange={(e) => setShowBlockedOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="mobile-show-blocked" className="ml-2 text-sm font-medium text-gray-700">
                      Blocked Only
                    </label>
                  </div>

                  {/* Clear Filters Button - Mobile */}
                  {(searchQuery || filterType !== 'all' || filterStatus !== 'all' || showUnreadOnly || showBlockedOnly) && (
                    <button
                      onClick={handleClearFilters}
                      className="ml-auto px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${getTypeColor(conversation.type)}`}>
                          <span className="text-sm font-semibold uppercase">{conversation.participants[0].initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.title}</h3>
                            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                              {conversation.unreadCount > 0 && (
                                <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                                  {conversation.unreadCount}
                                </span>
                              )}
                              <span className="text-xs text-gray-400">{formatTimestamp(conversation.timestamp)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                              {conversation.status}
                            </span>
                            {conversation.jobStatus && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(conversation.jobStatus)}`}>
                                {conversation.jobStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                    <p className="text-gray-500 mb-4 text-center">
                      {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                        ? 'Try adjusting your search or filters to see more conversations.'
                        : 'Your conversations will appear here when you receive messages.'
                      }
                    </p>
                    {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Mobile Conversation Thread
            <div className="flex-1 flex flex-col">
              {/* Thread Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                  {selectedConversation?.messages.map(message => (
                    <div key={message.id} className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.isFromUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <div className={`text-xs mb-1 ${message.isFromUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                        <div className="text-sm">{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Thread Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleFileAttachment}
                      type="button"
                      className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Attach files"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                      title="Send message"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showBlockedModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Mark as Blocked</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to mark this conversation as blocked? You will no longer receive notifications for new messages.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowBlockedModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md shadow-sm hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle block action
                  setShowBlockedModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Request Clarification Modal - Trezo Style */}
      {showClarificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Request Clarification</h3>
                <button
                  onClick={() => setShowClarificationModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-300 mt-2">
                Select a template and customize your clarification request. The customer will be notified to provide additional information.
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Template Dropdown */}
              <div>
                <label htmlFor="clarification-template" className="block text-sm font-medium text-gray-300 mb-2">
                  Template
                </label>
                <select
                  id="clarification-template"
                  value={clarificationTemplate}
                  onChange={(e) => {
                    const template = clarificationTemplates.find(t => t.value === e.target.value);
                    setClarificationTemplate(e.target.value);
                    setClarificationMessage(template ? template.message : '');
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select a template --</option>
                  {clarificationTemplates.map(template => (
                    <option key={template.value} value={template.value} className="bg-slate-800">
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="clarification-message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="clarification-message"
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                  placeholder="Type your clarification request..."
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="text-xs text-gray-400 mt-1">
                  {clarificationMessage.length} characters
                </div>
              </div>

              {/* Mark as Blocked Checkbox - Only for Job conversations */}
              {selectedConversation?.type === 'job' && (
                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5">
                    <input
                      id="mark-blocked"
                      type="checkbox"
                      checked={markAsBlocked}
                      onChange={(e) => setMarkAsBlocked(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="mark-blocked" className="font-medium text-gray-300 cursor-pointer">
                      Mark job as Blocked
                    </label>
                    <p className="text-gray-400">
                      This will pause the job until the customer provides the requested information.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setClarificationTemplate('');
                  setClarificationMessage('');
                  setMarkAsBlocked(false);
                  setShowClarificationModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendClarification}
                disabled={!clarificationMessage.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-gray-400 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakerMessages;
