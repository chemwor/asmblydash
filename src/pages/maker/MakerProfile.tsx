import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ProfileData } from "../../features/makerProfile/mockMakerProfile";
import { loadProfile, saveProfile, defaultProfile } from "../../features/makerProfile/mockMakerProfile";

const MakerProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfile);
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modal state for machine CRUD
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [editingMachineIndex, setEditingMachineIndex] = useState<number | null>(null);
  const [machineFormData, setMachineFormData] = useState({
    printerModel: '',
    buildVolume: { x: '', y: '', z: '' },
    nozzleSize: '',
    printTechnologies: ['FDM'],
    notes: ''
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
        // Fallback to default profile on error
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

  // Calculate profile completeness
  const calculateCompleteness = (): number => {
    let completed = 0;
    const total = 6;

    // Basic Profile section (check key fields)
    if (profileData.displayName && profileData.contactEmail && profileData.location.city &&
        profileData.location.state && profileData.serviceRegion && profileData.timezone) {
      completed++;
    }

    // Profile section (check key fields)
    if (profileData.businessName && profileData.contactEmail && profileData.phone &&
        profileData.address && profileData.specialties.length > 0) {
      completed++;
    }

    // Machines section
    if (profileData.machines.length > 0) {
      completed++;
    }

    // Materials section
    if (profileData.materials.length > 0) {
      completed++;
    }

    // Lead times section
    if (profileData.standardLeadTime && profileData.rushLeadTime && profileData.maxConcurrentJobs) {
      completed++;
    }

    // Shipping section
    if (profileData.shippingMethods.length > 0 && profileData.shippingZones.length > 0) {
      completed++;
    }

    // Payouts section
    if (profileData.payoutsConfigured) {
      completed++;
    }

    return Math.round((completed / total) * 100);
  };

  const completeness = calculateCompleteness();

  const updateProfile = (field: keyof ProfileData, value: string | boolean | string[] | ProfileData['machines'] | ProfileData['location']) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateLocation = (field: 'city' | 'state', value: string) => {
    setProfileData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const addMachine = () => {
    const newMachine = {
      id: Date.now().toString(),
      printerModel: "",
      buildVolume: {
        x: "",
        y: "",
        z: ""
      },
      nozzleSize: "",
      printTechnologies: [],
      notes: ""
    };
    updateProfile('machines', [...profileData.machines, newMachine]);
  };

  const updateMachine = (index: number, field: string, value: string) => {
    const updatedMachines = profileData.machines.map((machine, i) =>
      i === index ? { ...machine, [field]: value } : machine
    );
    updateProfile('machines', updatedMachines);
  };

  const removeMachine = (index: number) => {
    const updatedMachines = profileData.machines.filter((_, i) => i !== index);
    updateProfile('machines', updatedMachines);
  };

  const addMaterial = (material: string) => {
    if (material && !profileData.materials.includes(material)) {
      updateProfile('materials', [...profileData.materials, material]);
    }
  };

  const removeMaterial = (material: string) => {
    updateProfile('materials', profileData.materials.filter(m => m !== material));
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !profileData.specialties.includes(specialty)) {
      updateProfile('specialties', [...profileData.specialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    updateProfile('specialties', profileData.specialties.filter(s => s !== specialty));
  };

  const getCompletionIcon = (isComplete: boolean) =>
    isComplete ? 'check_circle' : 'radio_button_unchecked';

  const getCompletionColor = (isComplete: boolean) =>
    isComplete ? 'text-green-500' : 'text-gray-400';

  // Machine CRUD functions
  const openAddMachineModal = () => {
    setMachineFormData({
      printerModel: '',
      buildVolume: { x: '', y: '', z: '' },
      nozzleSize: '0.4',
      printTechnologies: ['FDM'],
      notes: ''
    });
    setEditingMachineIndex(null);
    setShowMachineModal(true);
  };

  const openEditMachineModal = (index: number) => {
    const machine = profileData.machines[index];
    setMachineFormData({
      printerModel: machine.printerModel,
      buildVolume: { ...machine.buildVolume },
      nozzleSize: machine.nozzleSize,
      printTechnologies: [...machine.printTechnologies],
      notes: machine.notes
    });
    setEditingMachineIndex(index);
    setShowMachineModal(true);
  };

  const handleSaveMachine = () => {
    setIsSaving(true);
    if (editingMachineIndex !== null) {
      // Edit existing machine
      const updatedMachines = profileData.machines.map((machine, i) =>
        i === editingMachineIndex ? { ...machine, ...machineFormData } : machine
      );
      updateProfile('machines', updatedMachines);
    } else {
      // Add new machine
      const newMachine = {
        id: Date.now().toString(),
        ...machineFormData
      };
      updateProfile('machines', [...profileData.machines, newMachine]);
    }
    setShowMachineModal(false);
    setIsSaving(false);
  };

  const handleDeleteMachine = (index: number) => {
    const updatedMachines = profileData.machines.filter((_, i) => i !== index);
    updateProfile('machines', updatedMachines);
  };

  const updateMachineForm = (field: string, value: string | string[]) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setMachineFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev], [child]: value }
      }));
    } else {
      setMachineFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const togglePrintTechnology = (tech: string) => {
    setMachineFormData(prev => {
      const technologies = prev.printTechnologies.includes(tech)
        ? prev.printTechnologies.filter(t => t !== tech)
        : [...prev.printTechnologies, tech];
      return { ...prev, printTechnologies: technologies };
    });
  };

  // Materials & Colors functions
  const toggleMaterial = (material: string) => {
    const updatedMaterials = profileData.materials.includes(material)
      ? profileData.materials.filter(m => m !== material)
      : [...profileData.materials, material];
    updateProfile('materials', updatedMaterials);
  };

  const toggleColor = (color: string) => {
    const updatedColors = profileData.availableColors.includes(color)
      ? profileData.availableColors.filter(c => c !== color)
      : [...profileData.availableColors, color];
    updateProfile('availableColors', updatedColors);
  };

  const toggleExoticMaterial = (material: string) => {
    const updatedExoticMaterials = profileData.exoticMaterials.includes(material)
      ? profileData.exoticMaterials.filter(m => m !== material)
      : [...profileData.exoticMaterials, material];
    updateProfile('exoticMaterials', updatedExoticMaterials);
  };

  // Show loading state while profile is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Action Bar */}
      {hasUnsavedChanges && (
        <div className="sticky top-0 z-40 bg-white dark:bg-[#0c1427] border-b border-gray-200 dark:border-[#172036] p-4 mb-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                You have unsaved changes
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="bg-gray-200 dark:bg-[#172036] hover:bg-gray-300 dark:hover:bg-[#1f2547] text-gray-700 dark:text-gray-300 font-medium py-[8px] px-[16px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[8px] px-[16px] rounded-md transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="material-symbols-outlined text-[16px]">save</i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-[5px]">Profile & Capabilities</h5>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tell Asmbly what you can print so you get the right jobs
          </p>
        </div>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/maker/dashboard"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Profile & Capabilities
          </li>
        </ol>
      </div>

      {/* Profile Completeness Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Profile Completeness</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {completeness}% Complete
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {completeness === 100 ? "Profile Complete!" : "Complete your profile to get more jobs"}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <i className={`material-symbols-outlined ${getCompletionColor(
                  !!(profileData.displayName && profileData.contactEmail && profileData.location.city &&
                  profileData.location.state && profileData.serviceRegion && profileData.timezone)
                )}`}>
                  {getCompletionIcon(
                    !!(profileData.displayName && profileData.contactEmail && profileData.location.city &&
                    profileData.location.state && profileData.serviceRegion && profileData.timezone)
                  )}
                </i>
                <span className="text-sm text-gray-700 dark:text-gray-300">Basic Profile</span>
              </div>

              <div className="flex items-center gap-3">
                <i className={`material-symbols-outlined ${getCompletionColor(
                  !!(profileData.businessName && profileData.contactEmail && profileData.phone && 
                  profileData.address && profileData.specialties.length > 0)
                )}`}>
                  {getCompletionIcon(
                    !!(profileData.businessName && profileData.contactEmail && profileData.phone &&
                    profileData.address && profileData.specialties.length > 0)
                  )}
                </i>
                <span className="text-sm text-gray-700 dark:text-gray-300">Profile Information</span>
              </div>

              <div className="flex items-center gap-3">
                <i className={`material-symbols-outlined ${getCompletionColor(profileData.machines.length > 0)}`}>
                  {getCompletionIcon(profileData.machines.length > 0)}
                </i>
                <span className="text-sm text-gray-700 dark:text-gray-300">Machines & Equipment</span>
              </div>

              <div className="flex items-center gap-3">
                <i className={`material-symbols-outlined ${getCompletionColor(profileData.materials.length > 0)}`}>
                  {getCompletionIcon(profileData.materials.length > 0)}
                </i>
                <span className="text-sm text-gray-700 dark:text-gray-300">Materials & Capabilities</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <i className={`material-symbols-outlined ${getCompletionColor(
                  !!(profileData.standardLeadTime && profileData.rushLeadTime && profileData.maxConcurrentJobs)
                )}`}>
                  {getCompletionIcon(
                    !!(profileData.standardLeadTime && profileData.rushLeadTime && profileData.maxConcurrentJobs)
                  )}
                </i>
                <span className="text-sm text-gray-700 dark:text-gray-300">Lead Times</span>
              </div>

              <div className="flex items-center gap-3">
                <i className={`material-symbols-outlined ${getCompletionColor(
                  profileData.shippingMethods.length > 0 && profileData.shippingZones.length > 0
                )}`}>
                  {getCompletionIcon(
                    profileData.shippingMethods.length > 0 && profileData.shippingZones.length > 0
                  )}
                </i>
                <span className="text-sm text-gray-700 dark:text-gray-300">Shipping Options</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className={`material-symbols-outlined ${getCompletionColor(profileData.payoutsConfigured)}`}>
                    {getCompletionIcon(profileData.payoutsConfigured)}
                  </i>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Payout Settings</span>
                </div>
                <Link
                  to="/maker/payouts"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  Configure →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Profile */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Basic Profile</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => updateProfile('displayName', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="Your name as you want it to be displayed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workshop Name *
              </label>
              <input
                type="text"
                value={profileData.workshopName}
                onChange={(e) => updateProfile('workshopName', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="Your workshop or business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <input
                type="text"
                value={profileData.location.city}
                onChange={(e) => updateLocation('city', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
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
                onChange={(e) => updateLocation('state', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="TX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Region *
              </label>
              <input
                type="text"
                value={profileData.serviceRegion}
                onChange={(e) => updateProfile('serviceRegion', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="e.g., Texas, Southwest US"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone *
              </label>
              <input
                type="text"
                value={profileData.timezone}
                onChange={(e) => updateProfile('timezone', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="e.g., Central Time (US & Canada)"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profileData.acceptNewJobs}
                onChange={(e) => updateProfile('acceptNewJobs', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Accepting New Jobs</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[12px] px-[24px] rounded-md transition-all inline-flex items-center gap-2">
              <i className="material-symbols-outlined text-[18px]">save</i>
              Save Basic Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Profile Information</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={profileData.businessName}
                onChange={(e) => updateProfile('businessName', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="Your business or maker space name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={profileData.contactEmail}
                onChange={(e) => updateProfile('contactEmail', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="contact@business.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <select
                value={profileData.yearsExperience}
                onChange={(e) => updateProfile('yearsExperience', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
              >
                <option value="">Select experience</option>
                <option value="<1">Less than 1 year</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => updateProfile('address', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ZIP *
              </label>
              <input
                type="text"
                value={profileData.zipCode}
                onChange={(e) => updateProfile('zipCode', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="12345"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specialties
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profileData.specialties.map((specialty, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 text-sm rounded-full">
                  {specialty}
                  <button
                    onClick={() => removeSpecialty(specialty)}
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                  >
                    <i className="material-symbols-outlined text-[16px]">close</i>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add specialty (e.g., Prototyping, Miniatures, etc.)"
                className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] flex-1 outline-0 transition-all focus:border-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSpecialty(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input) {
                    addSpecialty(input.value);
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-md transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Machines & Equipment */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Machines & Equipment</h5>
          </div>
          <button
            onClick={openAddMachineModal}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[8px] px-[16px] rounded-md transition-all inline-flex items-center gap-2 text-sm"
          >
            <i className="material-symbols-outlined text-[16px]">add</i>
            Add Machine
          </button>
        </div>
        <div className="trezo-card-content">
          {profileData.machines.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#1a2038] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="material-symbols-outlined text-3xl text-gray-400">precision_manufacturing</i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No machines added</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Add your 3D printers to let buyers know your capabilities</p>
              <button
                onClick={openAddMachineModal}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[8px] px-[16px] rounded-md transition-all inline-flex items-center gap-2 text-sm"
              >
                <i className="material-symbols-outlined text-[16px]">add</i>
                Add Your First Machine
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {profileData.machines.map((machine, index) => (
                <div key={machine.id} className="border border-gray-200 dark:border-[#172036] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h6 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Machine #{index + 1}
                    </h6>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditMachineModal(index)}
                        className="text-blue-500 hover:text-blue-600 p-1"
                        title="Edit machine"
                      >
                        <i className="material-symbols-outlined text-[20px]">edit</i>
                      </button>
                      <button
                        onClick={() => handleDeleteMachine(index)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Remove machine"
                      >
                        <i className="material-symbols-outlined text-[20px]">delete</i>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Printer Model
                      </label>
                      <input
                        type="text"
                        value={machine.printerModel}
                        onChange={(e) => updateMachine(index, 'printerModel', e.target.value)}
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                        placeholder="e.g., Prusa i3 MK3S+"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Build Volume (X mm)
                      </label>
                      <input
                        type="text"
                        value={machine.buildVolume.x}
                        onChange={(e) => updateMachine(index, 'buildVolume.x', e.target.value)}
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                        placeholder="e.g., 250"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Build Volume (Y mm)
                      </label>
                      <input
                        type="text"
                        value={machine.buildVolume.y}
                        onChange={(e) => updateMachine(index, 'buildVolume.y', e.target.value)}
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                        placeholder="e.g., 210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Build Volume (Z mm)
                      </label>
                      <input
                        type="text"
                        value={machine.buildVolume.z}
                        onChange={(e) => updateMachine(index, 'buildVolume.z', e.target.value)}
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                        placeholder="e.g., 200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nozzle Size (mm)
                      </label>
                      <input
                        type="text"
                        value={machine.nozzleSize}
                        onChange={(e) => updateMachine(index, 'nozzleSize', e.target.value)}
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                        placeholder="e.g., 0.4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Print Technologies
                      </label>
                      <input
                        type="text"
                        value={machine.printTechnologies.join(', ')}
                        onChange={(e) => updateMachine(index, 'printTechnologies', e.target.value.split(',').map(t => t.trim()))}
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                        placeholder="e.g., FDM, SLA"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={machine.notes}
                      onChange={(e) => updateMachine(index, 'notes', e.target.value)}
                      className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] py-[10px] block w-full outline-0 transition-all focus:border-primary-500"
                      placeholder="Any additional information about the machine"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Materials & Colors */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Materials & Colors</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          {/* Materials Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Supported Materials
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {['PLA', 'PETG', 'ABS', 'TPU', 'Nylon', 'Resin'].map((material) => (
                <button
                  key={material}
                  onClick={() => toggleMaterial(material)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    profileData.materials.includes(material)
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] text-gray-700 dark:text-gray-300 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {profileData.materials.includes(material) && (
                      <i className="material-symbols-outlined text-[16px]">check</i>
                    )}
                    {material}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Material Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom material..."
                className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] flex-1 outline-0 transition-all focus:border-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const material = e.currentTarget.value.trim();
                    if (material && !profileData.materials.includes(material)) {
                      updateProfile('materials', [...profileData.materials, material]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input) {
                    const material = input.value.trim();
                    if (material && !profileData.materials.includes(material)) {
                      updateProfile('materials', [...profileData.materials, material]);
                      input.value = '';
                    }
                  }
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-md transition-all"
              >
                Add
              </button>
            </div>

            {/* Selected Materials Display */}
            {profileData.materials.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected materials:</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.materials.map((material, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-sm rounded-full">
                      {material}
                      <button
                        onClick={() => toggleMaterial(material)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      >
                        <i className="material-symbols-outlined text-[16px]">close</i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colors Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Available Colors
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {[
                { name: 'Black', color: 'bg-black' },
                { name: 'White', color: 'bg-white border-2 border-gray-300' },
                { name: 'Gray', color: 'bg-gray-500' },
                { name: 'Red', color: 'bg-red-500' },
                { name: 'Blue', color: 'bg-blue-500' },
                { name: 'Green', color: 'bg-green-500' },
                { name: 'Yellow', color: 'bg-yellow-500' },
                { name: 'Orange', color: 'bg-orange-500' },
                { name: 'Purple', color: 'bg-purple-500' },
                { name: 'Pink', color: 'bg-pink-500' }
              ].map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => toggleColor(colorOption.name)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    profileData.availableColors.includes(colorOption.name)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${colorOption.color}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">{colorOption.name}</span>
                    {profileData.availableColors.includes(colorOption.name) && (
                      <i className="material-symbols-outlined text-[16px] text-primary-600">check</i>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add custom color..."
                className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] flex-1 outline-0 transition-all focus:border-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const color = e.currentTarget.value.trim();
                    if (color && !profileData.availableColors.includes(color)) {
                      updateProfile('availableColors', [...profileData.availableColors, color]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input) {
                    const color = input.value.trim();
                    if (color && !profileData.availableColors.includes(color)) {
                      updateProfile('availableColors', [...profileData.availableColors, color]);
                      input.value = '';
                    }
                  }
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-md transition-all"
              >
                Add
              </button>
            </div>

            {/* Custom Colors Toggle */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.canSourceCustomColors}
                  onChange={(e) => updateProfile('canSourceCustomColors', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Can source custom colors upon request</span>
              </label>
            </div>

            {/* Selected Colors Display */}
            {profileData.availableColors.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available colors:</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.availableColors.map((color, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm rounded-full">
                      {color}
                      <button
                        onClick={() => toggleColor(color)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <i className="material-symbols-outlined text-[16px]">close</i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Exotic Materials Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Exotic Materials <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {['Wood-filled', 'Carbon Fiber', 'Metal-filled', 'Glow-in-the-dark', 'Conductive', 'Flexible TPU', 'Dissolvable PVA', 'High-temp PEEK'].map((material) => (
                <button
                  key={material}
                  onClick={() => toggleExoticMaterial(material)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    profileData.exoticMaterials.includes(material)
                      ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      : 'border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] text-gray-700 dark:text-gray-300 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {profileData.exoticMaterials.includes(material) && (
                      <i className="material-symbols-outlined text-[16px]">check</i>
                    )}
                    {material}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Exotic Material Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add custom exotic material..."
                className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] flex-1 outline-0 transition-all focus:border-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const material = e.currentTarget.value.trim();
                    if (material && !profileData.exoticMaterials.includes(material)) {
                      updateProfile('exoticMaterials', [...profileData.exoticMaterials, material]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input) {
                    const material = input.value.trim();
                    if (material && !profileData.exoticMaterials.includes(material)) {
                      updateProfile('exoticMaterials', [...profileData.exoticMaterials, material]);
                      input.value = '';
                    }
                  }
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-md transition-all"
              >
                Add
              </button>
            </div>

            {/* Selected Exotic Materials Display */}
            {profileData.exoticMaterials.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Exotic materials offered:</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.exoticMaterials.map((material, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 text-sm rounded-full">
                      {material}
                      <button
                        onClick={() => toggleExoticMaterial(material)}
                        className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
                      >
                        <i className="material-symbols-outlined text-[16px]">close</i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Exotic materials help differentiate your services and may command premium pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Lead Times */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Lead Times & Capacity</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Standard Lead Time (days)
              </label>
              <input
                type="text"
                value={profileData.standardLeadTime}
                onChange={(e) => updateProfile('standardLeadTime', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="e.g., 5-7"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Typical turnaround for standard jobs
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rush Lead Time (days)
              </label>
              <input
                type="text"
                value={profileData.rushLeadTime}
                onChange={(e) => updateProfile('rushLeadTime', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="e.g., 2-3"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                For urgent orders (additional fees may apply)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Concurrent Jobs
              </label>
              <input
                type="text"
                value={profileData.maxConcurrentJobs}
                onChange={(e) => updateProfile('maxConcurrentJobs', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="e.g., 8"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Maximum jobs you can handle at once
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Accept Rush Jobs
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={profileData.acceptRushJobs}
                  onChange={(e) => updateProfile('acceptRushJobs', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Yes, I accept rush jobs</span>
              </div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rush Surcharge Percentage
              </label>
              <input
                type="text"
                value={profileData.rushSurchargePercentage}
                onChange={(e) => updateProfile('rushSurchargePercentage', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="e.g., 20"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Percentage surcharge for rush jobs
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekend Printing
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={profileData.weekendPrinting}
                  onChange={(e) => updateProfile('weekendPrinting', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Yes, I print on weekends</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Shipping & Delivery</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Shipping Methods
              </label>
              <div className="space-y-2">
                {['USPS Priority', 'USPS Ground', 'UPS Ground', 'UPS 2-Day', 'FedEx Ground', 'FedEx Express'].map((method) => (
                  <label key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.shippingMethods.includes(method)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateProfile('shippingMethods', [...profileData.shippingMethods, method]);
                        } else {
                          updateProfile('shippingMethods', profileData.shippingMethods.filter(m => m !== method));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{method}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.localDelivery}
                    onChange={(e) => updateProfile('localDelivery', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Offer Local Delivery</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shipping Zones
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profileData.shippingZones.map((zone, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm rounded-full">
                    {zone}
                    <button
                      onClick={() => updateProfile('shippingZones', profileData.shippingZones.filter(z => z !== zone))}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <i className="material-symbols-outlined text-[16px]">close</i>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add shipping zone (e.g., Texas, Southwest US)"
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] flex-1 outline-0 transition-all focus:border-primary-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const zone = e.currentTarget.value;
                      if (zone && !profileData.shippingZones.includes(zone)) {
                        updateProfile('shippingZones', [...profileData.shippingZones, zone]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input) {
                      const zone = input.value;
                      if (zone && !profileData.shippingZones.includes(zone)) {
                        updateProfile('shippingZones', [...profileData.shippingZones, zone]);
                        input.value = '';
                      }
                    }
                  }}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-md transition-all"
                >
                  Add
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Define the regions you're willing to ship to
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[12px] px-[24px] rounded-md transition-all inline-flex items-center gap-2">
          <i className="material-symbols-outlined text-[18px]">save</i>
          Save Profile
        </button>
      </div>

      {/* Machine Modal */}
      {showMachineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-lg w-full max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingMachineIndex !== null ? "Edit Machine" : "Add Machine"}
              </h3>
              <button
                onClick={() => setShowMachineModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Printer Model
                </label>
                <input
                  type="text"
                  value={machineFormData.printerModel}
                  onChange={(e) => updateMachineForm('printerModel', e.target.value)}
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                  placeholder="e.g., Prusa i3 MK3S+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Build Volume (X mm)
                </label>
                <input
                  type="text"
                  value={machineFormData.buildVolume.x}
                  onChange={(e) => updateMachineForm('buildVolume.x', e.target.value)}
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                  placeholder="e.g., 250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Build Volume (Y mm)
                </label>
                <input
                  type="text"
                  value={machineFormData.buildVolume.y}
                  onChange={(e) => updateMachineForm('buildVolume.y', e.target.value)}
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                  placeholder="e.g., 210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Build Volume (Z mm)
                </label>
                <input
                  type="text"
                  value={machineFormData.buildVolume.z}
                  onChange={(e) => updateMachineForm('buildVolume.z', e.target.value)}
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                  placeholder="e.g., 200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nozzle Size (mm)
                </label>
                <input
                  type="text"
                  value={machineFormData.nozzleSize}
                  onChange={(e) => updateMachineForm('nozzleSize', e.target.value)}
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] block w-full outline-0 transition-all focus:border-primary-500"
                  placeholder="e.g., 0.4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Print Technologies
                </label>
                <div className="flex flex-wrap gap-2">
                  {['FDM', 'SLA', 'SLS', 'DLP'].map((tech) => (
                    <label key={tech} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={machineFormData.printTechnologies.includes(tech)}
                        onChange={() => togglePrintTechnology(tech)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={machineFormData.notes}
                onChange={(e) => updateMachineForm('notes', e.target.value)}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] py-[10px] block w-full outline-0 transition-all focus:border-primary-500"
                placeholder="Any additional information about the machine"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMachineModal(false)}
                className="bg-gray-200 dark:bg-[#172036] text-gray-700 dark:text-gray-300 font-medium py-[12px] px-[24px] rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMachine}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[12px] px-[24px] rounded-md transition-all inline-flex items-center gap-2"
              >
                <i className="material-symbols-outlined text-[18px]">save</i>
                {editingMachineIndex !== null ? "Update Machine" : "Add Machine"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MakerProfile;
