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

// Default designer profile data
const designerProfileWithData: DesignerProfileData = {
  // Basic profile information
  displayName: 'Alex Chen',
  businessName: 'Creative Design Studio',
  contactEmail: 'alex@creativedesign.com',
  phone: '+1 (555) 123-4567',
  profilePhoto: '/images/profile.jpg',
  bio: 'Passionate designer with 5+ years of experience in logo design, branding, and digital graphics.',
  website: 'https://alexchen.design',

  // Location information
  location: {
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    timezone: 'PST'
  },
  timezone: 'America/Los_Angeles',

  // Professional information
  designCategories: ['Logo Design', 'Branding', 'Print Design'],
  specialtyCategories: ['Tech Startups', 'E-commerce', 'Healthcare'],
  softwareSkills: ['Adobe Illustrator', 'Figma', 'Adobe Photoshop'],
  specialtySkills: ['Brand Identity', 'Logo Animation', 'Icon Design'],
  yearsExperience: 5,
  clientTypes: ['Startups', 'Small Business', 'Enterprise'],

  // Portfolio
  portfolioUrl: 'https://alexchen.design/portfolio',
  portfolioItems: [
    {
      id: '1',
      title: 'Tech Startup Logo',
      category: 'Logo Design',
      description: 'Modern logo design for AI company',
      thumbnail: '/images/portfolio/logo1.jpg',
      featured: true
    },
    {
      id: '2',
      title: 'E-commerce Branding',
      category: 'Branding',
      description: 'Complete brand identity for online retailer',
      thumbnail: '/images/portfolio/brand1.jpg',
      featured: true
    }
  ],

  // Rates and terms
  hourlyRate: 75,
  projectMinimum: 500,
  paymentTerms: 'Net 30',
  rushJobSurcharge: '50%',
  revisionPolicy: 'Up to 3 revisions included',
  maxRevisions: '3',

  // Availability and capacity
  workingHours: {
    start: '09:00',
    end: '17:00'
  },
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  currentlyAvailable: true,
  acceptingProjects: true,
  acceptNewRequests: true,
  currentCapacity: 'Medium',
  maxProjectsPerMonth: '8',
  responseTime: '24 hours',
  availableForRush: true,
  vacationMode: false,
  vacationUntil: '',

  // Social links
  socialLinks: {
    website: 'https://alexchen.design',
    linkedin: 'https://linkedin.com/in/alexchen',
    instagram: 'https://instagram.com/alexchen_design',
    behance: 'https://behance.net/alexchen',
    dribbble: 'https://dribbble.com/alexchen'
  },
  socialMedia: {
    website: 'https://alexchen.design',
    linkedin: 'https://linkedin.com/in/alexchen',
    instagram: 'https://instagram.com/alexchen_design',
    behance: 'https://behance.net/alexchen',
    dribbble: 'https://dribbble.com/alexchen'
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
  const fields = [
    profileData.displayName,
    profileData.businessName,
    profileData.contactEmail,
    profileData.phone,
    profileData.bio,
    profileData.location.city,
    profileData.location.state,
    profileData.location.country
  ];

  const filledFields = fields.filter(field => field && field.trim() !== '').length;
  return Math.round((filledFields / fields.length) * 100);
};

// Aliases for backward compatibility with Portfolio component
export const defaultDesignerProfile = designerProfileWithData;
export const loadDesignerProfile = loadProfile;
export const saveDesignerProfile = saveProfile;
