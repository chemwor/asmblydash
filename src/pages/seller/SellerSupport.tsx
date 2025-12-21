import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { getCases, addCase } from '../../features/sellerSupport/mockCases';
import type { SupportIssue, AddCasePayload } from '../../features/sellerSupport/mockCases';

const SellerSupport: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('Updated (desc)');

  // Modal states
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState(false);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Create issue form state
  const [createIssueForm, setCreateIssueForm] = useState({
    type: 'Other' as 'Defect' | 'Reprint' | 'Shipping' | 'Refund' | 'Licensing' | 'Other',
    linkedToType: 'None' as 'Order' | 'STL Request' | 'None',
    linkedId: '',
    priority: 'Normal' as 'Low' | 'Normal' | 'High' | 'Urgent',
    subject: '',
    description: '',
    preferredResolution: 'Other' as 'Reprint' | 'Refund' | 'Advice' | 'Other'
  });

  // Form errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get filtered and sorted issues using the helper
  const issues = getCases({
    searchTerm,
    type: filterType,
    status: activeStatusTab,
    priority: filterPriority,
    sortBy
  });

  // Calculate dynamic KPIs from the issues data
  const supportKPIs = {
    openIssues: {
      value: getCases().filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length,
      change: '+3',
      changeType: 'negative' as 'negative' | 'positive',
      period: 'vs last week'
    },
    awaitingResponse: {
      value: getCases().filter(i => i.status === 'Waiting on Seller' || i.status === 'Waiting on Maker').length,
      change: '-2',
      changeType: 'positive' as 'negative' | 'positive',
      period: 'vs last week'
    },
    resolved30d: {
      value: getCases().filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
      change: '+8',
      changeType: 'positive' as 'negative' | 'positive',
      period: 'vs previous 30d'
    },
    avgResolutionTime: {
      value: '2.3 days',
      change: '-0.5',
      changeType: 'positive' as 'negative' | 'positive',
      period: 'vs last month'
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!createIssueForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!createIssueForm.description.trim()) {
      errors.description = 'Description is required';
    }

    if (createIssueForm.linkedToType !== 'None' && !createIssueForm.linkedId.trim()) {
      errors.linkedId = 'Linked ID is required when Linked To is not None';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmitIssue = () => {
    if (!validateForm()) {
      return;
    }

    const payload: AddCasePayload = {
      type: createIssueForm.type,
      priority: createIssueForm.priority,
      subject: createIssueForm.subject,
      description: createIssueForm.description,
      linkedToType: createIssueForm.linkedToType,
      linkedId: createIssueForm.linkedId
    };

    addCase(payload);

    // Reset form
    setCreateIssueForm({
      type: 'Other',
      linkedToType: 'None',
      linkedId: '',
      priority: 'Normal',
      subject: '',
      description: '',
      preferredResolution: 'Other'
    });
    setFormErrors({});

    // Close modal
    setCreateIssueModalOpen(false);

    // Show toast
    setToastMessage('Support case created successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Get all cases for tab counts
  const allCases = getCases();
  const filteredIssues = issues;

  return (
    <div className="relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300">
          <div className="flex items-center">
            <i className="material-symbols-outlined mr-2">check_circle</i>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h5 className="!mb-0">Support Tickets</h5>

          {/* New Issue Button */}
          <button
            onClick={() => setCreateIssueModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <i className="material-symbols-outlined text-lg">add</i>
            New Issue
          </button>
        </div>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/seller"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Seller
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Support
          </li>
        </ol>
      </div>

      {/* Create Issue Modal */}
      <Dialog open={createIssueModalOpen} onClose={() => setCreateIssueModalOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-xl bg-slate-900 p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Create Support Case</h3>
              <button
                onClick={() => setCreateIssueModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Issue Type
                </label>
                <select
                  value={createIssueForm.type}
                  onChange={(e) => setCreateIssueForm(prev => ({
                    ...prev,
                    type: e.target.value as SupportIssue['type']
                  }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Defect">Defect</option>
                  <option value="Reprint">Reprint</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Refund">Refund</option>
                  <option value="Licensing">Licensing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Linked To */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Linked To
                  </label>
                  <select
                    value={createIssueForm.linkedToType}
                    onChange={(e) => setCreateIssueForm(prev => ({
                      ...prev,
                      linkedToType: e.target.value as 'Order' | 'STL Request' | 'None',
                      linkedId: ''
                    }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="None">None</option>
                    <option value="Order">Order</option>
                    <option value="STL Request">STL Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Linked ID
                  </label>
                  <input
                    type="text"
                    value={createIssueForm.linkedId}
                    onChange={(e) => setCreateIssueForm(prev => ({
                      ...prev,
                      linkedId: e.target.value
                    }))}
                    disabled={createIssueForm.linkedToType === 'None'}
                    placeholder={createIssueForm.linkedToType === 'Order' ? 'e.g., ORD-2024-1234' : 'e.g., STL-2024-0123'}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      createIssueForm.linkedToType === 'None' 
                        ? 'border-slate-700 text-gray-500 cursor-not-allowed' 
                        : formErrors.linkedId 
                          ? 'border-red-500' 
                          : 'border-slate-700'
                    }`}
                  />
                  {formErrors.linkedId && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.linkedId}</p>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={createIssueForm.priority}
                  onChange={(e) => setCreateIssueForm(prev => ({
                    ...prev,
                    priority: e.target.value as SupportIssue['priority']
                  }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={createIssueForm.subject}
                  onChange={(e) => setCreateIssueForm(prev => ({
                    ...prev,
                    subject: e.target.value
                  }))}
                  placeholder="Brief description of the issue"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    formErrors.subject ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.subject && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.subject}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={createIssueForm.description}
                  onChange={(e) => setCreateIssueForm(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                    formErrors.description ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                  <i className="material-symbols-outlined text-3xl text-gray-500 mb-2">attach_file</i>
                  <p className="text-gray-400 text-sm">Click to browse or drag files here</p>
                  <input type="file" multiple className="hidden" />
                </div>
              </div>

              {/* Preferred Resolution */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Resolution
                </label>
                <select
                  value={createIssueForm.preferredResolution}
                  onChange={(e) => setCreateIssueForm(prev => ({
                    ...prev,
                    preferredResolution: e.target.value as 'Reprint' | 'Refund' | 'Advice' | 'Other'
                  }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Reprint">Reprint</option>
                  <option value="Refund">Refund</option>
                  <option value="Advice">Advice</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
              <button
                onClick={() => setCreateIssueModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitIssue}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              >
                Create Case
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-dark rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Open Issues</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {supportKPIs.openIssues.value}
              </p>
              <span className={`text-xs ${supportKPIs.openIssues.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {supportKPIs.openIssues.change} {supportKPIs.openIssues.period}
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">Awaiting Response</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {supportKPIs.awaitingResponse.value}
              </p>
              <span className={`text-xs ${supportKPIs.awaitingResponse.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {supportKPIs.awaitingResponse.change} {supportKPIs.awaitingResponse.period}
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

        <div className="bg-white dark:bg-gray-dark rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Resolution Time</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {supportKPIs.avgResolutionTime.value}
              </p>
              <span className={`text-xs ${supportKPIs.avgResolutionTime.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {supportKPIs.avgResolutionTime.change} {supportKPIs.avgResolutionTime.period}
              </span>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <i className="material-symbols-outlined text-blue-600 dark:text-blue-400">avg_time</i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
        {/* Status Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6 pt-4">
            {['All', 'Open', 'Waiting', 'Resolved'].map((tab) => {
              const count = tab === 'All'
                ? allCases.length
                : tab === 'Open'
                  ? allCases.filter(i => i.status === 'Open' || i.status === 'In Progress').length
                  : tab === 'Waiting'
                    ? allCases.filter(i => i.status === 'Waiting on Seller' || i.status === 'Waiting on Maker').length
                    : allCases.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

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
                  placeholder="Search by case ID, title, or linked ID..."
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
              <option value="Defect">Defect</option>
              <option value="Reprint">Reprint</option>
              <option value="Shipping">Shipping</option>
              <option value="Refund">Refund</option>
              <option value="Licensing">Licensing</option>
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
              <option value="Updated (desc)">Updated (desc)</option>
              <option value="Priority (Urgent first)">Priority (Urgent first)</option>
              <option value="SLA (Urgent first)">SLA (Urgent first)</option>
              <option value="Created (newest first)">Created (newest first)</option>
              <option value="Case ID (A-Z)">Case ID (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SLA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-dark divide-y divide-gray-200 dark:divide-gray-600">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="material-symbols-outlined text-4xl text-gray-400 mb-4">support</i>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No support cases found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm || filterType !== 'All' || filterPriority !== 'All' || activeStatusTab !== 'All'
                          ? 'Try adjusting your filters or search terms.'
                          : 'Create your first support case to get started.'}
                      </p>
                      <button
                        onClick={() => setCreateIssueModalOpen(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                      >
                        <i className="material-symbols-outlined text-lg">add</i>
                        Create Support Case
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {issue.caseId}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${issue.typeClass}`}>
                            {issue.type}
                          </span>
                          {issue.linkedTo && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              → {issue.linkedTo.id}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {issue.shortTitle}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {issue.assignedTo && `Assigned to ${issue.assignedTo}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${issue.statusClass}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${issue.priorityClass}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {issue.sla && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${issue.slaClass}`}>
                          {issue.sla.status === 'Overdue' ? 'Overdue' : issue.sla.timeLeft}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {issue.updatedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/seller/support/${issue.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerSupport;
