import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import {
  defaultDesignerProfile,
  loadDesignerProfile,
  saveDesignerProfile
} from '../../features/designerProfile/mockDesignerProfile';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  link?: string;
  thumbnail: string; // Add missing property
  featured: boolean; // Add missing property
}

interface RatesLicensing {
  turnaroundTime: string;
  baseDesignRate: string;
  rushFeePercentage: string;
  licensingPreference: string;
  defaultRoyaltyRate: string;
}

const Portfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [ratesLicensing, setRatesLicensing] = useState<RatesLicensing>({
    turnaroundTime: '3-5 days',
    baseDesignRate: '',
    rushFeePercentage: '',
    licensingPreference: 'Both',
    defaultRoyaltyRate: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    link: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Branding',
    'Photography',
    'Marketing',
    'Other'
  ];

  const turnaroundOptions = [
    '2-3 days',
    '3-5 days',
    '1-2 weeks'
  ];

  const licensingOptions = [
    'Per-print royalty',
    'Flat fee per design',
    'Both'
  ];

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await loadDesignerProfile();
        setPortfolioItems(profile.portfolioItems);
        setRatesLicensing(profile.ratesLicensing);
      } catch (error) {
        console.error('Failed to load designer profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveDesignerProfile({
        portfolioItems,
        ratesLicensing
      });
    } catch (error) {
      console.error('Failed to save designer profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This will remove all your portfolio items and reset rates.')) {
      setPortfolioItems(defaultDesignerProfile.portfolioItems);
      setRatesLicensing(defaultDesignerProfile.ratesLicensing);
    }
  };

  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        description: item.description,
        image: item.image || '',
        link: item.link || ''
      });
      setImagePreview(item.image || '');
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        image: '',
        link: ''
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      image: '',
      link: ''
    });
    setImagePreview('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.category || !formData.description.trim()) {
      return;
    }

    if (editingItem) {
      // Update existing item
      setPortfolioItems(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData, image: formData.image || undefined, link: formData.link || undefined }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        image: formData.image || undefined,
        link: formData.link || undefined,
        thumbnail: '', // Add default value
        featured: false // Add default value
      };
      setPortfolioItems(prev => [...prev, newItem]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      setPortfolioItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleRatesChange = (field: keyof RatesLicensing, value: string) => {
    setRatesLicensing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Rates & Licensing Skeleton */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Skeleton */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 dark:bg-[#15203c] rounded-lg p-4">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {/* Save/Reset Actions Bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-[#0c1427] rounded-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Designer Profile</h3>
          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            Auto-saved locally
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <i className="ri-refresh-line mr-2"></i>
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 rounded-md transition-colors"
          >
            {isSaving ? (
              <>
                <i className="ri-loader-4-line mr-2 animate-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="ri-save-line mr-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rates & Licensing Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-6">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0 text-xl font-semibold text-gray-900 dark:text-white">Rates & Licensing</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set your default rates and licensing preferences</p>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Typical Turnaround */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Typical Turnaround
              </label>
              <select
                value={ratesLicensing.turnaroundTime}
                onChange={(e) => handleRatesChange('turnaroundTime', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {turnaroundOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Design Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Design Rate (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ratesLicensing.baseDesignRate}
                  onChange={(e) => handleRatesChange('baseDesignRate', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Rush Fee % */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rush Fee % (optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={ratesLicensing.rushFeePercentage}
                  onChange={(e) => handleRatesChange('rushFeePercentage', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Licensing Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Licensing Preference
              </label>
              <select
                value={ratesLicensing.licensingPreference}
                onChange={(e) => handleRatesChange('licensingPreference', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {licensingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Royalty Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Royalty Rate (per print) (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ratesLicensing.defaultRoyaltyRate}
                  onChange={(e) => handleRatesChange('defaultRoyaltyRate', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <i className="ri-information-line text-blue-500 dark:text-blue-400 mt-0.5 mr-2"></i>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                These are defaults and can be overridden per request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 text-xl font-semibold text-gray-900 dark:text-white">Portfolio</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio items</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400"
          >
            <i className="ri-add-line mr-2"></i>
            Add Portfolio Item
          </button>
        </div>

        <div className="trezo-card-content">
          {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <i className="ri-folder-open-line text-4xl"></i>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No portfolio items yet</p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md"
              >
                <i className="ri-add-line mr-2"></i>
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-[#15203c] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {item.image && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                        {item.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                          title="Edit"
                        >
                          <i className="ri-edit-line text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        View Project
                        <i className="ri-external-link-line ml-1"></i>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of the project"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-500 file:text-white hover:file:bg-primary-400"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <i className="ri-close-line text-sm"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Link
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-400 rounded-md transition-colors"
                  >
                    {editingItem ? 'Update' : 'Create'} Portfolio Item
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Portfolio;
