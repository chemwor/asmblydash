import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SellerStlRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - in a real app this would come from props or context
  const mockRequests = [
    {
      id: 'STL-2024-001',
      title: 'Custom Phone Grip with Logo',
      category: 'Accessories',
      requestDate: '2024-12-18',
      updatedDate: '2024-12-19',
      dueDate: '2024-12-25',
      status: 'submitted',
      statusLabel: 'Submitted',
      statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      priority: 'high',
      priorityLabel: 'High',
      priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      budget: '$150 - $200',
      targetPrice: '$12.99',
      description: 'Custom phone grip with company logo and unique ergonomic design for promotional use. The grip should accommodate both portrait and landscape orientations and work with wireless charging. Logo should be embossed and clearly visible.',
      requesterEmail: 'client@techcorp.com',
      referenceLinks: [
        'https://example.com/logo-reference',
        'https://example.com/grip-inspiration'
      ],
      intendedUse: 'Etsy product'
    },
    {
      id: 'STL-2024-002',
      title: 'Miniature Building Model',
      category: 'Architecture',
      requestDate: '2024-12-17',
      updatedDate: '2024-12-19',
      dueDate: '2024-12-31',
      status: 'in_design',
      statusLabel: 'In Design',
      statusClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      priority: 'normal',
      priorityLabel: 'Normal',
      priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      budget: '$300 - $500',
      targetPrice: '$45.00',
      description: 'Detailed architectural model of downtown office building for presentation purposes. Should include accurate facade details, proper scaling at 1:200, and removable sections to show interior layout.',
      requesterEmail: 'architect@designstudio.com',
      referenceLinks: [
        'https://example.com/building-photos',
        'https://example.com/architectural-plans'
      ],
      intendedUse: 'Personal'
    },
    {
      id: 'STL-2024-003',
      title: 'Gaming Controller Stand',
      category: 'Gaming',
      requestDate: '2024-12-16',
      updatedDate: '2024-12-18',
      dueDate: '2024-12-23',
      status: 'review',
      statusLabel: 'Review',
      statusClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      priority: 'normal',
      priorityLabel: 'Normal',
      priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      budget: '$100',
      targetPrice: '$24.99',
      description: 'Ergonomic controller stand with cable management for popular gaming consoles. Should support PS5, Xbox Series X, and Nintendo Pro controllers with adjustable angles and integrated cable routing.',
      requesterEmail: 'gamer@streamtech.com',
      referenceLinks: [
        'https://example.com/controller-dimensions'
      ],
      intendedUse: 'Shopify product'
    },
    {
      id: 'STL-2024-004',
      title: 'Medical Device Prototype',
      category: 'Medical',
      requestDate: '2024-12-15',
      updatedDate: '2024-12-17',
      dueDate: '2024-12-20',
      status: 'approved',
      statusLabel: 'Approved',
      statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      priority: 'high',
      priorityLabel: 'High',
      priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      budget: '$800 - $1200',
      targetPrice: '$89.99',
      description: 'Prototype housing for medical monitoring device with precise specifications. Must be biocompatible, waterproof to IP67 standard, and accommodate internal electronics with proper thermal management.',
      requesterEmail: 'dr.smith@medtech.com',
      referenceLinks: [
        'https://example.com/device-specs',
        'https://example.com/regulatory-requirements'
      ],
      intendedUse: 'Other'
    },
    {
      id: 'STL-2024-005',
      title: 'Custom Jewelry Mold',
      category: 'Fashion',
      requestDate: '2024-12-14',
      updatedDate: '2024-12-16',
      dueDate: '2024-12-21',
      status: 'delivered',
      statusLabel: 'Delivered',
      statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      priority: 'low',
      priorityLabel: 'Low',
      priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
      budget: '$200 - $300',
      targetPrice: '$35.00',
      description: 'Intricate jewelry casting mold for custom ring design with detailed engravings. Two-part mold with precise registration pins and sprue system for silver casting.',
      requesterEmail: 'jeweler@craftworks.com',
      referenceLinks: [
        'https://example.com/ring-design',
        'https://example.com/engraving-details'
      ],
      intendedUse: 'Etsy product'
    }
  ];

  // Find the request by ID
  const request = mockRequests.find(req => req.id === id);

  // State for UI interactions
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'submitted', label: 'Submitted', icon: 'ri-file-paper-line' },
      { key: 'in_design', label: 'In Design', icon: 'ri-pencil-ruler-2-line' },
      { key: 'review', label: 'Review', icon: 'ri-search-eye-line' },
      { key: 'approved', label: 'Approved', icon: 'ri-checkbox-circle-line' },
      { key: 'delivered', label: 'Delivered', icon: 'ri-truck-line' }
    ];

    const statusOrder = ['submitted', 'in_design', 'review', 'approved', 'delivered'];
    const currentIndex = statusOrder.indexOf(request?.status || '');

    return steps.map((step, index) => ({
      ...step,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  const canCancel = () => {
    return request?.status === 'submitted' || request?.status === 'in_design';
  };

  // Mock messages for demo
  const mockMessages = [
    {
      id: 1,
      sender: 'Designer',
      message: 'I\'ve started working on your request. The initial concept looks promising!',
      timestamp: '2024-12-19 10:30 AM',
      isFromSeller: false
    },
    {
      id: 2,
      sender: 'You',
      message: 'Great! Please make sure the logo is prominently displayed.',
      timestamp: '2024-12-19 11:15 AM',
      isFromSeller: true
    },
    {
      id: 3,
      sender: 'Designer',
      message: 'Absolutely! I\'ll send you some preview renders later today.',
      timestamp: '2024-12-19 2:45 PM',
      isFromSeller: false
    }
  ];

  // Handle actions
  const handleCancelRequest = () => {
    console.log('Cancel request:', id);
    setShowCancelConfirm(false);
    // In real app: update status and navigate back
  };

  const handleMarkApproved = () => {
    console.log('Mark approved:', id);
    // In real app: update status
  };

  const handleRequestChanges = () => {
    console.log('Request changes:', id);
    // In real app: show changes form
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log('Send message:', newMessage);
    setNewMessage('');
    // In real app: send message via API
  };

  // Not found state
  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <i className="ri-file-search-line text-6xl text-gray-400 dark:text-gray-600"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Request Not Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The STL request you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/seller/stl-requests')}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px]">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/seller/stl-requests')}
            className="mr-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <div>
            <h4 className="text-[20px] font-semibold text-black dark:text-white">
              {request.title}
            </h4>
            <p className="text-gray-500 dark:text-gray-400">
              Request ID: {request.id}
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav>
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a href="/seller/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li>
              <a href="/seller/stl-requests" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                STL Requests
              </a>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li className="text-gray-900 dark:text-white font-medium">
              {request.id}
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px]">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Overview</h5>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-[8px] py-[3px] rounded-full text-xs font-medium ${request.statusClass}`}>
                  {request.statusLabel}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Category
                </label>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                  {request.category}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Priority
                </label>
                <span className={`inline-flex px-[8px] py-[3px] rounded-full text-xs font-medium ${request.priorityClass}`}>
                  {request.priorityLabel}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Budget
                </label>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {request.budget}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Due Date
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(request.dueDate)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getDaysUntilDue(request.dueDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Requested
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(request.requestDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px]">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Status Timeline</h5>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {getStatusSteps().map((step, index) => (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.isCurrent 
                      ? 'bg-primary-500 text-white'
                      : step.isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <i className={`${step.icon} text-sm`}></i>
                  </div>
                  <span className={`text-xs font-medium text-center ${
                    step.isActive 
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </span>

                  {index < getStatusSteps().length - 1 && (
                    <div className={`absolute top-5 w-full h-0.5 ${
                      index < getStatusSteps().findIndex(s => s.isCurrent)
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} style={{
                      left: '50%',
                      width: 'calc(100% - 40px)',
                      zIndex: -1
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description & References */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px]">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Description & References</h5>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Description
                </h6>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {request.description}
                </p>
              </div>

              {request.referenceLinks && request.referenceLinks.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Reference Links
                  </h6>
                  <div className="space-y-2">
                    {request.referenceLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        <i className="ri-external-link-line mr-2"></i>
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {request.intendedUse && (
                <div>
                  <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Intended Use
                  </h6>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.intendedUse}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Deliverables */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px]">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Deliverables</h5>
              </div>
            </div>

            <div className="space-y-4">
              {request.status === 'delivered' || request.status === 'approved' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <i className="ri-file-3d-line text-3xl text-gray-400 dark:text-gray-600 mb-2"></i>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      STL Files
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Final 3D printable files
                    </p>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs">
                      <i className="ri-download-line mr-1"></i>
                      Download
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <i className="ri-image-line text-3xl text-gray-400 dark:text-gray-600 mb-2"></i>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Renders
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Preview images
                    </p>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs">
                      <i className="ri-eye-line mr-1"></i>
                      View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-file-upload-line text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                  <p className="text-gray-500 dark:text-gray-400">
                    Deliverables will appear here once the design is completed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px]">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Actions</h5>
              </div>
            </div>

            <div className="space-y-3">
              {canCancel() && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                >
                  <i className="ri-close-circle-line"></i>
                  Cancel Request
                </button>
              )}

              {request.status === 'review' && (
                <>
                  <button
                    onClick={handleMarkApproved}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <i className="ri-check-line"></i>
                    Mark as Approved
                  </button>
                  <button
                    onClick={handleRequestChanges}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <i className="ri-edit-line"></i>
                    Request Changes
                  </button>
                </>
              )}

              {(request.status === 'delivered' || request.status === 'approved') && (
                <button className="w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
                  <i className="ri-download-line"></i>
                  Download Files
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px]">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Messages</h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Chat with the designer
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Message Thread */}
              <div className="max-h-60 overflow-y-auto space-y-3">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isFromSeller ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isFromSeller
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isFromSeller ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    <i className="ri-send-plane-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cancel Request
              </h3>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to cancel this STL request? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancelRequest}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerStlRequestDetail;
