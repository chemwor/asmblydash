import React, { useState } from 'react';
import { Link, useParams } from "react-router-dom";
import {
  getCaseById,
  getConversations,
  getAttachments,
  addMessage
} from '../../features/sellerSupport/mockCases';
import type {
  AddMessagePayload
} from '../../features/sellerSupport/mockCases';

const SellerSupportCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Find the case by ID using the helper
  const supportCase = getCaseById(id!);

  // Get conversations and attachments
  const conversations = supportCase ? getConversations(supportCase.id) : [];
  const attachments = supportCase ? getAttachments(supportCase.id) : [];

  // If case not found
  if (!supportCase) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="material-symbols-outlined text-6xl text-gray-400 mb-4">error_outline</i>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Case Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The support case with ID "{id}" could not be found.
          </p>
          <Link
            to="/seller/support"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Support
          </Link>
        </div>
      </div>
    );
  }

  // Get timeline steps based on status
  const getTimelineSteps = () => {
    const steps = [
      { label: 'Created', status: 'completed' },
      { label: 'In Progress', status: supportCase.status === 'Open' ? 'pending' : 'completed' },
      { label: 'Waiting', status: supportCase.status.includes('Waiting') ? 'current' : supportCase.status === 'Resolved' || supportCase.status === 'Closed' ? 'completed' : 'pending' },
      { label: 'Resolved', status: supportCase.status === 'Resolved' || supportCase.status === 'Closed' ? 'completed' : 'pending' }
    ];

    if (supportCase.status === 'Open') {
      steps[0].status = 'current';
    } else if (supportCase.status === 'In Progress') {
      steps[1].status = 'current';
    }

    return steps;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const payload: AddMessagePayload = {
      author: 'You (Seller)',
      type: 'seller',
      message: newMessage.trim()
    };

    addMessage(supportCase.id, payload);

    setToastMessage('Message sent successfully!');
    setShowToast(true);
    setNewMessage('');
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleActionClick = (action: string) => {
    setToastMessage(`Case ${action} successfully!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const timelineSteps = getTimelineSteps();

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
          <Link
            to="/seller/support"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="material-symbols-outlined text-xl">arrow_back</i>
          </Link>
          <h5 className="!mb-0">Case Details - {supportCase.caseId}</h5>
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
            <Link to="/seller/support">Support</Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            {supportCase.caseId}
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Overview Card */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Case Overview</h6>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Case ID</label>
                  <p className="text-gray-900 dark:text-white font-medium">{supportCase.caseId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supportCase.statusClass}`}>
                      {supportCase.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supportCase.typeClass}`}>
                      {supportCase.type}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supportCase.priorityClass}`}>
                      {supportCase.priority}
                    </span>
                  </div>
                </div>

                {supportCase.sla && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SLA Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supportCase.slaClass}`}>
                        {supportCase.sla.status === 'Overdue' ? 'Overdue' : supportCase.sla.timeLeft}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Linked To</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {supportCase.linkedTo ? (
                      <Link
                        to={`/seller/${supportCase.linkedTo.type === 'Order' ? 'orders' : 'stl-requests'}/${supportCase.linkedTo.id}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        {supportCase.linkedTo.type}: {supportCase.linkedTo.id}
                      </Link>
                    ) : (
                      'None'
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Date</label>
                  <p className="text-gray-900 dark:text-white">{supportCase.createdDate}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                  <p className="text-gray-900 dark:text-white">{supportCase.updatedDate}</p>
                </div>

                {supportCase.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</label>
                    <p className="text-gray-900 dark:text-white">{supportCase.assignedTo}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
              <p className="text-gray-900 dark:text-white mt-2">{supportCase.description}</p>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Case Timeline</h6>

            <div className="relative">
              {timelineSteps.map((step, index) => (
                <div key={step.label} className="flex items-center mb-6 last:mb-0">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : step.status === 'current'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.status === 'completed' ? (
                        <i className="material-symbols-outlined text-sm">check</i>
                      ) : step.status === 'current' ? (
                        <i className="material-symbols-outlined text-sm">radio_button_checked</i>
                      ) : (
                        <i className="material-symbols-outlined text-sm">radio_button_unchecked</i>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className={`font-medium ${
                        step.status === 'current' 
                          ? 'text-primary-500' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>

                  {index < timelineSteps.length - 1 && (
                    <div className={`absolute left-4 mt-8 w-0.5 h-6 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} style={{ top: `${index * 48 + 32}px` }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Card */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Conversation</h6>

            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {conversations.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <i className="material-symbols-outlined text-sm text-gray-600 dark:text-gray-300">
                      {message.type === 'customer' ? 'person' : message.type === 'support' ? 'support_agent' : 'store'}
                    </i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{message.author}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        message.type === 'customer' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                          : message.type === 'support'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                            : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {message.type === 'customer' ? 'Customer' : message.type === 'support' ? 'Support' : 'Seller'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Compose Message */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Evidence / Attachments Card */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Evidence & Attachments</h6>
              <button
                onClick={() => handleActionClick('attachment uploaded')}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                <i className="material-symbols-outlined text-base mr-1">attach_file</i>
                Add
              </button>
            </div>

            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center flex-shrink-0">
                    <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">
                      {attachment.type === 'image' ? 'image' : 'description'}
                    </i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {attachment.size} • {attachment.uploadedBy} • {attachment.uploadedAt}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <i className="material-symbols-outlined text-sm">download</i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Actions Card */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resolution Actions</h6>

            <div className="space-y-3">
              {supportCase.status !== 'Resolved' && supportCase.status !== 'Closed' && (
                <button
                  onClick={() => handleActionClick('marked as resolved')}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <i className="material-symbols-outlined text-sm">check_circle</i>
                  Mark as Resolved
                </button>
              )}

              {(supportCase.status === 'Resolved' || supportCase.status === 'Closed') && (
                <button
                  onClick={() => handleActionClick('reopened')}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <i className="material-symbols-outlined text-sm">refresh</i>
                  Reopen Case
                </button>
              )}

              <button
                onClick={() => handleActionClick('escalated')}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <i className="material-symbols-outlined text-sm">priority_high</i>
                Escalate
              </button>

              <button
                onClick={() => handleActionClick('notes updated')}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <i className="material-symbols-outlined text-sm">edit_note</i>
                Add Internal Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSupportCaseDetail;
