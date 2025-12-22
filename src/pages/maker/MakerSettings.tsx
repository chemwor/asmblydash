import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { loadMakerSettings, saveMakerSettings, defaultMakerSettings } from '../../features/makerSettings/mockMakerSettings';

interface NotificationSettings {
  email: string;
  inAppNotifications: boolean;
  // Jobs
  newJobAssigned: boolean;
  jobDueSoon: boolean;
  jobOverdue: boolean;
  jobMarkedBlocked: boolean;
  statusChangeConfirmations: boolean;
  // Quality
  qcPhotosRequired: boolean;
  reprintRequested: boolean;
  issueTicketUpdates: boolean;
  // Finance
  payoutScheduled: boolean;
  payoutProcessed: boolean;
  adjustmentApplied: boolean;
}

interface WorkflowPreferences {
  autoAcceptJobs: boolean;
  maxConcurrentJobs: number;
  defaultLeadTime: number;
  requireApprovalForRushJobs: boolean;
  autoQuoteGeneration: boolean;
  preferredMaterials: string[];
  qualityCheckRequired: boolean;
  // New fields
  defaultJobsView: string;
  defaultJobsFilter: string;
  autoSortJobsByDueDate: boolean;
  requireChecklistCompletion: boolean;
  requireQcPhotos: boolean;
  autoOpenLastViewedJob: boolean;
}

interface AvailabilitySettings {
  isAvailable: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  timezone: string;
  vacationMode: boolean;
  maxDailyJobs: number;
}

interface AccountSecuritySettings {
  displayName: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  profileVisibility: string;
}

export interface MakerSettingsType {
  notifications: NotificationSettings;
  workflowPreferences: WorkflowPreferences;
  availability: AvailabilitySettings;
  accountSecurity: AccountSecuritySettings;
}

