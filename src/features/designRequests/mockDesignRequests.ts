// Design Requests feature module - centralized mock data and helpers

export interface DeliverableItem {
  id: string;
  name: string;
  uploadedDate: string;
  uploadDate: string; // Add missing property
  size?: string;
  type: 'source' | 'stl' | 'render' | 'notes';
}

export interface Deliverable {
  type: 'stl' | 'renders' | 'notes' | 'source';
  label: string;
  required: boolean;
  status: 'missing' | 'added';
  items: DeliverableItem[];
}

export interface DesignRequest {
  id: string;
  requestId: string;
  title: string;
  description: string;
  type: 'Logo Design' | '3D Model' | 'UI/UX Design' | 'Product Design' | 'Packaging' | 'Illustration' | 'Other';
  status: 'New' | 'In Progress' | 'In Review' | 'Revision Needed' | 'Approved' | 'Delivered' | 'Blocked';
  priority: 'Normal' | 'High' | 'Rush';
  clientName: string;
  clientEmail: string;
  budget: number;
  dueDate: string;
  createdDate: string;
  updatedDate: string;
  submittedDate?: string;
  approvedDate?: string;
  completedDate?: string;
  revisionCount: number;
  maxRevisions: number;
  files: string[];
  tags: string[];
  statusClass: string;
  priorityClass: string;
  typeClass: string;
  // Review & Feedback flags
  printabilityIssue?: boolean;
  missingReference?: boolean;
  reviewNotes?: string;
  // Deliverables
  deliverables?: Deliverable[];
}

// Helper function to calculate days until due date
const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const timeDiff = due.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

