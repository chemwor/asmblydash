import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

interface ShopifySettings {
  isConnected: boolean;
  storeUrl: string;
  storeName: string;
  adminEmail: string;
  accessToken: string;
  syncProducts: boolean;
  syncOrders: boolean;
  syncTracking: boolean;
  autoSync: boolean;
  syncInventory: boolean;
  lastSync: string;
}

interface PricingRules {
  targetMargin: number;
  minimumMargin: number;
  platformMarkup: number;
  useRecommendedPricing: boolean;
  rushFee: number;
  autoRepriceOnCostChanges: boolean;
}

interface NotificationSettings {
  notificationEmail: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  newOrderReceived: boolean;
  orderDelayed: boolean;
  orderShipped: boolean;
  newSupportCaseUpdates: boolean;
  reprintDefectFlagged: boolean;
  newProductIdeas: boolean;
  customSTLRequestUpdates: boolean;
  payoutProcessed: boolean;
  paymentFeeChanges: boolean;
}

interface BrandingSettings {
  brandName: string;
  supportEmail: string;
  logoFile: File | null;
  logoPreview: string;
  packagingInsertNote: string;
  returnAddress: string;
  defaultPackingSlipStyle: string;
  requirePhotoProof: boolean;
  allowMaterialSubstitution: boolean;
}

interface AccountSettings {
  displayName: string;
  email: string;
  phone: string;
  timezone: string;
  twoFactorEnabled: boolean;
}

interface SellerSettingsType {
  shopifySettings: ShopifySettings;
  pricingRules: PricingRules;
  notifications: NotificationSettings;
  brandingSettings: BrandingSettings;
  accountSettings: AccountSettings;
}

