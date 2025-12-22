import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { FileItem, FilterState, ProofUploadPayload } from "../../features/makerFiles/mockMakerFiles";
import {
  mockJobs,
  getFiles,
  addProofUpload,
  deleteMakerFiles,
  getAllFiles
} from "../../features/makerFiles/mockMakerFiles";

const MakerFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(getAllFiles());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'All',
    source: 'All',
    job: 'All',
    qcRequiredOnly: false
  });
  const [formData, setFormData] = useState({
    linkedJobId: '',
    proofType: 'QC Photos' as const,
    notes: '',
    selectedFiles: [] as File[]
  });
  const [showToast, setShowToast] = useState(false);

  // Filter files based on current filter state using helper
  const filteredFiles = useMemo(() => {
    return getFiles(filters);
  }, [filters]);

  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      source: 'All',
      job: 'All',
      qcRequiredOnly: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ProofUploadPayload = {
      linkedJobId: formData.linkedJobId,
      proofType: formData.proofType,
      notes: formData.notes,
      files: formData.selectedFiles
    };

    // Use helper to add proof upload
    const updatedFiles = addProofUpload(payload);
    setFiles([...updatedFiles]);

    // Reset form and close modal
    setFormData({
      linkedJobId: '',
      proofType: 'QC Photos',
      notes: '',
      selectedFiles: []
    });
    setIsModalOpen(false);

    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        selectedFiles: Array.from(e.target.files!)
      }));
    }
  };

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = deleteMakerFiles([fileId]);
    setFiles([...updatedFiles]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'STL':
        return 'view_in_ar';
      case 'IMAGE':
        return 'image';
      case 'PDF':
        return 'picture_as_pdf';
      case 'ZIP':
        return 'folder_zip';
      default:
        return 'description';
    }
  };

  const getSourceBadge = (source: string) => {
    const badgeClasses = {
      'Maker': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Seller': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Designer': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'System': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return badgeClasses[source as keyof typeof badgeClasses] || badgeClasses.System;
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'qcRequiredOnly') return value === true;
    return value !== '' && value !== 'All';
  }).length;

  const showNoFilesOverallState = files.length === 0;
  const showNoResultsState = files.length > 0 && filteredFiles.length === 0;

  const renderEmptyState = () => {
    if (showNoFilesOverallState) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#1a2038] rounded-full flex items-center justify-center">
                <i className="material-symbols-outlined text-3xl text-gray-400">folder_open</i>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No files yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Files will appear here when jobs are created or when you upload proof photos.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Link
                    to="/maker/jobs"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <i className="material-symbols-outlined mr-2 text-[18px]">work</i>
                    Check Jobs
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <i className="material-symbols-outlined mr-2 text-[18px]">upload</i>
                    Upload Proof
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    if (showNoResultsState) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#1a2038] rounded-full flex items-center justify-center">
                <i className="material-symbols-outlined text-3xl text-gray-400">search_off</i>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No files found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center px-4 py-2 mt-4 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-all"
                >
                  <i className="material-symbols-outlined mr-2 text-[18px]">clear</i>
                  Clear Filters
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return null;
  };

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-[5px]">Files</h5>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage job files, upload proofs, and track file requirements
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
            Files
          </li>
        </ol>
      </div>

      {/* Filter Controls */}
      {!showNoFilesOverallState && (
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
          <div className="trezo-card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search files, jobs, products..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] pl-[45px] pr-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                  <i className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    search
                  </i>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                >
                  <option value="All">All Types</option>
                  <option value="STL">STL</option>
                  <option value="IMAGE">Image</option>
                  <option value="PDF">PDF</option>
                  <option value="ZIP">ZIP</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <select
                  value={filters.source}
                  onChange={(e) => updateFilter('source', e.target.value)}
                  className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                >
                  <option value="All">All Sources</option>
                  <option value="Maker">Maker</option>
                  <option value="Seller">Seller</option>
                  <option value="Designer">Designer</option>
                  <option value="System">System</option>
                </select>
              </div>

              {/* Job Filter */}
              <div>
                <select
                  value={filters.job}
                  onChange={(e) => updateFilter('job', e.target.value)}
                  className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                >
                  <option value="All">All Jobs</option>
                  {mockJobs.filter(job => job.status === 'active').map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* QC Required Toggle & Clear Filters */}
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.qcRequiredOnly}
                    onChange={(e) => updateFilter('qcRequiredOnly', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    QC Required Only
                  </span>
                </label>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
                  >
                    <i className="material-symbols-outlined text-[16px]">clear</i>
                    Clear Filters ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredFiles.length} of {files.length} files
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Job Files</h5>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[12px] px-[20px] rounded-md transition-all inline-flex items-center gap-2"
          >
            <i className="material-symbols-outlined text-[18px]">upload</i>
            Upload Proof
          </button>
        </div>

        <div className="trezo-card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#172036]">
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">File</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Size</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Source</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Job</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Updated</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showNoFilesOverallState || showNoResultsState) ? (
                  renderEmptyState()
                ) : (
                  filteredFiles.map((file) => {
                    const linkedJob = mockJobs.find(job => job.id === file.linkedJobId);
                    const canDelete = file.source === 'Maker';

                    return (
                      <tr key={file.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#1a2038]">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a2038] rounded-md flex items-center justify-center">
                              <i className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                                {getFileIcon(file.type)}
                              </i>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">{file.name}</div>
                              {file.proofType && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">{file.proofType}</div>
                              )}
                              {!canDelete && (
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  Provided by {file.source}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-gray-600 dark:text-gray-400">{file.type}</td>
                        <td className="py-4 px-2 text-gray-600 dark:text-gray-400">{file.size}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getSourceBadge(file.source)}`}>
                            {file.source}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          {linkedJob ? (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900 dark:text-gray-100">{linkedJob.productName}</div>
                              <div className="text-gray-500 dark:text-gray-400">{file.linkedJobId}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-gray-600 dark:text-gray-400">{file.updated}</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1">
                            <button className="text-primary-500 hover:text-primary-600 p-1" title="Download">
                              <i className="material-symbols-outlined text-[18px]">download</i>
                            </button>
                            {canDelete ? (
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-500 hover:text-red-600 p-1"
                                title="Delete"
                              >
                                <i className="material-symbols-outlined text-[18px]">delete</i>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="text-gray-300 dark:text-gray-600 p-1 cursor-not-allowed"
                                title="Cannot delete files provided by others"
                              >
                                <i className="material-symbols-outlined text-[18px]">delete</i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Proof Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-lg mx-4 z-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Upload Proof</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Linked Job *
                  </label>
                  <select
                    value={formData.linkedJobId}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedJobId: e.target.value }))}
                    className="h-[50px] rounded-md text-white border border-gray-600 bg-slate-800 px-4 block w-full outline-0 transition-all focus:border-primary-500"
                    required
                  >
                    <option value="">Select a job...</option>
                    {mockJobs.filter(job => job.status === 'active').map(job => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Proof Type *
                  </label>
                  <select
                    value={formData.proofType}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      proofType: e.target.value as 'QC Photos' | 'Packaging Photo' | 'Label Photo' | 'Other'
                    }))}
                    className="h-[50px] rounded-md text-white border border-gray-600 bg-slate-800 px-4 block w-full outline-0 transition-all focus:border-primary-500"
                  >
                    <option value="QC Photos">QC Photos</option>
                    <option value="Packaging Photo">Packaging Photo</option>
                    <option value="Label Photo">Label Photo</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="h-[100px] rounded-md text-white border border-gray-600 bg-slate-800 p-4 block w-full outline-0 transition-all focus:border-primary-500"
                    placeholder="Any additional notes about the proof..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Files *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="rounded-md text-white border border-gray-600 bg-slate-800 px-4 py-2 block w-full outline-0 transition-all focus:border-primary-500"
                    multiple
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    You can select multiple files. Max size: 10MB each.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-[12px] px-[20px] rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    <i className="material-symbols-outlined text-[18px]">upload</i>
                    Upload Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-[12px] px-[20px] rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    <i className="material-symbols-outlined text-[18px]">close</i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
          <div className="flex items-center gap-2">
            <i className="material-symbols-outlined text-[20px]">check_circle</i>
            <span>Proof uploaded successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MakerFiles;
