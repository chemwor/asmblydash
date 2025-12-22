import React, { useState } from 'react';
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  CubeIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  PaperClipIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import type { DesignRequest, Deliverable, DeliverableItem } from '../features/designRequests/mockDesignRequests';
import { getRequestWithDeliverables, addDeliverableItem, removeDeliverableItem } from '../features/designerDashboard/mockDesignerDashboard';

interface Message {
  id: string;
  sender: 'Designer' | 'Seller' | 'Support';
  timestamp: string;
  body: string;
  attachments?: string[];
}

interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  internal: boolean;
}

interface ActivityEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'status' | 'deliverable' | 'message' | 'note';
}

interface DeliverablesSectionProps {
  request: DesignRequest;
  onUpdateRequest?: (updatedRequest: DesignRequest) => void;
}

const DeliverablesSection: React.FC<DeliverablesSectionProps> = ({
  request: initialRequest,
  onUpdateRequest
}) => {
  const [request, setRequest] = useState(() => getRequestWithDeliverables(initialRequest.id) || initialRequest);
  const [showUploadModal, setShowUploadModal] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState({
    name: '',
    type: '',
    size: ''
  });

  // Message thread state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Seller',
      timestamp: '2024-12-20T10:30:00Z',
      body: 'Project looks great! Just need a few minor adjustments to the corner radius and we should be good to go.',
      attachments: ['reference-image.jpg']
    },
    {
      id: '2',
      sender: 'Designer',
      timestamp: '2024-12-20T14:15:00Z',
      body: 'Thanks for the feedback! I\'ve made the requested changes to the corner radius. The updated files are ready for review.'
    },
    {
      id: '3',
      sender: 'Support',
      timestamp: '2024-12-21T09:00:00Z',
      body: 'Reminder: This project is due in 3 days. Please ensure all deliverables are uploaded before the deadline.'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [mockAttachments, setMockAttachments] = useState<string[]>([]);

  // Note modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteData, setNoteData] = useState({
    content: '',
    internal: true
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error'>('success');

  // Activity tracking state
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([
    {
      id: '1',
      timestamp: '2024-12-18T09:00:00Z',
      text: 'Project created and set to New status',
      type: 'status'
    },
    {
      id: '2',
      timestamp: '2024-12-19T14:30:00Z',
      text: 'Status changed to In Progress',
      type: 'status'
    },
    {
      id: '3',
      timestamp: '2024-12-20T10:15:00Z',
      text: 'Initial design files uploaded',
      type: 'deliverable'
    },
    {
      id: '4',
      timestamp: '2024-12-20T14:15:00Z',
      text: 'Designer added feedback response',
      type: 'message'
    }
  ]);

  const timelineSteps: Array<{ key: DesignRequest['status']; label: string }> = [
    { key: 'New', label: 'New' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'In Review', label: 'In Review' },
    { key: 'Revision Needed', label: 'Revision Needed' },
    { key: 'Approved', label: 'Approved' },
    { key: 'Delivered', label: 'Delivered' }
  ];

  const addActivity = (text: string, type: ActivityEntry['type']) => {
    const newActivity: ActivityEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      text,
      type
    };
    setActivityLog(prev => [newActivity, ...prev]);
  };

  const getDeliverableIcon = (type: Deliverable['type']) => {
    switch (type) {
      case 'stl':
        return <CubeIcon className="h-5 w-5" />;
      case 'renders':
        return <PhotoIcon className="h-5 w-5" />;
      case 'notes':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'source':
        return <DocumentIcon className="h-5 w-5" />;
      default:
        return <DocumentIcon className="h-5 w-5" />;
    }
  };

  const handleUpload = (deliverableType: Deliverable['type']) => {
    if (!uploadData.name.trim()) return;

    const newItem: Omit<DeliverableItem, 'id'> = {
      name: uploadData.name,
      uploadedDate: new Date().toISOString().split('T')[0],
      size: uploadData.size || `${Math.floor(Math.random() * 50) + 1} MB`,
      type: uploadData.type || getDefaultFileType(deliverableType)
    };

    const success = addDeliverableItem(request.id, deliverableType, newItem);

    if (success) {
      const updatedRequest = getRequestWithDeliverables(request.id);
      if (updatedRequest) {
        setRequest(updatedRequest);
        onUpdateRequest?.(updatedRequest);

        // Add activity log entry
        const deliverableLabel = updatedRequest.deliverables?.find(d => d.type === deliverableType)?.label || 'file';
        addActivity(`Uploaded ${deliverableLabel}: ${uploadData.name}`, 'deliverable');
      }
    }

    setShowUploadModal(null);
    setUploadData({ name: '', type: '', size: '' });
  };

  const handleRemove = (deliverableType: Deliverable['type'], itemId: string) => {
    const deliverable = request.deliverables?.find(d => d.type === deliverableType);
    const item = deliverable?.items.find(i => i.id === itemId);

    const success = removeDeliverableItem(request.id, deliverableType, itemId);

    if (success) {
      const updatedRequest = getRequestWithDeliverables(request.id);
      if (updatedRequest) {
        setRequest(updatedRequest);
        onUpdateRequest?.(updatedRequest);

        // Add activity log entry
        const deliverableLabel = deliverable?.label || 'file';
        addActivity(`Removed ${deliverableLabel}: ${item?.name || 'file'}`, 'deliverable');
      }
    }
  };

  const getDefaultFileType = (deliverableType: Deliverable['type']): string => {
    switch (deliverableType) {
      case 'stl':
        return 'STL';
      case 'renders':
        return 'PNG';
      case 'notes':
        return 'TXT';
      case 'source':
        return 'STEP';
      default:
        return 'FILE';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && mockAttachments.length === 0) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Designer',
      timestamp: new Date().toISOString(),
      body: newMessage,
      attachments: mockAttachments.length > 0 ? [...mockAttachments] : undefined
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setMockAttachments([]);

    // Add activity log entry for message
    addActivity(`Added message: "${newMessage.slice(0, 50)}${newMessage.length > 50 ? '...' : ''}"`, 'message');

    // Update request timestamp
    const updatedRequest = { ...request, updatedDate: new Date().toISOString().split('T')[0] };
    setRequest(updatedRequest);
    onUpdateRequest?.(updatedRequest);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickTemplate = (template: string) => {
    setNewMessage(template);
    setShowQuickTemplates(false);
  };

  const addMockAttachment = () => {
    const mockFiles = [
      'updated-design.pdf',
      'reference-notes.txt',
      'color-palette.png',
      'mockup-v2.jpg',
      'specifications.docx'
    ];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setMockAttachments(prev => [...prev, randomFile]);
  };

  const removeMockAttachment = (index: number) => {
    setMockAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderColor = (sender: Message['sender']) => {
    switch (sender) {
      case 'Designer':
        return 'text-blue-600 dark:text-blue-400';
      case 'Seller':
        return 'text-green-600 dark:text-green-400';
      case 'Support':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleSaveNote = () => {
    if (!noteData.content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: noteData.content,
      timestamp: new Date().toISOString(),
      author: 'Designer',
      internal: noteData.internal
    };

    // Add note to notes array
    setNotes(prev => [...prev, newNote]);

    // Add activity log entry
    const noteType = noteData.internal ? 'internal note' : 'note';
    addActivity(`Added ${noteType}: "${noteData.content.slice(0, 50)}${noteData.content.length > 50 ? '...' : ''}"`, 'note');

    // Update request timestamp (simulate saving to mock data)
    const updatedRequest = {
      ...request,
      updatedDate: new Date().toISOString().split('T')[0],
      // Simulate adding notes array to request object
      notes: [...(request.notes || []), newNote]
    };
    setRequest(updatedRequest);
    onUpdateRequest?.(updatedRequest);

    // Reset form and close modal
    setNoteData({ content: '', internal: true });
    setShowNoteModal(false);

    // Show success toast
    setShowToast(true);
    setToastMessage('Note added successfully!');
    setToastType('success');
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!request.deliverables) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Deliverables Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Deliverables
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Upload and manage project deliverables for {request.requestId}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {request.deliverables.map((deliverable) => (
              <div
                key={deliverable.type}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-600 dark:text-gray-400">
                      {getDeliverableIcon(deliverable.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {deliverable.label}
                        {deliverable.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {deliverable.status === 'added' ? (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">Added</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-orange-600 dark:text-orange-400">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">Missing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowUploadModal(deliverable.type)}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  >
                    <CloudArrowUpIcon className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>

                {/* Uploaded items list */}
                {deliverable.items.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Uploaded Files ({deliverable.items.length})
                    </h5>
                    <div className="space-y-1">
                      {deliverable.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="text-gray-500 dark:text-gray-400">
                              <DocumentIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.type} • {item.size} • {formatDate(item.uploadedDate)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemove(deliverable.type, item.id)}
                            className="ml-3 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Remove file"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review & Feedback Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Review & Feedback
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Communicate with the seller and support team
          </p>
        </div>

        {/* Messages Thread */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {message.sender[0]}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className={`text-sm font-medium ${getSenderColor(message.sender)}`}>
                      {message.sender}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {message.body}
                    </p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs"
                          >
                            <PaperClipIcon className="h-3 w-3 mr-1" />
                            {attachment}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compose Box */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {/* Mock Attachments */}
          {mockAttachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {mockAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
                >
                  <PaperClipIcon className="h-3 w-3 mr-1" />
                  {attachment}
                  <button
                    onClick={() => removeMockAttachment(index)}
                    className="ml-1 text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              {/* Mock Attachment Button */}
              <button
                onClick={addMockAttachment}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Add attachment"
              >
                <PaperClipIcon className="h-5 w-5" />
              </button>

              {/* Quick Templates Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickTemplates(!showQuickTemplates)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Quick templates"
                >
                  <ChevronDownIcon className="h-5 w-5" />
                </button>

                {showQuickTemplates && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {quickTemplates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickTemplate(template)}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && mockAttachments.length === 0}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Timeline Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Status Timeline
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Project progress and activity history
          </p>
        </div>

        <div className="p-6">
          {/* Timeline Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-600"></div>

              {timelineSteps.map((step, index) => {
                const currentStepIndex = timelineSteps.findIndex(s => s.key === request.status);
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isUpcoming = index > currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${
                        isCurrent 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : isCompleted 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Recent Activity
              </h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  title="Add Note"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activityLog.length} entries
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activityLog.slice(0, 10).map((activity) => {
                const getActivityIcon = (type: ActivityEntry['type']) => {
                  switch (type) {
                    case 'status':
                      return <ArrowRightIcon className="h-3 w-3" />;
                    case 'deliverable':
                      return <DocumentIcon className="h-3 w-3" />;
                    case 'message':
                      return <ChatBubbleLeftRightIcon className="h-3 w-3" />;
                    case 'note':
                      return <DocumentTextIcon className="h-3 w-3" />;
                    default:
                      return <ClockIcon className="h-3 w-3" />;
                  }
                };

                const getActivityColor = (type: ActivityEntry['type']) => {
                  switch (type) {
                    case 'status':
                      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
                    case 'deliverable':
                      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
                    case 'message':
                      return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
                    case 'note':
                      return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
                    default:
                      return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
                  }
                };

                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatMessageTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">
                Upload File
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {request.deliverables?.find(d => d.type === showUploadModal)?.label}
              </p>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  File Name *
                </label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter file name..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  File Type
                </label>
                <input
                  type="text"
                  value={uploadData.type}
                  onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder={getDefaultFileType(showUploadModal)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  File Size
                </label>
                <input
                  type="text"
                  value={uploadData.size}
                  onChange={(e) => setUploadData(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="e.g., 2.5 MB"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(null);
                  setUploadData({ name: '', type: '', size: '' });
                }}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpload(showUploadModal)}
                disabled={!uploadData.name.trim()}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">
                Add Note
              </h3>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Note Content *
                </label>
                <textarea
                  value={noteData.content}
                  onChange={(e) => setNoteData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your note here..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={noteData.internal}
                  onChange={(e) => setNoteData(prev => ({ ...prev, internal: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-slate-200">
                  Internal Note (only visible to you)
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteData({ content: '', internal: true });
                }}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!noteData.content.trim()}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-4 right-4 text-sm font-medium rounded-lg shadow-lg p-4 z-50 ${toastType === 'success' ? 'bg-green-600 text-white' : toastType === 'error' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default DeliverablesSection;
