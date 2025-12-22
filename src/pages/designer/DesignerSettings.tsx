import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DesignerSettings: React.FC = () => {
  // Local state for all settings
  const [notifications, setNotifications] = useState({
    // Email settings
    notificationEmail: 'designer@example.com',
    inAppEnabled: true,

    // Requests
    newRequestAssigned: true,
    dueSoon7Days: true,
    dueWithin48Hours: true,
    sellerCommented: true,
    statusChangeConfirmations: true,

    // Files
    deliverableRequested: true,
    fileReplacedByOther: false,

    // Royalties
    payoutScheduled: true,
    payoutProcessed: true,
    newSellerUsingDesign: false
  });

  const [workflow, setWorkflow] = useState({
    // Existing fields
    autoAcceptRequests: false,
    requestApprovalRequired: true,
    defaultDeliveryTime: '7',
    fileFormat: 'both',
    revisionLimit: '3',
    autoBackup: true,

    // New fields
    defaultRequestsView: 'table',
    defaultRequestsFilter: 'active',
    autoSortByDueDate: false,
    requireSTLAndRender: true,
    autoCreateDeliveryNote: false
  });

  const [availability, setAvailability] = useState({
    // Working schedule
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    acceptNewRequests: true,

    // Quiet hours
    quietHoursEnabled: false,
    quietStart: '22:00',
    quietEnd: '08:00',

    // Legacy fields
    weekendMode: false,
    vacationMode: false,
    vacationUntil: '',
    timezone: 'UTC-8'
  });

  const [account, setAccount] = useState({
    displayName: 'Alex Chen',
    email: 'alex.chen@example.com',
    twoFactorEnabled: false,
    sessionTimeout: '60',
    dataExportFormat: 'json'
  });

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateConfirmText, setDeactivateConfirmText] = useState('');

  const handleNotificationChange = (key: string, value: boolean | string) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleWorkflowChange = (key: string, value: string | boolean) => {
    setWorkflow(prev => ({ ...prev, [key]: value }));
  };

  const handleAvailabilityChange = (key: string, value: string | boolean | any) => {
    setAvailability(prev => ({ ...prev, [key]: value }));
  };

  const handleWorkingDayChange = (dayKey: string, checked: boolean) => {
    setAvailability(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [dayKey]: checked
      }
    }));
  };

  const handleAccountChange = (key: string, value: string | boolean) => {
    setAccount(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Mock save action
    console.log('Settings saved:', { notifications, workflow, availability, account });
    alert('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      alert('Account deletion request submitted. You will receive an email with further instructions.');
    }
  };

  const handleSaveNotifications = () => {
    // Mock save action for notifications
    console.log('Notification settings saved:', notifications);

    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0';
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="material-symbols-outlined mr-2">check_circle</i>
        Notification settings saved successfully!
      </div>
    `;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleSaveWorkflow = () => {
    // Mock save action for workflow
    console.log('Workflow settings saved:', workflow);

    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0';
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="material-symbols-outlined mr-2">check_circle</i>
        Workflow preferences saved successfully!
      </div>
    `;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleSaveAvailability = () => {
    // Mock save action for availability
    console.log('Availability settings saved:', availability);

    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0';
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="material-symbols-outlined mr-2">check_circle</i>
        Availability settings saved successfully!
      </div>
    `;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };


  const handleConfirmDeactivate = () => {
    if (deactivateConfirmText === 'DEACTIVATE') {
      setShowDeactivateModal(false);
      setDeactivateConfirmText('');

      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0';
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="material-symbols-outlined mr-2">info</i>
          Designer account deactivation initiated. Check your email for next steps.
        </div>
      `;
      document.body.appendChild(toast);

      // Animate in
      setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
      }, 100);

      // Animate out and remove
      setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 5000);
    }
  };

  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
    setDeactivateConfirmText('');
  };

  return (
    <div className="main-content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage notifications, workflow preferences, and account settings
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Save All Changes
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/designer/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <i className="material-symbols-outlined mr-2 text-lg">dashboard</i>
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <i className="material-symbols-outlined text-gray-400 mx-1">chevron_right</i>
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">Settings</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="space-y-6">
        {/* 1. Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure how and when you want to be notified</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveNotifications}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save Changes
              </button>
              <i className="material-symbols-outlined text-gray-400 text-2xl">notifications</i>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email & General Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">General Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notification Email Address
                  </label>
                  <input
                    type="email"
                    value={notifications.notificationEmail}
                    onChange={(e) => handleNotificationChange('notificationEmail', e.target.value)}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This email will receive all notification updates</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">In-App Notifications</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Show notifications within the application interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.inAppEnabled}
                      onChange={(e) => handleNotificationChange('inAppEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Requests Notifications */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <i className="material-symbols-outlined mr-2 text-blue-500">assignment</i>
                Request Notifications
              </h4>
              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">New Request Assigned</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when a new design request is assigned to you</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.newRequestAssigned}
                      onChange={(e) => handleNotificationChange('newRequestAssigned', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Soon (7 Days)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reminder when requests are due within 7 days</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.dueSoon7Days}
                      onChange={(e) => handleNotificationChange('dueSoon7Days', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Within 48 Hours</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Urgent reminder for requests due within 2 days</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.dueWithin48Hours}
                      onChange={(e) => handleNotificationChange('dueWithin48Hours', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Seller Commented / Feedback Received</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when sellers leave comments or feedback</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sellerCommented}
                      onChange={(e) => handleNotificationChange('sellerCommented', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Change Confirmations</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Notifications for submitted, approved, and delivered status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.statusChangeConfirmations}
                      onChange={(e) => handleNotificationChange('statusChangeConfirmations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Files Notifications */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <i className="material-symbols-outlined mr-2 text-green-500">folder</i>
                File Notifications
              </h4>
              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Deliverable Requested / Missing</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when deliverables are requested or reported missing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.deliverableRequested}
                      onChange={(e) => handleNotificationChange('deliverableRequested', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">File Replaced by Someone Else</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Notification when your files are replaced by other team members</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.fileReplacedByOther}
                      onChange={(e) => handleNotificationChange('fileReplacedByOther', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Royalties Notifications */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <i className="material-symbols-outlined mr-2 text-yellow-500">payments</i>
                Royalty Notifications
              </h4>
              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payout Scheduled</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when your payout is scheduled for processing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.payoutScheduled}
                      onChange={(e) => handleNotificationChange('payoutScheduled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payout Processed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Confirmation when your payout has been successfully processed</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.payoutProcessed}
                      onChange={(e) => handleNotificationChange('payoutProcessed', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">New Seller Started Using Your Design</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Optional notification when new sellers adopt your designs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.newSellerUsingDesign}
                      onChange={(e) => handleNotificationChange('newSellerUsingDesign', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workflow Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Preferences</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure how you handle design requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveWorkflow}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save Changes
              </button>
              <i className="material-symbols-outlined text-gray-400 text-2xl">settings</i>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Requests View
                </label>
                <select
                  value={workflow.defaultRequestsView}
                  onChange={(e) => handleWorkflowChange('defaultRequestsView', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="table">Table</option>
                  <option value="compact">Compact list</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Requests Filter
                </label>
                <select
                  value={workflow.defaultRequestsFilter}
                  onChange={(e) => handleWorkflowChange('defaultRequestsFilter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="in-review">In Review</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-sort by Due Date</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Automatically sort requests by due date</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflow.autoSortByDueDate}
                    onChange={(e) => handleWorkflowChange('autoSortByDueDate', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Require STL + Render Before Review</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Require STL file and at least 1 render before "Submit for Review"</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflow.requireSTLAndRender}
                    onChange={(e) => handleWorkflowChange('requireSTLAndRender', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-create Delivery Note</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Automatically create delivery note when marking as Delivered</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflow.autoCreateDeliveryNote}
                    onChange={(e) => handleWorkflowChange('autoCreateDeliveryNote', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Availability & Quiet Hours */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Availability & Quiet Hours</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Used for request assignment and notification timing.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveAvailability}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save Changes
              </button>
              <i className="material-symbols-outlined text-gray-400 text-2xl">schedule</i>
            </div>
          </div>

          <div className="space-y-6">
            {/* Accept New Requests Master Toggle */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Accept New Requests</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Master toggle to control availability for new request assignments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.acceptNewRequests}
                  onChange={(e) => handleAvailabilityChange('acceptNewRequests', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Working Days */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Working Days</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'monday', label: 'Monday' },
                      { key: 'tuesday', label: 'Tuesday' },
                      { key: 'wednesday', label: 'Wednesday' },
                      { key: 'thursday', label: 'Thursday' },
                      { key: 'friday', label: 'Friday' },
                      { key: 'saturday', label: 'Saturday' },
                      { key: 'sunday', label: 'Sunday' }
                    ].map(day => (
                      <div key={day.key} className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={availability.workingDays[day.key as keyof typeof availability.workingDays]}
                            onChange={(e) => handleWorkingDayChange(day.key, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{day.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Working Hours</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Time
                      </label>
                      <select
                        value={availability.workingHoursStart}
                        onChange={(e) => handleAvailabilityChange('workingHoursStart', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Time
                      </label>
                      <select
                        value={availability.workingHoursEnd}
                        onChange={(e) => handleAvailabilityChange('workingHoursEnd', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiet Hours & Settings */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Quiet Hours</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">No notifications during these hours</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={availability.quietHoursEnabled}
                        onChange={(e) => handleAvailabilityChange('quietHoursEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {availability.quietHoursEnabled && (
                    <div className="grid grid-cols-2 gap-3 ml-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={availability.quietStart}
                          onChange={(e) => handleAvailabilityChange('quietStart', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={availability.quietEnd}
                          onChange={(e) => handleAvailabilityChange('quietEnd', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={availability.timezone}
                    onChange={(e) => handleAvailabilityChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC+1">Central Europe (UTC+1)</option>
                  </select>
                </div>

                {/* Legacy Options */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Additional Options</h5>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Vacation Mode</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pause new request notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={availability.vacationMode}
                          onChange={(e) => handleAvailabilityChange('vacationMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {availability.vacationMode && (
                      <div className="ml-4">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Return Date
                        </label>
                        <input
                          type="date"
                          value={availability.vacationUntil}
                          onChange={(e) => handleAvailabilityChange('vacationUntil', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Account & Security */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account & Security</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your account information and security settings</p>
            </div>
            <i className="material-symbols-outlined text-gray-400 text-2xl">security</i>
          </div>

          <div className="space-y-6">
            {/* Account Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Account Information</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={account.displayName}
                    onChange={(e) => handleAccountChange('displayName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={account.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contact support to change your email address</p>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Security Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={account.twoFactorEnabled}
                      onChange={(e) => handleAccountChange('twoFactorEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Update your account password for better security</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Device Sessions */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Active Sessions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">laptop_mac</i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Chrome on macOS</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current session • Last active: Now</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    Current
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">phone_iphone</i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Safari on iPhone</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                    Revoke
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <i className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-lg">desktop_windows</i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Firefox on Windows</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last active: 3 days ago</p>
                    </div>
                  </div>
                  <button className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Privacy Settings</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout
                  </label>
                  <select
                    value={account.sessionTimeout}
                    onChange={(e) => handleAccountChange('sessionTimeout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                    <option value="480">8 hours</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Export Format
                  </label>
                  <select
                    value={account.dataExportFormat}
                    onChange={(e) => handleAccountChange('dataExportFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors">
                  Download My Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Irreversible and destructive actions</p>
            </div>
            <i className="material-symbols-outlined text-red-400 text-2xl">warning</i>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Delete Account</h4>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors ml-4"
                >
                  Delete Account
                </button>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Reset All Settings</h4>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Reset all preferences to default values. This will not affect your account or data.
                  </p>
                </div>
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors ml-4">
                  Reset Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Deactivate Account
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please type <span className="font-medium">DEACTIVATE</span> below to confirm account deactivation.
            </p>
            <div className="mb-4">
              <input
                type="text"
                value={deactivateConfirmText}
                onChange={(e) => setDeactivateConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type DEACTIVATE to confirm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDeactivate}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerSettings;
