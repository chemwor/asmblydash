// Portfolio item interface
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  link?: string;
  featured: boolean;
}

// Main designer profile data interface
export interface DesignerProfileData {
  // Basic profile information
  displayName: string;
  businessName: string;
  contactEmail: string;
  phone: string;
  profilePhoto: string;
  bio: string;
  website: string;

  // Location information
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  timezone: string;

  // Professional information
  designCategories: string[];
  specialtyCategories: string[];
  softwareSkills: string[];
  specialtySkills: string[];
  yearsExperience: number;
  clientTypes: string[];

  // Portfolio
  portfolioUrl: string;
  portfolioItems: PortfolioItem[];

  // Rates and terms
  hourlyRate: number;
  projectMinimum: number;
  paymentTerms: string;
  rushJobSurcharge: string;
  revisionPolicy: string;
  maxRevisions: string;

  // Availability and capacity
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  currentlyAvailable: boolean;
  acceptingProjects: boolean;
  acceptNewRequests: boolean;
  currentCapacity: string;
  maxProjectsPerMonth: string;
  responseTime: string;
  availableForRush: boolean;
  vacationMode: boolean;
  vacationUntil: string;

  // Social links
  socialLinks: {
    website: string;
    linkedin: string;
    instagram: string;
    behance: string;
    dribbble: string;
  };
  socialMedia: {
    website: string;
    linkedin: string;
    instagram: string;
    behance: string;
    dribbble: string;
  };
}

// Default profile data
export const defaultProfile: DesignerProfileData = {
  displayName: '',
  businessName: '',
  contactEmail: '',
  phone: '',
  profilePhoto: '',
  bio: '',
  website: '',
  location: {
    city: '',
    state: '',
    country: '',
    timezone: 'UTC'
  },
  timezone: 'UTC',
  designCategories: [],
  specialtyCategories: [],
  softwareSkills: [],
  specialtySkills: [],
  yearsExperience: 0,
  clientTypes: [],
  portfolioUrl: '',
  portfolioItems: [],
  hourlyRate: 0,
  projectMinimum: 0,
  paymentTerms: '',
  rushJobSurcharge: '',
  revisionPolicy: '',
  maxRevisions: '',
  workingHours: {
    start: '',
    end: ''
  },
  workingDays: [],
  currentlyAvailable: true,
  acceptingProjects: true,
  acceptNewRequests: true,
  currentCapacity: '',
  maxProjectsPerMonth: '',
  responseTime: '',
  availableForRush: false,
  vacationMode: false,
  vacationUntil: '',
  socialLinks: {
    website: '',
    linkedin: '',
    instagram: '',
    behance: '',
    dribbble: ''
  },
  socialMedia: {
    website: '',
    linkedin: '',
    instagram: '',
    behance: '',
    dribbble: ''
  }
};

// Mock function to load profile data
export const loadProfile = async (): Promise<DesignerProfileData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Try to load from localStorage or return default
  const savedProfile = localStorage.getItem('designerProfile');
  if (savedProfile) {
    try {
      return JSON.parse(savedProfile);
    } catch (error) {
      console.warn('Failed to parse saved profile, using default');
    }
  }

  return { ...defaultProfile };
};

// Mock function to save profile data
export const saveProfile = async (profileData: DesignerProfileData): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Save to localStorage for persistence
  localStorage.setItem('designerProfile', JSON.stringify(profileData));

  // In a real app, this would make an API call
  console.log('Profile saved successfully');
};

// Function to calculate profile completeness percentage
export const calculateCompleteness = (profileData: DesignerProfileData): number => {
  let completedFields = 0;
  let totalFields = 0;

  // Basic profile fields (weight: 20%)
  const basicFields = [
    profileData.displayName,
    profileData.contactEmail,
    profileData.location.city,
    profileData.bio
  ];
  totalFields += 4;
  completedFields += basicFields.filter(field => field && field.trim() !== '').length;

  // Specialties (weight: 20%)
  totalFields += 2;
  if (profileData.designCategories.length > 0) completedFields += 1;
  if (profileData.softwareSkills.length > 0) completedFields += 1;

  // Portfolio (weight: 20%)
  totalFields += 2;
  if (profileData.portfolioUrl && profileData.portfolioUrl.trim() !== '') completedFields += 1;
  if (profileData.portfolioItems.length > 0) completedFields += 1;

  // Rates (weight: 20%)
  const rateFields = [
    profileData.hourlyRate > 0,
    profileData.projectMinimum > 0,
    profileData.paymentTerms && profileData.paymentTerms.trim() !== ''
  ];
  totalFields += 3;
  completedFields += rateFields.filter(Boolean).length;

  // Availability (weight: 20%)
  totalFields += 2;
  if (profileData.workingHours.start && profileData.workingHours.end) completedFields += 1;
  if (profileData.workingDays.length > 0) completedFields += 1;

  // Calculate percentage
  const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  return Math.min(100, Math.max(0, percentage));
};
