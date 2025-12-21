import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getJobs, updateJobStatus, jobs } from "../../features/makerJobs/mockJobs";
import type { Job, JobFilters } from "../../features/makerJobs/mockJobs";
import StatusTimeline from "../../components/StatusTimeline";
import MarkBlockedModal from "../../components/MarkBlockedModal";
import ShippingCard from "../../components/ShippingCard";

const MakerJobs: React.FC = () => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedJobForBlocking, setSelectedJobForBlocking] = useState<Job | null>(null);

  // Filter and search state
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [materialFilter, setMaterialFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('due-date-soonest');

  // Get unique materials from jobs data
  const uniqueMaterials = [...new Set(jobs.map(job => job.material))].sort();

  // Get filtered jobs using the feature module
  const filteredJobs = getJobs({
    statusGroup: activeTab as JobFilters['statusGroup'],
    searchQuery: searchQuery || undefined,
    material: materialFilter !== 'All' ? materialFilter : undefined,
    priority: priorityFilter !== 'All' ? priorityFilter : undefined,
    sortBy: sortBy as JobFilters['sortBy']
  });

  // Helper functions for job status indicators
  const isOverdue = (job: Job) => {
    const today = new Date();
    const dueDate = new Date(job.dueDate);
    return dueDate < today && !['Delivered', 'Shipped'].includes(job.status);
  };

  const isAtRisk = (job: Job) => {
    const now = new Date();
    const dueDate = new Date(job.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    const activeStatuses = ['Queued', 'Printing', 'QC', 'Packing'];
    return diffHours > 0 && diffHours <= 48 && activeStatuses.includes(job.status);
  };

  // Compute KPI values from jobs data
  const activeJobs = jobs.filter(job => ['Printing', 'Queued', 'QC', 'Packing'].includes(job.status));
  const dueSoonJobs = jobs.filter(job => isAtRisk(job));
  const blockedJobs = jobs.filter(job => job.status === 'Blocked');
  const completedJobs = jobs.filter(job => {
    if (!job.completedAt) return false;
    const completedDate = new Date(job.completedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return completedDate >= thirtyDaysAgo;
  });

  const formatDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days`;
  };

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

  const handleStatusChange = (jobId: string, newStatus: string) => {
    updateJobStatus(jobId, newStatus);
    setStatusDropdownOpen(null);
  };

  const handleOpenBlockModal = (job: Job) => {
    setSelectedJobForBlocking(job);
    setBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setSelectedJobForBlocking(null);
    setBlockModalOpen(false);
  };

  const statusOptions = ['Queued', 'Printing', 'QC', 'Packing', 'Shipped', 'Delivered', 'Blocked'];

  return (
    <>
      {/* Page Header with Breadcrumb */}
      <div className="mb-[25px]">
        <div className="flex flex-wrap items-center justify-between gap-[15px]">
          <div>
            <h1 className="text-[28px] lg:text-[32px] font-semibold text-dark dark:text-title-dark mb-[5px]">
              Jobs
            </h1>
            <p className="text-body dark:text-subtitle-dark">
              Manage your assigned production queue
            </p>
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Jobs
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px] mb-[25px]">
        {/* Active Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Active Jobs</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {activeJobs.length}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-blue-600 dark:text-blue-400">work</i>
            </div>
          </div>
        </div>

        {/* Due Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Due Soon (48h)</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {dueSoonJobs.length}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-orange-600 dark:text-orange-400">schedule</i>
            </div>
          </div>
        </div>

        {/* Blocked */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Blocked</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {blockedJobs.length}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-red-600 dark:text-red-400">block</i>
            </div>
          </div>
        </div>

        {/* Completed (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Completed (30d)</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {completedJobs.length}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-green-600 dark:text-green-400">check_circle</i>
            </div>
          </div>
        </div>
      </div>

      {/* Status Timeline and Shipping Cards - Show for first active job as example */}
      {activeJobs.length > 0 && (
        <div className="mb-[25px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
            <StatusTimeline job={activeJobs[0]} />
            <ShippingCard job={activeJobs[0]} onUpdate={() => {
              // Force re-render by updating a state value or refetching data
              // In a real app, you might want to refetch jobs data
            }} />
          </div>
        </div>
      )}

      {/* Filtering Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-[25px] p-[25px]">
        {/* Status Tabs */}
        <div className="mb-[20px]">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['All', 'Active', 'Blocked', 'Shipped', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {(() => {
                      switch (tab) {
                        case 'All':
                          return jobs.length;
                        case 'Active':
                          return jobs.filter(job => ['Queued', 'Printing', 'QC', 'Packing'].includes(job.status)).length;
                        case 'Blocked':
                          return jobs.filter(job => job.status === 'Blocked').length;
                        case 'Shipped':
                          return jobs.filter(job => job.status === 'Shipped').length;
                        case 'Completed':
                          return jobs.filter(job => job.status === 'Delivered').length;
                        default:
                          return 0;
                      }
                    })()}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[15px]">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="material-symbols-outlined text-gray-400 text-[20px]">search</i>
            </div>
            <input
              type="text"
              placeholder="Search jobs, products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i className="material-symbols-outlined text-gray-400 hover:text-gray-600 text-[18px]">close</i>
              </button>
            )}
          </div>

          {/* Material Filter */}
          <div className="relative">
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 sm:text-sm appearance-none"
            >
              <option value="All">All Materials</option>
              {uniqueMaterials.map((material) => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="material-symbols-outlined text-gray-400 text-[20px]">expand_more</i>
            </div>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 sm:text-sm appearance-none"
            >
              <option value="All">All Priorities</option>
              <option value="Standard">Standard</option>
              <option value="Rush">Rush</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="material-symbols-outlined text-gray-400 text-[20px]">expand_more</i>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 sm:text-sm appearance-none"
            >
              <option value="due-date-soonest">Due Date (Soonest)</option>
              <option value="due-date-latest">Due Date (Latest)</option>
              <option value="payout-highest">Payout (Highest)</option>
              <option value="updated-latest">Updated (Latest)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="material-symbols-outlined text-gray-400 text-[20px]">expand_more</i>
            </div>
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="mt-[15px] flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
          {(searchQuery || materialFilter !== 'All' || priorityFilter !== 'All' || activeTab !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setMaterialFilter('All');
                setPriorityFilter('All');
                setActiveTab('All');
                setSortBy('due-date-soonest');
              }}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <i className="material-symbols-outlined text-[16px] mr-1">clear</i>
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-[25px] border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-[15px]">
            <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark">
              All Jobs
            </h2>
            <div className="flex items-center gap-[10px]">
              <button className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <i className="material-symbols-outlined text-[18px] mr-[5px]">filter_list</i>
                Filter
              </button>
              <button className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700">
                <i className="material-symbols-outlined text-[18px] mr-[5px]">add</i>
                New Job
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product / Item
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Material / Color
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payout
                </th>
                <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Job ID */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    <div className="text-sm font-medium text-dark dark:text-title-dark">
                      {job.id}
                    </div>
                  </td>

                  {/* Linked Order */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    {job.orderId ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Order #{job.orderId}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">—</span>
                    )}
                  </td>

                  {/* Product / Item */}
                  <td className="px-[25px] py-[15px]">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <i className="material-symbols-outlined text-gray-400 dark:text-gray-300 text-[18px]">
                            inventory_2
                          </i>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-dark dark:text-title-dark">
                          {job.product}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Qty */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    <div className="text-sm text-dark dark:text-title-dark">
                      {job.qty}
                    </div>
                  </td>

                  {/* Material / Color */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    <div className="text-sm text-dark dark:text-title-dark">
                      {job.material}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {job.color}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                      {isOverdue(job) && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded dark:bg-red-900/30 dark:text-red-300" title="Overdue">
                          <i className="material-symbols-outlined text-[12px] mr-0.5">warning</i>
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    <div className="text-sm text-dark dark:text-title-dark">
                      {new Date(job.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDaysUntilDue(job.dueDate)}
                      </div>
                      {isAtRisk(job) && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 rounded dark:bg-orange-900/30 dark:text-orange-300" title="At Risk - Due within 48 hours">
                          <i className="material-symbols-outlined text-[12px] mr-0.5">schedule</i>
                          At Risk
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>

                  {/* Payout */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap">
                    <div className="text-sm font-medium text-dark dark:text-title-dark">
                      ${job.payout.toFixed(2)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-[25px] py-[15px] whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-[8px]">
                      {/* Open Job Detail */}
                      <Link
                        to={`/maker/jobs/${job.id}`}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Open Job Details"
                      >
                        <i className="material-symbols-outlined text-[18px]">open_in_new</i>
                      </Link>

                      {/* Quick Status Update Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdownOpen(statusDropdownOpen === job.id ? null : job.id)}
                          className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          title="Quick Status Update"
                        >
                          <i className="material-symbols-outlined text-[18px]">more_vert</i>
                        </button>

                        {statusDropdownOpen === job.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="py-1">
                              <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                                Update Status
                              </div>
                              {statusOptions.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(job.id, status)}
                                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                    job.status === status 
                                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${getStatusBadgeClass(status)}`}>
                                    {status}
                                  </span>
                                  {job.status === status && (
                                    <i className="material-symbols-outlined text-[16px] float-right mt-0.5">check</i>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mark Blocked Button */}
                      <button
                        onClick={() => handleOpenBlockModal(job)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Mark as Blocked"
                      >
                        <i className="material-symbols-outlined text-[18px]">block</i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Blocked Modal */}
      {blockModalOpen && selectedJobForBlocking && (
        <MarkBlockedModal
          job={selectedJobForBlocking}
          isOpen={blockModalOpen}
          onClose={handleCloseBlockModal}
          onSuccess={() => {
            // Refresh the page data or trigger re-render
            // In a real app, you might want to refetch data or use state management
          }}
        />
      )}
    </>
  );
};

export default MakerJobs;
