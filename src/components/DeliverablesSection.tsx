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
  PlusIcon
} from '@heroicons/react/24/outline';
import type { DesignRequest, DeliverableItem } from '../features/designRequests/mockDesignRequests';
import { getRequestWithDeliverables, addDeliverableItem, removeDeliverableItem } from '../features/designerDashboard/mockDesignerDashboard';

interface DeliverablesProps {
  request: DesignRequest;
  onUpdateRequest?: (updatedRequest: DesignRequest) => void;
}

interface DeliverableDisplay {
  type: string;
  label: string;
  required: boolean;
  status: 'added' | 'missing';
  items: DeliverableItem[];
}

const DeliverablesSection: React.FC<DeliverablesProps> = ({ request, onUpdateRequest }) => {
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');

  // Convert array-based deliverables to display format
  const getDeliverablesArray = (deliverables: DesignRequest['deliverables']) => {
    if (!deliverables || !Array.isArray(deliverables)) return [];

    return deliverables.map(deliverable => ({
      type: deliverable.type,
      label: deliverable.label,
      required: deliverable.required,
      status: deliverable.status,
      items: deliverable.items || []
    })) as DeliverableDisplay[];
  };

  const deliverables = getDeliverablesArray(request.deliverables);

  const handleDeleteFile = (deliverableType: string, itemId: string) => {
    const updatedRequest = removeDeliverableItem(request.requestId, deliverableType, itemId);
    if (updatedRequest && onUpdateRequest) {
      // Convert DesignerRequest to DesignRequest structure if needed
      const convertedRequest: DesignRequest = {
        ...updatedRequest,
        deliverables: request.deliverables // Keep original deliverables structure
      };
      onUpdateRequest(convertedRequest);
      // Update deliverable label for feedback
      const deliverableLabel = deliverables.find((d) => d.type === deliverableType)?.label || 'file';
      console.log(`${deliverableLabel} removed successfully`);
    }
  };

  const handlePreview = (deliverableType: string, itemId: string) => {
    const deliverable = deliverables.find((d) => d.type === deliverableType);
    const item = deliverable?.items.find((i) => i.id === itemId);

    if (item) {
      // In a real application, this would open a preview modal or download the file
      console.log(`Previewing ${item.name}`);
      // Add update to activity log
      const updatedRequest = { ...request, updatedDate: new Date().toISOString() };
      onUpdateRequest?.(updatedRequest);
    }
  };

  const getDefaultFileType = (deliverableType: string): string => {
    return deliverableType;
  };

  const quickTemplates = [
    { name: 'Ready for Review', status: 'In Review' },
    { name: 'Need More Info', status: 'Revision Needed' },
    { name: 'Design Complete', status: 'Approved' }
  ];

  const handleUpload = (deliverableType: string) => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    // Simulate file upload and add to deliverables
    Array.from(uploadFiles).forEach(file => {
      const newItem: DeliverableItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        name: file.name,
        uploadedDate: new Date().toISOString(),
        type: deliverableType,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      };

      addDeliverableItem(request.requestId, deliverableType, newItem);
    });

    // Close modal and reset form
    setShowUploadModal(null);
    setUploadFiles(null);
    setUploadNotes('');

    // Refresh the request data
    const updatedRequest = getRequestWithDeliverables(request.requestId);
    if (updatedRequest && onUpdateRequest) {
      // Convert DesignerRequest to DesignRequest structure if needed
      const convertedRequest: DesignRequest = {
        ...updatedRequest,
        deliverables: request.deliverables // Keep original deliverables structure
      };
      onUpdateRequest(convertedRequest);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <CubeIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Deliverables
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuickTemplates(!showQuickTemplates)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Quick Actions
            </button>
          </div>
        </div>

        {/* Deliverables List */}
        <div className="space-y-6">
          {deliverables.length > 0 ? (
            deliverables.map((deliverable) => (
              <div key={deliverable.type} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {deliverable.type === 'stl' && <CubeIcon className="h-5 w-5 text-blue-500" />}
                    {deliverable.type === 'renders' && <PhotoIcon className="h-5 w-5 text-green-500" />}
                    {deliverable.type === 'notes' && <DocumentTextIcon className="h-5 w-5 text-yellow-500" />}
                    {deliverable.type === 'source' && <DocumentIcon className="h-5 w-5 text-purple-500" />}

                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {deliverable.label}
                    </h4>
                    {deliverable.required && (
                      <span className="text-xs text-red-500 font-medium">Required</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deliverable.status === 'added' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {deliverable.status === 'added' ? (
                        <>
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Complete
                        </>
                      ) : (
                        <>
                          <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                          Missing
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => setShowUploadModal(deliverable.type)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <CloudArrowUpIcon className="h-3 w-3 mr-1" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Files List */}
                {deliverable.items && deliverable.items.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {deliverable.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="flex items-center space-x-3">
                          <DocumentIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.uploadedDate} • {item.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreview(deliverable.type, item.id)}
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleDeleteFile(deliverable.type, item.id)}
                            className="text-red-600 hover:text-red-500"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No deliverables configured for this project.
            </div>
          )}
        </div>

        {/* Quick Templates */}
        {showQuickTemplates && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">Quick Status Updates</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quickTemplates.map((template, index) => (
                <button
                  key={index}
                  className="p-3 text-left border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                >
                  <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">{template.name}</h5>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Update to {template.status}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Project Timeline</h4>
          <div className="space-y-4">
            {[
              { step: 'Project Started', status: 'complete', date: request.createdDate },
              { step: 'Design In Progress', status: request.status === 'In Progress' ? 'current' : 'complete', date: request.updatedDate },
              { step: 'Review & Feedback', status: request.status === 'In Review' ? 'current' : request.status === 'Revision Needed' ? 'current' : 'pending', date: '' },
              { step: 'Approved & Delivered', status: request.status === 'Delivered' ? 'complete' : 'pending', date: request.completedDate || '' }
            ].map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex-shrink-0 w-3 h-3 rounded-full border-2 ${
                  step.status === 'complete' 
                    ? 'bg-green-500 border-green-500' 
                    : step.status === 'current'
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
                }`} />
                <div className="ml-4 flex-1">
                  <p className={`text-sm font-medium ${
                    step.status === 'complete' || step.status === 'current'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500'
                  }`}>
                    {step.step}
                  </p>
                  {step.date && (
                    <p className="text-xs text-gray-500">
                      {new Date(step.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Upload {deliverables.find((d) => d.type === showUploadModal)?.label}
                </h3>
                <button
                  onClick={() => setShowUploadModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setUploadFiles(e.target.files)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    rows={3}
                    placeholder={getDefaultFileType(showUploadModal)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUploadModal(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpload(showUploadModal)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Upload Files
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverablesSection;
