import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  getFiles,
  addFile,
  replaceFile,
  getNextVersion,
  type DesignerFile
} from '../../features/designerFiles/mockDesignerFiles';
import { getRequests, addDeliverable } from '../../features/designerRequests/mockDesignerRequests';

// Upload form interface
interface UploadFormData {
  linkedRequestId: string;
  deliverableType: 'STL' | 'Render' | 'Notes' | 'Source';
  required: boolean;
  version: number;
  fileName: string;
  notesContent?: string;
  description?: string;
}

// Interface for missing deliverables
interface MissingDeliverable {
  requestId: string;
  title: string;
  missingTypes: string[];
}

const DesignerFiles: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [requestFilter, setRequestFilter] = useState<string>('all');
  const [requiredFilter, setRequiredFilter] = useState<string>('all'); // all / required / optional
  const [showMissingDeliverables, setShowMissingDeliverables] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('updated_date');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [editingFile, setEditingFile] = useState<DesignerFile | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    linkedRequestId: '',
    deliverableType: 'STL',
    required: false,
    version: 1,
    fileName: '',
    notesContent: '',
    description: ''
  });

  // Get all files and requests
  const allFiles = getFiles();
  const allRequests = getRequests();

  // Calculate missing deliverables
  const missingDeliverables = useMemo(() => {
    if (!showMissingDeliverables) return [];

    const requestsWithMissing = allRequests.map(request => {
      const requestFiles = allFiles.filter(file =>
        file.requestId === request.requestId && !file.isSuperseded
      );

      const existingTypes = new Set(requestFiles.map(file => file.type));
      const requiredTypes = ['STL', 'Render'] as const; // Define what's typically required
      const missingTypes = requiredTypes.filter(type => !existingTypes.has(type));

      if (missingTypes.length > 0) {
        return {
          requestId: request.requestId,
          title: request.title,
          missingTypes: missingTypes
        };
      }
      return null;
    }).filter(Boolean) as MissingDeliverable[];

    return requestsWithMissing;
  }, [allRequests, allFiles, showMissingDeliverables]);

  // Helper function to show toast
  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    const filtered = allFiles.filter(file => {
      // Hide superseded files by default
      if (file.isSuperseded) return false;

      const statusMatch = statusFilter === 'all' || file.status === statusFilter;
      const typeMatch = typeFilter === 'all' || file.type === typeFilter;
      const requestMatch = requestFilter === 'all' || file.requestId === requestFilter;
      const requiredMatch = requiredFilter === 'all' ||
        (requiredFilter === 'required' && file.required) ||
        (requiredFilter === 'optional' && !file.required);
      const searchMatch = searchTerm === '' ||
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && typeMatch && requestMatch && requiredMatch && searchMatch;
    });

    // Sort files
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'upload_date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'request':
          return a.requestId.localeCompare(b.requestId);
        case 'updated_date':
          return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
        case 'version':
          return b.version - a.version;
        default:
          return 0;
      }
    });
  }, [allFiles, statusFilter, typeFilter, requestFilter, requiredFilter, searchTerm, sortBy]);

  // Check if filters are active
  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' ||
    requestFilter !== 'all' || requiredFilter !== 'all' || searchTerm !== '' || showMissingDeliverables;

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setRequestFilter('all');
    setRequiredFilter('all');
    setSearchTerm('');
    setShowMissingDeliverables(false);
  };

  // Handle upload modal open
  const handleUploadClick = () => {
    setEditingFile(null);
    setUploadForm({
      linkedRequestId: '',
      deliverableType: 'STL',
      required: false,
      version: 1,
      fileName: '',
      notesContent: '',
      description: ''
    });
    setShowUploadModal(true);
  };

  // Handle replace file
  const handleReplaceFile = (file: DesignerFile) => {
    setEditingFile(file);
    setUploadForm({
      linkedRequestId: file.requestId,
      deliverableType: file.type,
      required: file.required || false,
      version: file.version + 1,
      fileName: file.name,
      notesContent: file.content || '',
      description: file.description || ''
    });
    setShowUploadModal(true);
  };

  // Handle request selection change
  const handleRequestChange = (requestId: string) => {
    setUploadForm(prev => {
      const newVersion = requestId ? getNextVersion(requestId, prev.deliverableType) : 1;
      return {
        ...prev,
        linkedRequestId: requestId,
        version: newVersion
      };
    });
  };

  // Handle deliverable type change
  const handleTypeChange = (type: UploadFormData['deliverableType']) => {
    setUploadForm(prev => {
      const newVersion = prev.linkedRequestId ? getNextVersion(prev.linkedRequestId, type) : 1;
      return {
        ...prev,
        deliverableType: type,
        version: newVersion
      };
    });
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.linkedRequestId) {
      showToastMessage('Please select a linked request', 'error');
      return;
    }

    if (uploadForm.deliverableType === 'Notes' && !uploadForm.notesContent?.trim()) {
      showToastMessage('Please enter notes content', 'error');
      return;
    }

    if (uploadForm.deliverableType !== 'Notes' && !uploadForm.fileName?.trim()) {
      showToastMessage('Please enter a file name', 'error');
      return;
    }

    try {
      const selectedRequest = allRequests.find(r => r.requestId === uploadForm.linkedRequestId);
      if (!selectedRequest) {
        showToastMessage('Selected request not found', 'error');
        return;
      }

      const fileData = {
        name: uploadForm.deliverableType === 'Notes' ? uploadForm.fileName || 'Notes' : uploadForm.fileName,
        type: uploadForm.deliverableType,
        size: uploadForm.deliverableType === 'Notes' ? `${(uploadForm.notesContent?.length || 0)} chars` : '0 MB',
        requestId: uploadForm.linkedRequestId,
        requestTitle: selectedRequest.title,
        status: 'Draft' as const,
        tags: [uploadForm.deliverableType.toLowerCase()],
        version: uploadForm.version,
        downloadUrl: `/files/${uploadForm.fileName}`,
        clientName: selectedRequest.clientName,
        priority: selectedRequest.priority,
        required: uploadForm.required,
        description: uploadForm.description,
        content: uploadForm.deliverableType === 'Notes' ? uploadForm.notesContent : undefined
      };

      if (editingFile) {
        // Replace existing file
        const newFile = replaceFile(editingFile.id, fileData);
        if (newFile) {
          // Update request deliverables summary
          const deliverableType = newFile.type.toLowerCase() as 'stl' | 'render' | 'notes' | 'source';
          addDeliverable(uploadForm.linkedRequestId, deliverableType, {
            name: newFile.name,
            uploadDate: newFile.uploadDate,
            size: newFile.size
          });

          showToastMessage(`File replaced successfully (v${newFile.version})`, 'success');
        } else {
          showToastMessage('Failed to replace file', 'error');
        }
      } else {
        // Add new file
        const newFile = addFile(fileData);

        // Update request deliverables summary
        const deliverableType = newFile.type.toLowerCase() as 'stl' | 'render' | 'notes' | 'source';
        addDeliverable(uploadForm.linkedRequestId, deliverableType, {
          name: newFile.name,
          uploadDate: newFile.uploadDate,
          size: newFile.size
        });

        showToastMessage('File uploaded successfully', 'success');
      }

      setShowUploadModal(false);
    } catch {
      showToastMessage('An error occurred while uploading the file', 'error');
    }
  };

  // Get status badge class
  const getStatusBadge = (status: string) => {
    const badges = {
      'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Revision Needed': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return badges[status as keyof typeof badges] || badges.Draft;
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    const icons = {
      'STL': '🗃️',
      'Render': '🖼️',
      'Notes': '📝',
      'Source': '📁'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Designer Files</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your project deliverables and uploads</p>
        </div>
        <button
          onClick={handleUploadClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload File
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <select
              value={requestFilter}
              onChange={(e) => setRequestFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Requests</option>
              {allRequests.map((request) => (
                <option key={request.requestId} value={request.requestId}>
                  {request.requestId} - {request.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={requiredFilter}
              onChange={(e) => setRequiredFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All / Required / Optional</option>
              <option value="required">Required</option>
              <option value="optional">Optional</option>
            </select>
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="STL">STL Files</option>
              <option value="Render">Renders</option>
              <option value="Notes">Notes</option>
              <option value="Source">Source Files</option>
            </select>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="updated_date">Updated (latest)</option>
              <option value="request">Request ID</option>
              <option value="type">Type</option>
              <option value="version">Version (latest)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="missing-deliverables"
            checked={showMissingDeliverables}
            onChange={(e) => setShowMissingDeliverables(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="missing-deliverables" className="text-sm text-gray-700 dark:text-gray-300">
            Show requests missing deliverables
          </label>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Missing Deliverables Section */}
      {showMissingDeliverables && missingDeliverables.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-orange-800 dark:text-orange-200 mb-3">
            Requests Missing Deliverables
          </h3>
          <div className="space-y-3">
            {missingDeliverables.map((request: MissingDeliverable) => (
              <div key={request.requestId} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{request.requestId}</span>
                    <span className="text-gray-600 dark:text-gray-400">-</span>
                    <span className="text-gray-700 dark:text-gray-300 truncate">{request.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Missing:</span>
                    <div className="flex gap-2">
                      {request.missingTypes.map((type: string) => (
                        <span key={type} className="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/designer/requests/${request.requestId}`}
                  className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Open Request
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(file.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{file.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">v{file.version} • {file.size}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleReplaceFile(file)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  title="Replace file"
                >
                  Replace
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Request:</span>
                <Link
                  to={`/designer/requests/${file.requestId}`}
                  className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-40"
                  title={file.requestTitle}
                >
                  {file.requestId}
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Client:</span>
                <span className="text-sm text-gray-900 dark:text-white">{file.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(file.status)}`}>
                  {file.status}
                </span>
              </div>
              {file.required && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Required:</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Required
                  </span>
                </div>
              )}
            </div>

            {file.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {file.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Uploaded {formatDate(file.uploadDate)}</span>
              <span>{file.priority} priority</span>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>

          {/* No files overall */}
          {allFiles.filter(f => !f.isSuperseded).length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload your first deliverable
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                Get started by uploading project files. Files are attached to requests and become available to Makers after approval.
              </p>
              <button
                onClick={handleUploadClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload First File
              </button>
            </>
          ) : (
            /* No results after filtering */
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No files found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No files match your current search and filter criteria.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={clearAllFilters}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
                <span className="text-gray-400 text-sm">or</span>
                <button
                  onClick={handleUploadClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Upload New File
                </button>
              </div>
            </>
          )}

          {/* Subtle informational note */}
          <div className="mt-8 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              💡 Files are attached to requests and become available to Makers after approval
            </p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingFile ? 'Replace Deliverable' : 'Upload Deliverable'}
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Linked Request */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Linked Request *
                  </label>
                  <select
                    value={uploadForm.linkedRequestId}
                    onChange={(e) => handleRequestChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a request...</option>
                    {allRequests.map((request) => (
                      <option key={request.requestId} value={request.requestId}>
                        {request.requestId} - {request.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deliverable Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deliverable Type *
                  </label>
                  <select
                    value={uploadForm.deliverableType}
                    onChange={(e) => handleTypeChange(e.target.value as UploadFormData['deliverableType'])}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="STL">STL File</option>
                    <option value="Render">Render</option>
                    <option value="Notes">Notes</option>
                    <option value="Source">Source File</option>
                  </select>
                </div>

                {/* Required Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={uploadForm.required}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, required: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="required" className="ml-2 text-sm text-gray-300">
                    Required deliverable
                  </label>
                </div>

                {/* Version */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Version
                  </label>
                  <input
                    type="number"
                    value={uploadForm.version}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, version: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* File Input or Notes */}
                {uploadForm.deliverableType === 'Notes' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes Content *
                    </label>
                    <textarea
                      value={uploadForm.notesContent}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, notesContent: e.target.value }))}
                      rows={6}
                      placeholder="Enter your notes here..."
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      File Name *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.fileName}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, fileName: e.target.value }))}
                      placeholder="Enter file name..."
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Note: Actual file upload is simulated for this demo
                    </p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description / Change Log
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Optional description or change notes..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingFile ? 'Replace File' : 'Upload File'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg text-white ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerFiles;