const SellerSettings: React.FC = () => {
  const [sellerSettings, setSellerSettings] = useState<SellerSettingsType>({
    shopifySettings: {
      isConnected: false,
      storeUrl: '',
      storeName: '',
      adminEmail: '',
      accessToken: '',
      syncProducts: true,
      syncOrders: true,
      syncTracking: true,
      autoSync: true,
      syncInventory: true,
      lastSync: ''
    },
    pricingRules: {
      targetMargin: 20,
      minimumMargin: 15,
      platformMarkup: 25,
      useRecommendedPricing: true,
      rushFee: 10,
      autoRepriceOnCostChanges: true
    },
    notifications: {
      notificationEmail: '',
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      newOrderReceived: true,
      orderDelayed: true,
      orderShipped: true,
      newSupportCaseUpdates: true,
      reprintDefectFlagged: true,
      newProductIdeas: false,
      customSTLRequestUpdates: true,
      payoutProcessed: true,
      paymentFeeChanges: true
    },
    brandingSettings: {
      brandName: '',
      supportEmail: '',
      logoFile: null,
      logoPreview: '',
      packagingInsertNote: '',
      returnAddress: '',
      defaultPackingSlipStyle: 'Minimal',
      requirePhotoProof: false,
      allowMaterialSubstitution: true
    },
    accountSettings: {
      displayName: '',
      email: '',
      phone: '',
      timezone: 'America/New_York',
      twoFactorEnabled: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Helper to update specific setting sections
  const updateSettings = <K extends keyof SellerSettingsType>(
    section: K,
    updates: Partial<SellerSettingsType[K]>
  ) => {
    setSellerSettings(prev => ({
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
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessToast('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showSuccessToast('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShopifyConnect = () => {
    // Simulate connection
    if (sellerSettings.shopifySettings.storeUrl &&
        sellerSettings.shopifySettings.adminEmail &&
        sellerSettings.shopifySettings.accessToken) {

      updateSettings('shopifySettings', {
        isConnected: true,
        storeName: sellerSettings.shopifySettings.storeUrl
          .replace('.myshopify.com', '')
          .replace('https://', '')
          .replace('http://', ''),
        lastSync: new Date().toISOString()
      });

      setShowConnectModal(false);
      showSuccessToast('Shopify store connected successfully');
    }
  };

  const handleShopifyDisconnect = () => {
    updateSettings('shopifySettings', {
      isConnected: false,
      storeUrl: '',
      adminEmail: '',
      accessToken: '',
      storeName: '',
      lastSync: ''
    });

    setShowDisconnectModal(false);
    showSuccessToast('Shopify store disconnected');
  };

  const handleSyncNow = () => {
    updateSettings('shopifySettings', {
      lastSync: new Date().toISOString()
    });
    showSuccessToast('Sync completed successfully');
  };

  const formatLastSync = (timestamp: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const { shopifySettings, pricingRules, notifications, brandingSettings, accountSettings } = sellerSettings;

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

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Connect to Shopify</h6>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shopify Store URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopifySettings.storeUrl}
                  onChange={(e) => updateSettings('shopifySettings', { storeUrl: e.target.value })}
                  placeholder="your-store.myshopify.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={shopifySettings.adminEmail}
                  onChange={(e) => updateSettings('shopifySettings', { adminEmail: e.target.value })}
                  placeholder="admin@yourstore.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Access Token <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={shopifySettings.accessToken}
                  onChange={(e) => updateSettings('shopifySettings', { accessToken: e.target.value })}
                  placeholder="Enter your access token"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleShopifyConnect}
                  disabled={!shopifySettings.storeUrl || !shopifySettings.adminEmail || !shopifySettings.accessToken}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Disconnect Shopify</h6>
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to disconnect your Shopify store? This will stop all automatic syncing of products and orders.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleShopifyDisconnect}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
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
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage integrations, defaults, and notifications</p>
        </div>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/seller"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500 text-gray-700 dark:text-gray-300"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-gray-700 dark:text-gray-300">
            Seller
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-gray-700 dark:text-gray-300">
            Settings
          </li>
        </ol>
      </div>

      <div className="space-y-6">
        {/* 1. Shopify Integration */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Shopify Integration</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connect your Shopify store to sync products and orders automatically</p>
          </div>

          {/* Integration Status Block */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shopifySettings.isConnected 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1.5 ${
                    shopifySettings.isConnected ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  {shopifySettings.isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>

            {shopifySettings.isConnected ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Store:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{shopifySettings.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last sync:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatLastSync(shopifySettings.lastSync)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No Shopify store connected. Connect your store to start syncing products and orders.
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">info</i>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">What does sync do?</p>
                <p>Synchronization automatically imports your Shopify products, updates inventory levels, and creates orders when customers purchase your designs. This keeps your stores in perfect sync.</p>
              </div>
            </div>
          </div>

          {shopifySettings.isConnected ? (
            <div className="space-y-4">
              {/* Sync Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-sync products</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopifySettings.autoSync}
                      onChange={(e) => updateSettings('shopifySettings', { autoSync: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sync inventory levels</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopifySettings.syncInventory}
                      onChange={(e) => updateSettings('shopifySettings', { syncInventory: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
                <button
                  onClick={handleSyncNow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <i className="material-symbols-outlined text-sm">sync</i>
                  Sync Now
                </button>
                <button
                  onClick={() => setShowDisconnectModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4">
              <button
                onClick={() => setShowConnectModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="material-symbols-outlined text-sm">link</i>
                Connect Shopify
              </button>
            </div>
          )}
        </div>

        {/* 2. Default Pricing Rules */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Default Pricing Rules</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Set your default pricing rules for new products from the catalog</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Margin (%)
                </label>
                <input
                  type="number"
                  value={pricingRules.targetMargin}
                  onChange={(e) => updateSettings('pricingRules', { targetMargin: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your desired profit margin percentage</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Margin (%)
                </label>
                <input
                  type="number"
                  value={pricingRules.minimumMargin}
                  onChange={(e) => updateSettings('pricingRules', { minimumMargin: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lowest acceptable profit margin</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform Markup
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useRecommendedPricing"
                      checked={pricingRules.useRecommendedPricing}
                      onChange={(e) => updateSettings('pricingRules', { useRecommendedPricing: e.target.checked })}
                      className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <label htmlFor="useRecommendedPricing" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      Use recommended pricing
                    </label>
                  </div>
                  {!pricingRules.useRecommendedPricing && (
                    <div>
                      <input
                        type="number"
                        value={pricingRules.platformMarkup}
                        onChange={(e) => updateSettings('pricingRules', { platformMarkup: Number(e.target.value) })}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Custom markup %"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Custom platform markup percentage</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rush Fee (%)
                </label>
                <input
                  type="number"
                  value={pricingRules.rushFee}
                  onChange={(e) => updateSettings('pricingRules', { rushFee: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Additional fee for rush orders (optional)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-reprice on cost changes</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Automatically update product prices when costs change</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pricingRules.autoRepriceOnCostChanges}
                    onChange={(e) => updateSettings('pricingRules', { autoRepriceOnCostChanges: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            {/* Summary Line */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4">
              <div className="flex">
                <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 text-sm">info</i>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  These rules apply when adding new products from the catalog.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => updateSettings('pricingRules', {
                  targetMargin: 20,
                  minimumMargin: 15,
                  platformMarkup: 25,
                  useRecommendedPricing: true,
                  rushFee: 10,
                  autoRepriceOnCostChanges: true
                })}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* 3. Notifications */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notifications</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose how you want to receive notifications</p>
          </div>

          <div className="space-y-6">
            {/* Email Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Email
                </label>
                <input
                  type="email"
                  value={notifications.notificationEmail}
                  onChange={(e) => updateSettings('notifications', { notificationEmail: e.target.value })}
                  placeholder="Enter notification email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Quiet Hours */}
            <div>
              <h6 className="text-md font-medium text-gray-900 dark:text-white mb-4">Quiet Hours</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <select
                    value={notifications.quietHoursStart}
                    onChange={(e) => updateSettings('notifications', { quietHoursStart: e.target.value })}
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
                    End Time
                  </label>
                  <select
                    value={notifications.quietHoursEnd}
                    onChange={(e) => updateSettings('notifications', { quietHoursEnd: e.target.value })}
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                No notifications will be sent during these hours
              </p>
            </div>

            {/* Notification Categories */}
            {[
              {
                title: 'Order Notifications',
                items: [
                  { key: 'newOrderReceived', label: 'New order received', description: 'Get notified when you receive new orders' },
                  { key: 'orderDelayed', label: 'Order delayed / SLA risk', description: 'When orders are at risk of missing delivery dates' },
                  { key: 'orderShipped', label: 'Order shipped', description: 'When orders are shipped and tracking is available' }
                ]
              },
              {
                title: 'Support',
                items: [
                  { key: 'newSupportCaseUpdates', label: 'New support case updates', description: 'Updates on your support cases and messages' },
                  { key: 'reprintDefectFlagged', label: 'Reprint/defect flagged', description: 'When quality issues are reported for your products' }
                ]
              },
              {
                title: 'Growth',
                items: [
                  { key: 'newProductIdeas', label: 'New product ideas (weekly)', description: 'Weekly digest of new product opportunities' },
                  { key: 'customSTLRequestUpdates', label: 'Custom STL request updates', description: 'Updates on custom file requests and approvals' }
                ]
              },
              {
                title: 'Finance',
                items: [
                  { key: 'payoutProcessed', label: 'Payout processed', description: 'When your payments are processed and sent' },
                  { key: 'paymentFeeChanges', label: 'Payment/fee changes', description: 'Updates to payment methods or fee structures' }
                ]
              }
            ].map(({ title, items }) => (
              <div key={title}>
                <h6 className="text-md font-medium text-gray-900 dark:text-white mb-4">{title}</h6>
                <div className="space-y-4">
                  {items.map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[key as keyof typeof notifications] as boolean}
                          onChange={(e) => updateSettings('notifications', { [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Account Settings */}
        <div className="bg-white dark:bg-[#0c1427] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account information and security settings</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={accountSettings.displayName}
                  onChange={(e) => updateSettings('accountSettings', { displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) => updateSettings('accountSettings', { email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={accountSettings.phone}
                  onChange={(e) => updateSettings('accountSettings', { phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={accountSettings.timezone}
                  onChange={(e) => updateSettings('accountSettings', { timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="America/New_York">Eastern Time (EST)</option>
                  <option value="America/Chicago">Central Time (CST)</option>
                  <option value="America/Denver">Mountain Time (MST)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <div>
              <h6 className="text-md font-medium text-gray-900 dark:text-white mb-4">Security</h6>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-factor authentication</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accountSettings.twoFactorEnabled}
                      onChange={(e) => updateSettings('accountSettings', { twoFactorEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  Change Password
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Account Settings'}
              </button>
              <button className="border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-2 rounded-lg font-medium transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerSettings;
