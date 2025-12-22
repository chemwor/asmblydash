export interface SellerSettings {
  shopifySettings: {
    isConnected: boolean;
    storeUrl: string;
    apiKey: string;
    adminEmail: string;
    accessToken: string;
    autoSync: boolean;
    syncInventory: boolean;
    syncProducts: boolean;
    syncOrders: boolean;
    syncTracking: boolean;
    storeName: string;
    lastSync: string;
  };

  pricingRules: {
    targetMargin: number;
    minimumMargin: number;
    platformMarkup: number;
    useRecommendedPricing: boolean;
    rushFee: number;
    autoRepriceOnCostChanges: boolean;
    // Legacy fields for backward compatibility
    baseMarkup: number;
    printOnDemandMarkup: number;
    rushOrderSurcharge: number;
    bulkDiscountTier1: number;
    bulkDiscountTier2: number;
    bulkDiscountTier3: number;
  };

  notifications: {
    // Email settings
    notificationEmail: string;
    quietHoursStart: string;
    quietHoursEnd: string;
    // Order notifications
    newOrderReceived: boolean;
    orderDelayed: boolean;
    orderShipped: boolean;
    // Quality/Support notifications
    newSupportCaseUpdates: boolean;
    reprintDefectFlagged: boolean;
    // Catalog/Growth notifications
    newProductIdeas: boolean;
    customSTLRequestUpdates: boolean;
    // Finance notifications
    payoutProcessed: boolean;
    paymentFeeChanges: boolean;
    // Legacy fields for backward compatibility
    emailNewOrders: boolean;
    emailOrderUpdates: boolean;
    emailPayouts: boolean;
    emailSupport: boolean;
    smsUrgentOnly: boolean;
    browserNotifications: boolean;
  };

  brandingSettings: {
    brandName: string;
    supportEmail: string;
    packagingInsertNote: string;
    returnAddress: string;
    defaultPackingSlipStyle: string;
    requirePhotoProof: boolean;
    allowMaterialSubstitution: boolean;
    // Legacy fields for backward compatibility
    businessName: string;
    logo: string;
    logoFile: File | null;
    logoPreview: string;
    primaryColor: string;
    customPackaging: boolean;
    includeBusinessCard: boolean;
  };

  accountSettings: {
    displayName: string;
    email: string;
    phone: string;
    timezone: string;
    language: string;
    twoFactorEnabled: boolean;
  };
}

export const defaultSellerSettings: SellerSettings = {
  shopifySettings: {
    isConnected: false,
    storeUrl: '',
    apiKey: '',
    adminEmail: '',
    accessToken: '',
    autoSync: true,
    syncInventory: true,
    syncProducts: true,
    syncOrders: true,
    syncTracking: true,
    storeName: 'Your Design Store',
    lastSync: '2025-12-20T10:30:00Z'
  },

  pricingRules: {
    targetMargin: 20,
    minimumMargin: 15,
    platformMarkup: 25,
    useRecommendedPricing: false,
    rushFee: 10,
    autoRepriceOnCostChanges: true,
    // Legacy fields for backward compatibility
    baseMarkup: 25,
    printOnDemandMarkup: 30,
    rushOrderSurcharge: 15,
    bulkDiscountTier1: 10,
    bulkDiscountTier2: 15,
    bulkDiscountTier3: 20
  },

  notifications: {
    // Email settings
    notificationEmail: 'john@designstudio.com',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    // Order notifications
    newOrderReceived: true,
    orderDelayed: true,
    orderShipped: true,
    // Quality/Support notifications
    newSupportCaseUpdates: true,
    reprintDefectFlagged: true,
    // Catalog/Growth notifications
    newProductIdeas: true,
    customSTLRequestUpdates: true,
    // Finance notifications
    payoutProcessed: true,
    paymentFeeChanges: true,
    // Legacy fields for backward compatibility
    emailNewOrders: true,
    emailOrderUpdates: true,
    emailPayouts: true,
    emailSupport: true,
    smsUrgentOnly: false,
    browserNotifications: true
  },

  brandingSettings: {
    brandName: 'Your Design Studio',
    supportEmail: 'support@yourdesignstudio.com',
    packagingInsertNote: '',
    returnAddress: '',
    defaultPackingSlipStyle: 'Minimal',
    requirePhotoProof: true,
    allowMaterialSubstitution: false,
    // Legacy fields for backward compatibility
    businessName: 'Your Design Studio',
    logo: '',
    logoFile: null,
    logoPreview: '',
    primaryColor: '#6366f1',
    customPackaging: false,
    includeBusinessCard: false
  },

  accountSettings: {
    displayName: 'John Designer',
    email: 'john@designstudio.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    language: 'en',
    twoFactorEnabled: false
  }
};

export const loadSellerSettings = async (): Promise<SellerSettings> => {
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 300));

  // Return copy of default settings
  return JSON.parse(JSON.stringify(defaultSellerSettings));
};

export const saveSellerSettings = async (settings: SellerSettings): Promise<void> => {
  // Simulate save delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 300));

  // Mock async save operation - no actual persistence
  console.log('Settings saved (mock):', settings);
};

