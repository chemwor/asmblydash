// Mock persistence module for maker profile
export interface ProfileData {
  // Basic Profile section
  displayName: string;
  workshopName: string;
  location: {
    city: string;
    state: string;
  };
  serviceRegion: string;
  timezone: string;
  contactEmail: string;
  acceptNewJobs: boolean;

  // Profile section
  businessName: string;
  phone: string;
  address: string;
  zipCode: string;
  yearsExperience: string;
  specialties: string[];

  // Machines section
  machines: {
    id: string;
    printerModel: string;
    buildVolume: {
      x: string;
      y: string;
      z: string;
    };
    nozzleSize: string;
    printTechnologies: string[];
    notes: string;
  }[];

  // Materials & Colors section
  materials: string[];
  availableColors: string[];
  canSourceCustomColors: boolean;
  exoticMaterials: string[];

  // Lead times section
  standardLeadTime: string;
  rushLeadTime: string;
  maxConcurrentJobs: string;
  typicalTurnaround: string;
  maxJobsPerDay: string;
  acceptRushJobs: boolean;
  rushSurchargePercentage: string;
  weekendPrinting: boolean;

  // Shipping section
  shippingMethods: string[];
  localDelivery: boolean;
  shippingZones: string[];

  // Payouts completed (computed)
  payoutsConfigured: boolean;
}

export const defaultProfile: ProfileData = {
  // Basic Profile section - some fields filled, some empty
  displayName: "John Doe",
  workshopName: "Doe's Workshop",
  location: {
    city: "Austin",
    state: "TX"
  },
  serviceRegion: "Texas",
  timezone: "Central Time (US & Canada)",
  contactEmail: "john@doe.com",
  acceptNewJobs: true,

  // Profile section - some fields filled, some empty
  businessName: "MakerSpace Pro",
  phone: "",
  address: "123 Innovation Ave",
  zipCode: "78701",
  yearsExperience: "5",
  specialties: ["Prototyping", "Small Batch Production"],

  // Machines section - one machine configured
  machines: [
    {
      id: "1",
      printerModel: "Production Printer #1",
      buildVolume: {
        x: "250",
        y: "210",
        z: "200"
      },
      nozzleSize: "0.4",
      printTechnologies: ["FDM"],
      notes: ""
    }
  ],

  // Materials - partially filled
  materials: ["PLA", "PETG", "ABS"],
  availableColors: ["Red", "Blue", "Green"],
  canSourceCustomColors: true,
  exoticMaterials: ["Carbon Fiber", "NylonX"],

  // Lead times - filled
  standardLeadTime: "5-7",
  rushLeadTime: "2-3",
  maxConcurrentJobs: "8",
  typicalTurnaround: "3-5",
  maxJobsPerDay: "10",
  acceptRushJobs: true,
  rushSurchargePercentage: "20",
  weekendPrinting: false,

  // Shipping - partially filled
  shippingMethods: ["USPS Priority", "UPS Ground"],
  localDelivery: true,
  shippingZones: ["Texas", "Southwest US"],

  // Payouts - configured
  payoutsConfigured: true
};

// Mock async load function with random delay
export const loadProfile = async (): Promise<ProfileData> => {
  const delay = Math.floor(Math.random() * 300) + 300; // 300-600ms

  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would fetch from an API
      const savedProfile = localStorage.getItem('makerProfile');
      if (savedProfile) {
        resolve(JSON.parse(savedProfile));
      } else {
        resolve({ ...defaultProfile });
      }
    }, delay);
  });
};

// Mock async save function with toast notification
export const saveProfile = async (profile: ProfileData): Promise<void> => {
  const delay = Math.floor(Math.random() * 300) + 300; // 300-600ms

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // In a real app, this would save to an API
        localStorage.setItem('makerProfile', JSON.stringify(profile));

        // Show success toast
        showToast('Profile saved successfully!', 'success');
        resolve();
      } catch (error) {
        // Show error toast
        showToast('Failed to save profile. Please try again.', 'error');
        reject(error);
      }
    }, delay);
  });
};

// Simple toast function (mock implementation)
const showToast = (message: string, type: 'success' | 'error') => {
  // In a real app, this would use a proper toast library
  console.log(`${type.toUpperCase()}: ${message}`);

  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};
