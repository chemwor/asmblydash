import React, { useState } from 'react';
import { markBlockedWithDetails } from '../features/makerJobs/mockJobs';
import type { Job } from '../features/makerJobs/mockJobs';

interface MarkBlockedModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MarkBlockedModal: React.FC<MarkBlockedModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
  const [blockReason, setBlockReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [notifications, setNotifications] = useState({
    seller: false,
    designer: false,
    support: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blockReasons = [
    { value: '', label: 'Select a reason...' },
    { value: 'Missing file', label: 'Missing file' },
    { value: 'Unclear material', label: 'Unclear material' },
    { value: 'Machine issue', label: 'Machine issue' },
    { value: 'Quality concern', label: 'Quality concern' },
    { value: 'Other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blockReason || !details.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mark job as blocked with details
      const success = markBlockedWithDetails(job.id, blockReason, details.trim());

      if (success) {
        // Show success toast (mock implementation)
        showToast(`Job ${job.id} has been marked as blocked`, 'success');

        // Reset form
        setBlockReason('');
        setDetails('');
        setNotifications({ seller: false, designer: false, support: false });

        onSuccess();
        onClose();
      } else {
        showToast('Failed to mark job as blocked', 'error');
      }
    } catch {
      showToast('An error occurred while marking job as blocked', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setBlockReason('');
    setDetails('');
    setNotifications({ seller: false, designer: false, support: false });
    onClose();
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Simple toast implementation (mock)
  const showToast = (message: string, type: 'success' | 'error') => {
    console.log(`Toast: ${type.toUpperCase()} - ${message}`);
    // In a real app, this would trigger a toast notification
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal Panel */}
        <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="material-symbols-outlined text-red-400 text-[24px] mr-3">block</i>
                <h2 className="text-lg font-semibold text-white">Mark Job as Blocked</h2>
              </div>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <i className="material-symbols-outlined text-[24px]">close</i>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {/* Job Info */}
              <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center mr-3">
                    <i className="material-symbols-outlined text-slate-300 text-[18px]">inventory_2</i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{job.product}</h3>
                    <p className="text-xs text-slate-400">Job ID: {job.id}</p>
                  </div>
                </div>
              </div>

              {/* Block Reason Dropdown */}
              <div className="mb-4">
                <label htmlFor="blockReason" className="block text-sm font-medium text-slate-300 mb-2">
                  Block Reason <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="blockReason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                    required
                    disabled={isSubmitting}
                  >
                    {blockReasons.map((reason) => (
                      <option key={reason.value} value={reason.value} disabled={!reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</i>
                  </div>
                </div>
              </div>

              {/* Details Textarea */}
              <div className="mb-6">
                <label htmlFor="details" className="block text-sm font-medium text-slate-300 mb-2">
                  Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide specific details about why this job is blocked..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-400 mt-1">
                  {details.length}/500 characters
                </p>
              </div>

              {/* Notifications */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Notify (UI Only)
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'seller', label: 'Seller', icon: 'person' },
                    { key: 'designer', label: 'Designer', icon: 'design_services' },
                    { key: 'support', label: 'Support', icon: 'support_agent' }
                  ].map(({ key, label, icon }) => (
                    <label key={key} className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={notifications[key as keyof typeof notifications]}
                          onChange={() => handleNotificationChange(key as keyof typeof notifications)}
                          className="sr-only"
                          disabled={isSubmitting}
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-colors ${
                          notifications[key as keyof typeof notifications]
                            ? 'bg-red-500 border-red-500'
                            : 'bg-slate-800 border-slate-600'
                        }`}>
                          {notifications[key as keyof typeof notifications] && (
                            <i className="material-symbols-outlined text-white text-[12px] absolute inset-0 flex items-center justify-center">check</i>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex items-center">
                        <i className="material-symbols-outlined text-slate-400 text-[16px] mr-2">{icon}</i>
                        <span className="text-sm text-slate-300">{label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!blockReason || !details.trim() || isSubmitting}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <i className="material-symbols-outlined text-[16px] mr-2 animate-spin">refresh</i>
                      Marking Blocked...
                    </>
                  ) : (
                    <>
                      <i className="material-symbols-outlined text-[16px] mr-2">block</i>
                      Mark Blocked
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MarkBlockedModal;
