import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getJobBoardJobs, getJobBoardKPIs, getJobBoardFilterOptions, markJobAsAccepted } from "../../features/makerJobBoard/mockJobBoard";
import { addJobToQueue } from "../../features/makerJobs/mockJobs";
import type { JobBoardJob } from "../../features/makerJobBoard/mockJobBoard";

const MakerJobBoard: React.FC = () => {
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [materialFilter, setMaterialFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [minPayout, setMinPayout] = useState<string>('');
  const [maxPayout, setMaxPayout] = useState<string>('');
  const [requirementsFilters, setRequirementsFilters] = useState({
    qcPhotos: false,
    supports: false,
    multiPart: false
  });
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Preview modal state
  const [selectedJob, setSelectedJob] = useState<JobBoardJob | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; job: JobBoardJob | null }>({
    isOpen: false,
    job: null
  });

  // Get filter options
  const filterOptions = getJobBoardFilterOptions();

  // Get all unique regions from jobs
  const allJobs = getJobBoardJobs({ category: 'All', material: 'All', priority: 'All', difficulty: 'All', searchQuery: '', sortBy: 'posted-newest' });
  const uniqueRegions = Array.from(new Set(allJobs.map(job => job.region)));

  // Enhanced filtering logic
  const getFilteredJobs = () => {
    let jobs = allJobs;

    // Search filter (job ID + product name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      jobs = jobs.filter(job =>
        job.id.toLowerCase().includes(query) ||
        job.product.toLowerCase().includes(query) ||
        job.title.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      jobs = jobs.filter(job => job.category === categoryFilter);
    }

    // Material filter
    if (materialFilter !== 'All') {
      jobs = jobs.filter(job => job.material === materialFilter);
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      jobs = jobs.filter(job => job.priority === priorityFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'All') {
      jobs = jobs.filter(job => job.difficulty === difficultyFilter);
    }

    // Region filter
    if (regionFilter !== 'All') {
      jobs = jobs.filter(job => job.region === regionFilter);
    }

    // Payout range filter
    const minPayoutNum = parseFloat(minPayout) || 0;
    const maxPayoutNum = parseFloat(maxPayout) || Infinity;
    jobs = jobs.filter(job => job.payout >= minPayoutNum && job.payout <= maxPayoutNum);

    // Requirements filters
    if (requirementsFilters.qcPhotos) {
      jobs = jobs.filter(job =>
        job.requirements.some(req => req.toLowerCase().includes('qc') || req.toLowerCase().includes('quality')) ||
        job.slaExpectations.some(exp => exp.toLowerCase().includes('quality') || exp.toLowerCase().includes('qc'))
      );
    }
    if (requirementsFilters.supports) {
      jobs = jobs.filter(job =>
        job.requirements.some(req => req.toLowerCase().includes('support')) ||
        job.requiredSkills.some(skill => skill.toLowerCase().includes('support'))
      );
    }
    if (requirementsFilters.multiPart) {
      jobs = jobs.filter(job =>
        job.qty > 1 ||
        job.requirements.some(req => req.toLowerCase().includes('multi') || req.toLowerCase().includes('assembly')) ||
        job.requiredSkills.some(skill => skill.toLowerCase().includes('assembly'))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'payout-high':
        return jobs.sort((a, b) => b.payout - a.payout);
      case 'due-date-soonest':
        return jobs.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      case 'posted-newest':
        return jobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      case 'recommended':
      default:
        return jobs.sort((a, b) => {
          // Recommended jobs first, then by payout
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return b.payout - a.payout;
        });
    }
  };

  const filteredJobs = getFilteredJobs();

  // Get KPI data
  const kpis = getJobBoardKPIs();

  // Helper functions
  const formatDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date('2025-12-20'); // Current date context
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days`;
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Rush':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Standard':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handlePreviewJob = (job: JobBoardJob) => {
    setSelectedJob(job);
    setIsPreviewOpen(true);
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000); // Auto-hide after 4 seconds
  };

  // Handle job acceptance confirmation
  const handleAcceptJobConfirm = (job: JobBoardJob) => {
    setConfirmModal({ isOpen: true, job });
  };

  // Process job acceptance
  const processJobAcceptance = (job: JobBoardJob) => {
    try {
      // Mark job as accepted in job board
      const jobBoardSuccess = markJobAsAccepted(job.id);

      if (jobBoardSuccess) {
        try {
          const newJob = addJobToQueue(job);
          console.log('Job added to queue:', newJob);

          showToast('Job accepted successfully! Added to your queue.', 'success');
        } catch (error) {
          console.error('Failed to accept job:', error);
          throw new Error('Failed to mark job as accepted');
        }

        // Close modals
        setConfirmModal({ isOpen: false, job: null });
        setIsPreviewOpen(false);

        // Show success toast
        showToast("Job accepted and added to your queue");

        console.log(`Job ${job.id} successfully accepted and added to queue`);
      } else {
        throw new Error('Failed to mark job as accepted');
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      showToast("Failed to accept job. Please try again.", 'error');
    }
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, job: null });
  };

  // Updated handleAcceptJob to show confirmation modal first
  const handleAcceptJob = (jobId: string) => {
    const job = filteredJobs.find(j => j.id === jobId);
    if (job) {
      handleAcceptJobConfirm(job);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedJob(null);
  };

  const toggleRequirementFilter = (filterType: keyof typeof requirementsFilters) => {
    setRequirementsFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setMaterialFilter('All');
    setPriorityFilter('All');
    setDifficultyFilter('All');
    setRegionFilter('All');
    setMinPayout('');
    setMaxPayout('');
    setRequirementsFilters({
      qcPhotos: false,
      supports: false,
      multiPart: false
    });
    setSortBy('recommended');
  };

  return (
    <>
      {/* Page Header with Breadcrumb */}
      <div className="mb-[25px]">
        <div className="flex flex-wrap items-center justify-between gap-[15px]">
          <div>
            <h1 className="text-[28px] lg:text-[32px] font-semibold text-dark dark:text-title-dark mb-[5px]">
              Job Board
            </h1>
            <p className="text-body dark:text-subtitle-dark">
              Pick up new jobs that match your capabilities
            </p>
          </div>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/maker/dashboard"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="material-symbols-outlined text-[18px] mr-[5px]">home</i>
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</i>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Job Board
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px] mb-[25px]">
        {/* Recommended Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Recommended Jobs</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {kpis.recommendedJobs}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-purple-600 dark:text-purple-400">recommend</i>
            </div>
          </div>
        </div>

        {/* New Today */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">New Today</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {kpis.newToday}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-green-600 dark:text-green-400">new_releases</i>
            </div>
          </div>
        </div>

        {/* Highest Payout Available */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Highest Payout Available</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                ${kpis.highestPayout.toFixed(2)}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-blue-600 dark:text-blue-400">payments</i>
            </div>
          </div>
        </div>

        {/* Rush Jobs Available */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Rush Jobs Available</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {kpis.rushJobs}
              </h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-red-600 dark:text-red-400">bolt</i>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm mb-[25px]">
        {/* First Row - Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[15px] mb-[20px]">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
              Search Jobs
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Job ID or Product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-[45px] pr-[15px] py-[12px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <i className="material-symbols-outlined absolute left-[15px] top-1/2 transform -translate-y-1/2 text-gray-400">search</i>
            </div>
          </div>

          {/* Material Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
              Material
            </label>
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="w-full px-[15px] py-[12px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Materials</option>
              {filterOptions.materials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-[15px] py-[12px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Priorities</option>
              <option value="Rush">Rush</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
              Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-[15px] py-[12px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Regions</option>
              {uniqueRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-[15px] py-[12px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="recommended">Recommended</option>
              <option value="payout-high">Payout (High to Low)</option>
              <option value="due-date-soonest">Due Date (Soonest)</option>
              <option value="posted-newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Second Row - Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[15px] items-end">
          {/* Payout Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
              Payout Range
            </label>
            <div className="grid grid-cols-2 gap-[8px]">
              <input
                type="number"
                placeholder="Min $"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
                className="w-full px-[12px] py-[12px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <input
                type="number"
                placeholder="Max $"
                value={maxPayout}
                onChange={(e) => setMaxPayout(e.target.value)}
                className="w-full px-[12px] py-[12px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Requirements Toggles */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-[5px]">
              Requirements
            </label>
            <div className="flex gap-[8px]">
              <button
                onClick={() => toggleRequirementFilter('qcPhotos')}
                className={`px-[12px] py-[8px] rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-[4px] ${
                  requirementsFilters.qcPhotos 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                }`}
              >
                <i className="material-symbols-outlined text-[16px]">
                  {requirementsFilters.qcPhotos ? 'check_circle' : 'radio_button_unchecked'}
                </i>
                QC Photos Required
              </button>
              <button
                onClick={() => toggleRequirementFilter('supports')}
                className={`px-[12px] py-[8px] rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-[4px] ${
                  requirementsFilters.supports 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                }`}
              >
                <i className="material-symbols-outlined text-[16px]">
                  {requirementsFilters.supports ? 'check_circle' : 'radio_button_unchecked'}
                </i>
                Supports Required
              </button>
              <button
                onClick={() => toggleRequirementFilter('multiPart')}
                className={`px-[12px] py-[8px] rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-[4px] ${
                  requirementsFilters.multiPart 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                }`}
              >
                <i className="material-symbols-outlined text-[16px]">
                  {requirementsFilters.multiPart ? 'check_circle' : 'radio_button_unchecked'}
                </i>
                Multi-part
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearAllFilters}
              className="w-full px-[15px] py-[12px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-[8px]"
            >
              <i className="material-symbols-outlined text-[18px]">refresh</i>
              Clear All
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || categoryFilter !== 'All' || materialFilter !== 'All' || priorityFilter !== 'All' || regionFilter !== 'All' || minPayout || maxPayout || Object.values(requirementsFilters).some(Boolean)) && (
          <div className="mt-[20px] pt-[20px] border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-[10px] flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  Search: "{searchQuery}"
                </span>
              )}
              {materialFilter !== 'All' && (
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  Material: {materialFilter}
                </span>
              )}
              {priorityFilter !== 'All' && (
                <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  Priority: {priorityFilter}
                </span>
              )}
              {regionFilter !== 'All' && (
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  Region: {regionFilter}
                </span>
              )}
              {(minPayout || maxPayout) && (
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  Payout: ${minPayout || '0'} - ${maxPayout || '∞'}
                </span>
              )}
              {requirementsFilters.qcPhotos && (
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  QC Photos
                </span>
              )}
              {requirementsFilters.supports && (
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  Supports
                </span>
              )}
              {requirementsFilters.multiPart && (
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-[8px] py-[4px] rounded-full text-xs font-medium">
                  Multi-part
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-[25px] border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark">
              Available Jobs ({filteredJobs.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-[50px]">
              <i className="material-symbols-outlined text-[48px] text-gray-400 mb-[15px]">search_off</i>
              <p className="text-body dark:text-subtitle-dark">No jobs match your current filters.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Material & Qty
                  </th>
                  <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payout
                  </th>
                  <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-[25px] py-[15px] text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Requirements
                  </th>
                  <th className="px-[25px] py-[15px] text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {/* Job Details */}
                    <td className="px-[25px] py-[20px]">
                      <div className="flex items-start space-x-[15px]">
                        <div className="w-[60px] h-[60px] bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="material-symbols-outlined text-[24px] text-gray-500 dark:text-gray-300">inventory_2</i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-[8px] mb-[5px]">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {job.id}
                            </p>
                            <span className={`text-xs px-[8px] py-[2px] rounded-full font-medium ${getPriorityBadgeClass(job.priority)}`}>
                              {job.priority}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-dark dark:text-title-dark mb-[2px]">
                              {job.product}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {job.id} {job.orderId && `• Order: ${job.orderId}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Material & Qty */}
                    <td className="px-[25px] py-[20px]">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium">
                          Qty: {job.qty}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {job.material}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {job.color}
                        </p>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="px-[25px] py-[20px]">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatDaysUntilDue(job.dueDate)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {job.dueDate}
                        </p>
                      </div>
                    </td>

                    {/* Payout */}
                    <td className="px-[25px] py-[20px]">
                      <div className="text-sm">
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                          ${job.payout.toFixed(2)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          ~{job.estimatedHours}h
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-[25px] py-[20px]">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {job.distance}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {job.region}
                        </p>
                      </div>
                    </td>

                    {/* Requirements */}
                    <td className="px-[25px] py-[20px]">
                      <div className="flex flex-wrap gap-[4px] max-w-[200px]">
                        {job.requirements.slice(0, 2).map((req, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-xs px-[6px] py-[2px] rounded"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{job.requirements.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-[25px] py-[20px] text-right">
                      <div className="flex items-center justify-end space-x-[8px]">
                        <button
                          onClick={() => handlePreviewJob(job)}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-[12px] py-[6px] rounded text-sm font-medium transition-colors duration-200"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleAcceptJob(job.id)}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-[12px] py-[6px] rounded text-sm font-medium transition-colors duration-200"
                        >
                          Accept Job
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Job Preview Modal/Drawer */}
      {isPreviewOpen && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closePreview}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-slate-900 shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-[25px] border-b border-gray-700">
                <div>
                  <h2 className="text-[24px] font-semibold text-white mb-[5px]">
                    Job Preview
                  </h2>
                  <p className="text-gray-300">
                    {selectedJob.id} - {selectedJob.product}
                  </p>
                </div>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-white p-[8px]"
                >
                  <i className="material-symbols-outlined text-[24px]">close</i>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-[25px] space-y-[25px]">
                {/* Job Overview */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white mb-[15px]">Job Overview</h3>
                  <div className="bg-slate-800 rounded-lg p-[20px] space-y-[15px]">
                    <div className="grid grid-cols-2 gap-[15px]">
                      <div>
                        <p className="text-gray-400 text-sm">Quantity</p>
                        <p className="text-white font-medium">{selectedJob.qty}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Material</p>
                        <p className="text-white font-medium">{selectedJob.material} - {selectedJob.color}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Due Date</p>
                        <p className="text-white font-medium">{formatDaysUntilDue(selectedJob.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Estimated Time</p>
                        <p className="text-white font-medium">{selectedJob.estimatedHours} hours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-[10px] pt-[15px] border-t border-gray-700">
                      <span className={`text-sm px-[10px] py-[4px] rounded-full font-medium ${getPriorityBadgeClass(selectedJob.priority)}`}>
                        {selectedJob.priority}
                      </span>
                      <span className="bg-gray-700 text-gray-300 text-sm px-[10px] py-[4px] rounded-full font-medium">
                        {selectedJob.difficulty}
                      </span>
                      <span className="bg-gray-700 text-gray-300 text-sm px-[10px] py-[4px] rounded-full font-medium">
                        {selectedJob.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full Requirements */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white mb-[15px]">Full Requirements</h3>
                  <div className="bg-slate-800 rounded-lg p-[20px]">
                    <p className="text-gray-300 mb-[15px]">{selectedJob.fullRequirements}</p>
                    <div className="space-y-[8px]">
                      <p className="text-gray-400 text-sm font-medium">Required Skills:</p>
                      <div className="flex flex-wrap gap-[8px]">
                        {selectedJob.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-900/30 text-blue-300 text-sm px-[10px] py-[4px] rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Files List */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white mb-[15px]">Files & Resources</h3>
                  <div className="bg-slate-800 rounded-lg p-[20px]">
                    <div className="space-y-[10px]">
                      {selectedJob.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-[12px] bg-slate-700 rounded-lg">
                          <div className="flex items-center space-x-[12px]">
                            <div className="w-[40px] h-[40px] bg-slate-600 rounded-lg flex items-center justify-center">
                              <i className="material-symbols-outlined text-[20px] text-gray-300">
                                {file.type === 'STL' ? 'view_in_ar' :
                                 file.type === 'PDF' ? 'picture_as_pdf' :
                                 file.type === 'Image' ? 'image' : 'description'}
                              </i>
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{file.name}</p>
                              <p className="text-gray-400 text-xs">{file.type} • {file.size}</p>
                            </div>
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SLA Expectations */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white mb-[15px]">SLA Expectations</h3>
                  <div className="bg-slate-800 rounded-lg p-[20px]">
                    <ul className="space-y-[8px]">
                      {selectedJob.slaExpectations.map((expectation, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <i className="material-symbols-outlined text-[16px] text-green-400 mr-[8px]">check_circle</i>
                          {expectation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Payout Breakdown */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white mb-[15px]">Payout Breakdown</h3>
                  <div className="bg-slate-800 rounded-lg p-[20px]">
                    <div className="space-y-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Base Pay</span>
                        <span className="text-white font-medium">${selectedJob.payoutBreakdown.basePay.toFixed(2)}</span>
                      </div>
                      {selectedJob.payoutBreakdown.rushBonus && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Rush Bonus</span>
                          <span className="text-green-400 font-medium">+${selectedJob.payoutBreakdown.rushBonus.toFixed(2)}</span>
                        </div>
                      )}
                      {selectedJob.payoutBreakdown.qualityBonus && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Quality Bonus</span>
                          <span className="text-green-400 font-medium">+${selectedJob.payoutBreakdown.qualityBonus.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-semibold text-lg">Total Payout</span>
                          <span className="text-green-400 font-bold text-xl">${selectedJob.payoutBreakdown.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-[25px] border-t border-gray-700">
                <div className="flex items-center space-x-[15px]">
                  <button
                    onClick={closePreview}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-[12px] px-[20px] rounded-lg font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleAcceptJob(selectedJob.id)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-[12px] px-[20px] rounded-lg font-medium transition-colors duration-200"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.job && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeConfirmModal}
          />

          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 rounded-lg shadow-lg">
            <div className="p-[25px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-[15px]">
                <h3 className="text-[18px] font-semibold text-white">
                  Confirm Job Acceptance
                </h3>
                <button
                  onClick={closeConfirmModal}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="material-symbols-outlined text-[24px]">close</i>
                </button>
              </div>

              {/* Content */}
              <div className="mb-[20px]">
                <p className="text-gray-300 text-sm mb-[10px]">
                  Are you sure you want to accept this job? It will be added to your queue.
                </p>
                <div className="bg-slate-800 rounded-lg p-[15px]">
                  <p className="text-white font-medium text-sm mb-[5px]">
                    Job ID: {confirmModal.job.id}
                  </p>
                  <p className="text-white font-medium text-sm mb-[5px]">
                    Product: {confirmModal.job.product}
                  </p>
                  <p className="text-white font-medium text-sm">
                    Payout: ${confirmModal.job.payout.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-[10px]">
                <button
                  onClick={closeConfirmModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-[12px] px-[15px] rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmModal.job && processJobAcceptance(confirmModal.job)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-[12px] px-[15px] rounded-lg font-medium transition-colors duration-200"
                >
                  Confirm Acceptance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </>
  );
};

export default MakerJobBoard;
