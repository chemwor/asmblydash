import type { MakerSettingsType } from '../../pages/maker/MakerSettings';

export const defaultMakerSettings: MakerSettingsType = {
  notifications: {
    email: 'maker@example.com',
    inAppNotifications: true,
    // Jobs
    newJobAssigned: true,
    jobDueSoon: true,
    jobOverdue: false,
    jobMarkedBlocked: true,
    statusChangeConfirmations: true,
    // Quality
    qcPhotosRequired: true,
    reprintRequested: false,
    issueTicketUpdates: true,
    // Finance
    payoutScheduled: true,
    payoutProcessed: false,
    adjustmentApplied: true,
  },
  workflowPreferences: {
    autoAcceptJobs: false,
    maxConcurrentJobs: 5,
    defaultLeadTime: 7,
    requireApprovalForRushJobs: true,
    autoQuoteGeneration: false,
    preferredMaterials: ['PLA', 'PETG'],
    qualityCheckRequired: true,
    // New fields
    defaultJobsView: 'table',
    defaultJobsFilter: 'active',
    autoSortJobsByDueDate: true,
    requireChecklistCompletion: true,
    requireQcPhotos: true,
    autoOpenLastViewedJob: false,
  },
  availability: {
    isAvailable: true,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    timezone: 'America/New_York',
    vacationMode: false,
    maxDailyJobs: 3,
  },
  accountSecurity: {
    displayName: 'John Maker',
    email: 'maker@example.com',
    phone: '+1 (555) 123-4567',
    twoFactorEnabled: false,
    sessionTimeout: 30,
    profileVisibility: 'public',
  }
};

export const loadMakerSettings = async (): Promise<MakerSettingsType> => {
  // Simulate API call with random delay between 300-600ms
  const delay = Math.floor(Math.random() * 300) + 300;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Return default settings (in real app, would load from API)
  return { ...defaultMakerSettings };
};

export const saveMakerSettings = async (settings: MakerSettingsType): Promise<void> => {
  // Simulate API call with random delay between 300-600ms
  const delay = Math.floor(Math.random() * 300) + 300;
  await new Promise(resolve => setTimeout(resolve, delay));

  // In real app, would save to API
  console.log('Settings saved:', settings);

  // Return success (toast will be shown by the component)
};