const MakerSettings: React.FC = () => {
  const [settings, setSettings] = useState<MakerSettingsType>(defaultMakerSettings);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateConfirmText, setDeactivateConfirmText] = useState('');

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsInitialLoading(true);
        const loadedSettings = await loadMakerSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
        showSuccessToast('Failed to load settings');
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Helper to update specific setting sections
  const updateSettings = <K extends keyof MakerSettingsType>(
    section: K,
    updates: Partial<MakerSettingsType[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  // Save settings
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await saveMakerSettings(settings);
      showSuccessToast('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showSuccessToast('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleResetSettings = () => {
    setSettings({ ...defaultMakerSettings });
    showSuccessToast('Settings reset to defaults');
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const materialOptions = ['PLA', 'ABS', 'PETG', 'TPU', 'Wood Fill', 'Metal Fill', 'Carbon Fiber'];
  const timezoneOptions = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ];

  const { notifications, workflowPreferences, availability, accountSecurity } = settings;

  // Show loading skeleton on initial load
  if (isInitialLoading) {
    return (
      <>
        {/* Header */}
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-0 text-gray-900 dark:text-white">Settings</h5>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage notifications, workflow preferences, and account settings</p>
          </div>

          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              <Link
                to="/maker"
                className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500 text-gray-700 dark:text-gray-300"
              >
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                  home
                </i>
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-gray-700 dark:text-gray-300">
              Maker
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-gray-700 dark:text-gray-300">
              Settings
            </li>
          </ol>
        </div>

        {/* Loading State */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300">
          <div className="flex items-center">
            <i className="material-symbols-outlined mr-2">check_circle</i>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h6>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, job history, and earnings.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  showSuccessToast('Account deletion request submitted');
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-lg font-semibold text-yellow-400">Deactivate Account</h6>
              <button
                onClick={() => {
                  setDeactivateConfirmText('');
                  setShowDeactivateModal(false);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-300">
                Deactivating your account will hide your profile and pause all job notifications. You can reactivate your account at any time.
              </p>
            </div>

            {/* Confirmation Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type "DEACTIVATE" to confirm
              </label>
              <input
                type="text"
                value={deactivateConfirmText}
                onChange={(e) => setDeactivateConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deactivateConfirmText === 'DEACTIVATE') {
                    setDeactivateConfirmText('');
                    setShowDeactivateModal(false);
                    showSuccessToast('Account deactivated successfully');
                  } else {
                    showSuccessToast('Please type "DEACTIVATE" to confirm');
                  }
                }}
                disabled={deactivateConfirmText !== 'DEACTIVATE'}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  deactivateConfirmText === 'DEACTIVATE' 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Deactivate Account
              </button>
              <button
                onClick={() => {
                  setDeactivateConfirmText('');
                  setShowDeactivateModal(false);
                }}
                className="flex-1 border border-gray-600 text-gray-300 hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0 text-gray-900 dark:text-white">Settings</h5>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage notifications, workflow preferences, and account settings</p>
        </div>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/maker"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500 text-gray-700 dark:text-gray-300"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-gray-700 dark:text-gray-300">
            Maker
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-gray-700 dark:text-gray-300">
            Settings
          </li>
        </ol>
      </div>

      <div className="space-y-6">
        {/* 1. Notifications */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notifications</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure how and when you want to receive notifications</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Email
              </label>
              <input
                type="email"
                value={notifications.email}
                onChange={(e) => updateSettings('notifications', { email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">In-App Notifications</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications within the app</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.inAppNotifications}
                    onChange={(e) => updateSettings('notifications', { inAppNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Jobs Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-6">
                <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <i className="material-symbols-outlined text-primary-500 mr-2 text-lg">work</i>
                  Jobs
                </h6>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New job assigned to you</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when a new job is assigned to you</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.newJobAssigned}
                        onChange={(e) => updateSettings('notifications', { newJobAssigned: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job due within 48 hours</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive alerts for jobs due within 48 hours</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.jobDueSoon}
                        onChange={(e) => updateSettings('notifications', { jobDueSoon: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job overdue / SLA risk</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when a job is overdue or at SLA risk</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.jobOverdue}
                        onChange={(e) => updateSettings('notifications', { jobOverdue: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job marked blocked (by you or system)</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Notifications when jobs are marked as blocked</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.jobMarkedBlocked}
                        onChange={(e) => updateSettings('notifications', { jobMarkedBlocked: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status change confirmations</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Confirmations when job status changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.statusChangeConfirmations}
                        onChange={(e) => updateSettings('notifications', { statusChangeConfirmations: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quality Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <i className="material-symbols-outlined text-primary-500 mr-2 text-lg">verified</i>
                  Quality
                </h6>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">QC photos required</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when quality control photos are required</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.qcPhotosRequired}
                        onChange={(e) => updateSettings('notifications', { qcPhotosRequired: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reprint requested</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Notifications when a reprint is requested</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.reprintRequested}
                        onChange={(e) => updateSettings('notifications', { reprintRequested: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issue/ticket updates</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Updates on issues and support tickets</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.issueTicketUpdates}
                        onChange={(e) => updateSettings('notifications', { issueTicketUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Finance Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <i className="material-symbols-outlined text-primary-500 mr-2 text-lg">payments</i>
                  Finance
                </h6>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payout scheduled</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when a payout is scheduled</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.payoutScheduled}
                        onChange={(e) => updateSettings('notifications', { payoutScheduled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payout processed</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Notifications when payouts have been processed</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.payoutProcessed}
                        onChange={(e) => updateSettings('notifications', { payoutProcessed: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adjustment applied</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Notifications when payment adjustments are applied</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.adjustmentApplied}
                        onChange={(e) => updateSettings('notifications', { adjustmentApplied: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Changes Button for Notifications */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  showSuccessToast('Notification settings saved successfully');
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="material-symbols-outlined text-sm">save</i>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* 2. Workflow Preferences */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Workflow Preferences</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure your workflow automation and job handling preferences</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Concurrent Jobs
                </label>
                <input
                  type="number"
                  value={workflowPreferences.maxConcurrentJobs}
                  onChange={(e) => updateSettings('workflowPreferences', { maxConcurrentJobs: Number(e.target.value) })}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum jobs you can handle simultaneously</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Lead Time (days)
                </label>
                <input
                  type="number"
                  value={workflowPreferences.defaultLeadTime}
                  onChange={(e) => updateSettings('workflowPreferences', { defaultLeadTime: Number(e.target.value) })}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your standard turnaround time</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Materials
              </label>
              <div className="flex flex-wrap gap-2">
                {materialOptions.map(material => (
                  <label key={material} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={workflowPreferences.preferredMaterials.includes(material)}
                      onChange={(e) => {
                        const materials = e.target.checked
                          ? [...workflowPreferences.preferredMaterials, material]
                          : workflowPreferences.preferredMaterials.filter(m => m !== material);
                        updateSettings('workflowPreferences', { preferredMaterials: materials });
                      }}
                      className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-accept Jobs</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Automatically accept jobs that match your criteria</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowPreferences.autoAcceptJobs}
                    onChange={(e) => updateSettings('workflowPreferences', { autoAcceptJobs: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Approval for Rush Jobs</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manual approval required for jobs with tight deadlines</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowPreferences.requireApprovalForRushJobs}
                    onChange={(e) => updateSettings('workflowPreferences', { requireApprovalForRushJobs: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality Check Required</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Add quality inspection step before shipping</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowPreferences.qualityCheckRequired}
                    onChange={(e) => updateSettings('workflowPreferences', { qualityCheckRequired: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* New Workflow Settings */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <i className="material-symbols-outlined text-primary-500 mr-2 text-lg">settings</i>
                  Workflow Automation
                </h6>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Jobs View</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Choose the default view for your jobs list</p>
                    </div>
                    <select
                      value={workflowPreferences.defaultJobsView}
                      onChange={(e) => updateSettings('workflowPreferences', { defaultJobsView: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="table">Table</option>
                      <option value="compact-list">Compact List</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Jobs Filter</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Set the default filter for your jobs</p>
                    </div>
                    <select
                      value={workflowPreferences.defaultJobsFilter}
                      onChange={(e) => updateSettings('workflowPreferences', { defaultJobsFilter: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="due-soon">Due Soon</option>
                      <option value="all">All</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-sort jobs by due date</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Automatically sort jobs by their due date</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workflowPreferences.autoSortJobsByDueDate}
                        onChange={(e) => updateSettings('workflowPreferences', { autoSortJobsByDueDate: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Require checklist completion before allowing "Mark Shipped"</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ensure checklist is completed before marking job as shipped</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workflowPreferences.requireChecklistCompletion}
                        onChange={(e) => updateSettings('workflowPreferences', { requireChecklistCompletion: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Require QC photos when job flag is set</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mandatory QC photos when quality flag is enabled</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workflowPreferences.requireQcPhotos}
                        onChange={(e) => updateSettings('workflowPreferences', { requireQcPhotos: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-open last viewed job on return</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Automatically open the last viewed job when returning to dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workflowPreferences.autoOpenLastViewedJob}
                        onChange={(e) => updateSettings('workflowPreferences', { autoOpenLastViewedJob: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Changes Button for Workflow Preferences */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  showSuccessToast('Workflow preferences saved successfully');
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="material-symbols-outlined text-sm">save</i>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* 3. Availability & Quiet Hours */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Availability & Quiet Hours</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your availability status and quiet hours for notifications</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Used for job recommendations and notifications timing.</p>
          </div>

          <div className="space-y-6">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Accept new jobs</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Master toggle to accept or pause new job requests</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.isAvailable}
                  onChange={(e) => updateSettings('availability', { isAvailable: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Working Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex flex-col items-center">
                    <input
                      type="checkbox"
                      checked={availability.workingDays.includes(day)}
                      onChange={(e) => {
                        const days = e.target.checked
                          ? [...availability.workingDays, day]
                          : availability.workingDays.filter(d => d !== day);
                        updateSettings('availability', { workingDays: days });
                      }}
                      className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 mb-1"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                      {day.slice(0, 3)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Working Hours Start
                </label>
                <select
                  value={availability.workingHoursStart}
                  onChange={(e) => updateSettings('availability', { workingHoursStart: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={`${hour}:00`} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Working Hours End
                </label>
                <select
                  value={availability.workingHoursEnd}
                  onChange={(e) => updateSettings('availability', { workingHoursEnd: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={`${hour}:00`} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Quiet Hours Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Quiet Hours</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Disable notifications during specific hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.quietHoursEnabled}
                  onChange={(e) => updateSettings('availability', { quietHoursEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Quiet Hours Time Range - Only show when enabled */}
            {availability.quietHoursEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-600">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quiet Hours Start
                  </label>
                  <select
                    value={availability.quietHoursStart}
                    onChange={(e) => updateSettings('availability', { quietHoursStart: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <option key={`${hour}:00`} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quiet Hours End
                  </label>
                  <select
                    value={availability.quietHoursEnd}
                    onChange={(e) => updateSettings('availability', { quietHoursEnd: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <option key={`${hour}:00`} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={availability.timezone}
                  onChange={(e) => updateSettings('availability', { timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {timezoneOptions.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Daily Jobs
                </label>
                <input
                  type="number"
                  value={availability.maxDailyJobs}
                  onChange={(e) => updateSettings('availability', { maxDailyJobs: Number(e.target.value) })}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Vacation Mode */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vacation Mode</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Temporarily pause all job requests</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.vacationMode}
                  onChange={(e) => updateSettings('availability', { vacationMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Save Changes Button for Availability */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  showSuccessToast('Availability settings saved successfully');
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="material-symbols-outlined text-sm">save</i>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* 4. Account & Security */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account & Security</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account information and security settings</p>
          </div>

          <div className="space-y-6">
            {/* Basic Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={accountSecurity.displayName}
                  onChange={(e) => updateSettings('accountSecurity', { displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={accountSecurity.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contact support to change your email address</p>
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <i className="material-symbols-outlined text-primary-500 mr-2 text-lg">lock</i>
                Password & Authentication
              </h6>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: December 15, 2025</p>
                  </div>
                  <button
                    onClick={() => {
                      showSuccessToast('Change password feature coming soon');
                    }}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accountSecurity.twoFactorEnabled}
                      onChange={(e) => {
                        updateSettings('accountSecurity', { twoFactorEnabled: e.target.checked });
                        showSuccessToast(e.target.checked ? '2FA setup feature coming soon' : '2FA disabled (placeholder)');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Device Sessions */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <i className="material-symbols-outlined text-primary-500 mr-2 text-lg">devices</i>
                Active Sessions
              </h6>
              <div className="space-y-3">
                {/* Current Session */}
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">computer</i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Chrome on macOS</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Current session • Last active: Now</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                    Current
                  </span>
                </div>

                {/* Previous Sessions */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <i className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">phone_iphone</i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Safari on iPhone</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Last active: December 20, 2025 at 3:42 PM</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      showSuccessToast('Session management feature coming soon');
                    }}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
                    Revoke
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <i className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">computer</i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Firefox on Windows</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Last active: December 19, 2025 at 11:28 AM</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      showSuccessToast('Session management feature coming soon');
                    }}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={accountSecurity.phone}
                    onChange={(e) => updateSettings('accountSecurity', { phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={accountSecurity.profileVisibility}
                    onChange={(e) => updateSettings('accountSecurity', { profileVisibility: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="buyers-only">Buyers Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Changes Button for Account & Security */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  showSuccessToast('Account settings saved successfully');
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="material-symbols-outlined text-sm">save</i>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* 5. Danger Zone */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-red-200 dark:border-red-800 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Irreversible and destructive actions</p>
          </div>

          <div className="space-y-4">
            {/* Deactivate Account */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h6 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Deactivate Maker Account</h6>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    Temporarily disable your maker account. You can reactivate it anytime.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDeactivateConfirmText('');
                    setShowDeactivateModal(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4 flex-shrink-0"
                >
                  Deactivate Account
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h6 className="text-sm font-medium text-red-800 dark:text-red-300">Delete Account</h6>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                    Permanently remove your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4 flex-shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save/Reset Button */}
        <div className="flex justify-between pt-6">
          <button
            onClick={handleResetSettings}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="material-symbols-outlined text-sm">refresh</i>
            Reset to Defaults
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <i className="material-symbols-outlined text-sm">save</i>
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default MakerSettings;
