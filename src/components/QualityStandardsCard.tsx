import React, { useState } from 'react';

const QualityStandardsCard: React.FC = () => {
  const [provideQcPhotos, setProvideQcPhotos] = useState<boolean>(false);
  const [providePackagingPhotos, setProvidePackagingPhotos] = useState<boolean>(false);
  const [basicPostProcessing, setBasicPostProcessing] = useState<boolean>(false);
  const [canDoPainting, setCanDoPainting] = useState<boolean>(false);
  const [acceptsToleranceCritical, setAcceptsToleranceCritical] = useState<boolean>(false);
  const [qualityNotes, setQualityNotes] = useState<string>('');

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Quality Standards</h5>
        </div>
      </div>

      <div className="trezo-card-content">
        {/* QC Photos toggle */}
        <div className="mb-[20px] md:mb-[25px]">
          <div className="form-check flex items-center gap-[8px]">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="qcPhotosToggle"
              checked={provideQcPhotos}
              onChange={(e) => setProvideQcPhotos(e.target.checked)}
            />
            <label htmlFor="qcPhotosToggle" className="cursor-pointer font-medium">
              Will provide QC photos on request
            </label>
          </div>
        </div>

        {/* Packaging photos toggle */}
        <div className="mb-[20px] md:mb-[25px]">
          <div className="form-check flex items-center gap-[8px]">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="packagingPhotosToggle"
              checked={providePackagingPhotos}
              onChange={(e) => setProvidePackagingPhotos(e.target.checked)}
            />
            <label htmlFor="packagingPhotosToggle" className="cursor-pointer font-medium">
              Can provide packaging photo proof
            </label>
          </div>
        </div>

        {/* Basic post-processing toggle */}
        <div className="mb-[20px] md:mb-[25px]">
          <div className="form-check flex items-center gap-[8px]">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="postProcessingToggle"
              checked={basicPostProcessing}
              onChange={(e) => setBasicPostProcessing(e.target.checked)}
            />
            <label htmlFor="postProcessingToggle" className="cursor-pointer font-medium">
              Can do basic post-processing (sanding, deburring)
            </label>
          </div>
        </div>

        {/* Painting toggle */}
        <div className="mb-[20px] md:mb-[25px]">
          <div className="form-check flex items-center gap-[8px]">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="paintingToggle"
              checked={canDoPainting}
              onChange={(e) => setCanDoPainting(e.target.checked)}
            />
            <label htmlFor="paintingToggle" className="cursor-pointer font-medium">
              Can do painting (optional)
            </label>
          </div>
        </div>

        {/* Tolerance-critical parts toggle */}
        <div className="mb-[20px] md:mb-[25px]">
          <div className="form-check flex items-center gap-[8px]">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="toleranceCriticalToggle"
              checked={acceptsToleranceCritical}
              onChange={(e) => setAcceptsToleranceCritical(e.target.checked)}
            />
            <label htmlFor="toleranceCriticalToggle" className="cursor-pointer font-medium">
              Accepts tolerance-critical parts
            </label>
          </div>
        </div>

        {/* Quality notes textarea */}
        <div className="mb-0">
          <label className="mb-[12px] font-medium block">Quality Notes</label>
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
