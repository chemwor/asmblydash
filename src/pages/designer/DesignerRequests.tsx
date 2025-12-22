import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getRequests } from '../../features/designerRequests/mockDesignerRequests';

// Control whether designers can create new requests
const ALLOW_DESIGNER_CREATE = false;

const DesignerRequests: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sellerFilter, setSellerFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('due_date');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [showNewRequestModal, setShowNewRequestModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // New request form state
  const [newRequest, setNewRequest] = useState({
    title: '',
    category: '',
    seller: '',
    priority: 'Normal',
    dueDate: '',
    description: '',
    references: '',
    attachments: []
  });

  // Get all requests using the new feature module
  const allRequests = getRequests();

  // Get unique values for filter dropdowns
  const uniqueCategories = [...new Set(allRequests.map(r => r.type))].sort();
  const uniqueSellers = [...new Set(allRequests.map(r => r.clientName))].sort();

  // Helper function to calculate days until due date
  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Helper function to check if request is overdue
  const isOverdue = (dueDate: string, status: string): boolean => {
    if (status === 'Approved' || status === 'Delivered') return false;
    return getDaysUntilDue(dueDate) < 0;
  };

  // Helper function to check if request is at risk
  const isAtRisk = (dueDate: string, status: string): boolean => {
    const activeStatuses = ['New', 'In Progress', 'In Review', 'Revision Needed'];
    if (!activeStatuses.includes(status)) return false;
    const daysUntil = getDaysUntilDue(dueDate);
    return daysUntil >= 0 && daysUntil <= 2;
  };

  // Filter and sort requests based on selected filters
  const filteredRequests = useMemo(() => {
    const filtered = allRequests.filter(request => {
      // Status tab filter
      let statusTabMatch = true;
      if (statusTab === 'active') {
        statusTabMatch = request.status === 'New' || request.status === 'In Progress';
      } else if (statusTab === 'in_review') {
        statusTabMatch = request.status === 'In Review' || request.status === 'Revision Needed';
      } else if (statusTab === 'revisions') {
        statusTabMatch = request.status === 'Revision Needed';
      } else if (statusTab === 'completed') {
        statusTabMatch = request.status === 'Approved' || request.status === 'Delivered';
      }

      // Individual filter matches
      const statusMatch = statusFilter === 'all' || request.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || request.priority === priorityFilter;
      const typeMatch = typeFilter === 'all' || request.type === typeFilter;
      const sellerMatch = sellerFilter === 'all' || request.clientName === sellerFilter;

      // Search term match (request ID, title, seller)
      const searchMatch = searchTerm === '' ||
        request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      return statusTabMatch && statusMatch && priorityMatch && typeMatch && sellerMatch && searchMatch;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due_date': {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
          // If dates are equal, sort by priority
          const priorityOrder = { 'Rush': 3, 'High': 2, 'Normal': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        case 'updated': {
          return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
        }

        case 'priority': {
          const priorityOrderDesc = { 'Rush': 3, 'High': 2, 'Normal': 1 };
          if (priorityOrderDesc[a.priority] !== priorityOrderDesc[b.priority]) {
            return priorityOrderDesc[b.priority] - priorityOrderDesc[a.priority];
          }
          // If priority is equal, sort by due date
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        case 'status': {
          const statusOrder = {
            'New': 1,
            'In Progress': 2,
            'In Review': 3,
            'Revision Needed': 4,
            'Approved': 5,
            'Delivered': 6,
            'Blocked': 7
          };
          return statusOrder[a.status] - statusOrder[b.status];
        }

        default:
          return 0;
      }
    });
  }, [allRequests, statusFilter, priorityFilter, typeFilter, sellerFilter, searchTerm, sortBy, statusTab]);

  // Compute KPIs dynamically from all requests (not filtered)
  const dynamicKpiData = useMemo(() => {
    // Open Requests (New + In Progress)
    const openRequests = allRequests.filter(r =>
      r.status === 'New' || r.status === 'In Progress'
    ).length;

    // Due Soon (within 7 days)
    const dueSoon = allRequests.filter(r => {
      if (r.status === 'Delivered' || r.status === 'Blocked') return false;
      const daysUntilDue = getDaysUntilDue(r.dueDate);
      return daysUntilDue <= 7 && daysUntilDue >= 0;
    }).length;

    // In Review (In Review + Revision Needed status)
    const inReview = allRequests.filter(r => r.status === 'In Review' || r.status === 'Revision Needed').length;

    // Revision Needed
    const revisionNeeded = allRequests.filter(r => r.status === 'Revision Needed').length;

    return {
      openRequests,
      dueSoon,
      inReview,
      revisionNeeded
    };
  }, [allRequests]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to format updated date relative
  const formatUpdatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  // Helper function to get due date status
  const getDueDateStatus = (dueDate: string, status: string) => {
    if (status === 'Delivered' || status === 'Blocked') return null;

    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) {
      return { text: 'Overdue', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    } else if (daysUntil <= 2) {
      return { text: 'Due soon', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
    } else if (daysUntil <= 7) {
      return { text: `${daysUntil}d left`, class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    }
    return null;
  };

  // Helper function to handle quick status change (UI-only for now)
  const handleQuickStatusChange = (requestId: string, newStatus: string) => {
    // UI-only implementation - would typically update the backend
    console.log(`Quick status change for request ${requestId} to ${newStatus}`);
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
    setSellerFilter('all');
    setSearchTerm('');
    setSortBy('due_date');
    setStatusTab('all');
  };

  // Helper function to reset new request form
  const resetNewRequestForm = () => {
    setNewRequest({
      title: '',
      category: '',
      seller: '',
      priority: 'Normal',
      dueDate: '',
      description: '',
      references: '',
      attachments: []
    });
  };

  // Helper function to handle new request submission
  const handleSubmitNewRequest = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate new request ID
    const newId = (Math.max(...allRequests.map(r => parseInt(r.id))) + 1).toString();
    const currentYear = new Date().getFullYear();
    const requestCount = allRequests.length + 1;
    const newRequestId = `DR-${currentYear}-${requestCount.toString().padStart(3, '0')}`;

    // Create new request object
    const requestToAdd = {
      id: newId,
      requestId: newRequestId,
      title: newRequest.title,
      description: newRequest.description,
      type: newRequest.category as 'Logo Design' | '3D Model' | 'UI/UX Design' | 'Product Design' | 'Packaging' | 'Illustration' | 'Other',
      status: 'New' as const,
      priority: newRequest.priority as 'Normal' | 'High' | 'Rush',
      clientName: newRequest.seller,
      clientEmail: `${newRequest.seller.toLowerCase().replace(' ', '.')}@email.com`,
      budget: 1000, // Default budget
      dueDate: newRequest.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      revisionCount: 0,
      maxRevisions: 3,
      files: [],
      tags: [newRequest.category.toLowerCase()],
      statusClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      priorityClass: newRequest.priority === 'Rush'
        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        : newRequest.priority === 'High'
        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      typeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };

    // In a real app, this would be an API call
    // For now, we'll just log it and show success
    console.log('New request created:', requestToAdd);

    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Close modal and reset form
    setShowNewRequestModal(false);
    resetNewRequestForm();
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all' ||
    typeFilter !== 'all' || sellerFilter !== 'all' || searchTerm !== '' ||
    sortBy !== 'due_date' || statusTab !== 'all';

  return (
    <div className="main-content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Requests
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            All design requests assigned to you
          </p>
        </div>
        {ALLOW_DESIGNER_CREATE && (
          <div>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <i className="ri-add-line mr-2"></i>
              New Request
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Open */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <i className="ri-file-list-line text-blue-600 dark:text-blue-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dynamicKpiData.openRequests}</p>
            </div>
          </div>
        </div>

        {/* Due Soon (7 days) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <i className="ri-time-line text-orange-600 dark:text-orange-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Soon</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dynamicKpiData.dueSoon}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">7 days</p>
            </div>
          </div>
        </div>

        {/* In Review */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <i className="ri-eye-line text-yellow-600 dark:text-yellow-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dynamicKpiData.inReview}</p>
            </div>
          </div>
        </div>

        {/* Revision Needed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <i className="ri-refresh-line text-purple-600 dark:text-purple-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revision Needed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dynamicKpiData.revisionNeeded}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtering Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        {/* Status Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusTab === 'all'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusTab('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusTab === 'active'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusTab('in_review')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusTab === 'in_review'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              In Review
            </button>
            <button
              onClick={() => setStatusTab('revisions')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusTab === 'revisions'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Revisions
            </button>
            <button
              onClick={() => setStatusTab('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusTab === 'completed'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search requests, titles, or sellers..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[120px]">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="min-w-[120px]">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="Rush">Rush</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div className="min-w-[120px]">
                <select
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Sellers</option>
                  {uniqueSellers.map(seller => (
                    <option key={seller} value={seller}>{seller}</option>
                  ))}
                </select>
              </div>

              <div className="min-w-[140px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="due_date">Due date (soonest)</option>
                  <option value="updated">Updated (latest)</option>
                  <option value="priority">Priority (Rush first)</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div className="min-w-[120px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Revision Needed">Revision Needed</option>
                  <option value="Approved">Approved</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-center">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Design Requests ({filteredRequests.length})
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sortBy === 'due_date' && 'Sorted by due date (ascending), then priority'}
            {sortBy === 'updated' && 'Sorted by updated date (latest first)'}
            {sortBy === 'priority' && 'Sorted by priority (Rush first), then due date'}
            {sortBy === 'status' && 'Sorted by status'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title / Concept
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => {
                const dueDateStatus = getDueDateStatus(request.dueDate, request.status);
                const requestIsOverdue = isOverdue(request.dueDate, request.status);
                const requestIsAtRisk = isAtRisk(request.dueDate, request.status);

                return (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.requestId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {request.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{request.clientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${request.typeClass}`}>
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${request.statusClass}`}>
                          {request.status}
                        </span>
                        {requestIsOverdue && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" title="Overdue">
                            <i className="ri-alarm-warning-line mr-1"></i>
                            Overdue
                          </span>
                        )}
                        {!requestIsOverdue && requestIsAtRisk && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" title="At Risk - Due within 48 hours">
                            <i className="ri-error-warning-line mr-1"></i>
                            At Risk
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(request.dueDate)}
                        </div>
                        {dueDateStatus && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${dueDateStatus.class}`}>
                            {dueDateStatus.text}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${request.priorityClass}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatUpdatedDate(request.updatedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/designer/requests/${request.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Open
                        </Link>
                        <select
                          onChange={(e) => handleQuickStatusChange(request.id, e.target.value)}
                          value={request.status}
                          className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="px-6 py-12 text-center">
            <i className="ri-file-list-line text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No requests found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowNewRequestModal(false)}></div>

            <div className="inline-block align-bottom bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitNewRequest}>
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Create New Request
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewRequestModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newRequest.title}
                        onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter request title..."
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={newRequest.category}
                        onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select category...</option>
                        {uniqueCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Seller */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Seller *
                      </label>
                      <select
                        required
                        value={newRequest.seller}
                        onChange={(e) => setNewRequest({...newRequest, seller: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select seller...</option>
                        {uniqueSellers.map(seller => (
                          <option key={seller} value={seller}>{seller}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority and Due Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Priority
                        </label>
                        <select
                          value={newRequest.priority}
                          onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Rush">Rush</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Due Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={newRequest.dueDate}
                          onChange={(e) => setNewRequest({...newRequest, dueDate: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={newRequest.description}
                        onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe the request requirements..."
                      />
                    </div>

                    {/* References */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        References (Links)
                      </label>
                      <input
                        type="text"
                        value={newRequest.references}
                        onChange={(e) => setNewRequest({...newRequest, references: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Reference URLs (comma separated)..."
                      />
                    </div>

                    {/* Attachments (UI Only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Attachments
                      </label>
                      <div className="border-2 border-dashed border-slate-600 rounded-md p-4 text-center">
                        <i className="ri-upload-2-line text-2xl text-gray-400 mb-2 block"></i>
                        <p className="text-sm text-gray-400">
                          Drag & drop files here or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          (UI only - no actual upload)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewRequestModal(false);
                      resetNewRequestForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                  >
                    Create Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-md shadow-lg flex items-center">
            <i className="ri-check-line mr-2"></i>
            Request created successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerRequests;
