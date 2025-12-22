// Designer Dashboard feature module - centralized mock data and helpers

import type { DesignerRequest } from '../designerRequests/mockDesignerRequests';
import { designerRequests } from '../designerRequests/mockDesignerRequests';

// Export the requests array
export const requests = designerRequests;

// Helper to get all requests
export const getRequests = () => {
  return designerRequests;
};

// Helper to compute KPIs
export const computeKpis = (requests: DesignerRequest[]) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

  // Helper function to calculate days until due date
  const getDaysUntilDue = (dueDate: string): number => {
    const currentDay = new Date();
    const due = new Date(dueDate);
    currentDay.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const timeDiff = due.getTime() - currentDay.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Open Requests (New + In Progress)
  const openRequests = requests.filter(request =>
    request.status === 'New' || request.status === 'In Progress'
  ).length;

  // Due Soon (within 7 days)
  const dueSoon = requests.filter(request => {
    if (request.status === 'Delivered' || request.status === 'Blocked') return false;
    const daysUntilDue = getDaysUntilDue(request.dueDate);
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  }).length;

  // In Review (In Review + Revision Needed status)
  const inReview = requests.filter(request => request.status === 'In Review' || request.status === 'Revision Needed').length;

  // Revision Requests (requests that have revisions > 0)
  const revisionRequests = requests.filter(request => request.revisionCount > 0).length;

  // Approved in last 30 days
  const approved30d = requests.filter(request => {
    if (!request.approvedDate) return false;
    const approvedDate = new Date(request.approvedDate);
    return approvedDate >= thirtyDaysAgo && approvedDate <= today;
  }).length;

  // Calculate total royalties for last 30 days (10% of completed project budgets)
  const royalties30d = requests
    .filter(request => {
      if (!request.completedDate) return false;
      const completedDate = new Date(request.completedDate);
      return completedDate >= thirtyDaysAgo && completedDate <= today;
    })
    .reduce((total, request) => total + (request.budget * 0.10), 0);

  return {
    openRequests,
    dueSoon,
    inReview,
    revisionRequests,
    approved30d,
    royalties30d
  };
};

// Helper to compute pipeline counts
export const computePipelineCounts = (requests: DesignerRequest[]) => {
  const getRequestsByStatus = (status: DesignerRequest['status']) => {
    return requests.filter(request => request.status === status);
  };

  return {
    new: getRequestsByStatus('New').length,
    inProgress: getRequestsByStatus('In Progress').length,
    inReview: getRequestsByStatus('In Review').length,
    revisionNeeded: getRequestsByStatus('Revision Needed').length,
    approved: getRequestsByStatus('Approved').length,
    delivered: getRequestsByStatus('Delivered').length,
    blocked: getRequestsByStatus('Blocked').length
  };
};

// Helper to get action items (reviews, alerts, performance data)
export const getActionItems = (requests: DesignerRequest[]) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of day for comparison

  const twoDaysFromNow = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
  const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

  // Review & Feedback requests
  const reviewFeedbackRequests = requests.filter(request =>
    request.status === 'Revision Needed' ||
    request.status === 'In Review' ||
    request.printabilityIssue ||
    request.missingReference
  ).slice(0, 10); // Limit to 10 items

  // Alerts data
  const overdueRequests = requests.filter(request => {
    const dueDate = new Date(request.dueDate);
    return dueDate < today && request.status !== 'Approved' && request.status !== 'Delivered';
  });

  const dueWithin48h = requests.filter(request => {
    if (request.status === 'Approved' || request.status === 'Delivered' || request.status === 'Blocked') return false;
    const dueDate = new Date(request.dueDate);
    return dueDate >= today && dueDate <= twoDaysFromNow;
  });

  const dueSoon = requests.filter(request => {
    if (request.status === 'Approved' || request.status === 'Delivered' || request.status === 'Blocked') return false;
    const dueDate = new Date(request.dueDate);
    return dueDate >= today && dueDate <= sevenDaysFromNow;
  });

  const blockedRequests = requests.filter(request => request.status === 'Blocked' || request.printabilityIssue || request.missingReference);

  const blockedMissingReference = requests.filter(request =>
    request.missingReference || (request.status === 'Blocked' && request.reviewNotes?.includes('reference'))
  );

  const blockedPrintability = requests.filter(request =>
    request.printabilityIssue || (request.status === 'Blocked' && request.reviewNotes?.includes('printability'))
  );

  // Performance data
  const royalties30d = requests
    .filter(request => {
      if (!request.completedDate) return false;
      const completedDate = new Date(request.completedDate);
      return completedDate >= thirtyDaysAgo && completedDate <= today;
    })
    .reduce((total, request) => total + (request.budget * 0.10), 0);

  const printsCompleted = requests
    .filter(request => request.status === 'Delivered')
    .reduce((total, request, index) => total + Math.floor(Math.random() * 50) + 10, 0); // Random prints per design

  const topDesigns = [
    { name: 'Corporate logo for tech startup', earnings: 450 },
    { name: 'Product packaging design', earnings: 380 },
    { name: 'Mobile app UI redesign', earnings: 320 }
  ];

  // Sorted requests
  const sortedRequests = [...requests].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return {
    reviewFeedbackRequests,
    alertsData: {
      overdue: overdueRequests.length,
      dueWithin48h: dueWithin48h.length,
      dueSoon: dueSoon.length,
      blocked: blockedRequests.length,
      blockedMissingReference: blockedMissingReference.length,
      blockedPrintability: blockedPrintability.length
    },
    performanceData: {
      royalties30d,
      printsCompleted,
      topDesigns
    },
    sortedRequests
  };
};
