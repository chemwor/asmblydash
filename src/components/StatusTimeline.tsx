import React from 'react';
import type { Job, ActivityEntry } from '../features/makerJobs/mockJobs';

interface StatusTimelineProps {
  job: Job;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ job }) => {
  // Define the status flow
  const statusSteps = [
    { key: 'Queued', label: 'Queued', icon: 'hourglass_empty' },
    { key: 'Printing', label: 'Printing', icon: 'print' },
    { key: 'QC', label: 'QC', icon: 'verified' },
    { key: 'Packing', label: 'Packing', icon: 'inventory_2' },
    { key: 'Shipped', label: 'Shipped', icon: 'local_shipping' }
  ];

  // Get current step index
  const getCurrentStepIndex = (status: string) => {
    const index = statusSteps.findIndex(step => step.key === status);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex(job.status);

  // Get step status (completed, current, or upcoming)
  const getStepStatus = (stepIndex: number) => {
    if (job.status === 'Delivered') {
      return 'completed'; // All steps completed for delivered jobs
    }
    if (job.status === 'Blocked') {
      return stepIndex === currentStepIndex ? 'blocked' : stepIndex < currentStepIndex ? 'completed' : 'upcoming';
    }
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  // Get step styling classes
  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'current':
        return 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600';
    }
  };

  // Get connector line styling
  const getConnectorClasses = (stepIndex: number) => {
    const stepStatus = getStepStatus(stepIndex);
    if (stepStatus === 'completed') {
      return 'bg-green-200 dark:bg-green-800';
    }
    return 'bg-gray-200 dark:bg-gray-600';
  };

  // Format activity timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString();
  };

  // Get activity entries (mock some if none exist)
  const getActivityEntries = (): ActivityEntry[] => {
    if (job.activity && job.activity.length > 0) {
      return job.activity.slice(0, 5); // Show last 5 activities
    }

    // Mock some activity based on current status
    const mockActivity: ActivityEntry[] = [];
    const baseTime = new Date();

    if (job.status === 'Delivered' || job.status === 'Shipped') {
      mockActivity.push({
        id: `${job.id}-delivered`,
        status: 'Delivered',
        timestamp: new Date(baseTime.getTime() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      });
    }

    if (['Delivered', 'Shipped', 'Packing'].includes(job.status)) {
      mockActivity.push({
        id: `${job.id}-packing`,
        status: 'Packing',
        timestamp: new Date(baseTime.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      });
    }

    if (['Delivered', 'Shipped', 'Packing', 'QC'].includes(job.status)) {
      mockActivity.push({
        id: `${job.id}-qc`,
        status: 'QC',
        timestamp: new Date(baseTime.getTime() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      });
    }

    if (['Delivered', 'Shipped', 'Packing', 'QC', 'Printing'].includes(job.status)) {
      mockActivity.push({
        id: `${job.id}-printing`,
        status: 'Printing',
        timestamp: new Date(baseTime.getTime() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      });
    }

    mockActivity.push({
      id: `${job.id}-queued`,
      status: 'Queued',
      timestamp: new Date(baseTime.getTime() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    });

    return mockActivity.slice(0, 5);
  };

  const activityEntries = getActivityEntries();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
      <h3 className="text-[18px] font-semibold text-dark dark:text-title-dark mb-[20px] flex items-center">
        <i className="material-symbols-outlined text-[20px] mr-[8px] text-blue-600 dark:text-blue-400">timeline</i>
        Status Timeline
      </h3>

      {/* Status Steps */}
      <div className="mb-[25px]">
        <div className="flex items-center justify-between relative">
          {/* Background connector line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 dark:bg-gray-600 transform -translate-y-1/2 z-0"></div>

          {statusSteps.map((step, index) => {
            const stepStatus = getStepStatus(index);
            const isLast = index === statusSteps.length - 1;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                {/* Step Circle */}
                <div
                  className={`w-[40px] h-[40px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${getStepClasses(stepStatus)}`}
                >
                  <i className={`material-symbols-outlined text-[18px] ${
                    stepStatus === 'completed' ? 'material-symbols-outlined' : 'material-symbols-outlined'
                  }`}>
                    {stepStatus === 'completed' ? 'check' : step.icon}
                  </i>
                </div>

                {/* Step Label */}
                <span className={`text-xs font-medium mt-[8px] transition-colors duration-200 ${
                  stepStatus === 'current'
                    ? 'text-blue-600 dark:text-blue-400'
                    : stepStatus === 'completed'
                    ? 'text-green-600 dark:text-green-400'
                    : stepStatus === 'blocked'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {step.label}
                </span>

                {/* Active Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute top-1/2 left-[40px] w-[calc(100vw/5-40px)] h-[2px] transform -translate-y-1/2 transition-colors duration-200 ${
                      getConnectorClasses(index)
                    }`}
                    style={{
                      width: `calc(${100 / statusSteps.length}vw - ${40 / statusSteps.length}px)`
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Status Info */}
        {job.status === 'Blocked' && (
          <div className="mt-[15px] p-[12px] bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <i className="material-symbols-outlined text-red-600 dark:text-red-400 text-[16px] mr-[8px]">block</i>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">Job is currently blocked</span>
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div>
        <h4 className="text-[14px] font-semibold text-dark dark:text-title-dark mb-[15px] flex items-center">
          <i className="material-symbols-outlined text-[16px] mr-[5px] text-gray-500">history</i>
          Recent Activity
        </h4>

        <div className="space-y-[12px]">
          {activityEntries.length > 0 ? (
            activityEntries.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-[8px]">
                <div className="flex items-center">
                  <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center mr-[12px] text-[12px] ${
                    activity.status === 'Delivered'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : activity.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : activity.status === 'Packing'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : activity.status === 'QC'
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : activity.status === 'Printing'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                      : activity.status === 'Blocked'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    <i className="material-symbols-outlined text-[12px]">
                      {activity.status === 'Delivered' ? 'check_circle'
                        : activity.status === 'Shipped' ? 'local_shipping'
                        : activity.status === 'Packing' ? 'inventory_2'
                        : activity.status === 'QC' ? 'verified'
                        : activity.status === 'Printing' ? 'print'
                        : activity.status === 'Blocked' ? 'block'
                        : 'radio_button_checked'
                      }
                    </i>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-dark dark:text-title-dark">
                      Status changed to {activity.status}
                    </span>
                    {activity.note && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {activity.note}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-[20px]">
              <i className="material-symbols-outlined text-gray-400 text-[24px] mb-[8px]">history</i>
              <p className="text-sm text-gray-500 dark:text-gray-400">No activity recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;
