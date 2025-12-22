import React, { useState } from 'react';

const QualityStandardsCard: React.FC = () => {
  const [provideQcPhotos, setProvideQcPhotos] = useState<boolean>(false);
  const [providePackagingPhotos, setProvidePackagingPhotos] = useState<boolean>(false);
  const [basicPostProcessing, setBasicPostProcessing] = useState<boolean>(false);
  const [canDoPainting, setCanDoPainting] = useState<boolean>(false);
  const [acceptsToleranceCritical, setAcceptsToleranceCritical] = useState<boolean>(false);
  const [qualityNotes, setQualityNotes] = useState<string>('');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40 transition-all duration-300 ease-out ring-1 ring-gray-950/[0.02] dark:ring-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-0">Quality Standards</h5>
        </div>
      </div>

      <div>
        {/* QC Photos toggle with modern styling */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              id="qcPhotosToggle"
              checked={provideQcPhotos}
              onChange={(e) => setProvideQcPhotos(e.target.checked)}
            />
            <label htmlFor="qcPhotosToggle" className="cursor-pointer font-medium text-gray-900 dark:text-white">
              Will provide QC photos on request
            </label>
          </div>
        </div>

        {/* Packaging photos toggle with modern styling */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              id="packagingPhotosToggle"
              checked={providePackagingPhotos}
              onChange={(e) => setProvidePackagingPhotos(e.target.checked)}
            />
            <label htmlFor="packagingPhotosToggle" className="cursor-pointer font-medium text-gray-900 dark:text-white">
              Can provide packaging photo proof
            </label>
          </div>
        </div>

        {/* Basic post-processing toggle with modern styling */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              id="postProcessingToggle"
              checked={basicPostProcessing}
              onChange={(e) => setBasicPostProcessing(e.target.checked)}
            />
            <label htmlFor="postProcessingToggle" className="cursor-pointer font-medium text-gray-900 dark:text-white">
              Can do basic post-processing (sanding, deburring)
            </label>
          </div>
        </div>

        {/* Painting toggle with modern styling */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              id="paintingToggle"
              checked={canDoPainting}
              onChange={(e) => setCanDoPainting(e.target.checked)}
            />
            <label htmlFor="paintingToggle" className="cursor-pointer font-medium text-gray-900 dark:text-white">
              Can do painting (optional)
            </label>
          </div>
        </div>

        {/* Tolerance-critical parts toggle with modern styling */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              id="toleranceCriticalToggle"
              checked={acceptsToleranceCritical}
              onChange={(e) => setAcceptsToleranceCritical(e.target.checked)}
            />
            <label htmlFor="toleranceCriticalToggle" className="cursor-pointer font-medium text-gray-900 dark:text-white">
              Accepts tolerance-critical parts
            </label>
          </div>
        </div>

        {/* Quality notes textarea with modern styling */}
        <div className="mb-0">
          <label className="mb-[12px] font-medium block text-gray-900 dark:text-white">Quality Notes</label>
          <textarea
            className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
            placeholder="Add any additional quality standards, equipment details, or special capabilities..."
            value={qualityNotes}
            onChange={(e) => setQualityNotes(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default QualityStandardsCard;
