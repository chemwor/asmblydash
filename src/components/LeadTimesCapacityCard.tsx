import React, { useState } from 'react';

const LeadTimesCapacityCard: React.FC = () => {
  const [turnaroundTime, setTurnaroundTime] = useState<string>('');
  const [maxJobsPerDay, setMaxJobsPerDay] = useState<number>(0);
  const [rushJobsEnabled, setRushJobsEnabled] = useState<boolean>(false);
  const [rushSurcharge, setRushSurcharge] = useState<number>(0);
  const [weekendPrintingEnabled, setWeekendPrintingEnabled] = useState<boolean>(false);

  const turnaroundOptions = [
    { value: '', label: 'Select turnaround time...' },
    { value: '1-2-days', label: '1–2 days' },
    { value: '3-5-days', label: '3–5 days' },
    { value: '1-week', label: '1 week' }
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Lead Times & Capacity</h5>
        </div>
      </div>

      <div className="trezo-card-content">
        {/* Helper text */}
        <div className="mb-[25px] p-[15px] bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-4 border-blue-400">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-0">
            These values help match you with jobs that fit your schedule and capacity. Setting accurate lead times improves customer satisfaction.
          </p>
        </div>

        {/* Typical turnaround */}
        <div className="mb-[20px] md:mb-[25px]">
          <label className="mb-[12px] font-medium block">Typical Turnaround</label>
          <select
            className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white"
            value={turnaroundTime}
            onChange={(e) => setTurnaroundTime(e.target.value)}
          >
            {turnaroundOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max jobs per day */}
        <div className="mb-[20px] md:mb-[25px]">
          <label className="mb-[12px] font-medium block">Max Jobs Per Day</label>
          <input
            type="number"
            min="0"
            className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
            placeholder="Enter maximum jobs per day"
            value={maxJobsPerDay || ''}
            onChange={(e) => setMaxJobsPerDay(parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Rush jobs toggle */}
        <div className="mb-[20px] md:mb-[25px]">
          <div className="form-check flex items-center gap-[8px] mb-[15px]">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="rushJobsToggle"
              checked={rushJobsEnabled}
              onChange={(e) => setRushJobsEnabled(e.target.checked)}
            />
            <label htmlFor="rushJobsToggle" className="cursor-pointer font-medium">
              Accept Rush Jobs
            </label>
          </div>

          {/* Rush surcharge - only show when rush jobs enabled */}
          {rushJobsEnabled && (
            <div className="ml-[24px]">
              <label className="mb-[12px] font-medium block">Rush Surcharge (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="5"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter rush surcharge percentage"
                value={rushSurcharge || ''}
                onChange={(e) => setRushSurcharge(parseInt(e.target.value) || 0)}
              />
            </div>
          )}
        </div>

        {/* Weekend printing toggle */}
        <div className="mb-0">
          <div className="form-check flex items-center gap-[8px]">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="weekendPrintingToggle"
              checked={weekendPrintingEnabled}
              onChange={(e) => setWeekendPrintingEnabled(e.target.checked)}
            />
            <label htmlFor="weekendPrintingToggle" className="cursor-pointer font-medium">
              Weekend Printing Available
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadTimesCapacityCard;
