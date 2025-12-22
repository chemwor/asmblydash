import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  balances,
  nextPayout,
  jobEarnings,
  detailedTransactions,
  updatePayoutMethod
} from "../../features/makerPayouts/mockMakerPayouts";

interface EarningsFilters {
  search: string;
  status: string;
  dateRange: string;
  sortBy: string;
}

const MakerPayouts: React.FC = () => {
  const [isPayoutMethodModalOpen, setIsPayoutMethodModalOpen] = useState(false);
  const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(false);
  const [earningsFilters, setEarningsFilters] = useState<EarningsFilters>({
    search: '',
    status: 'All',
    dateRange: '30d',
    sortBy: 'Newest'
  });

  // Filter and sort earnings by job
  const filteredEarnings = useMemo(() => {
    let filtered = jobEarnings.filter(earning => {
      // Search filter
      if (earningsFilters.search) {
        const searchTerm = earningsFilters.search.toLowerCase();
        const matchesJobId = earning.jobId.toLowerCase().includes(searchTerm);
        const matchesProduct = earning.productName.toLowerCase().includes(searchTerm);
        if (!matchesJobId && !matchesProduct) {
          return false;
        }
      }

      // Status filter
      if (earningsFilters.status !== 'All' && earning.status !== earningsFilters.status) {
        return false;
      }

      // Date range filter
      const completedDate = new Date(earning.dateCompleted);
      const now = new Date('2024-12-20'); // Current date context
      const daysDiff = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (earningsFilters.dateRange) {
        case '7d':
          if (daysDiff > 7) return false;
          break;
        case '30d':
          if (daysDiff > 30) return false;
          break;
        case '90d':
          if (daysDiff > 90) return false;
          break;
      }

      return true;
    });

    // Sort results
    filtered.sort((a, b) => {
      const aNetPayout = a.basePayout + a.bonuses + a.adjustments;
      const bNetPayout = b.basePayout + b.bonuses + b.adjustments;

      switch (earningsFilters.sortBy) {
        case 'Newest':
          return new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime();
        case 'Highest net':
          return bNetPayout - aNetPayout;
        case 'Status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [earningsFilters]);

  const updateEarningsFilter = (key: keyof EarningsFilters, value: string) => {
    setEarningsFilters(prev => ({ ...prev, [key]: value }));
  };

  const scrollToStatements = () => {
    const statementsElement = document.getElementById('statements-section');
    if (statementsElement) {
      statementsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'paid': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Processing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Available': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Paid': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };
    return badgeClasses[status as keyof typeof badgeClasses] || badgeClasses.pending;
  };

  const getTransactionTypeBadge = (type: string) => {
    const badgeClasses = {
      'Job payout': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Bonus': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Adjustment': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Payout transfer': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return badgeClasses[type as keyof typeof badgeClasses] || badgeClasses['Job payout'];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return 'work';
      case 'bonus':
        return 'stars';
      case 'payout':
        return 'payments';
      default:
        return 'attach_money';
    }
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    return `${isNegative ? '-' : ''}$${absoluteAmount.toFixed(2)}`;
  };

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-[5px]">Earnings & Payouts</h5>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Track your job earnings and payout schedule
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
            Earnings & Payouts
          </li>
        </ol>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[25px] mb-[25px]">
        {/* Available Balance */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between mb-[10px]">
            <div>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mb-[5px]">
                Available Balance
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${balances.availableBalance.toFixed(2)}
              </h3>
            </div>
            <div className="w-[50px] h-[50px] bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <i className="material-symbols-outlined text-primary-500 text-2xl">account_balance_wallet</i>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <i className="material-symbols-outlined text-[16px] mr-1">trending_up</i>
              Ready to withdraw
            </span>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between mb-[10px]">
            <div>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mb-[5px]">
                Pending Balance
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${balances.pendingBalance.toFixed(2)}
              </h3>
            </div>
            <div className="w-[50px] h-[50px] bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <i className="material-symbols-outlined text-yellow-500 text-2xl">schedule</i>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-yellow-600 dark:text-yellow-400 flex items-center">
              <i className="material-symbols-outlined text-[16px] mr-1">schedule</i>
              Awaiting completion
            </span>
          </div>
        </div>

        {/* Paid Out (30d) */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between mb-[10px]">
            <div>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mb-[5px]">
                Paid Out (30d)
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${balances.paidOut30d.toFixed(2)}
              </h3>
            </div>
            <div className="w-[50px] h-[50px] bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <i className="material-symbols-outlined text-green-500 text-2xl">payments</i>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <i className="material-symbols-outlined text-[16px] mr-1">check_circle</i>
              Last 30 days
            </span>
          </div>
        </div>

        {/* Bonuses (30d) */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between mb-[10px]">
            <div>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mb-[5px]">
                Bonuses Earned (30d)
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${balances.bonuses30d.toFixed(2)}
              </h3>
            </div>
            <div className="w-[50px] h-[50px] bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <i className="material-symbols-outlined text-orange-500 text-2xl">stars</i>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-orange-600 dark:text-orange-400 flex items-center">
              <i className="material-symbols-outlined text-[16px] mr-1">bolt</i>
              On-time bonuses
            </span>
          </div>
        </div>
      </div>

      {/* Balance Breakdown & Next Payout Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        {/* Left Panel: Balance Breakdown */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px]">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Balance Breakdown</h5>
            </div>
          </div>
          <div className="trezo-card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#172036]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center justify-center">
                    <i className="material-symbols-outlined text-green-500 text-sm">check_circle</i>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Available</span>
                </div>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ${balances.breakdown.available.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#172036]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-md flex items-center justify-center">
                    <i className="material-symbols-outlined text-yellow-500 text-sm">schedule</i>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Pending</span>
                </div>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  ${balances.breakdown.pending.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#172036]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 rounded-md flex items-center justify-center">
                    <i className="material-symbols-outlined text-orange-500 text-sm">pause</i>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">On Hold</span>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  ${balances.breakdown.onHold.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-md flex items-center justify-center">
                    <i className="material-symbols-outlined text-red-500 text-sm">tune</i>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Adjustments</span>
                </div>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  ${balances.breakdown.adjustments.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Next Payout */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px]">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Next Payout</h5>
            </div>
          </div>
          <div className="trezo-card-content">
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  ${nextPayout.estimatedAmount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated amount
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-[#172036]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payout Date</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(nextPayout.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method</span>
                  <div className="flex items-center gap-2">
                    <i className="material-symbols-outlined text-gray-500 text-sm">account_balance</i>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {nextPayout.method}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(nextPayout.status)}`}>
                    {nextPayout.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setIsPayoutMethodModalOpen(true)}
                  className="flex-1 py-2 px-3 text-sm border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2038] rounded-md transition-all"
                >
                  Manage Method
                </button>
                <button
                  onClick={scrollToStatements}
                  className="flex-1 py-2 px-3 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-all"
                >
                  View Statements
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings by Job Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Earnings by Job</h5>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-[20px] md:mb-[25px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs, products..."
                value={earningsFilters.search}
                onChange={(e) => updateEarningsFilter('search', e.target.value)}
                className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] pl-[45px] pr-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
              <i className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </i>
            </div>

            {/* Status Filter */}
            <select
              value={earningsFilters.status}
              onChange={(e) => updateEarningsFilter('status', e.target.value)}
              className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={earningsFilters.dateRange}
              onChange={(e) => updateEarningsFilter('dateRange', e.target.value)}
              className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            {/* Sort */}
            <select
              value={earningsFilters.sortBy}
              onChange={(e) => updateEarningsFilter('sortBy', e.target.value)}
              className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
            >
              <option value="Newest">Newest First</option>
              <option value="Highest net">Highest Net Payout</option>
              <option value="Status">Status</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredEarnings.length} of {jobEarnings.length} jobs
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#172036]">
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Date Completed</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Job ID</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Product / Item</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Qty</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Base Payout</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Bonuses</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Adjustments</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Net Payout</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEarnings.map((earning) => {
                  const netPayout = earning.basePayout + earning.bonuses + earning.adjustments;

                  return (
                    <tr key={earning.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#1a2038]">
                      <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                        {new Date(earning.dateCompleted).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-2">
                        <Link
                          to={`/maker/jobs/${earning.jobId}`}
                          className="text-primary-500 hover:text-primary-600 font-medium transition-all"
                        >
                          {earning.jobId}
                        </Link>
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {earning.productName}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                        {earning.qty}
                      </td>
                      <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                        ${earning.basePayout.toFixed(2)}
                      </td>
                      <td className="py-4 px-2">
                        <span className={earning.bonuses > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                          {earning.bonuses > 0 ? `+$${earning.bonuses.toFixed(2)}` : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={earning.adjustments !== 0 ? (earning.adjustments < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400') : 'text-gray-400'}>
                          {earning.adjustments !== 0 ? formatCurrency(earning.adjustments) : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ${netPayout.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(earning.status)}`}>
                          {earning.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredEarnings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <i className="material-symbols-outlined text-4xl">work_off</i>
                        <span>No earnings match your current filters</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Transactions Accordion */}
        <div className="mt-[20px] border-t border-gray-200 dark:border-[#172036] pt-[20px]">
          <button
            onClick={() => setIsTransactionsExpanded(!isTransactionsExpanded)}
            className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-[#1a2038] rounded-md hover:bg-gray-100 dark:hover:bg-[#1f2142] transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="material-symbols-outlined text-primary-500">receipt_long</i>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Detailed Transactions
              </span>
              <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                {detailedTransactions.length} records
              </span>
            </div>
            <i className={`material-symbols-outlined text-gray-500 transition-transform ${isTransactionsExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </i>
          </button>

          {isTransactionsExpanded && (
            <div className="mt-4 border border-gray-200 dark:border-[#172036] rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#1a2038]">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">Reference</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedTransactions.map((transaction, index) => (
                      <tr key={transaction.id} className={`border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#1a2038] ${index % 2 === 0 ? 'bg-white dark:bg-[#0c1427]' : 'bg-gray-25 dark:bg-[#111632]'}`}>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTransactionTypeBadge(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {transaction.reference.startsWith('job-') ? (
                            <Link
                              to={`/maker/jobs/${transaction.reference}`}
                              className="text-primary-500 hover:text-primary-600 font-medium transition-all"
                            >
                              {transaction.reference}
                            </Link>
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              {transaction.reference}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`font-medium ${
                            transaction.amount >= 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div id="statements-section" className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Transactions</h5>
          </div>
          <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="trezo-card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#172036]">
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Transaction</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Payout Date</th>
                </tr>
              </thead>
              <tbody>
                {detailedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#1a2038]">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a2038] rounded-md flex items-center justify-center">
                          <i className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                            {getTypeIcon(transaction.type)}
                          </i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {transaction.jobTitle}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.jobId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`font-medium ${
                        transaction.amount >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                      {transaction.payoutDate ? new Date(transaction.payoutDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payout Schedule Info */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mt-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Payout Schedule</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <div className="text-center p-4 bg-gray-50 dark:bg-[#1a2038] rounded-md">
              <i className="material-symbols-outlined text-3xl text-primary-500 mb-2">schedule</i>
              <h6 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Weekly Payouts</h6>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Every Friday at 5:00 PM EST
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-[#1a2038] rounded-md">
              <i className="material-symbols-outlined text-3xl text-green-500 mb-2">account_balance</i>
              <h6 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Minimum Payout</h6>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                $50.00 minimum balance required
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-[#1a2038] rounded-md">
              <i className="material-symbols-outlined text-3xl text-blue-500 mb-2">info</i>
              <h6 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Processing Time</h6>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                1-3 business days to your account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Payout Method Modal */}
      {isPayoutMethodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsPayoutMethodModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Payout Method</h3>
                <button
                  onClick={() => setIsPayoutMethodModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-[#172036] rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <i className="material-symbols-outlined text-gray-500">account_balance</i>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Bank Account</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">••••1234</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsPayoutMethodModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#1a2038] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsPayoutMethodModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-all"
                  >
                    Add New Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MakerPayouts;