// Helper to create mock request with proper styling classes
const createMockRequest = (requestData: Omit<DesignRequest, 'statusClass' | 'priorityClass' | 'typeClass'>): DesignRequest => {
  return {
    ...requestData,
    statusClass: requestData.status === 'New' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      : requestData.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : requestData.status === 'In Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : requestData.status === 'Revision Needed' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : requestData.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : requestData.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    priorityClass: requestData.priority === 'Rush' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : requestData.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    typeClass: requestData.type === 'Logo Design' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      : requestData.type === '3D Model' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : requestData.type === 'UI/UX Design' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : requestData.type === 'Product Design' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : requestData.type === 'Packaging' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : requestData.type === 'Illustration' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };
};

// Mock design requests data - 25 complete entries with some having review flags
const mockDesignRequests: DesignRequest[] = [
  createMockRequest({
    id: '1',
    requestId: 'DR-2024-001',
    title: 'Logo design for tech startup',
    description: 'Need a modern, clean logo for our AI-powered productivity app.',
    type: 'Logo Design',
    status: 'New',
    priority: 'High',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@techstartup.com',
    budget: 2500,
    dueDate: '2024-12-28',
    createdDate: '2024-12-18',
    updatedDate: '2024-12-21',
    revisionCount: 0,
    maxRevisions: 3,
    files: ['brief.pdf', 'reference-designs.zip'],
    tags: ['logo', 'branding', 'tech', 'startup']
  }),
  createMockRequest({
    id: '2',
    requestId: 'DR-2024-002',
    title: '3D product visualization for furniture',
    description: 'Create photorealistic 3D renders of our new chair collection.',
    type: '3D Model',
    status: 'In Progress',
    priority: 'Normal',
    clientName: 'Michael Chen',
    clientEmail: 'mike@furnitureplus.com',
    budget: 3200,
    dueDate: '2025-01-15',
    createdDate: '2024-12-10',
    updatedDate: '2024-12-20',
    submittedDate: '2024-12-15',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['chair-specs.pdf', 'material-samples.jpg'],
    tags: ['3d-render', 'furniture', 'product-viz']
  }),
  createMockRequest({
    id: '3',
    requestId: 'DR-2024-003',
    title: 'Mobile app UI redesign',
    description: 'Complete redesign of our fitness tracking mobile app.',
    type: 'UI/UX Design',
    status: 'Revision Needed',
    priority: 'High',
    clientName: 'Jessica Martinez',
    clientEmail: 'jessica@fittrackapp.com',
    budget: 4500,
    dueDate: '2024-12-30',
    createdDate: '2024-12-05',
    updatedDate: '2024-12-19',
    submittedDate: '2024-12-17',
    revisionCount: 2,
    maxRevisions: 3,
    files: ['ui-mockups-v2.fig', 'user-flow.pdf'],
    tags: ['mobile-app', 'ui-design', 'ux-design'],
    reviewNotes: 'UI components need better accessibility compliance'
  }),
  createMockRequest({
    id: '4',
    requestId: 'DR-2024-004',
    title: 'Product packaging design',
    description: 'Design packaging for our new organic skincare line.',
    type: 'Packaging',
    status: 'In Review',
    priority: 'Normal',
    clientName: 'David Wilson',
    clientEmail: 'david@organicskin.co',
    budget: 1800,
    dueDate: '2025-01-10',
    createdDate: '2024-11-28',
    updatedDate: '2024-12-16',
    submittedDate: '2024-12-12',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['packaging-final.ai', 'mockups.jpg'],
    tags: ['packaging', 'skincare', 'organic'],
    printabilityIssue: true,
    reviewNotes: 'Color profile may not print correctly on matte finish'
  }),
  createMockRequest({
    id: '5',
    requestId: 'DR-2024-005',
    title: 'Children\'s book illustrations',
    description: 'Need 15 whimsical illustrations for children\'s space book.',
    type: 'Illustration',
    status: 'In Progress',
    priority: 'Normal',
    clientName: 'Emma Thompson',
    clientEmail: 'emma@kidsbookpub.com',
    budget: 2200,
    dueDate: '2025-02-01',
    createdDate: '2024-12-01',
    updatedDate: '2024-12-18',
    submittedDate: '2024-12-10',
    revisionCount: 0,
    maxRevisions: 2,
    files: ['illustration-sketches.pdf', 'character-sheet.ai'],
    tags: ['illustration', 'children', 'book']
  }),
  createMockRequest({
    id: '6',
    requestId: 'DR-2024-006',
    title: 'Corporate identity system',
    description: 'Complete brand identity for consulting firm.',
    type: 'Logo Design',
    status: 'Delivered',
    priority: 'Normal',
    clientName: 'Robert Garcia',
    clientEmail: 'robert@consultpro.biz',
    budget: 3500,
    dueDate: '2024-12-15',
    createdDate: '2024-11-20',
    updatedDate: '2024-12-15',
    submittedDate: '2024-12-10',
    approvedDate: '2024-12-12',
    completedDate: '2024-12-15',
    revisionCount: 2,
    maxRevisions: 3,
    files: ['brand-identity-final.zip', 'style-guide.pdf'],
    tags: ['branding', 'corporate', 'identity']
  }),
  createMockRequest({
    id: '7',
    requestId: 'DR-2024-007',
    title: 'E-commerce website design',
    description: 'Design for handmade crafts marketplace.',
    type: 'UI/UX Design',
    status: 'New',
    priority: 'Rush',
    clientName: 'Lisa Anderson',
    clientEmail: 'lisa@craftmarket.online',
    budget: 5200,
    dueDate: '2024-12-25',
    createdDate: '2024-12-19',
    updatedDate: '2024-12-21',
    revisionCount: 0,
    maxRevisions: 3,
    files: ['project-brief.pdf', 'wireframes-draft.fig'],
    tags: ['ecommerce', 'website', 'crafts']
  }),
  createMockRequest({
    id: '8',
    requestId: 'DR-2024-008',
    title: 'Medical device product design',
    description: 'Industrial design for portable medical monitoring device.',
    type: 'Product Design',
    status: 'In Progress',
    priority: 'High',
    clientName: 'Dr. James Park',
    clientEmail: 'james@medtech-innovations.com',
    budget: 6500,
    dueDate: '2025-01-20',
    createdDate: '2024-11-15',
    updatedDate: '2024-12-20',
    submittedDate: '2024-12-05',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['device-specs.pdf', 'concept-sketches-v1.pdf'],
    tags: ['medical', 'product-design', 'monitoring']
  }),
  createMockRequest({
    id: '9',
    requestId: 'DR-2024-009',
    title: 'Restaurant menu design',
    description: 'Elegant menu design for upscale Italian restaurant.',
    type: 'Other',
    status: 'New',
    priority: 'Normal',
    clientName: 'Antonio Rossi',
    clientEmail: 'antonio@bellaitalia.com',
    budget: 1200,
    dueDate: '2025-01-05',
    createdDate: '2024-12-20',
    updatedDate: '2024-12-21',
    revisionCount: 0,
    maxRevisions: 2,
    files: ['menu-content.docx', 'food-photos.zip'],
    tags: ['menu', 'restaurant', 'print-design']
  }),
  createMockRequest({
    id: '10',
    requestId: 'DR-2024-010',
    title: 'Social media graphics package',
    description: '20 social media templates for fashion brand.',
    type: 'Illustration',
    status: 'In Progress',
    priority: 'High',
    clientName: 'Zoe Parker',
    clientEmail: 'zoe@fashionforward.co',
    budget: 1600,
    dueDate: '2024-12-26',
    createdDate: '2024-12-12',
    updatedDate: '2024-12-20',
    submittedDate: '2024-12-18',
    revisionCount: 0,
    maxRevisions: 2,
    files: ['brand-guidelines.pdf', 'template-mockups.psd'],
    tags: ['social-media', 'fashion', 'templates']
  }),
  createMockRequest({
    id: '11',
    requestId: 'DR-2024-011',
    title: 'E-book cover design',
    description: 'Professional book cover for self-help guide.',
    type: 'Illustration',
    status: 'Blocked',
    priority: 'Normal',
    clientName: 'Rachel Green',
    clientEmail: 'rachel@lifetransformation.com',
    budget: 800,
    dueDate: '2024-12-29',
    createdDate: '2024-12-14',
    updatedDate: '2024-12-19',
    revisionCount: 0,
    maxRevisions: 3,
    files: ['book-outline.pdf', 'author-photo.jpg'],
    tags: ['book-cover', 'self-help', 'publishing'],
    missingReference: true,
    reviewNotes: 'Need high-resolution author photo and book genre references'
  }),
  createMockRequest({
    id: '12',
    requestId: 'DR-2024-012',
    title: 'Black Friday sale banners',
    description: 'Promotional banners for Black Friday sale.',
    type: 'Other',
    status: 'New',
    priority: 'Rush',
    clientName: 'Mark Thompson',
    clientEmail: 'mark@retailmania.com',
    budget: 900,
    dueDate: '2024-12-23',
    createdDate: '2024-12-21',
    updatedDate: '2024-12-21',
    revisionCount: 0,
    maxRevisions: 1,
    files: ['sale-products.csv', 'brand-assets.zip'],
    tags: ['banners', 'promotional', 'retail']
  }),
  createMockRequest({
    id: '13',
    requestId: 'DR-2024-013',
    title: 'Annual report infographics',
    description: 'Infographics for company annual report.',
    type: 'Illustration',
    status: 'New',
    priority: 'Normal',
    clientName: 'Nancy Drew',
    clientEmail: 'nancy@acmeinc.com',
    budget: 1100,
    dueDate: '2025-01-15',
    createdDate: '2024-12-22',
    updatedDate: '2024-12-22',
    revisionCount: 0,
    maxRevisions: 2,
    files: ['data-sources.xlsx', 'branding-guide.pdf'],
    tags: ['infographic', 'data-visualization', 'annual-report']
  }),
  createMockRequest({
    id: '14',
    requestId: 'DR-2024-014',
    title: 'Billboard advertisement',
    description: 'Eye-catching billboard ad for product launch.',
    type: 'Other',
    status: 'In Progress',
    priority: 'High',
    clientName: 'Chris Peterson',
    clientEmail: 'chris@porkproductions.com',
    budget: 3000,
    dueDate: '2025-02-10',
    createdDate: '2024-12-10',
    updatedDate: '2024-12-20',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['product-photos.zip', 'billboard-specs.pdf'],
    tags: ['billboard', 'advertisement', 'marketing']
  }),
  createMockRequest({
    id: '15',
    requestId: 'DR-2024-015',
    title: 'Podcast cover art',
    description: 'Cover art for new podcast series.',
    type: 'Illustration',
    status: 'New',
    priority: 'Normal',
    clientName: 'Joe Stevens',
    clientEmail: 'joe@podcastnetwork.com',
    budget: 700,
    dueDate: '2025-01-20',
    createdDate: '2024-12-15',
    updatedDate: '2024-12-15',
    revisionCount: 0,
    maxRevisions: 3,
    files: ['podcast-outline.pdf', 'logo-ideas.ai'],
    tags: ['podcast', 'cover-art', 'branding']
  }),
  createMockRequest({
    id: '16',
    requestId: 'DR-2024-016',
    title: 'T-shirt graphic design',
    description: 'Graphics for band merchandise T-shirts.',
    type: 'Illustration',
    status: 'In Progress',
    priority: 'High',
    clientName: 'The Rock Band',
    clientEmail: 'merch@therockband.com',
    budget: 1200,
    dueDate: '2025-01-25',
    createdDate: '2024-12-18',
    updatedDate: '2024-12-20',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['band-logo.ai', 'tshirt-mockup.psd'],
    tags: ['tshirt', 'merchandise', 'band']
  }),
  createMockRequest({
    id: '17',
    requestId: 'DR-2024-017',
    title: 'YouTube thumbnail graphics',
    description: 'Eye-catching thumbnails for YouTube videos.',
    type: 'Illustration',
    status: 'New',
    priority: 'Normal',
    clientName: 'Content Creator',
    clientEmail: 'creator@youtube.com',
    budget: 900,
    dueDate: '2025-01-30',
    createdDate: '2024-12-20',
    updatedDate: '2024-12-20',
    revisionCount: 0,
    maxRevisions: 3,
    files: ['video-topics.docx', 'branding-assets.zip'],
    tags: ['youtube', 'thumbnails', 'video-marketing']
  }),
  createMockRequest({
    id: '18',
    requestId: 'DR-2024-018',
    title: 'Email newsletter template',
    description: 'Template for monthly email newsletter.',
    type: 'Other',
    status: 'In Progress',
    priority: 'Normal',
    clientName: 'Electric Motors Inc',
    clientEmail: 'marketing@electricmotors.com',
    budget: 1300,
    dueDate: '2025-02-05',
    createdDate: '2024-12-22',
    updatedDate: '2024-12-22',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['newsletter-content.docx', 'brand-kit.zip'],
    tags: ['email', 'newsletter', 'marketing']
  }),
  createMockRequest({
    id: '19',
    requestId: 'DR-2024-019',
    title: 'Landing page design',
    description: 'High-converting landing page for new service.',
    type: 'UI/UX Design',
    status: 'New',
    priority: 'High',
    clientName: 'Software Corp',
    clientEmail: 'marketing@softwarecorp.com',
    budget: 2000,
    dueDate: '2025-01-15',
    createdDate: '2024-12-10',
    updatedDate: '2024-12-20',
    revisionCount: 0,
    maxRevisions: 3,
    files: ['service-details.pdf'],
    tags: ['landing-page', 'ui-design', 'marketing']
  }),
  createMockRequest({
    id: '20',
    requestId: 'DR-2024-020',
    title: 'Online course graphics',
    description: 'Promotional graphics for new online course.',
    type: 'Illustration',
    status: 'In Progress',
    priority: 'Normal',
    clientName: 'Education Platform',
    clientEmail: 'design@eduplatform.com',
    budget: 1400,
    dueDate: '2025-02-15',
    createdDate: '2024-12-15',
    updatedDate: '2024-12-20',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['course-outline.pdf'],
    tags: ['online-course', 'graphics', 'education']
  }),
  createMockRequest({
    id: '21',
    requestId: 'DR-2024-021',
    title: 'Brand style guide',
    description: 'Comprehensive style guide for brand.',
    type: 'Other',
    status: 'New',
    priority: 'Normal',
    clientName: 'Media Company',
    clientEmail: 'brand@mediacompany.com',
    budget: 2500,
    dueDate: '2025-01-10',
    createdDate: '2024-12-05',
    updatedDate: '2024-12-20',
    revisionCount: 0,
    maxRevisions: 3,
    files: ['existing-brand-assets.zip'],
    tags: ['brand', 'style-guide', 'identity']
  }),
  createMockRequest({
    id: '22',
    requestId: 'DR-2024-022',
    title: 'Product label design',
    description: 'Labels for organic food products line.',
    type: 'Packaging',
    status: 'In Progress',
    priority: 'High',
    clientName: 'Organic Foods',
    clientEmail: 'supplier@organicfoods.com',
    budget: 1800,
    dueDate: '2025-01-20',
    createdDate: '2024-12-10',
    updatedDate: '2024-12-20',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['label-requirements.pdf'],
    tags: ['label', 'packaging', 'organic']
  }),
  createMockRequest({
    id: '23',
    requestId: 'DR-2024-023',
    title: 'Charity event poster',
    description: 'Poster for annual charity gala.',
    type: 'Other',
    status: 'New',
    priority: 'Normal',
    clientName: 'Charity Organization',
    clientEmail: 'events@charityorg.com',
    budget: 900,
    dueDate: '2025-01-05',
    createdDate: '2024-12-20',
    updatedDate: '2024-12-20',
    revisionCount: 0,
    maxRevisions: 2,
    files: ['event-details.docx'],
    tags: ['poster', 'event', 'charity']
  }),
  createMockRequest({
    id: '24',
    requestId: 'DR-2024-024',
    title: 'Merchandise catalog',
    description: 'Catalog design for merchandise range.',
    type: 'Other',
    status: 'In Progress',
    priority: 'High',
    clientName: 'ACME Corporation',
    clientEmail: 'sales@acmecorp.com',
    budget: 3500,
    dueDate: '2025-02-15',
    createdDate: '2024-12-15',
    updatedDate: '2024-12-20',
    revisionCount: 1,
    maxRevisions: 2,
    files: ['product-listing-data.csv'],
    tags: ['catalog', 'merchandise', 'design']
  }),
  createMockRequest({
    id: '25',
    requestId: 'DR-2024-025',
    title: 'Conference booth design',
    description: 'Trade show booth graphics for tech conference.',
    type: 'Other',
    status: 'In Review',
    priority: 'High',
    clientName: 'Tech Innovations',
    clientEmail: 'marketing@techinnovations.com',
    budget: 4200,
    dueDate: '2025-02-28',
    createdDate: '2024-11-15',
    updatedDate: '2024-12-18',
    submittedDate: '2024-12-15',
    revisionCount: 0,
    maxRevisions: 2,
    files: ['booth-dimensions.pdf'],
    tags: ['trade-show', 'booth', 'conference']
  })
];

// KPI calculation helpers - updated for new status names
export const getKPIData = () => {
  const requests = mockDesignRequests;
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

  // Open Requests (New + In Progress)
  const openRequests = requests.filter(r =>
    r.status === 'New' || r.status === 'In Progress'
  ).length;

  // Due Soon (within 7 days)
  const dueSoon = requests.filter(r => {
    if (r.status === 'Delivered' || r.status === 'Blocked') return false;
    const daysUntilDue = getDaysUntilDue(r.dueDate);
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  }).length;

  // In Review (In Review + Revision Needed status)
  const inReview = requests.filter(r => r.status === 'In Review' || r.status === 'Revision Needed').length;

  // Revision Requests (requests that have revisions > 0)
  const revisionRequests = requests.filter(r => r.revisionCount > 0).length;

  // Approved in last 30 days
  const approved30d = requests.filter(r => {
    if (!r.approvedDate) return false;
    const approvedDate = new Date(r.approvedDate);
    return approvedDate >= thirtyDaysAgo && approvedDate <= today;
  }).length;

  // Calculate total royalties for last 30 days (10% of completed project budgets)
  const royalties30d = requests
    .filter(r => {
      if (!r.completedDate) return false;
      const completedDate = new Date(r.completedDate);
      return completedDate >= thirtyDaysAgo && completedDate <= today;
    })
    .reduce((total, r) => total + (r.budget * 0.10), 0);

  return {
    openRequests,
    dueSoon,
    inReview,
    revisionRequests,
    approved30d,
    royalties30d
  };
};

// Helper to get requests by status
export const getRequestsByStatus = (status: DesignRequest['status']) => {
  return mockDesignRequests.filter(request => request.status === status);
};

// Helper to get requests due soon
export const getRequestsDueSoon = (days: number = 7) => {
  return mockDesignRequests.filter(request => {
    if (request.status === 'Delivered' || request.status === 'Blocked') return false;
    const daysUntilDue = getDaysUntilDue(request.dueDate);
    return daysUntilDue <= days && daysUntilDue >= 0;
  });
};

// Helper to get sorted requests (default by due date ascending)
export const getSortedRequests = () => {
  return [...mockDesignRequests].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

// Helper to get requests that need review and feedback
export const getReviewFeedbackRequests = () => {
  return mockDesignRequests.filter(request =>
    request.status === 'Revision Needed' ||
    request.status === 'In Review' ||
    request.printabilityIssue ||
    request.missingReference
  ).slice(0, 10); // Limit to 10 items
};

// Helper to get royalties and performance metrics
export const getRoyaltiesPerformanceData = () => {
  const requests = mockDesignRequests;
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

  // Calculate royalties for last 30 days (10% of completed project budgets)
  const royalties30d = requests
    .filter(r => {
      if (!r.completedDate) return false;
      const completedDate = new Date(r.completedDate);
      return completedDate >= thirtyDaysAgo && completedDate <= today;
    })
    .reduce((total, r) => total + (r.budget * 0.10), 0);

  // Mock total prints completed (based on delivered requests)
  const printsCompleted = requests
    .filter(r => r.status === 'Delivered')
    .reduce((total, _r) => total + Math.floor(Math.random() * 50) + 10, 0); // Random prints per design

  // Mock top 3 designs by earnings
  const topDesigns = [
    { name: 'Corporate logo for tech startup', earnings: 450 },
    { name: 'Product packaging design', earnings: 380 },
    { name: 'Mobile app UI redesign', earnings: 320 }
  ];

  return {
    royalties30d,
    printsCompleted,
    topDesigns
  };
};

// Helper to get alerts data
export const getAlertsData = () => {
  const requests = mockDesignRequests;
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of day for comparison

  const twoDaysFromNow = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
  const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

  // Compute overdue: dueDate < today AND status not Approved/Delivered
  const overdueRequests = requests.filter(r => {
    const dueDate = new Date(r.dueDate);
    return dueDate < today && r.status !== 'Approved' && r.status !== 'Delivered';
  });

  // Compute due within 48h: dueDate within 2 days AND status is active
  const dueWithin48h = requests.filter(r => {
    if (r.status === 'Approved' || r.status === 'Delivered' || r.status === 'Blocked') return false;
    const dueDate = new Date(r.dueDate);
    return dueDate >= today && dueDate <= twoDaysFromNow;
  });

  // Compute due soon: dueDate within 7 days AND status is active
  const dueSoon = requests.filter(r => {
    if (r.status === 'Approved' || r.status === 'Delivered' || r.status === 'Blocked') return false;
    const dueDate = new Date(r.dueDate);
    return dueDate >= today && dueDate <= sevenDaysFromNow;
  });

  // Get blocked requests with specific reasons
  const blockedRequests = requests.filter(r => r.status === 'Blocked');
  const blockedWithMissingRef = blockedRequests.filter(r => r.missingReference);
  const blockedWithPrintability = blockedRequests.filter(r => r.printabilityIssue);

  return {
    overdueRequests,
    dueWithin48h,
    dueSoon,
    blockedRequests,
    blockedWithMissingRef,
    blockedWithPrintability
  };
};

// Helper to create default deliverables based on project type
const createDefaultDeliverables = (projectType: DesignRequest['type']): Deliverable[] => {
  const baseDeliverables: Deliverable[] = [
    {
      type: 'stl',
      label: 'STL file',
      required: true,
      status: 'missing',
      items: []
    },
    {
      type: 'renders',
      label: 'Render previews (images)',
      required: true,
      status: 'missing',
      items: []
    },
    {
      type: 'notes',
      label: 'Assembly/print notes (text)',
      required: true,
      status: 'missing',
      items: []
    },
    {
      type: 'source',
      label: 'Optional: source file (STEP/BLEND)',
      required: false,
      status: 'missing',
      items: []
    }
  ];

  // Customize deliverables based on project type
  if (projectType === '3D Model' || projectType === 'Product Design') {
    return baseDeliverables;
  } else {
    // For non-3D projects, replace STL with final files
    return [
      {
        type: 'stl',
        label: 'Final files',
        required: true,
        status: 'missing',
        items: []
      },
      {
        type: 'renders',
        label: 'Preview images',
        required: true,
        status: 'missing',
        items: []
      },
      {
        type: 'notes',
        label: 'Project notes',
        required: false,
        status: 'missing',
        items: []
      },
      {
        type: 'source',
        label: 'Optional: source files',
        required: false,
        status: 'missing',
        items: []
      }
    ];
  }
};

// Helper to update request deliverables
export const updateRequestDeliverables = (requestId: string, deliverables: Deliverable[]): DesignRequest | null => {
  const requestIndex = mockDesignRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) return null;

  mockDesignRequests[requestIndex] = {
    ...mockDesignRequests[requestIndex],
    deliverables,
    updatedDate: new Date().toISOString().split('T')[0]
  };

  return mockDesignRequests[requestIndex];
};

// Helper to add deliverable item
export const addDeliverableItem = (requestId: string, deliverableType: Deliverable['type'], item: Omit<DeliverableItem, 'id'>): boolean => {
  const request = mockDesignRequests.find(req => req.id === requestId);
  if (!request || !request.deliverables) return false;

  const deliverable = request.deliverables.find(d => d.type === deliverableType);
  if (!deliverable) return false;

  const newItem: DeliverableItem = {
    ...item,
    id: `${requestId}-${deliverableType}-${Date.now()}`
  };

  deliverable.items.push(newItem);
  deliverable.status = 'added';

  return true;
};

// Helper to remove deliverable item
export const removeDeliverableItem = (requestId: string, deliverableType: Deliverable['type'], itemId: string): boolean => {
  const request = mockDesignRequests.find(req => req.id === requestId);
  if (!request || !request.deliverables) return false;

  const deliverable = request.deliverables.find(d => d.type === deliverableType);
  if (!deliverable) return false;

  const itemIndex = deliverable.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return false;

  deliverable.items.splice(itemIndex, 1);
  deliverable.status = deliverable.items.length > 0 ? 'added' : 'missing';

  return true;
};

// Helper to get request with deliverables
export const getRequestWithDeliverables = (requestId: string): DesignRequest | null => {
  const request = mockDesignRequests.find(req => req.id === requestId);
  if (!request) return null;

  // Initialize deliverables if not present
  if (!request.deliverables) {
    request.deliverables = createDefaultDeliverables(request.type);
  }

  return request;
};

// Export the requests array for direct access if needed
export const designRequests = mockDesignRequests;
