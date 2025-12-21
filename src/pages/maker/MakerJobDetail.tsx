import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getJobById,
  updateJobStatus,
  getProductionChecklist,
  updateChecklist,
  addQcPhotos,
  updateShipping,
  addActivity
} from "../../features/makerJobs/mockJobs";
import type { QcPhotoMeta, ChecklistPatch } from "../../features/makerJobs/mockJobs";

const MakerJobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // State for UI interactions
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<string | null>(null);
  const [qcPhotos, setQcPhotos] = useState<File[]>([]);

  // Find job by ID using the feature module
  const job = getJobById(id || '');

  // Helper to refresh component state
  const refreshComponent = () => {
    window.location.reload();
  };

  // Helper functions
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Packing':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'QC':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Printing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Queued':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Rush':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Standard':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Check if job is overdue or at risk
  const getDueDateStatus = () => {
    if (!job) return null;

    const today = new Date('2025-12-20'); // Current date from context
    const dueDate = new Date(job.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && !['Delivered', 'Shipped'].includes(job.status)) {
      return { status: 'Overdue', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    } else if (diffDays <= 1 && !['Delivered', 'Shipped'].includes(job.status)) {
      return { status: 'At Risk', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' };
    }
    return null;
  };

  const getStatusSteps = () => {
    const steps = ['Queued', 'Printing', 'QC', 'Packing', 'Shipped'];
    const currentIndex = steps.indexOf(job?.status || '');

    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  // Updated production checklist functions
  const getProductionChecklistSteps = () => {
    if (!job) return [];

    const checklist = getProductionChecklist(job);
    const hasQcPhotos = (job.qcPhotos && job.qcPhotos.length > 0) || qcPhotos.length >= 2;

    return [
      {
        key: 'printStarted' as const,
        name: 'Print Started',
        completed: checklist.printStarted,
        canToggle: true,
        requiresPhotos: false,
        hasPhotos: false
      },
      {
        key: 'printCompleted' as const,
        name: 'Print Completed',
        completed: checklist.printCompleted,
        canToggle: checklist.printStarted,
        requiresPhotos: false,
        hasPhotos: false
      },
      {
        key: 'qcCompleted' as const,
        name: 'QC Completed',
        completed: checklist.qcCompleted,
        canToggle: checklist.printCompleted && (!job.requiresQcPhotos || hasQcPhotos),
        requiresPhotos: job.requiresQcPhotos || false,
        hasPhotos: hasQcPhotos
      },
      {
        key: 'packaged' as const,
        name: 'Packaged',
        completed: checklist.packaged,
        canToggle: checklist.qcCompleted,
        requiresPhotos: false,
        hasPhotos: false
      },
      {
        key: 'labelCreated' as const,
        name: 'Label Created',
        completed: checklist.labelCreated,
        canToggle: checklist.packaged,
        requiresPhotos: false,
        hasPhotos: false
      },
      {
        key: 'trackingAdded' as const,
        name: 'Tracking Added',
        completed: checklist.trackingAdded,
        canToggle: checklist.labelCreated,
        requiresPhotos: false,
        hasPhotos: false
      }
    ];
  };

  // QC Photos handlers - updated to use helper functions
  const handleQcPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && job) {
      const newFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
      );

      if (newFiles.length > 0) {
        // Convert File objects to metadata for storage
        const photosMeta: QcPhotoMeta[] = newFiles.map(file => ({
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size,
          type: file.type
        }));

        // Use helper function to add QC photos
        addQcPhotos(job.id, photosMeta);

        // Add activity entry
        addActivity(job.id, {
          status: job.status,
          note: `Added ${newFiles.length} QC photo(s)`
        });

        setQcPhotos(prev => [...prev, ...newFiles]);
        refreshComponent();
      }
    }
  };

  const handleRemoveQcPhoto = (index: number) => {
    setQcPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleChecklistToggle = (stepKey: string, completed: boolean) => {
    if (job) {
      // Use helper function to update checklist
      const patch: ChecklistPatch = { [stepKey]: completed } as ChecklistPatch;
      updateChecklist(job.id, patch);

      // Add activity entry
      const stepName = stepKey.replace(/([A-Z])/g, ' $1').toLowerCase();
      addActivity(job.id, {
        status: job.status,
        note: `${completed ? 'Completed' : 'Unchecked'}: ${stepName}`
      });

      refreshComponent();
    }
  };

  const isAllChecklistCompleted = () => {
    const steps = getProductionChecklistSteps();
    return steps.every(step => step.completed);
  };

  const handleMarkShipped = () => {
    if (job && trackingNumber.trim() && carrier.trim()) {
      // Use helper function to update shipping
      updateShipping(job.id, { carrier, tracking: trackingNumber });

      // Update job status to Shipped
      updateJobStatus(job.id, 'Shipped');

      // Add activity entry
      addActivity(job.id, {
        status: 'Shipped',
        note: `Shipped via ${carrier} with tracking: ${trackingNumber}`
      });

      refreshComponent();
    }
  };

  const handleMarkBlocked = () => {
    if (job && blockReason.trim()) {
      // Update job status using helper
      updateJobStatus(job.id, 'Blocked');

      // Add activity entry with details
      addActivity(job.id, {
        status: 'Blocked',
        note: `Blocked: ${blockReason}`
      });

      setShowBlockModal(false);
      setBlockReason('');
      refreshComponent();
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (job) {
      // Use helper function to update status
      updateJobStatus(job.id, newStatus);

      // Add activity entry
      addActivity(job.id, {
        status: newStatus,
        note: `Status updated to ${newStatus}`
      });

      setShowStatusDropdown(false);
      refreshComponent();
    }
  };

  const statusOptions = ['Queued', 'Printing', 'QC', 'Packing'];

  // Show not found state
  if (!job) {
    return (
      <>
        {/* Breadcrumb */}
        <div className="mb-[25px]">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/maker/dashboard"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="material-symbols-outlined text-[18px] mr-[5px]">home</i>
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</i>
                  <Link
                    to="/maker/jobs"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    Jobs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</i>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    {id}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Not Found State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[50px] text-center">
          <div className="w-[100px] h-[100px] rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-[25px]">
            <i className="material-symbols-outlined text-[40px] text-gray-400 dark:text-gray-500">search_off</i>
          </div>
          <h2 className="text-[24px] font-semibold text-dark dark:text-title-dark mb-[10px]">
            Job Not Found
          </h2>
          <p className="text-body dark:text-subtitle-dark mb-[25px]">
            The job with ID "{id}" could not be found.
          </p>
          <Link
            to="/maker/jobs"
            className="inline-flex items-center px-[20px] py-[10px] text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            <i className="material-symbols-outlined text-[18px] mr-[8px]">arrow_back</i>
            Back to Jobs
          </Link>
        </div>
      </>
    );
  }

  const dueDateStatus = getDueDateStatus();

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px]">
        <div className="flex flex-wrap items-start justify-between gap-[15px] mb-[15px]">
          <div className="flex-1">
            {/* Title and badges */}
            <div className="flex items-center gap-[15px] mb-[15px]">
              <h1 className="text-[28px] lg:text-[32px] font-semibold text-dark dark:text-title-dark">
                Job #{job.id}
              </h1>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(job.status)}`}>
                {job.status}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityBadgeClass(job.priority)}`}>
                {job.priority}
              </span>
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap items-center gap-[10px] mb-[10px]">
              {/* Due date chip */}
              <div className="flex items-center gap-[6px] px-[12px] py-[6px] bg-gray-50 dark:bg-gray-700 rounded-lg">
                <i className="material-symbols-outlined text-[16px] text-gray-500">schedule</i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due {new Date(job.dueDate).toLocaleDateString()}
                </span>
                {dueDateStatus && (
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${dueDateStatus.class}`}>
                    {dueDateStatus.status}
                  </span>
                )}
              </div>

              {/* Payout chip */}
              <div className="flex items-center gap-[6px] px-[12px] py-[6px] bg-green-50 dark:bg-green-900/20 rounded-lg">
                <i className="material-symbols-outlined text-[16px] text-green-600 dark:text-green-400">payments</i>
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  ${job.payout.toFixed(2)}
                </span>
              </div>

              {/* Order chip */}
              {job.orderId && (
                <div className="flex items-center gap-[6px] px-[12px] py-[6px] bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <i className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">shopping_bag</i>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Order #{job.orderId}
                  </span>
                  <Link
                    to={`/seller/orders/${job.orderId}`}
                    className="ml-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    View Order
                  </Link>
                </div>
              )}
            </div>

            <p className="text-body dark:text-subtitle-dark">
              {job.product}
            </p>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-[10px]">
            {/* Mark Blocked button */}
            {job.status !== 'Blocked' && !['Delivered', 'Shipped'].includes(job.status) && (
              <button
                onClick={() => setShowBlockModal(true)}
                className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <i className="material-symbols-outlined text-[18px] mr-[5px]">block</i>
                Mark Blocked
              </button>
            )}

            {/* Update Status dropdown */}
            {!['Delivered', 'Shipped', 'Blocked'].includes(job.status) && (
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <i className="material-symbols-outlined text-[18px] mr-[5px]">update</i>
                  Update Status
                  <i className="material-symbols-outlined text-[16px] ml-[5px]">expand_more</i>
                </button>

                {showStatusDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                          job.status === status 
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mark Shipped button */}
            <button
              onClick={handleMarkShipped}
              disabled={!isAllChecklistCompleted() || job.status !== 'Packing'}
              className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
              title={!isAllChecklistCompleted() ? 'Complete all checklist items first' : ''}
            >
              <i className="material-symbols-outlined text-[18px] mr-[5px]">local_shipping</i>
              Mark Shipped
            </button>

            <Link
              to="/maker/jobs"
              className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <i className="material-symbols-outlined text-[18px] mr-[5px]">arrow_back</i>
              Back to Jobs
            </Link>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/maker/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
              >
                <i className="material-symbols-outlined text-[18px] mr-[5px]">home</i>
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <i className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</i>
                <Link
                  to="/maker/jobs"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Jobs
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <i className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</i>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {job.id}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-[25px]">
          {/* Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
            <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark mb-[20px]">
              Overview
            </h2>

            {/* Product Header with Thumbnail */}
            <div className="flex items-start gap-[20px] mb-[25px] pb-[20px] border-b border-gray-200 dark:border-gray-700">
              <div className="w-[80px] h-[80px] rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                  <i className="material-symbols-outlined text-[32px] text-purple-600 dark:text-purple-400">view_in_ar</i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-semibold text-dark dark:text-title-dark mb-[8px]">
                  {job.product}
                </h3>
                <div className="flex items-center gap-[20px] text-sm text-body dark:text-subtitle-dark">
                  <span><strong>Quantity:</strong> {job.qty} pieces</span>
                  <span><strong>Job ID:</strong> {job.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
              {/* Left Column - Material & Print Settings */}
              <div className="space-y-[20px]">
                <div>
                  <h4 className="text-[16px] font-semibold text-dark dark:text-title-dark mb-[12px]">
                    Material & Color
                  </h4>
                  <div className="space-y-[8px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body dark:text-subtitle-dark">Material</span>
                      <span className="text-sm font-medium text-dark dark:text-title-dark">{job.material}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body dark:text-subtitle-dark">Color</span>
                      <span className="text-sm font-medium text-dark dark:text-title-dark">{job.color}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[16px] font-semibold text-dark dark:text-title-dark mb-[12px]">
                    Print Settings
                  </h4>
                  <div className="space-y-[8px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body dark:text-subtitle-dark">Layer Height</span>
                      <span className="text-sm font-medium text-dark dark:text-title-dark">0.2mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body dark:text-subtitle-dark">Infill</span>
                      <span className="text-sm font-medium text-dark dark:text-title-dark">{job.priority === 'Rush' ? '20%' : '15%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body dark:text-subtitle-dark">Supports</span>
                      <span className="text-sm font-medium text-dark dark:text-title-dark">{job.material === 'Resin' ? 'Auto-generated' : 'Tree supports'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Timeline & Payout */}
              <div className="space-y-[20px]">
                <div>
                  <h4 className="text-[16px] font-semibold text-dark dark:text-title-dark mb-[12px]">
                    Timeline & SLA
                  </h4>
                  <div className="space-y-[8px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body dark:text-subtitle-dark">Due Date</span>
                      <span className="text-sm font-medium text-dark dark:text-title-dark">
                        {new Date(job.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body dark:text-subtitle-dark">Status</span>
                      <div className="flex items-center gap-[8px]">
                        {(() => {
                          const today = new Date('2025-12-20');
                          const dueDate = new Date(job.dueDate);
                          const diffTime = dueDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                          if (diffDays < 0 && !['Delivered', 'Shipped'].includes(job.status)) {
                            return (
                              <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                Overdue by {Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? 's' : ''}
                              </span>
                            );
                          } else if (diffDays === 0 && !['Delivered', 'Shipped'].includes(job.status)) {
                            return (
                              <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                                Due today
                              </span>
                            );
                          } else if (diffDays === 1 && !['Delivered', 'Shipped'].includes(job.status)) {
                            return (
                              <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                                Due tomorrow
                              </span>
                            );
                          } else if (diffDays > 0 && !['Delivered', 'Shipped'].includes(job.status)) {
                            return (
                              <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                Due in {diffDays} day{diffDays !== 1 ? 's' : ''}
                              </span>
                            );
                          } else {
                            return (
                              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                Completed
                              </span>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[16px] font-semibold text-dark dark:text-title-dark mb-[12px]">
                    Payout Breakdown
                  </h4>
                  <div className="space-y-[8px]">
                    {(() => {
                      const basePayout = job.priority === 'Rush' ? job.payout * 0.8 : job.payout;
                      const rushBonus = job.priority === 'Rush' ? job.payout * 0.2 : 0;
                      const hasAdjustments = job.qty > 5; // Mock condition for bulk discount
                      const adjustment = hasAdjustments ? job.payout * 0.05 : 0;

                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-body dark:text-subtitle-dark">Base payout</span>
                            <span className="text-sm font-medium text-dark dark:text-title-dark">
                              ${basePayout.toFixed(2)}
                            </span>
                          </div>
                          {rushBonus > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-600 dark:text-green-400">Rush bonus</span>
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                +${rushBonus.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {adjustment > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-blue-600 dark:text-blue-400">Bulk bonus</span>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                +${adjustment.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="pt-[8px] border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-dark dark:text-title-dark">Net payout</span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                ${job.payout.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {job.orderId && (
              <div className="mt-[25px] pt-[20px] border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">shopping_bag</i>
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Linked Order</p>
                      <p className="text-blue-700 dark:text-blue-400">Order #{job.orderId}</p>
                    </div>
                  </div>
                  <Link
                    to={`/seller/orders/${job.orderId}`}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700"
                  >
                    View Order
                    <i className="material-symbols-outlined text-[14px] ml-1">arrow_outward</i>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Files & Instructions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
            <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark mb-[20px]">
              Files & Instructions
            </h2>

            {/* Files List */}
            <div className="mb-[25px]">
              <h3 className="text-[16px] font-semibold text-dark dark:text-title-dark mb-[15px]">
                Project Files
              </h3>
              <div className="space-y-[12px]">
                {/* STL File */}
                <div className="flex items-center justify-between p-[15px] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <i className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[20px]">view_in_ar</i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <p className="font-medium text-dark dark:text-title-dark">{job.product.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.stl</p>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded dark:bg-purple-900/20 dark:text-purple-300">
                          STL
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">3D Model File • 2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() => setShowPreviewModal('stl')}
                      className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">visibility</i>
                      Preview
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">download</i>
                      Download
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">link</i>
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Images */}
                <div className="flex items-center justify-between p-[15px] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-[20px]">image</i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <p className="font-medium text-dark dark:text-title-dark">reference_images.zip</p>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded dark:bg-green-900/20 dark:text-green-300">
                          IMAGE
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reference Images • 3 files • 8.2 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() => setShowPreviewModal('images')}
                      className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">visibility</i>
                      Preview
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">download</i>
                      Download
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">link</i>
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* PDF Instructions */}
                <div className="flex items-center justify-between p-[15px] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      <i className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-[20px]">description</i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <p className="font-medium text-dark dark:text-title-dark">printing_instructions.pdf</p>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded dark:bg-orange-900/20 dark:text-orange-300">
                          PDF
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Detailed Print Instructions • 1.2 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() => setShowPreviewModal('pdf')}
                      className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">visibility</i>
                      Preview
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">download</i>
                      Download
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">link</i>
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex items-center justify-between p-[15px] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">note_alt</i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <p className="font-medium text-dark dark:text-title-dark">special_notes.txt</p>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded dark:bg-blue-900/20 dark:text-blue-300">
                          NOTES
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer Notes & Requirements • 0.8 KB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() => setShowPreviewModal('notes')}
                      className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">visibility</i>
                      Preview
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">download</i>
                      Download
                    </button>
                    <button className="inline-flex items-center px-[10px] py-[6px] text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                      <i className="material-symbols-outlined text-[16px] mr-[4px]">link</i>
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Block */}
            <div>
              <h3 className="text-[16px] font-semibold text-dark dark:text-title-dark mb-[15px]">
                Print Instructions
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-[16px] border-l-4 border-blue-500">
                <ul className="space-y-[8px] text-sm text-dark dark:text-title-dark">
                  <li className="flex items-start gap-[8px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-blue-500 mt-[6px] flex-shrink-0"></div>
                    <span>Print in {job.material}, {job.color.toLowerCase()}, 0.2mm layer height</span>
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-blue-500 mt-[6px] flex-shrink-0"></div>
                    <span>{job.material === 'Resin' ? 'Auto-generated supports required' : 'Tree supports required under overhanging areas'}</span>
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-blue-500 mt-[6px] flex-shrink-0"></div>
                    <span>{job.material === 'Resin' ? 'Clean with IPA and cure under UV before QC photos' : 'Clean with deburring tool and remove supports before QC photos'}</span>
                  </li>
                  {job.priority === 'Rush' && (
                    <li className="flex items-start gap-[8px]">
                      <div className="w-[6px] h-[6px] rounded-full bg-red-500 mt-[6px] flex-shrink-0"></div>
                      <span className="text-red-600 dark:text-red-400 font-medium">RUSH ORDER: Priority processing required</span>
                    </li>
                  )}
                  {job.color.toLowerCase().includes('food') && (
                    <li className="flex items-start gap-[8px]">
                      <div className="w-[6px] h-[6px] rounded-full bg-green-500 mt-[6px] flex-shrink-0"></div>
                      <span className="text-green-600 dark:text-green-400 font-medium">Food-safe material - use dedicated equipment</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-[25px]">
          {/* Status Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
            <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark mb-[20px]">
              Status Timeline
            </h2>

            <div className="space-y-[15px]">
              {getStatusSteps().map((step, index) => (
                <div key={index} className="flex items-center gap-[12px]">
                  <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${
                    step.current
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 ring-2 ring-primary-200 dark:ring-primary-800'
                      : step.completed
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.completed ? (
                      <i className="material-symbols-outlined text-[16px]">check</i>
                    ) : (
                      <div className="w-[8px] h-[8px] rounded-full bg-current"></div>
                    )}
                  </div>
                  <span className={`font-medium ${
                    step.current
                      ? 'text-primary-900 dark:text-primary-300'
                      : step.completed
                      ? 'text-green-900 dark:text-green-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Production Checklist */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
            <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark mb-[20px]">
              Production Checklist
            </h2>

            <div className="space-y-[15px]">
              {getProductionChecklistSteps().map((step) => (
                <div key={step.key} className="space-y-[8px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`checklist-${step.key}`}
                        checked={step.completed}
                        disabled={!step.canToggle}
                        onChange={(e) => handleChecklistToggle(step.key, e.target.checked)}
                        className={`w-[20px] h-[20px] rounded border-2 transition-colors ${
                          step.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : step.canToggle
                            ? 'border-gray-300 hover:border-primary-500 focus:ring-2 focus:ring-primary-200'
                            : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                        } dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-800`}
                      />
                    </div>
                    <label
                      htmlFor={`checklist-${step.key}`}
                      className={`font-medium cursor-pointer flex-1 ${
                        step.completed
                          ? 'text-green-900 dark:text-green-300 line-through'
                          : step.canToggle
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {step.name}
                      {step.requiresPhotos && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded dark:bg-orange-900/20 dark:text-orange-300">
                          Photos Required
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QC Photos Section */}
          {job.requiresQcPhotos && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
              <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark mb-[20px]">
                QC Photos
              </h2>

              {/* Upload Area */}
              <div className="mb-[20px]">
                <label htmlFor="qc-photo-upload" className="block">
                  <div className="relative cursor-pointer">
                    <input
                      id="qc-photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleQcPhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-[20px] text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                      <div className="flex flex-col items-center gap-[8px]">
                        <i className="material-symbols-outlined text-[32px] text-gray-400 dark:text-gray-500">add_a_photo</i>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Click to upload photos
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG up to 10MB each
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Photo Grid */}
              {qcPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-[8px]">
                  {qcPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`QC Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveQcPhoto(index)}
                        className="absolute -top-2 -right-2 w-[20px] h-[20px] bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <i className="material-symbols-outlined text-[12px]">close</i>
                      </button>

                      {/* Photo Info */}
                      <div className="mt-[4px] text-xs text-gray-500 dark:text-gray-400 truncate">
                        {photo.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shipping */}
          {(job.status === 'Packing' || job.status === 'Shipped') && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
              <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark mb-[20px]">
                Shipping
              </h2>

              {job.status === 'Packing' ? (
                <div className="space-y-[15px]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number..."
                      className="w-full px-[12px] py-[8px] border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
                      Carrier
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="Enter carrier name..."
                      className="w-full px-[12px] py-[8px] border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleMarkShipped}
                    disabled={!trackingNumber.trim() || !carrier.trim()}
                    className="w-full inline-flex items-center justify-center px-[16px] py-[8px] text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
                  >
                    <i className="material-symbols-outlined text-[18px] mr-[8px]">local_shipping</i>
                    Mark as Shipped
                  </button>
                </div>
              ) : (
                <div className="p-[15px] bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-[10px] mb-[10px]">
                    <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">local_shipping</i>
                    <p className="font-medium text-blue-900 dark:text-blue-300">Shipped</p>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Tracking: TRK123456789
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Issues / Block */}
          {job.status !== 'Shipped' && job.status !== 'Delivered' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
              <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark mb-[20px]">
                Issues
              </h2>

              {job.status === 'Blocked' ? (
                <div className="p-[15px] bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-[10px] mb-[10px]">
                    <i className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">block</i>
                    <p className="font-medium text-red-900 dark:text-red-300">Job Blocked</p>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Waiting for material delivery
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="w-full inline-flex items-center justify-center px-[16px] py-[8px] text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <i className="material-symbols-outlined text-[18px] mr-[8px]">block</i>
                  Mark as Blocked
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={() => setShowBlockModal(false)}></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <i className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">block</i>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    Block Job
                  </h3>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for blocking
                    </label>
                    <textarea
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      rows={3}
                      placeholder="Explain why this job is blocked..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleMarkBlocked}
                  disabled={!blockReason.trim()}
                  className="inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                >
                  Block Job
                </button>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showStatusDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowStatusDropdown(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={() => setShowPreviewModal(null)}></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  Preview {showPreviewModal === 'stl' ? '3D Model' : showPreviewModal === 'images' ? 'Images' : 'Document'}
                </h3>
                <button
                  onClick={() => setShowPreviewModal(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <i className="material-symbols-outlined text-[24px]">close</i>
                </button>
              </div>

              {/* Preview Content Placeholder */}
              <div className="flex flex-col gap-[15px]">
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Preview Content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MakerJobDetail;
