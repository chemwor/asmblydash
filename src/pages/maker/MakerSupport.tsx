import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getCases, addCase, cases } from '../../features/makerSupport/mockMakerSupport';
import { getJobs, markBlockedWithDetails } from '../../features/makerJobs/mockJobs';

const MakerSupport: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('Updated (desc)');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    type: 'Print Failure',
    linkedJobId: '',
    priority: 'Normal',
    subject: '',
    description: '',
    markJobBlocked: false
  });

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get filtered and sorted cases using the helper
  const filteredCases = getCases({
    searchTerm,
    type: filterType,
    status: activeStatusTab,
    priority: filterPriority,
    sortBy
  });

  // Get all cases for KPI calculations
  const allCases = cases;

  // Get active jobs for the dropdown
  const allJobs = getJobs();
  const activeJobs = allJobs.filter(job =>
    job.status !== 'completed' &&
    job.status !== 'cancelled' &&
    job.status !== 'shipped'
  );

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new support case
      const newCase = addCase({
        type: formData.type as 'Print Failure' | 'Reprint' | 'QC Dispute' | 'Shipping' | 'File Issue' | 'Other',
        priority: formData.priority as 'Low' | 'Normal' | 'High' | 'Urgent',
        subject: formData.subject,
        description: formData.description,
        linkedJobId: formData.linkedJobId || undefined
      });

      // Mark job as blocked if requested
      if (formData.markJobBlocked && formData.linkedJobId) {
        markBlockedWithDetails(
          formData.linkedJobId,
          'Support Case Created',
          `Blocked due to support case: ${newCase.caseId}`
        );
      }

      // Reset form
      setFormData({
        type: 'Print Failure',
        linkedJobId: '',
        priority: 'Normal',
        subject: '',
        description: '',
        markJobBlocked: false
      });

      // Close modal and show success toast
      setShowModal(false);
      setToastMessage(`Support case ${newCase.caseId} created successfully!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);

    } catch (error) {
      console.error('Error creating support case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      type: 'Print Failure',
      linkedJobId: '',
      priority: 'Normal',
      subject: '',
      description: '',
      markJobBlocked: false
    });
  };

  // Calculate dynamic KPIs from the cases data with proper SLA logic
  const supportKPIs = {
    openCases: {
      value: allCases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length,
      change: '+2',
      changeType: 'negative' as 'negative' | 'positive',
      period: 'vs last week'
    },
    waitingOnYou: {
      value: allCases.filter(c => c.status === 'Waiting on Maker').length,
      change: '-1',
      changeType: 'positive' as 'negative' | 'positive',
      period: 'vs last week'
    },
    overdueCases: {
      value: allCases.filter(c => c.sla.status === 'Overdue' && c.status !== 'Resolved' && c.status !== 'Closed').length,
      change: '+3',
      changeType: 'negative' as 'negative' | 'positive',
      period: 'vs last week'
    },
    resolved30d: {
      value: allCases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length,
      change: '+5',
      changeType: 'positive' as 'negative' | 'positive',
      period: 'vs previous 30d'
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0">Support</h5>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Track issues, disputes, and job-related cases</p>
        </div>

        <div className="flex items-center gap-3 mt-[12px] md:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium text-sm rounded-lg transition-colors"
          >
            <i className="material-symbols-outlined text-sm mr-2">add</i>
            New Case
          </button>

          <ol className="breadcrumb">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              <Link
                to="/maker"
                className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                  home
                </i>
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              Maker
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              Support
            </li>
          </ol>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-dark rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Open Cases</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {supportKPIs.openCases.value}
              </p>
              <span className={`text-xs ${supportKPIs.openCases.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {supportKPIs.openCases.change} {supportKPIs.openCases.period}
              </span>
            </div>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <i className="material-symbols-outlined text-red-600 dark:text-red-400">error</i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-dark rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Waiting on You</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {supportKPIs.waitingOnYou.value}
              </p>
              <span className={`text-xs ${supportKPIs.waitingOnYou.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {supportKPIs.waitingOnYou.change} {supportKPIs.waitingOnYou.period}
              </span>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <i className="material-symbols-outlined text-blue-600 dark:text-blue-400">person</i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-dark rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Overdue Cases</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {supportKPIs.overdueCases.value}
              </p>
              <span className={`text-xs ${supportKPIs.overdueCases.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {supportKPIs.overdueCases.change} {supportKPIs.overdueCases.period}
              </span>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <i className="material-symbols-outlined text-orange-600 dark:text-orange-400">schedule</i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-dark rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Resolved (30d)</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {supportKPIs.resolved30d.value}
              </p>
              <span className={`text-xs ${supportKPIs.resolved30d.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {supportKPIs.resolved30d.change} {supportKPIs.resolved30d.period}
              </span>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <i className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
        {/* Status Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6 pt-4">
            {['All', 'Open', 'Waiting on You', 'Waiting on Seller', 'Resolved'].map((tab) => {
              const count = tab === 'All'
                ? allCases.length
                : tab === 'Open'
                  ? allCases.filter(c => c.status === 'Open' || c.status === 'In Review').length
                  : tab === 'Waiting on You'
                    ? allCases.filter(c => c.status === 'Waiting on Maker').length
                    : tab === 'Waiting on Seller'
                      ? allCases.filter(c => c.status === 'Waiting on Seller').length
                      : allCases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveStatusTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeStatusTab === tab
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="material-symbols-outlined text-gray-400">search</i>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by case ID, job ID, or subject..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Types</option>
              <option value="Print Failure">Print Failure</option>
              <option value="Reprint">Reprint</option>
              <option value="QC Dispute">QC Dispute</option>
              <option value="Shipping">Shipping</option>
              <option value="File Issue">File Issue</option>
              <option value="Other">Other</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Updated (desc)">Updated (Latest)</option>
              <option value="Updated (asc)">Updated (Oldest)</option>
              <option value="SLA (overdue)">SLA (Overdue First)</option>
              <option value="Priority (urgent)">Priority (Urgent First)</option>
              <option value="Created (desc)">Created (Newest)</option>
              <option value="Created (asc)">Created (Oldest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Linked Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SLA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-dark divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCases.map((supportCase) => (
                <tr key={supportCase.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {supportCase.caseId}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {supportCase.shortTitle}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supportCase.typeClass}`}>
                      {supportCase.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {supportCase.linkedJobId ? (
                      <Link
                        to={`/maker/jobs/${supportCase.linkedJobId}`}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        <i className="material-symbols-outlined text-xs mr-1">work</i>
                        {supportCase.linkedJobId}
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supportCase.priorityClass}`}>
                      {supportCase.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supportCase.statusClass}`}>
                      {supportCase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {supportCase.updatedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supportCase.slaClass}`}>
                      {supportCase.sla.status === 'Due'
                        ? supportCase.sla.daysLeft
                          ? `Due in ${supportCase.sla.daysLeft}d`
                          : 'Due today'
                        : `Overdue ${supportCase.sla.daysOverdue}d`
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/maker/support/${supportCase.id}`}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <i className="material-symbols-outlined text-gray-400 text-4xl mb-4">support_agent</i>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No support cases found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {/* New Case Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white">Create Support Case</h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <i className="material-symbols-outlined">close</i>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Case Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Case Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="Print Failure">Print Failure</option>
                        <option value="Reprint">Reprint</option>
                        <option value="QC Dispute">QC Dispute</option>
                        <option value="Shipping">Shipping</option>
                        <option value="File Issue">File Issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Linked Job */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Linked Job (Optional)
                      </label>
                      <select
                        value={formData.linkedJobId}
                        onChange={(e) => handleInputChange('linkedJobId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a job (optional)</option>
                        {activeJobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.id} - {job.product}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Priority <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of the issue"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Provide detailed information about the issue..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        required
                      />
                    </div>

                    {/* Attachments (UI only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Attachments (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                        <i className="material-symbols-outlined text-gray-400 text-2xl mb-2">upload</i>
                        <p className="text-sm text-gray-400 mb-1">Click to upload files or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg,.pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={() => {}} // UI only - no actual file handling
                        />
                      </div>
                    </div>

                    {/* Mark Job as Blocked */}
                    {formData.linkedJobId && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="markJobBlocked"
                          checked={formData.markJobBlocked}
                          onChange={(e) => handleInputChange('markJobBlocked', e.target.checked)}
                          className="w-4 h-4 text-primary-600 bg-slate-800 border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <label htmlFor="markJobBlocked" className="ml-2 text-sm text-gray-300">
                          Mark linked job as Blocked
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-800 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.subject.trim() || !formData.description.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      'Create Case'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
            <i className="material-symbols-outlined mr-2">check_circle</i>
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-green-200 hover:text-white"
            >
              <i className="material-symbols-outlined text-sm">close</i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakerSupport;

