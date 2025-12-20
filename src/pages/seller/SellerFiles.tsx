import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { getFiles, deleteFiles, moveFiles, type FileData } from "../../features/sellerFiles/mockFiles";

const SellerFiles = () => {
  // State for search, filters, and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Updated (desc)");

  // State for bulk selection
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveToFolder, setMoveToFolder] = useState("");

  // State for files - now managed through the feature module
  const [files, setFiles] = useState<FileData[]>([]);

  // Load files on component mount and when filters change
  useEffect(() => {
    const filteredFiles = getFiles({ searchTerm, sortBy });
    setFiles(filteredFiles);
  }, [searchTerm, sortBy]);

  // Available folders for move functionality
  const folders = [
    "Product Images",
    "Documents",
    "STL Requests",
    "Media",
    "Configuration",
    "Feedback",
    "Archive"
  ];

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Use files directly from state (already filtered and sorted by useEffect)
  const filteredAndSortedFiles = useMemo(() => {
    return files;
  }, [files]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedFiles.length === filteredAndSortedFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredAndSortedFiles.map(file => file.id));
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Bulk action handlers
  const handleBulkDownload = () => {
    console.log("Downloading files:", selectedFiles);
    // Placeholder for download functionality
    setSelectedFiles([]);
  };

  const handleBulkDelete = () => {
    const result = deleteFiles(selectedFiles);
    console.log("Delete result:", result);

    // Refresh files after deletion
    const updatedFiles = getFiles({ searchTerm, sortBy });
    setFiles(updatedFiles);
    setSelectedFiles([]);
  };

  const handleBulkMove = () => {
    if (moveToFolder && selectedFiles.length > 0) {
      const movedIds = moveFiles(selectedFiles, moveToFolder);
      console.log("Moved files:", movedIds, "to:", moveToFolder);

      // Refresh files after move
      const updatedFiles = getFiles({ searchTerm, sortBy });
      setFiles(updatedFiles);
      setSelectedFiles([]);
      setShowMoveModal(false);
      setMoveToFolder("");
    }
  };

  // Get file type color
  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "image": return "text-success-600 dark:text-success-300";
      case "video": return "text-primary-600 dark:text-primary-300";
      case "document": return "text-warning-600 dark:text-warning-300";
      case "data": return "text-purple-600 dark:text-purple-300";
      default: return "text-gray-600 dark:text-gray-300";
    }
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSearchTerm("");
    setSortBy("Updated (desc)");
  };

  // Upload handler (placeholder)
  const handleUploadFile = () => {
    console.log("Upload file clicked");
    // Placeholder for file upload functionality
  };

  // Individual file delete handler
  const handleDeleteFile = (fileId: string) => {
    const result = deleteFiles([fileId]);
    console.log("Delete single file result:", result);

    // Refresh files after deletion
    const updatedFiles = getFiles({ searchTerm, sortBy });
    setFiles(updatedFiles);
  };

  // Check if we have any files at all
  const hasFiles = files.length > 0;
  const hasSearchOrFilter = searchTerm.length > 0;

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Files</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/seller/dashboard"
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

      {/* Search and Sort Controls - only show if we have files */}
      {hasFiles && (
        <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] mb-[25px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Search Files
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by file name, linked ID, or folder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control h-[48px] ltr:pl-[45px] rtl:pr-[45px] text-[14px] text-black dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0c1427] rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute ltr:left-[16px] rtl:right-[16px] top-1/2 transform -translate-y-1/2">
                  <i className="material-symbols-outlined text-gray-500 !text-[20px]">search</i>
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control h-[48px] text-[14px] text-black dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0c1427] rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Updated (desc)">Updated (desc)</option>
                <option value="Name (A-Z)">Name (A-Z)</option>
                <option value="Size (desc)">Size (desc)</option>
                <option value="Type">Type</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar - only show if we have files and selections */}
      {selectedFiles.length > 0 && hasFiles && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-md p-[15px] mb-[25px] flex items-center justify-between">
          <span className="text-primary-700 dark:text-primary-300 font-medium">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBulkDownload}
              className="btn bg-primary-500 hover:bg-primary-600 text-white py-[6px] px-[12px] text-[13px] rounded-md transition-colors"
            >
              <i className="material-symbols-outlined !text-[16px] ltr:mr-[5px] rtl:ml-[5px]">download</i>
              Download
            </button>
            <button
              onClick={() => setShowMoveModal(true)}
              className="btn bg-success-500 hover:bg-success-600 text-white py-[6px] px-[12px] text-[13px] rounded-md transition-colors"
            >
              <i className="material-symbols-outlined !text-[16px] ltr:mr-[5px] rtl:ml-[5px]">drive_file_move</i>
              Move
            </button>
            <button
              onClick={handleBulkDelete}
              className="btn bg-danger-500 hover:bg-danger-600 text-white py-[6px] px-[12px] text-[13px] rounded-md transition-colors"
            >
              <i className="material-symbols-outlined !text-[16px] ltr:mr-[5px] rtl:ml-[5px]">delete</i>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Empty State - No Files Overall */}
      {!hasFiles && (
        <div className="bg-white dark:bg-[#0c1427] rounded-md p-[60px] text-center">
          <div className="max-w-md mx-auto">
            <div className="w-[80px] h-[80px] bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-[24px]">
              <i className="material-symbols-outlined !text-[40px] text-gray-400 dark:text-gray-600">cloud_upload</i>
            </div>
            <h5 className="mb-[16px] text-black dark:text-white">Upload your first file</h5>
            <p className="text-gray-500 dark:text-gray-400 mb-[24px] text-sm leading-relaxed">
              Start building your file library by uploading product images, documents, and other assets. Files will be automatically organized and linked to your products and orders.
            </p>
            <button
              onClick={handleUploadFile}
              className="btn bg-primary-500 hover:bg-primary-600 text-white py-[12px] px-[24px] rounded-md transition-colors inline-flex items-center"
            >
              <i className="material-symbols-outlined !text-[18px] ltr:mr-[8px] rtl:ml-[8px]">upload</i>
              Upload Files
            </button>
          </div>
        </div>
      )}

      {/* Files Table - only show if we have files */}
      {hasFiles && (
        <div className="bg-white dark:bg-[#0c1427] rounded-md">
          <div className="trezo-card-header mb-0 p-[20px] md:p-[25px] pb-0 flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">
                Files ({filteredAndSortedFiles.length})
              </h5>
            </div>
          </div>

          <div className="trezo-card-content p-0">
            {/* Empty State - No Search Results */}
            {filteredAndSortedFiles.length === 0 && hasSearchOrFilter && (
              <div className="p-[60px] text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-[64px] h-[64px] bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-[20px]">
                    <i className="material-symbols-outlined !text-[32px] text-gray-400 dark:text-gray-600">search_off</i>
                  </div>
                  <h6 className="mb-[12px] text-black dark:text-white">No files found</h6>
                  <p className="text-gray-500 dark:text-gray-400 mb-[20px] text-sm">
                    No files match your current search criteria. Try adjusting your search terms or clearing filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="btn bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-[8px] px-[16px] rounded-md transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Files Table */}
            {filteredAndSortedFiles.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={selectedFiles.length === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th className="text-left py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        File
                      </th>
                      <th className="text-left py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        Linked To
                      </th>
                      <th className="text-left py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        Folder
                      </th>
                      <th className="text-left py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        Size
                      </th>
                      <th className="text-left py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        Modified
                      </th>
                      <th className="text-left py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        Owner
                      </th>
                      <th className="text-center py-[12px] px-[20px] md:px-[25px] font-semibold text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-[12px] px-[20px] md:px-[25px]">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => handleSelectFile(file.id)}
                            />
                          </div>
                        </td>
                        <td className="py-[12px] px-[20px] md:px-[25px]">
                          <div className="flex items-center space-x-3">
                            {file.thumbnail ? (
                              <img
                                src={file.thumbnail}
                                alt={file.name}
                                className="w-[40px] h-[40px] object-cover rounded-md"
                              />
                            ) : (
                              <div className={`w-[40px] h-[40px] rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                                <i className={`material-symbols-outlined !text-[20px] ${getFileTypeColor(file.type)}`}>
                                  {file.typeIcon}
                                </i>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-black dark:text-white">
                                {file.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                {file.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-[12px] px-[20px] md:px-[25px]">
                          <div>
                            <div className="font-medium text-black dark:text-white">
                              {file.linkedId}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {file.linkedType}
                            </div>
                          </div>
                        </td>
                        <td className="py-[12px] px-[20px] md:px-[25px]">
                          <span className="text-black dark:text-white">
                            {file.folder}
                          </span>
                        </td>
                        <td className="py-[12px] px-[20px] md:px-[25px]">
                          <span className="text-black dark:text-white">
                            {file.size}
                          </span>
                        </td>
                        <td className="py-[12px] px-[20px] md:px-[25px]">
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatDate(file.lastModified)}
                          </span>
                        </td>
                        <td className="py-[12px] px-[20px] md:px-[25px]">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-block px-[8px] py-[2px] rounded-full text-xs font-medium ${
                              file.owner === "Seller" 
                                ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}>
                              {file.owner}
                            </span>
                            {file.owner !== "Seller" && (
                              <div className="group relative">
                                <i className="material-symbols-outlined !text-[14px] text-gray-400 dark:text-gray-500 cursor-help">info</i>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                  Provided by {file.owner}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-[12px] px-[20px] md:px-[25px] text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button className="p-[6px] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative">
                              <i className="material-symbols-outlined !text-[18px] text-gray-600 dark:text-gray-400">download</i>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                Download
                              </div>
                            </button>
                            <button className="p-[6px] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative">
                              <i className="material-symbols-outlined !text-[18px] text-gray-600 dark:text-gray-400">visibility</i>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                View
                              </div>
                            </button>
                            {file.owner === "Seller" ? (
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="p-[6px] rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors group relative"
                              >
                                <i className="material-symbols-outlined !text-[18px] text-red-600 dark:text-red-400">delete</i>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                  Delete
                                </div>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="p-[6px] rounded-md cursor-not-allowed group relative"
                              >
                                <i className="material-symbols-outlined !text-[18px] text-gray-300 dark:text-gray-600">delete</i>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                  Cannot delete files provided by {file.owner}
                                </div>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Move Folder Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-[20px]">
              <h5 className="!mb-0">Move Files to Folder</h5>
              <button
                onClick={() => setShowMoveModal(false)}
                className="p-[6px] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="material-symbols-outlined !text-[20px] text-gray-600 dark:text-gray-400">close</i>
              </button>
            </div>

            <div className="mb-[20px]">
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Select destination folder:
              </label>
              <select
                value={moveToFolder}
                onChange={(e) => setMoveToFolder(e.target.value)}
                className="form-control h-[48px] w-full text-[14px] text-black dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0c1427] rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose folder...</option>
                {folders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowMoveModal(false)}
                className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 py-[8px] px-[16px] text-[13px] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkMove}
                disabled={!moveToFolder}
                className="btn bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white py-[8px] px-[16px] text-[13px] rounded-md transition-colors"
              >
                Move Files
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredAndSortedFiles.length === 0 && (
        <div className="bg-white dark:bg-[#0c1427] rounded-md p-[40px] text-center">
          <i className="material-symbols-outlined !text-[48px] text-gray-400 dark:text-gray-600 mb-[16px]">folder_open</i>
          <h6 className="mb-[8px] text-gray-600 dark:text-gray-400">No files found</h6>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            {searchTerm ? "Try adjusting your search terms" : "Files will appear here as they are uploaded or linked to your products and orders"}
          </p>
        </div>
      )}
    </>
  );
};

export default SellerFiles;
