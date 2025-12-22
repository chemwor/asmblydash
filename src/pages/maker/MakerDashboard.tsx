import React from 'react';
import { Link } from "react-router-dom";
import {
  finance,
  alerts,
  getActiveJobs,
  getDueSoonJobs,
  getOverdueJobs,
  computeOnTimeRate,
  getJobsByStatus,
  getRecentJobs,
  getWorkQueue
} from '../../features/makerDashboard/mockMakerDashboard';

const MakerDashboard: React.FC = () => {
  // Computed data using helper functions
  const activeJobs = getActiveJobs();
  const dueSoonJobs = getDueSoonJobs(48);
  const overdueJobs = getOverdueJobs();
  const onTimeRate = computeOnTimeRate(30);
  const pipelineCounts = getJobsByStatus();
  const recentJobs = getRecentJobs(4);
  const workQueue = getWorkQueue();

  // Mock data for KPI cards
  const dashboardData = {
    kpis: {
      activeJobs: {
        value: activeJobs.length.toString(),
        title: 'Active Jobs',
        icon: 'work',
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-50 dark:bg-blue-900/20',
        change: '+23%',
        changeType: 'positive' as const,
        period: 'vs last week'
      },
      dueSoon: {
        value: dueSoonJobs.length.toString(),
        title: 'Due Soon (48h)',
        icon: 'schedule',
        iconColor: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-orange-50 dark:bg-orange-900/20',
        change: '-12%',
        changeType: 'positive' as const,
        period: 'vs last week'
      },
      overdue: {
        value: overdueJobs.length.toString(),
        title: 'Overdue / At Risk',
        icon: 'warning',
        iconColor: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-50 dark:bg-red-900/20',
        change: '-50%',
        changeType: 'positive' as const,
        period: 'vs last week'
      },
      onTimeRate: {
        value: `${onTimeRate}%`,
        title: 'On-Time Rate (30d)',
        icon: 'check_circle',
        iconColor: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-50 dark:bg-green-900/20',
        change: '+2.1%',
        changeType: 'positive' as const,
        period: 'vs last month'
      },
      earnings: {
        value: '$2,847',
        title: 'Earnings (30d)',
        icon: 'payments',
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-50 dark:bg-purple-900/20',
        change: '+15.7%',
        changeType: 'positive' as const,
        period: 'vs last month'
      }
    },
    recentJobs: recentJobs,
    earnings: finance,
    alerts: alerts,
    quickStats: {
      todayPrinted: 8,
      totalHours: 23.4,
      materialUsed: '1.2kg',
      avgJobTime: '2.8 hours'
    },
    workQueue: workQueue
  };

  const formatDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days left`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 dark:text-red-400';
      case 'High': return 'text-orange-600 dark:text-orange-400';
      case 'Medium': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Mock quality & risk data
  const qualityRiskData = {
    qcFailures30d: 3,
    reprintsRequested30d: 2,
    blockedJobs: pipelineCounts['Blocked'] || 0,
    openIssueTickets: 1,
    recentIssues: [
      {
        id: 'QR-2024-001',
        type: 'Quality',
        title: 'Layer adhesion issue - Phone Case',
        status: 'Investigating',
        date: '2024-12-18'
      },
      {
        id: 'QR-2024-002',
        type: 'Reprint',
        title: 'Dimensional accuracy - Keycaps',
        status: 'In Progress',
        date: '2024-12-17'
      }
    ]
  };

  const pipelineStatuses = [
    {
      key: 'Queued',
      count: pipelineCounts['Queued'] || 0,
      icon: 'queue',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    {
      key: 'Printing',
      count: pipelineCounts['Printing'] || 0,
      icon: 'print',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
      key: 'QC',
      count: pipelineCounts['QC'] || 0,
      icon: 'fact_check',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-700'
    },
    {
      key: 'Packing',
      count: pipelineCounts['Packing'] || 0,
      icon: 'inventory_2',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700'
    },
    {
      key: 'Shipped',
      count: pipelineCounts['Shipped'] || 0,
      icon: 'local_shipping',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700'
    },
    {
      key: 'Blocked',
      count: pipelineCounts['Blocked'] || 0,
      icon: 'block',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700'
    }
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0 text-gray-900 dark:text-white">Dashboard</h5>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your production workload and earnings at a glance</p>
        </div>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/maker"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500 text-gray-700 dark:text-gray-300"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Maker
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-gray-700 dark:text-gray-300">
            Dashboard
          </li>
        </ol>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[20px] md:gap-[25px] mb-[25px]">
        {Object.entries(dashboardData.kpis).map(([key, kpi]) => (
          <div key={key} className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full ${kpi.iconBg} flex items-center justify-center`}>
                <i className={`material-symbols-outlined ${kpi.iconColor}`}>
                  {kpi.icon}
                </i>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                  kpi.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  <i className={`material-symbols-outlined text-xs mr-1 ${
                    kpi.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {kpi.changeType === 'positive' ? 'trending_up' : 'trending_down'}
                  </i>
                  {kpi.change}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {kpi.value}
              </h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {kpi.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {kpi.period}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Job Pipeline Snapshot */}
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700 mb-[25px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Job Pipeline</h6>
          <Link
            to="/maker/jobs"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            View All Jobs
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {pipelineStatuses.map((status) => (
            <div
              key={status.key}
              className={`${status.bgColor} ${status.borderColor} border rounded-lg p-4 text-center transition-all hover:shadow-sm`}
            >
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  <i className={`material-symbols-outlined ${status.color} text-2xl`}>
                    {status.icon}
                  </i>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {status.count}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {status.key}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Flow Indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Flow:</span>
              <div className="flex items-center gap-1">
                <span>Queued</span>
                <i className="material-symbols-outlined text-xs">arrow_forward</i>
                <span>Printing</span>
                <i className="material-symbols-outlined text-xs">arrow_forward</i>
                <span>QC</span>
                <i className="material-symbols-outlined text-xs">arrow_forward</i>
                <span>Packing</span>
                <i className="material-symbols-outlined text-xs">arrow_forward</i>
                <span>Shipped</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-[20px]">
            <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Jobs</h6>
            <Link
              to="/maker/jobs"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {dashboardData.recentJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {job.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {job.id} • {job.customer}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                        {job.priority} Priority
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDaysUntilDue(job.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{job.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700">
          <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-[20px]">Today's Production</h6>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                  <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">print</i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Items Printed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{dashboardData.quickStats.todayPrinted}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-3">
                  <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">schedule</i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Print Time</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total hours</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{dashboardData.quickStats.totalHours}h</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mr-3">
                  <i className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-sm">inventory</i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Material Used</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Filament</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{dashboardData.quickStats.materialUsed}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                  <i className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">avg_time</i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Avg Job Time</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Per item</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{dashboardData.quickStats.avgJobTime}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h6 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h6>
            <div className="space-y-3">
              <Link
                to="/maker/jobs/new"
                className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Accept New Job
              </Link>
              <Link
                to="/maker/materials"
                className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Check Materials
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700 mb-[25px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Equipment Status</h6>
          <Link
            to="/maker/equipment"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            Manage Equipment
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Printer #1 - Prusa i3', status: 'Printing', job: 'Phone Case Batch', timeLeft: '2h 15m', color: 'green' },
            { name: 'Printer #2 - Ender 3', status: 'Idle', job: 'Available', timeLeft: '-', color: 'blue' },
            { name: 'Printer #3 - CR-10', status: 'Maintenance', job: 'Scheduled Service', timeLeft: '1 day', color: 'orange' },
            { name: 'Resin Printer', status: 'Printing', job: 'Miniature Set', timeLeft: '4h 32m', color: 'green' }
          ].map((equipment, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{equipment.name}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  equipment.color === 'green' ? 'bg-green-500' :
                  equipment.color === 'blue' ? 'bg-blue-500' :
                  equipment.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                }`}></div>
              </div>
              <p className={`text-xs font-medium mb-1 ${
                equipment.color === 'green' ? 'text-green-600 dark:text-green-400' :
                equipment.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                equipment.color === 'orange' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {equipment.status}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{equipment.job}</p>
              {equipment.timeLeft !== '-' && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{equipment.timeLeft} remaining</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Work Queue */}
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Work Queue</h6>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Sorted by Due Date</span>
            <Link
              to="/maker/jobs"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              View All Jobs
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Product / Item
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Material
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#0c1427] divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardData.workQueue.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {job.product}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.qty}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {job.material}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(job.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: new Date(job.dueDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDaysUntilDue(job.dueDate)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.priorityColor}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      to={`/maker/jobs/${job.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                    >
                      Open Job
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {dashboardData.workQueue.length} jobs in queue</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs">Rush Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs">Standard Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality & Risk Panel */}
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700 mb-[25px]">
        <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-[20px]">Quality & Risk</h6>

        <div className="space-y-6">
          {/* Quality Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {qualityRiskData.qcFailures30d}
              </div>
              <div className="text-xs font-medium text-orange-700 dark:text-orange-300">
                QC Failures (30d)
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {qualityRiskData.reprintsRequested30d}
              </div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Reprints (30d)
              </div>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                {qualityRiskData.blockedJobs}
              </div>
              <div className="text-xs font-medium text-red-700 dark:text-red-300">
                Blocked Jobs
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {qualityRiskData.openIssueTickets}
              </div>
              <div className="text-xs font-medium text-purple-700 dark:text-purple-300">
                Open Issues
              </div>
            </div>
          </div>

          {/* Recent Issues */}
          <div>
            <h6 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Issues</h6>
            <div className="space-y-3">
              {qualityRiskData.recentIssues.map((issue) => (
                <div key={issue.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {issue.id} • {issue.type}
                      </p>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      issue.status === 'Investigating' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(issue.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4">
            <div className="flex">
              <i className="material-symbols-outlined text-green-600 dark:text-green-400 mr-2 flex-shrink-0">verified</i>
              <div className="text-sm text-green-800 dark:text-green-300">
                <p className="font-medium mb-1">Quality Status: Good</p>
                <p>Your quality metrics are within acceptable ranges. Keep up the excellent work!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/maker/quality"
            className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            View Quality Reports
          </Link>
        </div>
      </div>

      {/* Earnings & Payouts Card */}
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings & Payouts</h6>
          <Link
            to="/maker/payouts"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            View Earnings
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">account_balance_wallet</i>
              </div>
            </div>
            <div className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">
              Available Balance
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {dashboardData.earnings.availableBalance}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                <i className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-lg">pending</i>
              </div>
            </div>
            <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">
              Pending Balance
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {dashboardData.earnings.pendingBalance}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">event</i>
              </div>
            </div>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
              Next Payout Date
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {dashboardData.earnings.nextPayoutDate}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                <i className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-lg">payments</i>
              </div>
            </div>
            <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
              Estimated Next Payout
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {dashboardData.earnings.estimatedNextPayout}
            </div>
          </div>
        </div>

        {/* Payout Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Payout Schedule
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Automatic {dashboardData.earnings.payoutFrequency.toLowerCase()} transfers
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts & Next Actions</h6>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              dashboardData.alerts.length > 0 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>
              {dashboardData.alerts.length} Alert{dashboardData.alerts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {dashboardData.alerts.map((alert) => {
            const getAlertStyles = (type: string) => {
              switch (type) {
                case 'urgent':
                  return {
                    borderColor: 'border-l-red-500',
                    bgColor: 'bg-red-50 dark:bg-red-900/10',
                    iconColor: 'text-red-600 dark:text-red-400',
                    iconBg: 'bg-red-100 dark:bg-red-900/30'
                  };
                case 'blocked':
                  return {
                    borderColor: 'border-l-orange-500',
                    bgColor: 'bg-orange-50 dark:bg-orange-900/10',
                    iconColor: 'text-orange-600 dark:text-orange-400',
                    iconBg: 'bg-orange-100 dark:bg-orange-900/30'
                  };
                case 'qc':
                  return {
                    borderColor: 'border-l-blue-500',
                    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/30'
                  };
                case 'payout':
                  return {
                    borderColor: 'border-l-green-500',
                    bgColor: 'bg-green-50 dark:bg-green-900/10',
                    iconColor: 'text-green-600 dark:text-green-400',
                    iconBg: 'bg-green-100 dark:bg-green-900/30'
                  };
                default:
                  return {
                    borderColor: 'border-l-gray-500',
                    bgColor: 'bg-gray-50 dark:bg-gray-900/10',
                    iconColor: 'text-gray-600 dark:text-gray-400',
                    iconBg: 'bg-gray-100 dark:bg-gray-900/30'
                  };
              }
            };

            const styles = getAlertStyles(alert.type);

            return (
              <div
                key={alert.id}
                className={`${styles.bgColor} ${styles.borderColor} border-l-4 rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <i className={`material-symbols-outlined ${styles.iconColor} text-lg`}>
                      {alert.icon}
                    </i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          {alert.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(alert.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <Link
                        to={alert.actionLink}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          alert.type === 'urgent' 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                            : alert.type === 'blocked'
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50'
                            : alert.type === 'qc'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                        }`}
                      >
                        <i className="material-symbols-outlined text-xs mr-1">
                          {alert.type === 'urgent' ? 'arrow_forward' :
                           alert.type === 'blocked' ? 'contact_support' :
                           alert.type === 'qc' ? 'upload' : 'visibility'}
                        </i>
                        {alert.action}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No alerts state */}
        {dashboardData.alerts.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</i>
            </div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">All Clear!</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">No urgent actions required at this time.</p>
          </div>
        )}

        {/* Alert Summary */}
        {dashboardData.alerts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600 dark:text-gray-400">
                {dashboardData.alerts.filter(a => a.type === 'urgent').length > 0 && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {dashboardData.alerts.filter(a => a.type === 'urgent').length} urgent action{dashboardData.alerts.filter(a => a.type === 'urgent').length !== 1 ? 's' : ''} required
                  </span>
                )}
                {dashboardData.alerts.filter(a => a.type === 'urgent').length === 0 && (
                  <span>Review and address alerts to keep production smooth</span>
                )}
              </div>
              <Link
                to="/maker/notifications"
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                View All Notifications
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MakerDashboard;
