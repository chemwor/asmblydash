import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getConversations,
  getThread,
  sendMessage,
  type Conversation,
  type Message,
  type Attachment
} from '../../features/designerMessages/mockDesignerMessages';

const DesignerMessages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [showMobileThread, setShowMobileThread] = useState<boolean>(false);
  const [showRevisionModal, setShowRevisionModal] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState<boolean>(false);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Request' | 'Support' | 'System'>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [inReviewOnly, setInReviewOnly] = useState<boolean>(false);
  const [revisionNeededOnly, setRevisionNeededOnly] = useState<boolean>(false);

  // Quick Templates
  const quickTemplates = [
    {
      id: 'clarification',
      name: 'Need clarification',
      content: `Hi! I need some clarification on a few points before I can proceed:

• [Specific requirement or detail needed]
• [Another point that needs clarification]
• [Any other missing information]

Could you please provide these details so I can deliver exactly what you're looking for?

Thanks!`
    },
    {
      id: 'deliverables',
      name: 'Deliverables uploaded',
      content: `Hi! I've completed your project and uploaded the deliverables:

✅ [List what was delivered - e.g., "3 logo variations in PNG, SVG, and PDF formats"]
✅ [Additional deliverables - e.g., "Business card mockups"]
✅ [Any extras - e.g., "Brand guidelines document"]

Please review and let me know if you need any adjustments or have any questions.

Best regards!`
    },
    {
      id: 'review',
      name: 'Please review',
      content: `Hi! I've completed the work and would love your feedback.

Please take a look at the attached files and let me know:
• Are you happy with the overall direction?
• Any changes or adjustments needed?
• Ready for final delivery?

Looking forward to your thoughts!`
    },
    {
      id: 'revision',
      name: 'Revision notes',
      content: `Hi! I've reviewed your feedback and here's my revision plan:

**Changes to implement:**
• [Change 1] - [Brief explanation]
• [Change 2] - [Brief explanation]
• [Change 3] - [Brief explanation]

**Questions/Clarifications needed:**
• [Any questions about the feedback]
• [Points that need clarification]

I'll have the revisions ready by [estimated timeframe]. Let me know if this looks good!`
    },
    {
      id: 'printability',
      name: 'Printability check',
      content: `Hi! Before finalizing the design, I'd like to confirm the printability requirements:

**Current specs:**
• Print size: [dimensions]
• Resolution: 300 DPI
• Color mode: CMYK
• Bleed: [amount] if applicable

**Please confirm:**
• Are these specifications correct for your printing needs?
• Any specific printer requirements or constraints?
• Do you need any additional print-ready formats?

This will ensure the final files are perfect for production!`
    }
  ];

  // Load conversations on component mount
  useEffect(() => {
    const loadedConversations = getConversations();
    setConversations(loadedConversations);

    // Auto-select first conversation if available
    if (loadedConversations.length > 0 && !selectedConversation) {
      handleSelectConversation(loadedConversations[0]);
    }
  }, [selectedConversation]);

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    const conversationMessages = getThread(conversation.id);
    setMessages(conversationMessages);

    // Mark conversation as read
    if (conversation.unreadCount > 0) {
      setConversations(prev =>
        prev.map(c => c.id === conversation.id ? { ...c, unreadCount: 0 } : c)
      );
    }

    // Show thread on mobile
    setShowMobileThread(true);
  };

  // Handle sending new message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const attachments: Attachment[] = selectedFiles.map((file, index) => ({
      id: `att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: formatFileSize(file.size),
      url: URL.createObjectURL(file)
    }));

    const sentMessage = sendMessage(selectedConversation!.id, newMessage.trim(), attachments);
    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
    setSelectedFiles([]);

    // Update conversation list
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversation!.id
          ? { ...c, lastMessage: sentMessage, updatedAt: sentMessage.timestamp, unreadCount: 0 }
          : c
      ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );

    // Mark conversation as read
    setSelectedConversation(prev => prev ? { ...prev, unreadCount: 0 } : null);
  };

  // Handle back to list on mobile
  const handleBackToList = () => {
    setShowMobileThread(false);
  };

  // Handle Submit for Review
  const handleSubmitForReview = () => {
    if (!selectedConversation) return;

    // Update conversation status
    setSelectedConversation(prev => prev ? { ...prev, requestStatus: 'In Review' } : null);
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversation!.id
          ? { ...c, requestStatus: 'In Review' }
          : c
      )
    );
  };

  // Handle Mark Revision Needed
  const handleMarkRevisionNeeded = (template: string) => {
    if (!selectedConversation) return;

    // Send template message
    const revisionMessage = sendMessage(selectedConversation!.id, template);
    setMessages(prev => [...prev, revisionMessage]);

    // Update conversation status
    setSelectedConversation(prev => prev ? { ...prev, requestStatus: 'Revision Needed' } : null);
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversation!.id
          ? { ...c, requestStatus: 'Revision Needed', lastMessage: revisionMessage, updatedAt: revisionMessage.timestamp }
          : c
      )
    );

    setShowRevisionModal(false);
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  // Format due date
  const formatDueDate = (daysFromNow: number) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysFromNow);
    return dueDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get role badge styling
  const getRoleBadge = (role: string) => {
    const badges = {
      'Designer': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'Client': 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'Seller': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'Maker': 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'Support': 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    };
    return badges[role as keyof typeof badges] || badges.Client;
  };

  // Get priority badge class
  const getPriorityBadge = (priority: string) => {
    const badges = {
      'Normal': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Rush': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return badges[priority as keyof typeof badges] || badges.Normal;
  };

  // Get type badge class
  const getTypeBadge = (type: string) => {
    const badges = {
      'Request': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Support': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'System': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
    return badges[type as keyof typeof badges] || badges.Request;
  };

  // Get request status badge class
  const getRequestStatusBadge = (status: string) => {
    const badges = {
      'New': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'In Review': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Revision Needed': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Approved': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    };
    return badges[status as keyof typeof badges] || badges.New;
  };

  // Handle textarea key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
    e.target.value = ''; // Reset input
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle template selection
  const handleTemplateSelect = (template: typeof quickTemplates[0]) => {
    setNewMessage(template.content);
    setShowTemplateDropdown(false);
  };

  // Filter and search conversations
  const getFilteredConversations = () => {
    let filtered = [...conversations];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv => {
        // Search in title
        if (conv.title.toLowerCase().includes(query)) return true;

        // Search in last message content
        if (conv.lastMessage.content.toLowerCase().includes(query)) return true;

        // Search in participant names
        return conv.participants.some(p => p.name.toLowerCase().includes(query));
      });
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(conv => conv.type === typeFilter);
    }

    // Unread only toggle
    if (unreadOnly) {
      filtered = filtered.filter(conv => conv.unreadCount > 0);
    }

    // Request-specific filters
    if (typeFilter === 'Request' || typeFilter === 'All') {
      if (inReviewOnly) {
        filtered = filtered.filter(conv =>
          conv.type === 'Request' && conv.requestStatus === 'In Review'
        );
      }

      if (revisionNeededOnly) {
        filtered = filtered.filter(conv =>
          conv.type === 'Request' && conv.requestStatus === 'Revision Needed'
        );
      }
    }

    // Sort by most recent
    return filtered.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  };

  // Handle type filter selection
  const handleTypeFilterSelect = (type: typeof typeFilter) => {
    setTypeFilter(type);
    setShowFilterDropdown(false);

    // Reset request-specific toggles when switching away from requests
    if (type !== 'Request') {
      setInReviewOnly(false);
      setRevisionNeededOnly(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setUnreadOnly(false);
    setInReviewOnly(false);
    setRevisionNeededOnly(false);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (typeFilter !== 'All') count++;
    if (unreadOnly) count++;
    if (inReviewOnly) count++;
    if (revisionNeededOnly) count++;
    return count;
  };

  const filteredConversations = getFilteredConversations();

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Conversations for requests, revisions, and approvals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className={`lg:col-span-4 ${showMobileThread ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversations</h3>

              {/* Search and Filter Controls */}
              <div className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Filter Controls Row */}
                <div className="flex items-center justify-between gap-2">
                  {/* Type Filter Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(prev => !prev)}
                      className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      {typeFilter}
                      <svg className={`w-3 h-3 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showFilterDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                        <div className="absolute top-full left-0 z-20 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                          {(['All', 'Request', 'Support', 'System'] as const).map(type => (
                            <button
                              key={type}
                              onClick={() => handleTypeFilterSelect(type)}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                typeFilter === type
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Clear Filters Button */}
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Clear all filters"
                    >
                      Clear ({getActiveFilterCount()})
                    </button>
                  )}
                </div>

                {/* Toggle Controls */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {/* Unread Only Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unreadOnly}
                      onChange={(e) => setUnreadOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Unread only</span>
                  </label>

                  {/* Request-specific toggles - only show when viewing All or Request types */}
                  {(typeFilter === 'All' || typeFilter === 'Request') && (
                    <>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inReviewOnly}
                          onChange={(e) => setInReviewOnly(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">In Review only</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={revisionNeededOnly}
                          onChange={(e) => setRevisionNeededOnly(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Revision Needed only</span>
                      </label>
                    </>
                  )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {filteredConversations.length} of {conversations.length} conversations
                  </span>
                  {filteredConversations.length === 0 && conversations.length > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">No matches found</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No conversations found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No conversations match your current filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedConversation?.id === conversation.id 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {conversation.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeBadge(conversation.type)}`}>
                              {conversation.type}
                            </span>
                          </div>
                          {conversation.requestId && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {conversation.requestId}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                        <span className="font-medium">{conversation.lastMessage.senderName}:</span>{' '}
                        {conversation.lastMessage.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          {conversation.type === 'Request' && conversation.requestStatus && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRequestStatusBadge(conversation.requestStatus)}`}>
                              {conversation.requestStatus}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(conversation.priority)}`}>
                            {conversation.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {conversation.participants.slice(0, 3).map((participant) => (
                            <div
                              key={participant.id}
                              className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden"
                              title={participant.name}
                            >
                              {participant.avatar ? (
                                <img
                                  src={participant.avatar}
                                  alt={participant.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                  {participant.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className={`lg:col-span-8 ${showMobileThread ? 'block' : 'hidden lg:block'}`}>
          {selectedConversation ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
              {/* Enhanced Thread Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToList}
                      className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Back to conversations"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {selectedConversation.title}
                      </h3>
                      {selectedConversation.requestId && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedConversation.requestId} - {selectedConversation.requestTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedConversation.type === 'Request' && selectedConversation.requestId && (
                      <Link
                        to={`/designer/requests/${selectedConversation.requestId}`}
                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="hidden sm:inline">Open Request</span>
                      </Link>
                    )}

                    {selectedConversation.type === 'Request' && (
                      <>
                        <button
                          onClick={() => setShowRevisionModal(true)}
                          className="px-3 py-1.5 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="hidden sm:inline">Mark Revision Needed</span>
                        </button>

                        <button
                          onClick={handleSubmitForReview}
                          className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="hidden sm:inline">Submit for Review</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Context Chips for Request Type */}
                {selectedConversation.type === 'Request' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedConversation.requestStatus && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRequestStatusBadge(selectedConversation.requestStatus)}`}>
                        {selectedConversation.requestStatus}
                      </span>
                    )}

                    {/* Due Date Chip */}
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due {formatDueDate(3)}
                    </span>

                    {/* Client Chip */}
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Client: {selectedConversation.participants.find(p => p.role === 'Client')?.name || 'N/A'}
                    </span>

                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(selectedConversation.priority)}`}>
                      {selectedConversation.priority} Priority
                    </span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'user-designer-001' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      message.senderId === 'user-designer-001'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    } rounded-lg p-3 shadow-sm`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${
                            message.senderId === 'user-designer-001' 
                              ? 'text-blue-100' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {message.senderName}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            message.senderId === 'user-designer-001'
                              ? 'bg-blue-500 text-blue-100'
                              : getRoleBadge(message.senderRole)
                          }`}>
                            {message.senderRole === 'Designer' && message.senderId === 'user-designer-001' ? 'Me' : message.senderRole}
                          </span>
                        </div>
                        <span className={`text-xs ${
                          message.senderId === 'user-designer-001'
                            ? 'text-blue-200'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className={`flex items-center gap-2 p-2 rounded ${
                              message.senderId === 'user-designer-001'
                                ? 'bg-blue-500 bg-opacity-20'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}>
                              <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                attachment.type === 'image' 
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {attachment.type === 'image' ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate max-w-32" title={attachment.name}>
                                  {attachment.name}
                                </p>
                                <p className={`text-xs ${
                                  message.senderId === 'user-designer-001'
                                    ? 'text-blue-200'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {attachment.size}
                                </p>
                              </div>
                              <button className={`text-xs px-2 py-1 rounded ${
                                message.senderId === 'user-designer-001'
                                  ? 'bg-blue-500 hover:bg-blue-400 text-white'
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300'
                              } transition-colors`}>
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Compose Box */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Selected Files ({selectedFiles.length}/5):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 pr-1">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                            file.type.startsWith('image/') 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {file.type.startsWith('image/') ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 max-w-32 truncate" title={file.name}>
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeSelectedFile(index)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove file"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* File Upload Button */}
                    <label className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 cursor-pointer transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                    </label>

                    {/* Template Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTemplateDropdown(prev => !prev)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Quick templates"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>

                      {showTemplateDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowTemplateDropdown(false)} />
                          <div className="absolute bottom-full right-0 z-20 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Templates</h4>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {quickTemplates.map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleTemplateSelect(template)}
                                  className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    {template.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {template.content.split('\n')[0]}...
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>Send</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
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

      {/* Revision Modal */}
      {showRevisionModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowRevisionModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mark Revision Needed
                  </h3>
                  <button
                    onClick={() => setShowRevisionModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select a template or write a custom message to request revisions:
                </p>

                <div className="space-y-3">
                  {quickTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleMarkRevisionNeeded(template.content)}
                      className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {template.content}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DesignerMessages;
