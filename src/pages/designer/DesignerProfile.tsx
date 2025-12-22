import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { DesignerProfileData } from "../../features/designerProfile/mockDesignerProfile";
import { loadProfile, saveProfile, defaultProfile, calculateCompleteness } from "../../features/designerProfile/mockDesignerProfile";

const DesignerProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<DesignerProfileData>(defaultProfile);
  const [originalProfileData, setOriginalProfileData] = useState<DesignerProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Portfolio modal state
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: '',
    description: '',
    thumbnail: '',
    link: ''
  });

  // Load profile on mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const profile = await loadProfile();
        setProfileData(profile);
        setOriginalProfileData(profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setProfileData(defaultProfile);
        setOriginalProfileData(defaultProfile);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Track changes to enable/disable save button
  useEffect(() => {
    const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalProfileData);
    setHasUnsavedChanges(hasChanges);
  }, [profileData, originalProfileData]);

  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveProfile(profileData);
      setOriginalProfileData({ ...profileData });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setProfileData({ ...originalProfileData });
    setHasUnsavedChanges(false);
  };

  // Update profile field
  const updateProfile = (field: keyof DesignerProfileData, value: string | boolean | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update nested profile field
  const updateNestedProfile = (section: keyof DesignerProfileData, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, string>),
        [field]: value
      }
    }));
  };

  // Add/remove array items
  const toggleArrayItem = (field: string, item: string) => {
    setProfileData(prev => {
      const currentArray = prev[field as keyof DesignerProfileData] as string[];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  // Handle profile photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateProfile('profilePhoto', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile photo
  const removeProfilePhoto = () => {
    updateProfile('profilePhoto', '');
  };

  // Portfolio management functions
  const openPortfolioModal = (itemId?: string) => {
    if (itemId) {
      const item = profileData.portfolioItems.find(p => p.id === itemId);
      if (item) {
        setPortfolioForm({
          title: item.title,
          category: item.category,
          description: item.description,
          thumbnail: item.thumbnail,
          link: item.link || ''
        });
        setEditingPortfolioItem(itemId);
      }
    } else {
      setPortfolioForm({
        title: '',
        category: '',
        description: '',
        thumbnail: '',
        link: ''
      });
      setEditingPortfolioItem(null);
    }
    setShowPortfolioModal(true);
  };

  const closePortfolioModal = () => {
    setShowPortfolioModal(false);
    setEditingPortfolioItem(null);
    setPortfolioForm({
      title: '',
      category: '',
      description: '',
      thumbnail: '',
      link: ''
    });
  };

  const handlePortfolioImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPortfolioForm(prev => ({ ...prev, thumbnail: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const savePortfolioItem = () => {
    if (!portfolioForm.title || !portfolioForm.category || !portfolioForm.description) return;

    setProfileData(prev => {
      const newItem = {
        id: editingPortfolioItem || Date.now().toString(),
        title: portfolioForm.title,
        category: portfolioForm.category,
        description: portfolioForm.description,
        thumbnail: portfolioForm.thumbnail,
        link: portfolioForm.link,
        featured: false
      };

      if (editingPortfolioItem) {
        return {
          ...prev,
          portfolioItems: prev.portfolioItems.map(item =>
            item.id === editingPortfolioItem ? newItem : item
          )
        };
      } else {
        return {
          ...prev,
          portfolioItems: [...prev.portfolioItems, newItem]
        };
      }
    });

    closePortfolioModal();
  };

  const deletePortfolioItem = (itemId: string) => {
    setProfileData(prev => ({
      ...prev,
      portfolioItems: prev.portfolioItems.filter(item => item.id !== itemId)
    }));
  };

  const completeness = calculateCompleteness(profileData);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Your public designer profile and preferences</p>
        </div>
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Reset Changes
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              hasUnsavedChanges && !isSaving
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/designer/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <i className="material-symbols-outlined mr-2 text-lg">dashboard</i>
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <i className="material-symbols-outlined text-gray-400 mx-1">chevron_right</i>
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">Profile</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Profile Completeness Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Completeness</h2>
          <span className="text-2xl font-bold text-blue-600">{completeness}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          ></div>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              key: 'profile',
              label: 'Profile',
              completed: profileData.displayName && profileData.contactEmail && profileData.location.city && profileData.bio
            },
            {
              key: 'specialties',
              label: 'Specialties',
              completed: profileData.designCategories.length > 0 && profileData.softwareSkills.length > 0
            },
            {
              key: 'portfolio',
              label: 'Portfolio',
              completed: profileData.portfolioUrl && profileData.portfolioItems.length > 0
            },
            {
              key: 'rates',
              label: 'Rates',
              completed: profileData.hourlyRate && profileData.projectMinimum && profileData.paymentTerms
            },
            {
              key: 'availability',
              label: 'Availability',
              completed: profileData.workingHours.start && profileData.workingDays.length > 0
            }
          ].map((item) => (
            <div
              key={item.key}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                item.completed 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                item.completed 
                  ? 'bg-green-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {item.completed && <i className="material-symbols-outlined text-white text-sm">check</i>}
              </div>
              <span className={`text-sm font-medium ${
                item.completed 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Profile</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Public information</span>
        </div>

        <div className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="relative">
                {profileData.profilePhoto ? (
                  <img
                    src={profileData.profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-200 dark:border-gray-600">
                    <i className="material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500">person</i>
                  </div>
                )}
                <button
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <i className="material-symbols-outlined text-sm">camera_alt</i>
                </button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload a professional headshot for your profile</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i className="material-symbols-outlined mr-2 text-sm">upload</i>
                  {profileData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profileData.profilePhoto && (
                  <button
                    onClick={removeProfilePhoto}
                    className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <i className="material-symbols-outlined mr-2 text-sm">delete</i>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => updateProfile('displayName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your display name"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This is how clients will see your name</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Studio/Brand Name
              </label>
              <input
                type="text"
                value={profileData.businessName}
                onChange={(e) => updateProfile('businessName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your studio or business name"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional business name or studio brand</p>
            </div>
          </div>

          {/* Location and Timezone */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <input
                type="text"
                value={profileData.location.city}
                onChange={(e) => updateNestedProfile('location', 'city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={profileData.location.state}
                onChange={(e) => updateNestedProfile('location', 'state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={profileData.location.country}
                onChange={(e) => updateNestedProfile('location', 'country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={profileData.timezone}
                onChange={(e) => updateProfile('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select timezone</option>
                <option value="America/New_York">Eastern (UTC-5)</option>
                <option value="America/Chicago">Central (UTC-6)</option>
                <option value="America/Denver">Mountain (UTC-7)</option>
                <option value="America/Los_Angeles">Pacific (UTC-8)</option>
                <option value="Europe/London">GMT (UTC+0)</option>
                <option value="Europe/Paris">CET (UTC+1)</option>
                <option value="Europe/Helsinki">EET (UTC+2)</option>
                <option value="Asia/Dubai">GST (UTC+4)</option>
                <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                <option value="Asia/Shanghai">CST (UTC+8)</option>
                <option value="Asia/Tokyo">JST (UTC+9)</option>
                <option value="Australia/Sydney">AEDT (UTC+11)</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio *
            </label>
            <textarea
              rows={4}
              value={profileData.bio}
              onChange={(e) => updateProfile('bio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell clients about yourself, your design philosophy, and what makes you unique..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {profileData.bio.length}/500 characters
            </p>
          </div>

          {/* Website and Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Website & Social Links</h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="material-symbols-outlined mr-1 text-sm">language</i>
                  Website
                </label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => updateProfile('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="material-symbols-outlined mr-1 text-sm">palette</i>
                  Behance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm">behance.net/</span>
                  <input
                    type="text"
                    value={profileData.socialMedia.behance}
                    onChange={(e) => updateNestedProfile('socialMedia', 'behance', e.target.value)}
                    className="w-full pl-24 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="material-symbols-outlined mr-1 text-sm">sports_basketball</i>
                  Dribbble
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm">dribbble.com/</span>
                  <input
                    type="text"
                    value={profileData.socialMedia.dribbble}
                    onChange={(e) => updateNestedProfile('socialMedia', 'dribbble', e.target.value)}
                    className="w-full pl-24 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="material-symbols-outlined mr-1 text-sm">camera_alt</i>
                  Instagram
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm">@</span>
                  <input
                    type="text"
                    value={profileData.socialMedia.instagram}
                    onChange={(e) => updateNestedProfile('socialMedia', 'instagram', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="material-symbols-outlined mr-1 text-sm">work</i>
                  LinkedIn
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm">linkedin.com/in/</span>
                  <input
                    type="text"
                    value={profileData.socialMedia.linkedin}
                    onChange={(e) => updateNestedProfile('socialMedia', 'linkedin', e.target.value)}
                    className="w-full pl-28 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Specialties</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptNewRequests"
              checked={profileData.acceptNewRequests}
              onChange={(e) => updateProfile('acceptNewRequests', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="acceptNewRequests" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Accept new requests
            </label>
          </div>
        </div>

        <div className="space-y-6">
          {/* Category Chips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Gadgets', 'Home', 'Automotive', 'Desk accessories', 'Cosplay',
                'Toys', 'Tools', 'Organization', 'Decor'
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => toggleArrayItem('specialtyCategories', category)}
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    profileData.specialtyCategories.includes(category)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } border`}
                >
                  <i className="material-symbols-outlined mr-1 text-sm">
                    {profileData.specialtyCategories.includes(category) ? 'check' : 'add'}
                  </i>
                  {category}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {profileData.specialtyCategories.length} selected
            </p>
          </div>

          {/* Skill Chips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Skills & Expertise
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'CAD', 'Sculpting', 'Mechanical parts', 'Fit/tolerance',
                'Multi-part assemblies', 'Supports optimization'
              ].map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleArrayItem('specialtySkills', skill)}
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    profileData.specialtySkills.includes(skill)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } border`}
                >
                  <i className="material-symbols-outlined mr-1 text-sm">
                    {profileData.specialtySkills.includes(skill) ? 'check' : 'add'}
                  </i>
                  {skill}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {profileData.specialtySkills.length} selected
            </p>
          </div>

          {/* Selected Summary */}
          {(profileData.specialtyCategories.length > 0 || profileData.specialtySkills.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Your Specialties</h4>
              <div className="space-y-2">
                {profileData.specialtyCategories.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categories:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.specialtyCategories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                        >
                          {category}
                          <button
                            onClick={() => toggleArrayItem('specialtyCategories', category)}
                            className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                          >
                            <i className="material-symbols-outlined text-xs">close</i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profileData.specialtySkills.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.specialtySkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        >
                          {skill}
                          <button
                            onClick={() => toggleArrayItem('specialtySkills', skill)}
                            className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                          >
                            <i className="material-symbols-outlined text-xs">close</i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio</h2>
          <button
            onClick={() => openPortfolioModal()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <i className="material-symbols-outlined mr-2 text-sm">add</i>
            Add Portfolio Item
          </button>
        </div>

        {/* Portfolio Grid */}
        {profileData.portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.portfolioItems.map((item) => (
              <div key={item.id} className="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                {/* Portfolio Image */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="material-symbols-outlined text-4xl text-gray-400">image</i>
                  )}
                </div>

                {/* Portfolio Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</h4>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openPortfolioModal(item.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <i className="material-symbols-outlined text-sm">edit</i>
                      </button>
                      <button
                        onClick={() => deletePortfolioItem(item.id)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <i className="material-symbols-outlined text-sm">delete</i>
                      </button>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-md mb-2">
                    {item.category}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <i className="material-symbols-outlined mr-1 text-xs">link</i>
                      View Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">collections</i>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No portfolio items yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start showcasing your work by adding your first portfolio item.</p>
            <button
              onClick={() => openPortfolioModal()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <i className="material-symbols-outlined mr-2 text-sm">add</i>
              Add Portfolio Item
            </button>
          </div>
        )}
      </div>

      {/* Profile Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {[
                { key: 'profile', label: 'Profile', icon: 'person' },
                { key: 'specialties', label: 'Specialties', icon: 'palette' },
                { key: 'portfolio', label: 'Portfolio', icon: 'collections' },
                { key: 'rates', label: 'Rates', icon: 'payments' },
                { key: 'availability', label: 'Availability', icon: 'schedule' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined mr-3 text-lg">{tab.icon}</i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">

            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Profile Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Display Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => updateProfile('displayName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={profileData.businessName}
                        onChange={(e) => updateProfile('businessName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your business name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio *
                    </label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell clients about yourself and your design approach..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={profileData.location.city}
                        onChange={(e) => updateNestedProfile('location', 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={profileData.location.state}
                        onChange={(e) => updateNestedProfile('location', 'state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileData.location.country}
                        onChange={(e) => updateNestedProfile('location', 'country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        value={profileData.contactEmail}
                        onChange={(e) => updateProfile('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => updateProfile('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="acceptingProjects"
                      checked={profileData.acceptingProjects}
                      onChange={(e) => updateProfile('acceptingProjects', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="acceptingProjects" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Currently accepting new projects
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Specialties Section */}
            {activeTab === 'specialties' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Specialties & Skills</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Design Categories *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Logo Design', 'Brand Identity', 'Print Design', 'Web Design',
                        'Packaging', 'Illustration', 'UI/UX Design', 'Social Media Graphics',
                        'Marketing Materials', 'Book Design', 'Poster Design', 'Business Cards'
                      ].map((category) => (
                        <label key={category} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={profileData.designCategories.includes(category)}
                            onChange={() => toggleArrayItem('designCategories', category)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Software Skills *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Figma',
                        'Sketch', 'Adobe XD', 'Canva', 'Procreate', 'CorelDRAW', 'Affinity Designer'
                      ].map((software) => (
                        <label key={software} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={profileData.softwareSkills.includes(software)}
                            onChange={() => toggleArrayItem('softwareSkills', software)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{software}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Years of Experience *
                      </label>
                      <select
                        value={profileData.yearsExperience}
                        onChange={(e) => updateProfile('yearsExperience', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select experience level</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="6-8 years">6-8 years</option>
                        <option value="8+ years">8+ years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Client Types
                      </label>
                      <div className="space-y-2">
                        {['Startups', 'Small Business', 'Enterprise', 'Nonprofits', 'Agencies'].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={profileData.clientTypes.includes(type)}
                              onChange={() => toggleArrayItem('clientTypes', type)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Section */}
            {activeTab === 'portfolio' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Portfolio & Social Media</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portfolio URL *
                    </label>
                    <input
                      type="url"
                      value={profileData.portfolioUrl}
                      onChange={(e) => updateProfile('portfolioUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://behance.net/yourprofile"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Behance
                      </label>
                      <input
                        type="text"
                        value={profileData.socialMedia.behance}
                        onChange={(e) => updateNestedProfile('socialMedia', 'behance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dribbble
                      </label>
                      <input
                        type="text"
                        value={profileData.socialMedia.dribbble}
                        onChange={(e) => updateNestedProfile('socialMedia', 'dribbble', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={profileData.socialMedia.instagram}
                        onChange={(e) => updateNestedProfile('socialMedia', 'instagram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={profileData.socialMedia.linkedin}
                        onChange={(e) => updateNestedProfile('socialMedia', 'linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rates Section */}
            {activeTab === 'rates' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pricing & Terms</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hourly Rate (USD) *
                      </label>
                      <input
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) => updateProfile('hourlyRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="85"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Minimum (USD) *
                      </label>
                      <input
                        type="number"
                        value={profileData.projectMinimum}
                        onChange={(e) => updateProfile('projectMinimum', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rush Job Surcharge (%)
                      </label>
                      <input
                        type="number"
                        value={profileData.rushJobSurcharge}
                        onChange={(e) => updateProfile('rushJobSurcharge', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Terms *
                    </label>
                    <select
                      value={profileData.paymentTerms}
                      onChange={(e) => updateProfile('paymentTerms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select payment terms</option>
                      <option value="100% upfront">100% upfront</option>
                      <option value="50% upfront, 50% on completion">50% upfront, 50% on completion</option>
                      <option value="30% upfront, 70% on completion">30% upfront, 70% on completion</option>
                      <option value="Net 30">Net 30</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Revision Policy
                      </label>
                      <input
                        type="text"
                        value={profileData.revisionPolicy}
                        onChange={(e) => updateProfile('revisionPolicy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3 rounds included"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Revisions
                      </label>
                      <input
                        type="number"
                        value={profileData.maxRevisions}
                        onChange={(e) => updateProfile('maxRevisions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Availability Section */}
            {activeTab === 'availability' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Availability & Schedule</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Working Hours Start *
                      </label>
                      <input
                        type="time"
                        value={profileData.workingHours.start}
                        onChange={(e) => updateNestedProfile('workingHours', 'start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Working Hours End *
                      </label>
                      <input
                        type="time"
                        value={profileData.workingHours.end}
                        onChange={(e) => updateNestedProfile('workingHours', 'end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Working Days *
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <label key={day} className="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={profileData.workingDays.includes(day)}
                            onChange={() => toggleArrayItem('workingDays', day)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                          />
                          <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Capacity
                      </label>
                      <select
                        value={profileData.currentCapacity}
                        onChange={(e) => updateProfile('currentCapacity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Available">Available</option>
                        <option value="Limited Capacity">Limited Capacity</option>
                        <option value="Fully Booked">Fully Booked</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Projects per Month
                      </label>
                      <input
                        type="number"
                        value={profileData.maxProjectsPerMonth}
                        onChange={(e) => updateProfile('maxProjectsPerMonth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Response Time *
                    </label>
                    <select
                      value={profileData.responseTime}
                      onChange={(e) => updateProfile('responseTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select response time</option>
                      <option value="Within 1 hour">Within 1 hour</option>
                      <option value="Within 4 hours">Within 4 hours</option>
                      <option value="Within 24 hours">Within 24 hours</option>
                      <option value="Within 48 hours">Within 48 hours</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="availableForRush"
                        checked={profileData.availableForRush}
                        onChange={(e) => updateProfile('availableForRush', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="availableForRush" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Available for rush jobs
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="vacationMode"
                        checked={profileData.vacationMode}
                        onChange={(e) => updateProfile('vacationMode', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="vacationMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Vacation mode (not accepting new projects)
                      </label>
                    </div>

                    {profileData.vacationMode && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Available again on
                        </label>
                        <input
                          type="date"
                          value={profileData.vacationUntil}
                          onChange={(e) => updateProfile('vacationUntil', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closePortfolioModal}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-lg">
              <div className="px-6 py-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {editingPortfolioItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                  </h3>
                  <button
                    onClick={closePortfolioModal}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="material-symbols-outlined">close</i>
                  </button>
                </div>
              </div>

              <div className="px-6 py-6 space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Project Image
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-20 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                        {portfolioForm.thumbnail ? (
                          <img
                            src={portfolioForm.thumbnail}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <i className="material-symbols-outlined text-2xl text-gray-400">image</i>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => document.getElementById('portfolio-image-upload')?.click()}
                          className="inline-flex items-center px-3 py-2 border border-slate-600 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          <i className="material-symbols-outlined mr-2 text-sm">upload</i>
                          {portfolioForm.thumbnail ? 'Change Image' : 'Upload Image'}
                        </button>
                        {portfolioForm.thumbnail && (
                          <button
                            onClick={() => setPortfolioForm(prev => ({ ...prev, thumbnail: '' }))}
                            className="inline-flex items-center px-3 py-2 border border-red-600 shadow-sm text-sm font-medium rounded-md text-red-400 bg-slate-800 hover:bg-red-900/20 transition-colors"
                          >
                            <i className="material-symbols-outlined mr-2 text-sm">delete</i>
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Upload an image to showcase your project</p>
                      <input
                        id="portfolio-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePortfolioImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={portfolioForm.title}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Category *
                    </label>
                    <select
                      value={portfolioForm.category}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="Logo Design">Logo Design</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Print Design">Print Design</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Illustration">Illustration</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Marketing Materials">Marketing Materials</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={portfolioForm.description}
                    onChange={(e) => setPortfolioForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Brief description of the project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Project Link
                  </label>
                  <input
                    type="url"
                    value={portfolioForm.link}
                    onChange={(e) => setPortfolioForm(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="https://example.com/project (optional)"
                  />
                  <p className="mt-1 text-xs text-gray-400">Optional link to view the live project or case study</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex justify-end space-x-3">
                <button
                  onClick={closePortfolioModal}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePortfolioItem}
                  disabled={!portfolioForm.title || !portfolioForm.category || !portfolioForm.description}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    portfolioForm.title && portfolioForm.category && portfolioForm.description
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {editingPortfolioItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerProfile;
