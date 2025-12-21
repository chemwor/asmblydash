import type { Job } from '../makerJobs/mockJobs';

// Blackout date interface
export interface BlackoutDate {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

// Filter interface
export interface CalendarFilters {
  statusFilter: string;
  priorityFilter: string;
  searchQuery: string;
}

// Calendar event interface
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    jobId: string;
    status: string;
    priority: string;
    payout: number;
    qty: number;
  };
}

// KPI counts interface
export interface CalendarCounts {
  dueToday: Job[];
  dueThisWeek: Job[];
  overdue: Job[];
  blocked: Job[];
}

// Mock blackout dates storage (in real app, this would be in state management or backend)
let mockBlackoutDates: BlackoutDate[] = [];

// Get blackout dates
export const getBlackoutDates = (): BlackoutDate[] => {
  return [...mockBlackoutDates];
};

// Add blackout date
export const addBlackoutDate = (entry: Omit<BlackoutDate, 'id'>): BlackoutDate => {
  const newBlackout: BlackoutDate = {
    id: Date.now().toString(),
    startDate: entry.startDate,
    endDate: entry.endDate,
    reason: entry.reason
  };

  mockBlackoutDates.push(newBlackout);
  return newBlackout;
};

// Remove blackout date
export const removeBlackoutDate = (id: string): void => {
  mockBlackoutDates = mockBlackoutDates.filter(blackout => blackout.id !== id);
};

// Helper function to check if a date is today
const isToday = (dateString: string, today: Date = new Date('2025-12-20')) => {
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
};

// Helper function to check if a date is within this week
const isThisWeek = (dateString: string, today: Date = new Date('2025-12-20')) => {
  const date = new Date(dateString);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)

  return date >= startOfWeek && date <= endOfWeek;
};

// Helper function to check if a date is overdue
const isOverdue = (dateString: string, status: string, today: Date = new Date('2025-12-20')) => {
  const date = new Date(dateString);
  return date < today && !['Delivered', 'Shipped'].includes(status);
};

// Apply filters to jobs
const applyFilters = (jobs: Job[], filters: CalendarFilters): Job[] => {
  return jobs.filter(job => {
    // Status filter
    if (filters.statusFilter === 'Active' && ['Delivered', 'Shipped'].includes(job.status)) return false;
    if (filters.statusFilter === 'Blocked' && job.status !== 'Blocked') return false;
    if (filters.statusFilter === 'Shipped' && job.status !== 'Shipped') return false;
    if (filters.statusFilter === 'Completed' && !['Delivered', 'Shipped'].includes(job.status)) return false;

    // Priority filter
    if (filters.priorityFilter !== 'All' && job.priority !== filters.priorityFilter) return false;

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const matchesId = job.id.toLowerCase().includes(query);
      const matchesProduct = job.product.toLowerCase().includes(query);
      if (!matchesId && !matchesProduct) return false;
    }

    return true;
  });
};

// Compute KPI counts from jobs data
export const computeCounts = (jobs: Job[]): CalendarCounts => {
  const dueToday = jobs.filter(job =>
    isToday(job.dueDate) && !['Delivered', 'Shipped'].includes(job.status)
  );

  const dueThisWeek = jobs.filter(job =>
    isThisWeek(job.dueDate) && !['Delivered', 'Shipped'].includes(job.status)
  );

  const overdue = jobs.filter(job =>
    isOverdue(job.dueDate, job.status)
  );

  const blocked = jobs.filter(job =>
    job.status === 'Blocked'
  );

  return {
    dueToday,
    dueThisWeek,
    overdue,
    blocked
  };
};

// Convert filtered jobs to calendar events
export const getCalendarEvents = (jobs: Job[], filters: CalendarFilters): CalendarEvent[] => {
  const filteredJobs = applyFilters(jobs, filters);

  return filteredJobs
    .filter(job => !['Delivered', 'Shipped'].includes(job.status))
    .map(job => {
      // Determine event color based on status using Trezo color system
      let backgroundColor = '#3B82F6'; // Default blue
      let borderColor = '#3B82F6';
      const textColor = '#FFFFFF';

      switch (job.status) {
        case 'Printing':
          backgroundColor = '#8B5CF6'; // Purple
          borderColor = '#8B5CF6';
          break;
        case 'QC':
          backgroundColor = '#F59E0B'; // Yellow/Orange
          borderColor = '#F59E0B';
          break;
        case 'Packing':
          backgroundColor = '#10B981'; // Green
          borderColor = '#10B981';
          break;
        case 'Blocked':
          backgroundColor = '#6B7280'; // Gray
          borderColor = '#6B7280';
          break;
        case 'Queued':
          backgroundColor = '#3B82F6'; // Blue
          borderColor = '#3B82F6';
          break;
      }

      // Add priority indicator for Rush jobs
      if (job.priority === 'Rush') {
        backgroundColor = '#EF4444'; // Red for Rush
        borderColor = '#EF4444';
      }

      return {
        id: job.id,
        title: `Job #${job.id} — ${job.product} (${job.priority})`,
        date: job.dueDate,
        backgroundColor,
        borderColor,
        textColor,
        extendedProps: {
          jobId: job.id,
          status: job.status,
          priority: job.priority,
          payout: job.payout,
          qty: job.qty
        }
      };
    });
};

// Get jobs for a specific date
export const getJobsForDate = (jobs: Job[], dateString: string): Job[] => {
  return jobs
    .filter(job =>
      job.dueDate === dateString &&
      !['Delivered', 'Shipped'].includes(job.status)
    )
    .sort((a, b) => {
      // Sort by priority first (Rush first), then by job ID
      if (a.priority === 'Rush' && b.priority !== 'Rush') return -1;
      if (a.priority !== 'Rush' && b.priority === 'Rush') return 1;
      return a.id.localeCompare(b.id);
    });
};
