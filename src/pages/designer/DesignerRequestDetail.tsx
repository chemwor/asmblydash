import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getRequestById,
  updateRequestStatus,
  addDeliverable,
  removeDeliverable,
  addNote,
  canSubmitForReview,
  type DesignerRequest as Request,
  type DeliverableItem
} from '../../features/designerRequests/mockDesignerRequests';

const DesignerRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error'>('success');
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false); // Add back the missing variable
  const [uploadType, setUploadType] = useState<'stl' | 'render' | 'notes' | 'source'>('stl');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Get the specific request by ID and force refresh when needed
  const request = useMemo(() => {
    return id ? getRequestById(id) : undefined;
  }, [id, refreshTrigger]);

  // Force refresh helper
  const forceRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to calculate days until due date
  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Helper function to get due date status
  const getDueDateStatus = (dueDate: string, status: string) => {
    if (status === 'Delivered' || status === 'Blocked') return null;

    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) {
      return { text: 'Overdue', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: 'ri-alarm-warning-line' };
    } else if (daysUntil <= 2) {
      return { text: 'At Risk', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: 'ri-error-warning-line' };
    } else if (daysUntil <= 7) {
      return { text: `${daysUntil}d left`, class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: 'ri-time-line' };
    }
    return null;
  };

  // Helper function to check if required deliverables are present
  const checkRequiredDeliverables = () => {
    if (!request?.deliverables) return { valid: false, missing: ['STL files', 'render previews'] };

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

  // Helper function to show toast with type
  const showToastMessage = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Handle status update with guardrails using feature module
  const handleStatusUpdate = (newStatus: string) => {
    if (!request) return;

    // Apply transition guardrails
    if (newStatus === 'In Review') {
      const deliverableCheck = canSubmitForReview(request);
      if (!deliverableCheck.valid) {
        showToastMessage(
          `Cannot submit for review. Missing required deliverables: ${deliverableCheck.missing.join(', ')}.`,
          'warning'
        );
        return;
      }
    }

    if (newStatus === 'Delivered') {
      if (request.status !== 'Approved' && request.status !== 'In Review') {
        showToastMessage(
          'Cannot mark as delivered. Project must be Approved or In Review first.',
          'warning'
        );
        return;
      }
    }

    const success = updateRequestStatus(request.id, newStatus as Request['status']);
    if (success) {
      let message;
      switch (newStatus) {
        case 'In Review':
          message = 'Request submitted for review successfully!';
          break;
        case 'Revision Needed':
          message = 'Request marked as needing revision.';
          break;
        case 'Delivered':
          message = 'Request marked as delivered!';
          break;
        default:
          message = `Status updated to ${newStatus}`;
      }
      showToastMessage(message, 'success');
      forceRefresh();
    }
  };

  // Handle quick action buttons with guardrails using feature module
  const handleSubmitForReview = () => {
    if (!request) return;

    const deliverableCheck = canSubmitForReview(request);
    if (!deliverableCheck.valid) {
      showToastMessage(
        `Cannot submit for review. Missing required deliverables: ${deliverableCheck.missing.join(', ')}.`,
        'warning'
      );
      return;
    }
    handleStatusUpdate('In Review');
  };

  const handleMarkRevisionNeeded = () => handleStatusUpdate('Revision Needed');

  const handleMarkDelivered = () => {
    if (!request) return;

    if (request.status !== 'Approved' && request.status !== 'In Review') {
      showToastMessage(
        'Cannot mark as delivered. Project must be Approved or In Review first.',
        'warning'
      );
      return;
    }
    handleStatusUpdate('Delivered');
  };

  // Handle add note using feature module
  const handleAddNote = () => {
    if (!request || !noteText.trim()) return;

    const success = addNote(request.id, {
      content: noteText,
      author: 'Designer',
      internal: true
    });

    if (success) {
      showToastMessage('Note added successfully!', 'success');
      setNoteText('');
      setShowNoteModal(false);
      forceRefresh();
    }
  };

  // Handle deliverables management using feature module
  const handleUpload = (type: 'stl' | 'render' | 'notes' | 'source') => {
    setUploadType(type);
    setShowUploadModal(true);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !request) return;

    const newItems: Omit<DeliverableItem, 'id' | 'type'>[] = Array.from(files).map(file => ({
      name: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    }));

    let successCount = 0;
    newItems.forEach(item => {
      if (addDeliverable(request.id, uploadType, item)) {
        successCount++;
      }
    });

    if (successCount > 0) {
      showToastMessage(`${successCount} file(s) uploaded successfully!`, 'success');
      forceRefresh();
    }

    setShowUploadModal(false);
  };

  const handleRemoveDeliverable = (itemId: string) => {
    if (!request) return;

    const success = removeDeliverable(request.id, itemId);

    if (success) {
      showToastMessage('File removed successfully!', 'success');
      forceRefresh();
    }
  };

  // Check if action buttons should be enabled with guardrails using feature module
  const deliverableCheck = request ? canSubmitForReview(request) : { valid: false, missing: [] };
  const canSubmitForReviewButton = (request?.status === 'New' || request?.status === 'In Progress') && deliverableCheck.valid;
  const canMarkRevision = request?.status === 'In Review';
  const canMarkDeliveredButton = (request?.status === 'Approved' || request?.status === 'In Review');

  const getDeliverableStatus = (items: DeliverableItem[]) => {
    return items.length > 0 ? 'Added' : 'Missing';
  };

  const getDeliverableIcon = (type: 'stl' | 'render' | 'notes' | 'source') => {
    switch (type) {
      case 'stl': return 'ri-file-3d-line';
      case 'render': return 'ri-image-line';
      case 'notes': return 'ri-file-text-line';
      case 'source': return 'ri-file-code-line';
    }
  };

  // Mock data for deliverables checklist
  const deliverables = [
    { id: 1, name: 'STL Files', completed: false, required: true },
    { id: 2, name: '3D Renders (High Quality)', completed: false, required: true },
    { id: 3, name: 'Technical Notes', completed: false, required: false },
    { id: 4, name: 'Print Settings Guide', completed: false, required: false }
  ];

  // Mock data for references and attachments
  const references = [
    'https://example.com/reference1',
    'https://example.com/inspiration',
    'https://dribbble.com/shot/example'
  ];

  const attachments = [
    { name: 'brief.pdf', size: '2.3 MB', type: 'PDF' },
    { name: 'reference-images.zip', size: '15.7 MB', type: 'ZIP' },
    { name: 'logo-sketch.ai', size: '4.1 MB', type: 'AI' }
  ];

  // Mock data for review/feedback thread
  const feedbackMessages = [
    {
      id: 1,
      author: 'Sarah Johnson',
      role: 'Client',
      timestamp: '2025-12-20T14:30:00Z',
      message: 'Looking forward to seeing the initial concepts. Please focus on modern, clean aesthetics.',
      avatar: 'SJ'
    },
    {
      id: 2,
      author: 'Design Team',
      role: 'Designer',
      timestamp: '2025-12-20T15:45:00Z',
      message: 'Understood. We\'ll prepare 3 initial concepts focusing on minimalist design principles.',
      avatar: 'DT'
    }
  ];

  if (!request) {
    return (
      <div className="main-content-area">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <i className="ri-file-search-line text-6xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Request not found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The request you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/designer/requests"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dueDateStatus = getDueDateStatus(request.dueDate, request.status);

  return (
    <div className="main-content-area">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/designer/requests"
          className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
        >
          Requests
        </Link>
        <i className="ri-arrow-right-s-line text-gray-400"></i>
        <span className="text-gray-900 dark:text-white font-medium">
          {request.requestId}
        </span>
      </div>

      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            {/* Title and Request ID */}
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {request.title}
              </h1>
              <span className="text-lg text-gray-500 dark:text-gray-400 font-mono">
                {request.requestId}
              </span>
            </div>

            {/* Status and Priority Badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${request.statusClass}`}>
                <i className="ri-circle-fill text-xs mr-2"></i>
                {request.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${request.priorityClass}`}>
                <i className="ri-flag-fill text-xs mr-2"></i>
                {request.priority} Priority
              </span>
            </div>

            {/* Info Chips */}
            <div className="flex items-center flex-wrap gap-3">
              {/* Due Date Chip */}
              <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <i className="ri-calendar-line text-gray-500 dark:text-gray-400 mr-2"></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  Due: {formatDate(request.dueDate)}
                </span>
                {dueDateStatus && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dueDateStatus.class}`}>
                    <i className={`${dueDateStatus.icon} mr-1`}></i>
                    {dueDateStatus.text}
                  </span>
                )}
              </div>

              {/* Seller Chip */}
              <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <i className="ri-user-line text-gray-500 dark:text-gray-400 mr-2"></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {request.clientName}
                </span>
              </div>

              {/* Category Chip */}
              <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <i className="ri-folder-line text-gray-500 dark:text-gray-400 mr-2"></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {request.type}
                </span>
              </div>

              {/* Budget Chip */}
              <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <i className="ri-money-dollar-circle-line text-gray-500 dark:text-gray-400 mr-2"></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ${request.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Update Status Dropdown */}
            <div className="min-w-[160px]">
              <select
                value={request.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Revision Needed">Revision Needed</option>
                <option value="Approved">Approved</option>
                <option value="Delivered">Delivered</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleSubmitForReview}
              disabled={!canSubmitForReviewButton}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                canSubmitForReviewButton
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="ri-send-plane-line mr-2"></i>
              Submit for Review
            </button>

            <button
              onClick={handleMarkRevisionNeeded}
              disabled={!canMarkRevision}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                canMarkRevision
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="ri-refresh-line mr-2"></i>
              Mark Revision Needed
            </button>

            <button
              onClick={handleMarkDelivered}
              disabled={!canMarkDeliveredButton}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                canMarkDeliveredButton
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="ri-check-double-line mr-2"></i>
              Mark Delivered
            </button>

            <button
              onClick={() => setShowNoteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <i className="ri-sticky-note-add-line mr-2"></i>
              Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Request ID
                </label>
                <p className="text-gray-900 dark:text-white">{request.requestId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Category
                </label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${request.typeClass}`}>
                  {request.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Client/Seller
                </label>
                <p className="text-gray-900 dark:text-white">{request.clientName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{request.clientEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Due Date
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(request.dueDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Budget
                </label>
                <p className="text-gray-900 dark:text-white font-semibold">
                  ${request.budget.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Revisions
                </label>
                <p className="text-gray-900 dark:text-white">
                  {request.revisionCount} / {request.maxRevisions}
                </p>
              </div>
            </div>
          </div>

          {/* Overview & Requirements Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Overview & Requirements
            </h3>

            {/* Request Description */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Project Description
              </h4>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {request.description || 'We need a modern, minimalist logo design that reflects innovation and reliability for our AI technology startup. The logo should work well across digital and print media, maintaining clarity at various sizes.'}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The design should convey trust, cutting-edge technology, and professional expertise. We're looking for something that stands out in the competitive tech landscape while remaining timeless and scalable.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Final deliverables should include vector files, multiple format exports, and a comprehensive style guide for consistent brand application across all touchpoints.
                </p>
              </div>
            </div>

            {/* Requirements List */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Technical Requirements
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <i className="ri-checkbox-circle-line text-primary-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span>Vector-based design (AI/SVG format required)</span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <i className="ri-checkbox-circle-line text-primary-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span>Scalable from business card size to billboard dimensions</span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <i className="ri-checkbox-circle-line text-primary-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span>Works in both color and monochrome versions</span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <i className="ri-checkbox-circle-line text-primary-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span>Readable on light and dark backgrounds</span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <i className="ri-checkbox-circle-line text-primary-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span>Maximum 3 colors in primary version</span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <i className="ri-checkbox-circle-line text-primary-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span>Include horizontal and vertical layout options</span>
                </li>
              </ul>
            </div>

            {/* Constraints Chips */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Design Constraints
              </h4>
              <div className="flex flex-wrap gap-3">
                {/* Material Constraints */}
                <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-3 py-2 rounded-lg">
                  <i className="ri-palette-line text-blue-600 dark:text-blue-400 mr-2"></i>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Digital Only
                  </span>
                </div>

                {/* Printable Constraint */}
                <div className="inline-flex items-center bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-3 py-2 rounded-lg">
                  <i className="ri-printer-line text-green-600 dark:text-green-400 mr-2"></i>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Print Ready Required
                  </span>
                </div>

                {/* Tolerance Critical */}
                <div className="inline-flex items-center bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-3 py-2 rounded-lg">
                  <i className="ri-ruler-line text-orange-600 dark:text-orange-400 mr-2"></i>
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Precision Critical
                  </span>
                </div>

                {/* QC Photos Required */}
                <div className="inline-flex items-center bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 px-3 py-2 rounded-lg">
                  <i className="ri-camera-line text-purple-600 dark:text-purple-400 mr-2"></i>
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    QC Photos Required
                  </span>
                </div>
              </div>
            </div>

            {/* Target Price Point */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Budget & Pricing
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Target Budget Range</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${(request.budget * 0.8).toLocaleString()} - ${request.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Project Budget</p>
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                      ${request.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Links */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Reference Materials
              </h4>
              <div className="space-y-3">
                {references.map((ref, index) => (
                  <a
                    key={index}
                    href={ref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-external-link-line text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {ref.includes('dribbble') ? 'Dribbble Design Reference' :
                         ref.includes('inspiration') ? 'Design Inspiration Gallery' :
                         'Reference Material'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {ref}
                      </p>
                    </div>
                    <i className="ri-arrow-right-up-line text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Tags */}
            {request.tags && request.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Project Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {request.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <i className="ri-hashtag text-xs mr-1"></i>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* References & Attachments Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              References & Attachments
            </h3>

            {/* References */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Reference Links
              </h4>
              <div className="space-y-2">
                {references.map((ref, index) => (
                  <a
                    key={index}
                    href={ref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    {ref}
                  </a>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Attachments
              </h4>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <i className="ri-file-line text-gray-400 mr-3"></i>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {file.type} • {file.size}
                        </p>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                      <i className="ri-download-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review/Feedback Thread Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Review & Feedback
            </h3>
            <div className="space-y-4">
              {feedbackMessages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                        {message.avatar}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.role}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <textarea
                rows={3}
                placeholder="Add a comment or feedback..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors">
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Deliverables Checklist Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Deliverables Checklist
            </h3>
            <div className="space-y-3">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={deliverable.completed}
                    onChange={() => {
                      // UI-only checkbox toggle
                      console.log(`Toggled deliverable: ${deliverable.name}`);
                    }}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label className={`text-sm ${deliverable.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {deliverable.name}
                    {deliverable.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              * Required deliverables
            </p>
          </div>

          {/* Timeline Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Request Created
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(request.createdDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Last Updated
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(request.updatedDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Due Date
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(request.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables Section */}
      {request.deliverables && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Deliverables
          </h3>

          <div className="space-y-6">
            {/* STL Files */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <i className={`${getDeliverableIcon('stl')} text-lg text-gray-600 dark:text-gray-400`}></i>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">STL Files</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    getDeliverableStatus(request.deliverables.stlFiles) === 'Added' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {getDeliverableStatus(request.deliverables.stlFiles)}
                  </span>
                </div>
                <button
                  onClick={() => handleUpload('stl')}
                  className="inline-flex items-center px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors"
                >
                  <i className="ri-upload-line mr-1"></i>
                  Upload
                </button>
              </div>

              {request.deliverables.stlFiles.length > 0 ? (
                <div className="space-y-2">
                  {request.deliverables.stlFiles.map((item: DeliverableItem) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <i className="ri-file-3d-line text-blue-500 mr-3"></i>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.uploadDate)} • {item.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDeliverable(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Remove file"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No STL files uploaded yet
                </div>
              )}
            </div>

            {/* Render Previews */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <i className={`${getDeliverableIcon('render')} text-lg text-gray-600 dark:text-gray-400`}></i>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Render Previews</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    getDeliverableStatus(request.deliverables.renderPreviews) === 'Added' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {getDeliverableStatus(request.deliverables.renderPreviews)}
                  </span>
                </div>
                <button
                  onClick={() => handleUpload('render')}
                  className="inline-flex items-center px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors"
                >
                  <i className="ri-upload-line mr-1"></i>
                  Upload
                </button>
              </div>

              {request.deliverables.renderPreviews.length > 0 ? (
                <div className="space-y-2">
                  {request.deliverables.renderPreviews.map((item: DeliverableItem) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <i className="ri-image-line text-green-500 mr-3"></i>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.uploadDate)} • {item.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDeliverable(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Remove file"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No render previews uploaded yet
                </div>
              )}
            </div>

            {/* Assembly/Print Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <i className={`${getDeliverableIcon('notes')} text-lg text-gray-600 dark:text-gray-400`}></i>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Assembly/Print Notes</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    getDeliverableStatus(request.deliverables.assemblyNotes) === 'Added' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {getDeliverableStatus(request.deliverables.assemblyNotes)}
                  </span>
                </div>
                <button
                  onClick={() => handleUpload('notes')}
                  className="inline-flex items-center px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors"
                >
                  <i className="ri-upload-line mr-1"></i>
                  Upload
                </button>
              </div>

              {request.deliverables.assemblyNotes.length > 0 ? (
                <div className="space-y-2">
                  {request.deliverables.assemblyNotes.map((item: DeliverableItem) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <i className="ri-file-text-line text-orange-500 mr-3"></i>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.uploadDate)} • {item.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDeliverable(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Remove file"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No assembly notes uploaded yet
                </div>
              )}
            </div>

            {/* Source Files (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <i className={`${getDeliverableIcon('source')} text-lg text-gray-600 dark:text-gray-400`}></i>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Source Files</h4>
                  <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    Optional
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    getDeliverableStatus(request.deliverables.sourceFiles) === 'Added' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {getDeliverableStatus(request.deliverables.sourceFiles)}
                  </span>
                </div>
                <button
                  onClick={() => handleUpload('source')}
                  className="inline-flex items-center px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors"
                >
                  <i className="ri-upload-line mr-1"></i>
                  Upload
                </button>
              </div>

              {request.deliverables.sourceFiles.length > 0 ? (
                <div className="space-y-2">
                  {request.deliverables.sourceFiles.map((item: DeliverableItem) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <i className="ri-file-code-line text-purple-500 mr-3"></i>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.uploadDate)} • {item.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDeliverable(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Remove file"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No source files uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowNoteModal(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add Note
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowNoteModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Note
                    </label>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Add your note here..."
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNoteModal(false);
                    setNoteText('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    noteText.trim()
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-md shadow-lg flex items-center ${
            toastType === 'success' 
              ? 'bg-green-600 text-white' 
              : toastType === 'warning' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <i className={`mr-2 ${
              toastType === 'success' 
                ? 'ri-check-line' 
                : toastType === 'warning' 
                ? 'ri-alert-line' 
                : 'ri-close-circle-line'
            }`}></i>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerRequestDetail;
