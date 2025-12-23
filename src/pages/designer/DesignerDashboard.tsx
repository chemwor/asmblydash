import React from 'react';
import { computeKpis, getRequests, computePipelineCounts, getActionItems } from '../../features/designerDashboard/mockDesignerDashboard';
import { Link } from 'react-router-dom';

// Define interface for request object used in getReasonChip
interface RequestItem {
  status: string;
  printabilityIssue?: boolean;
  missingReference?: boolean;
}

const DesignerDashboard: React.FC = () => {
  // Get mock data and compute all dashboard metrics using feature module helpers
  const requests = getRequests();
  const kpis = computeKpis(requests);
  const pipelineCounts = computePipelineCounts(requests);
  const actionItems = getActionItems(requests);

  // Extract action items data - fix property names to match actual exports
  const { reviewFeedbackRequests, alertsData } = actionItems;

  // Get reason chip for review items
  const getReasonChip = (request: RequestItem) => {
    if (request.status === 'Revision Needed') {
      return { text: 'Revision', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
    }
    if (request.status === 'In Review') {
      return { text: 'Pending Approval', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    }
    if (request.printabilityIssue) {
      return { text: 'Printability Issue', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    }
    if (request.missingReference) {
      return { text: 'Missing Assets', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    }
    return { text: 'Review', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate days until due date
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="main-content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Designer Dashboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage design requests and approvals
          </p>
        </div>
      </div>

      {/* Welcome Section */}
      {/*<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">*/}
      {/*  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">*/}
      {/*    Welcome to your Designer Dashboard*/}
      {/*  </h4>*/}
      {/*  <p className="text-gray-600 dark:text-gray-400 mb-4">*/}
      {/*    Track and manage your design requests, approvals, and performance metrics.*/}
      {/*    Use the navigation to access detailed views of your requests, files, and earnings.*/}
      {/*  </p>*/}

      {/*  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">*/}
      {/*    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">*/}
      {/*      <i className="ri-file-list-3-line text-2xl text-blue-600 dark:text-blue-400 mb-2"></i>*/}
      {/*      <p className="text-sm font-medium text-gray-900 dark:text-white">Manage Requests</p>*/}
      {/*      <p className="text-xs text-gray-600 dark:text-gray-400">View and respond to design requests</p>*/}
      {/*    </div>*/}
      {/*    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">*/}
      {/*      <i className="ri-folder-line text-2xl text-purple-600 dark:text-purple-400 mb-2"></i>*/}
      {/*      <p className="text-sm font-medium text-gray-900 dark:text-white">File Deliverables</p>*/}
      {/*      <p className="text-xs text-gray-600 dark:text-gray-400">Upload and organize your work</p>*/}
      {/*    </div>*/}
      {/*    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">*/}
      {/*      <i className="ri-line-chart-line text-2xl text-green-600 dark:text-green-400 mb-2"></i>*/}
      {/*      <p className="text-sm font-medium text-gray-900 dark:text-white">Track Performance</p>*/}
      {/*      <p className="text-xs text-gray-600 dark:text-gray-400">Monitor royalties and metrics</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Alerts Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alerts
          </h4>
        </div>

        <div className="space-y-3">
          {/* Overdue Alerts */}
          {alertsData.overdue > 0 && (
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex-shrink-0">
                <i className="ri-error-warning-line text-red-600 dark:text-red-400 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {alertsData.overdue} request{alertsData.overdue > 1 ? 's' : ''} overdue
                </p>
                <p className="text-xs text-red-600 dark:text-red-300">
                  These requests have passed their due date and need immediate attention
                </p>
              </div>
              <Link
                to="/designer/requests"
                className="ml-3 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                View →
              </Link>
            </div>
          )}

          {/* Due Within 48h */}
          {alertsData.dueWithin48h > 0 && (
            <div className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex-shrink-0">
                <i className="ri-time-line text-orange-600 dark:text-orange-400 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {alertsData.dueWithin48h} request{alertsData.dueWithin48h > 1 ? 's' : ''} due within 48h
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-300">
                  Time-sensitive requests requiring priority attention
                </p>
              </div>
              <Link
                to="/designer/requests"
                className="ml-3 text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                View →
              </Link>
            </div>
          )}

          {/* Due Soon (7 days) */}
          {alertsData.dueSoon > 0 && alertsData.dueWithin48h === 0 && (
            <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex-shrink-0">
                <i className="ri-calendar-event-line text-yellow-600 dark:text-yellow-400 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {alertsData.dueSoon} request{alertsData.dueSoon > 1 ? 's' : ''} due within 7 days
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  Plan your workload to meet upcoming deadlines
                </p>
              </div>
              <Link
                to="/designer/requests"
                className="ml-3 text-xs font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
              >
                View →
              </Link>
            </div>
          )}

          {/* Blocked - Missing Reference */}
          {alertsData.blockedMissingReference > 0 && (
            <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex-shrink-0">
                <i className="ri-image-line text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  {alertsData.blockedMissingReference} request{alertsData.blockedMissingReference > 1 ? 's' : ''} blocked: missing reference images
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Contact clients to provide missing reference materials
                </p>
              </div>
              <Link
                to="/designer/requests"
                className="ml-3 text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View →
              </Link>
            </div>
          )}

          {/* Blocked - Printability Issues */}
          {alertsData.blockedPrintability > 0 && (
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex-shrink-0">
                <i className="ri-printer-line text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {alertsData.blockedPrintability} request{alertsData.blockedPrintability > 1 ? 's' : ''} blocked: printability issues
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Review and resolve 3D printing compatibility problems
                </p>
              </div>
              <Link
                to="/designer/requests"
                className="ml-3 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View →
              </Link>
            </div>
          )}

          {/* No Alerts */}
          {alertsData.overdue === 0 && alertsData.dueWithin48h === 0 && alertsData.dueSoon === 0 && alertsData.blocked === 0 && (
            <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex-shrink-0">
                <i className="ri-check-line text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  All clear! No urgent alerts at this time.
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Your workload is on track and no requests require immediate attention.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {/* Open Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <i className="ri-draft-line text-blue-600 dark:text-blue-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.openRequests}</p>
            </div>
          </div>
        </div>

        {/* Due Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <i className="ri-time-line text-orange-600 dark:text-orange-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Soon (7d)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.dueSoon}</p>
            </div>
          </div>
        </div>

        {/* In Review */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <i className="ri-eye-line text-purple-600 dark:text-purple-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.inReview}</p>
            </div>
          </div>
        </div>

        {/* Revision Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <i className="ri-edit-line text-yellow-600 dark:text-yellow-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revision Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.revisionRequests}</p>
            </div>
          </div>
        </div>

        {/* Approved (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <i className="ri-check-line text-green-600 dark:text-green-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved (30d)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.approved30d}</p>
            </div>
          </div>
        </div>

        {/* Royalties (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <i className="ri-money-dollar-circle-line text-emerald-600 dark:text-emerald-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Royalties (30d)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${kpis.royalties30d.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Snapshot */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pipeline Snapshot
          </h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {/* New */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {pipelineCounts.new}
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
              New
            </div>
          </div>

          {/* In Progress */}
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-1">
              {pipelineCounts.inProgress}
            </div>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
              In Progress
            </div>
          </div>

          {/* In Review */}
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-200 mb-1">
              {pipelineCounts.inReview}
            </div>
            <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
              In Review
            </div>
          </div>

          {/* Revision Needed */}
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-200 mb-1">
              {pipelineCounts.revisionNeeded}
            </div>
            <div className="text-xs font-medium text-orange-700 dark:text-orange-300">
              Revision Needed
            </div>
          </div>

          {/* Approved */}
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-900 dark:text-green-200 mb-1">
              {pipelineCounts.approved}
            </div>
            <div className="text-xs font-medium text-green-700 dark:text-green-300">
              Approved
            </div>
          </div>

          {/* Delivered */}
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200 mb-1">
              {pipelineCounts.delivered}
            </div>
            <div className="text-xs font-medium text-purple-700 dark:text-purple-300">
              Delivered
            </div>
          </div>

          {/* Blocked */}
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-2xl font-bold text-red-900 dark:text-red-200 mb-1">
              {pipelineCounts.blocked}
            </div>
            <div className="text-xs font-medium text-red-700 dark:text-red-300">
              Blocked
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout for Design Work Queue and Review & Feedback */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Design Work Queue Table - Takes 2 columns */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Design Work Queue
              </h4>
              <Link
                to="/designer/requests"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title / Concept
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {actionItems.sortedRequests.map((request) => {
                    const daysUntilDue = getDaysUntilDue(request.dueDate);
                    const isOverdue = daysUntilDue < 0;
                    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

                    return (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {request.requestId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {request.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.statusClass}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex flex-col">
                            <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : isDueSoon ? 'text-orange-600 dark:text-orange-400 font-medium' : ''}>
                              {formatDate(request.dueDate)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                               daysUntilDue === 0 ? 'Due today' :
                               daysUntilDue === 1 ? 'Due tomorrow' :
                               `${daysUntilDue} days left`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.priorityClass}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(request.updatedDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/designer/requests/${request.id}`}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Review & Feedback Panel - Takes 1 column */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Review & Feedback
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {reviewFeedbackRequests.length} items
              </span>
            </div>

            <div className="space-y-3">
              {reviewFeedbackRequests.length > 0 ? (
                reviewFeedbackRequests.map((request) => {
                  const reasonChip = getReasonChip(request);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.requestId}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${reasonChip.class}`}>
                            {reasonChip.text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {request.title}
                        </p>
                      </div>
                      <Link
                        to={`/designer/requests/${request.id}`}
                        className="ml-3 inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        Open
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <i className="ri-check-line text-4xl text-gray-400 dark:text-gray-600 mb-2"></i>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No items need review
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
