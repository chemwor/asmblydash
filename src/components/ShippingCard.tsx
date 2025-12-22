import React, { useState } from 'react';
import { updateJobStatus, getProductionChecklist, updateShipping, addActivity } from '../features/makerJobs/mockJobs';
import type { Job } from '../features/makerJobs/mockJobs';
import { modernCardClasses } from '../utils/modernCardUtils';

interface ShippingCardProps {
  job: Job;
  onUpdate?: () => void;
}

const ShippingCard: React.FC<ShippingCardProps> = ({ job, onUpdate }) => {
  const [carrier, setCarrier] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [isShipping, setIsShipping] = useState(false);

  const carriers = [
    { value: '', label: 'Select carrier...' },
    { value: 'USPS', label: 'USPS' },
    { value: 'UPS', label: 'UPS' },
    { value: 'FedEx', label: 'FedEx' },
    { value: 'Other', label: 'Other' }
  ];

  // Get production checklist to determine if Mark Shipped should be enabled
  const checklist = getProductionChecklist(job);

  // Check if all required steps are completed (up to and including "Tracking added")
  const canMarkShipped = checklist.printStarted &&
                         checklist.printCompleted &&
                         checklist.qcCompleted &&
                         checklist.packaged &&
                         checklist.labelCreated &&
                         checklist.trackingAdded;

  const handleSaveTracking = async () => {
    if (!carrier || !trackingNumber.trim()) {
      showToast('Please select a carrier and enter a tracking number', 'error');
      return;
    }

    setIsUpdatingTracking(true);

    try {
      // Use the helper function to update shipping
      const success = updateShipping(job.id, { carrier, tracking: trackingNumber });

      if (success) {
        // Add activity entry
        addActivity(job.id, {
          status: job.status,
          note: `Tracking updated: ${carrier} ${trackingNumber}`
        });

        showToast('Tracking information saved successfully', 'success');
        onUpdate?.();
      } else {
        showToast('Failed to save tracking information', 'error');
      }
    } catch {
      showToast('An error occurred while saving tracking information', 'error');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const handleMarkShipped = async () => {
    if (!canMarkShipped) {
      showToast('Please complete all production steps before marking as shipped', 'error');
      return;
    }

    setIsShipping(true);

    try {
      // Update job status to Shipped using helper
      const success = updateJobStatus(job.id, 'Shipped');

      if (success) {
        // Add activity entry
        addActivity(job.id, {
          status: 'Shipped',
          note: 'Job marked as shipped'
        });

        showToast(`Job ${job.id} has been marked as shipped`, 'success');
        onUpdate?.();
      } else {
        showToast('Failed to mark job as shipped', 'error');
      }
    } catch {
      showToast('An error occurred while marking job as shipped', 'error');
    } finally {
      setIsShipping(false);
    }
  };

  // Simple toast implementation (mock)
  const showToast = (message: string, type: 'success' | 'error') => {
    console.log(`Toast: ${type.toUpperCase()} - ${message}`);
    // In a real app, this would trigger a toast notification
  };

  // Don't show shipping card for already shipped/delivered jobs
  if (job.status === 'Shipped' || job.status === 'Delivered') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
        <h3 className="text-[18px] font-semibold text-dark dark:text-title-dark mb-[15px] flex items-center">
          <i className="material-symbols-outlined text-[20px] mr-[8px] text-blue-600 dark:text-blue-400">local_shipping</i>
          Shipping Information
        </h3>
        <div className="flex items-center justify-center py-[20px]">
          <div className="text-center">
            <i className="material-symbols-outlined text-green-500 text-[32px] mb-[8px]">check_circle</i>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Job has been {job.status.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={modernCardClasses.card}>
      <div className={modernCardClasses.header}>
        <div>
          <h5 className={modernCardClasses.title}>Shipping & Delivery</h5>
        </div>
      </div>

      <div>
        {/* Helper text with modern styling */}
        <div className={modernCardClasses.infoBox}>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-0">
            Add tracking information and mark the job as shipped when ready for delivery.
          </p>
        </div>
      </div>

      {/* Shipping Form */}
      <div className="space-y-[20px]">
        {/* Carrier Selection */}
        <div>
          <label htmlFor="carrier" className="block text-sm font-medium text-dark dark:text-title-dark mb-[8px]">
            Carrier
          </label>
          <div className="relative">
            <select
              id="carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 text-sm appearance-none"
              disabled={isUpdatingTracking || isShipping}
            >
              {carriers.map((carrierOption) => (
                <option key={carrierOption.value} value={carrierOption.value} disabled={!carrierOption.value}>
                  {carrierOption.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="material-symbols-outlined text-gray-400 text-[20px]">expand_more</i>
            </div>
          </div>
        </div>

        {/* Tracking Number Input */}
        <div>
          <label htmlFor="trackingNumber" className="block text-sm font-medium text-dark dark:text-title-dark mb-[8px]">
            Tracking Number
          </label>
          <input
            type="text"
            id="trackingNumber"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 text-sm"
            disabled={isUpdatingTracking || isShipping}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-[12px] pt-[10px]">
          {/* Save Tracking Button */}
          <button
            onClick={handleSaveTracking}
            disabled={!carrier || !trackingNumber.trim() || isUpdatingTracking || isShipping}
            className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isUpdatingTracking ? (
              <>
                <i className="material-symbols-outlined text-[16px] mr-[8px] animate-spin">refresh</i>
                Saving...
              </>
            ) : (
              <>
                <i className="material-symbols-outlined text-[16px] mr-[8px]">save</i>
                Save Tracking
              </>
            )}
          </button>

          {/* Mark Shipped Button */}
          <button
            onClick={handleMarkShipped}
            disabled={!canMarkShipped || isUpdatingTracking || isShipping}
            className="inline-flex items-center px-[16px] py-[8px] text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
            title={!canMarkShipped ? 'Complete all production steps first' : 'Mark job as shipped'}
          >
            {isShipping ? (
              <>
                <i className="material-symbols-outlined text-[16px] mr-[8px] animate-spin">refresh</i>
                Shipping...
              </>
            ) : (
              <>
                <i className="material-symbols-outlined text-[16px] mr-[8px]">local_shipping</i>
                Mark Shipped
              </>
            )}
          </button>
        </div>

        {/* Production Steps Status */}
        {!canMarkShipped && (
          <div className="mt-[20px] p-[15px] bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <i className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-[20px] mr-[8px] mt-[-2px]">info</i>
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-[8px]">
                  Complete Production Steps
                </h4>
                <div className="space-y-[4px] text-xs text-yellow-700 dark:text-yellow-300">
                  <div className={`flex items-center ${checklist.printStarted ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <i className="material-symbols-outlined text-[14px] mr-[4px]">
                      {checklist.printStarted ? 'check_circle' : 'radio_button_unchecked'}
                    </i>
                    Print Started
                  </div>
                  <div className={`flex items-center ${checklist.printCompleted ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <i className="material-symbols-outlined text-[14px] mr-[4px]">
                      {checklist.printCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </i>
                    Print Completed
                  </div>
                  <div className={`flex items-center ${checklist.qcCompleted ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <i className="material-symbols-outlined text-[14px] mr-[4px]">
                      {checklist.qcCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </i>
                    QC Completed
                  </div>
                  <div className={`flex items-center ${checklist.packaged ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <i className="material-symbols-outlined text-[14px] mr-[4px]">
                      {checklist.packaged ? 'check_circle' : 'radio_button_unchecked'}
                    </i>
                    Packaged
                  </div>
                  <div className={`flex items-center ${checklist.labelCreated ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <i className="material-symbols-outlined text-[14px] mr-[4px]">
                      {checklist.labelCreated ? 'check_circle' : 'radio_button_unchecked'}
                    </i>
                    Label Created
                  </div>
                  <div className={`flex items-center ${checklist.trackingAdded ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <i className="material-symbols-outlined text-[14px] mr-[4px]">
                      {checklist.trackingAdded ? 'check_circle' : 'radio_button_unchecked'}
                    </i>
                    Tracking Added
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Job Status Info */}
        <div className="mt-[20px] p-[15px] bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[16px] mr-[8px]">info</i>
              <span className="text-sm text-gray-600 dark:text-gray-300">Current Status:</span>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              job.status === 'Printing' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
              job.status === 'QC' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
              job.status === 'Packing' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
              job.status === 'Queued' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {job.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCard;
