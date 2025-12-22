import React, { useState, useEffect } from 'react';
import type { ApexOptions } from "apexcharts";
import {
  kpis,
  topDesigns,
  topDesignsTable,
  recentTransactions,
  transactions,
  timeSeries30d,
  timeSeries90d,
  payoutSummary,
  updatePayoutMethod,
  type PayoutMethodPayload
} from '../../features/designerRoyalties/mockDesignerRoyalties';

const DesignerRoyalties: React.FC = () => {
  // Define trend type
  type TrendType = 'up' | 'down';

  const allRoyaltyTransactions = transactions;

  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  // State for chart period toggle
  const [chartPeriod, setChartPeriod] = useState<'30d' | '90d'>('30d');

  // State for dynamically loaded Chart component
  const [ChartComponent, setChartComponent] = useState<React.ComponentType<any> | null>(null);

  // States for royalty transactions filters
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<'all' | 'Pending' | 'Available' | 'Paid'>('all');
  const [transactionDateRange, setTransactionDateRange] = useState<'30d' | '90d'>('30d');
  const [transactionSortBy, setTransactionSortBy] = useState<'newest' | 'highest'>('newest');
  const [transactionSearchTerm, setTransactionSearchTerm] = useState<string>('');

  // Payout modal state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethodPayload>({
    type: 'Bank',
    accountHolder: 'John Designer',
    accountDetails: '•••• •••• •••• 1234'
  });

  // Dynamically import react-apexcharts
  useEffect(() => {
    import("react-apexcharts").then((module) => {
      setChartComponent(() => module.default);
    });
  }, []);

  const chartSeries = [{
    name: 'Daily Royalties',
    data: chartPeriod === '30d' ? timeSeries30d : timeSeries90d
  }];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#10B981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        },
        formatter: function (val) {
          return '$' + val.toFixed(0);
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    tooltip: {
      x: {
        format: 'MMM dd, yyyy'
      },
      y: {
        formatter: function (val) {
          return '$' + val.toFixed(2);
        }
      }
    }
  };

  // Filter transactions based on status
  const filteredTransactions = recentTransactions.filter(transaction =>
    statusFilter === 'all' || transaction.status === statusFilter
  );

  // Filter and sort royalty transactions
  const getFilteredRoyaltyTransactions = () => {
    let filtered = allRoyaltyTransactions;

    // Filter by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (transactionDateRange === '30d' ? 30 : 90));
    filtered = filtered.filter(transaction => new Date(transaction.date) >= cutoffDate);

    // Filter by status
    if (transactionStatusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === transactionStatusFilter);
    }

    // Filter by search term (design name or design ID)
    if (transactionSearchTerm.trim()) {
      const searchLower = transactionSearchTerm.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.design.toLowerCase().includes(searchLower) ||
        transaction.designId.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (transactionSortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    return filtered;
  };

  const filteredRoyaltyTransactions = getFilteredRoyaltyTransactions();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadge = (status: string) => {
    const badges = {
      'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  // Get status badge class for transactions
  const getTransactionStatusBadge = (status: string) => {
    const badges = {
      'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Available': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return badges[status as keyof typeof badges] || badges.Pending;
  };

  // Get source badge class
  const getSourceBadge = (source: string) => {
    const badges = {
      'Seller': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Marketplace': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Direct License': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return badges[source as keyof typeof badges] || badges.Seller;
  };

  // Handle payout method save
  const handleSavePayoutMethod = async () => {
    try {
      const result = await updatePayoutMethod(payoutMethod);
      setIsPayoutModalOpen(false);
      alert(result.message);
    } catch (error) {
      alert('Failed to update payout method');
    }
  };

  // Handle download statement
  const handleDownloadStatement = () => {
    // Placeholder for downloading statement
    alert('Statement download started! You will receive an email when ready.');
  };

  return (
    <div className="main-content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Royalties
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track earnings and usage across your licensed designs
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Royalties (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <i className="ri-money-dollar-circle-line text-green-600 dark:text-green-300 text-xl"></i>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Royalties (30d)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(kpis.royalties30d.value)}
              </p>
              <div className="flex items-center mt-1">
                <i className={`ri-arrow-${kpis.royalties30d.trend === 'up' ? 'up' : 'down'}-line text-sm ${
                  kpis.royalties30d.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}></i>
                <span className={`text-xs font-medium ml-1 ${
                  kpis.royalties30d.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpis.royalties30d.change}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prints Completed (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <i className="ri-printer-line text-blue-600 dark:text-blue-300 text-xl"></i>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Prints Completed (30d)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpis.printsCompleted30d.value.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <i className={`ri-arrow-${kpis.printsCompleted30d.trend === 'up' ? 'up' : 'down'}-line text-sm ${
                  kpis.printsCompleted30d.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}></i>
                <span className={`text-xs font-medium ml-1 ${
                  kpis.printsCompleted30d.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpis.printsCompleted30d.change}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Listings Using Your Files */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <i className="ri-file-list-3-line text-purple-600 dark:text-purple-300 text-xl"></i>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Listings Using Your Files
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpis.activeListings.value}
              </p>
              <div className="flex items-center mt-1">
                <i className={`ri-arrow-${kpis.activeListings.trend === 'up' ? 'up' : 'down'}-line text-sm ${
                  kpis.activeListings.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}></i>
                <span className={`text-xs font-medium ml-1 ${
                  kpis.activeListings.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(kpis.activeListings.change)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Design Earnings (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <i className="ri-trophy-line text-orange-600 dark:text-orange-300 text-xl"></i>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Top Design Earnings (30d)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(kpis.topDesignEarnings30d.value)}
              </p>
              <div className="flex items-center mt-1">
                <i className={`ri-arrow-${kpis.topDesignEarnings30d.trend === 'up' ? 'up' : 'down'}-line text-sm ${
                  kpis.topDesignEarnings30d.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}></i>
                <span className={`text-xs font-medium ml-1 ${
                  kpis.topDesignEarnings30d.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpis.topDesignEarnings30d.change}%
                </span>
                <span className="text-xs text-gray-500 ml-1">{kpis.topDesignEarnings30d.designName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Royalty Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Royalty Transactions
              </h4>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'pending')}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Design & Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prints
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.design}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.client}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.prints}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(transaction.rate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.earnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-gray-400 dark:text-gray-500">
                <i className="ri-file-list-line text-4xl mb-2"></i>
                <p className="text-sm">No transactions found for the selected filter.</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Performing Designs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Designs
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last 30 days
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {topDesigns.map((design, index) => (
                <div key={design.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {design.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {design.prints} prints
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(design.earnings)}
                    </p>
                    <div className="flex items-center justify-end">
                      <i className={`ri-arrow-${design.trend === 'up' ? 'up' : 'down'}-line text-xs ${
                        design.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}></i>
                      <span className={`text-xs ml-1 ${
                        design.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(design.trendPercent)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <i className="ri-lightbulb-line text-blue-600 dark:text-blue-400 mr-2"></i>
            Insights
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Key findings from your performance data
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Top Design Usage */}
            <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3 flex-shrink-0">
                <i className="ri-trophy-line text-blue-600 dark:text-blue-400 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Your top design was used by <strong>{Math.max(...topDesignsTable.map(d => d.activeSellers))} sellers</strong> this month
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {topDesignsTable.find(d => d.activeSellers === Math.max(...topDesignsTable.map(d => d.activeSellers)))?.name}
                </p>
              </div>
            </div>

            {/* Zero Prints Alert */}
            <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mr-3 flex-shrink-0">
                <i className="ri-alert-line text-yellow-600 dark:text-yellow-400 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                  <strong>{topDesignsTable.filter(d => d.printsCompleted30d === 0).length || 2} designs</strong> had zero prints in the last 30 days
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Consider promoting these designs
                </p>
              </div>
            </div>

            {/* Royalties Growth */}
            <div className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full mr-3 flex-shrink-0">
                <i className="ri-arrow-up-line text-green-600 dark:text-green-400 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-200">
                  Royalties are up <strong>{kpis.royalties30d.change}%</strong> vs prior period
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  {formatCurrency(kpis.royalties30d.value)} earned this month
                </p>
              </div>
            </div>

            {/* High Performing Categories */}
            <div className="flex items-start p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3 flex-shrink-0">
                <i className="ri-pie-chart-line text-purple-600 dark:text-purple-400 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                  <strong>Branding</strong> category leads with {topDesignsTable.filter(d => d.category === 'Branding').length} designs
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  {formatCurrency(topDesignsTable.filter(d => d.category === 'Branding').reduce((sum, d) => sum + d.revenue30d, 0))} revenue this month
                </p>
              </div>
            </div>

            {/* Marketplace Performance */}
            <div className="flex items-start p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-3 flex-shrink-0">
                <i className="ri-store-2-line text-orange-600 dark:text-orange-400 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                  <strong>{filteredRoyaltyTransactions.filter(t => t.source === 'Marketplace').length}%</strong> of transactions from marketplace
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Higher reach than direct sales
                </p>
              </div>
            </div>

            {/* Average Rate Insight */}
            <div className="flex items-start p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3 flex-shrink-0">
                <i className="ri-money-dollar-circle-line text-indigo-600 dark:text-indigo-400 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                  Average rate of <strong>{formatCurrency(filteredRoyaltyTransactions.reduce((sum, t) => sum + t.rate, 0) / filteredRoyaltyTransactions.length)}</strong> per print
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                  Across all active designs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payouts and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Royalties Over Time Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Royalties Over Time
            </h4>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setChartPeriod('30d')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  chartPeriod === '30d'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <i className="ri-calendar-30-line"></i>
                Last 30 Days
              </button>
              <button
                onClick={() => setChartPeriod('90d')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  chartPeriod === '90d'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <i className="ri-calendar-90-line"></i>
                Last 90 Days
              </button>
            </div>
          </div>

          <div className="p-6">
            {ChartComponent && (
              <ChartComponent
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={350}
              />
            )}
          </div>
        </div>

        {/* Payouts Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payouts
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Balance & payout information
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Available Balance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Available Balance
                </span>
                <i className="ri-money-dollar-circle-line text-green-500"></i>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(payoutSummary.availableBalance)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ready for payout
              </p>
            </div>

            {/* Pending Balance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Balance
                </span>
                <i className="ri-time-line text-yellow-500"></i>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(payoutSummary.pendingBalance)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Processing transactions
              </p>
            </div>

            {/* Next Payout */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Next Payout
                </span>
                <i className="ri-calendar-check-line text-blue-600 dark:text-blue-400"></i>
              </div>
              <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {formatDate(payoutSummary.nextPayoutDate)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Estimated: {formatCurrency(payoutSummary.estimatedNextPayout)}
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Payout Method
                </span>
                <i className="ri-bank-card-line text-gray-400"></i>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                  <i className="ri-bank-line text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {payoutSummary.payoutMethod.type}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {payoutSummary.payoutMethod.masked}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsPayoutModalOpen(true)}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <i className="ri-settings-3-line mr-2"></i>
                Manage Payout Method
              </button>
              <button
                onClick={handleDownloadStatement}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
              >
                <i className="ri-download-2-line mr-2"></i>
                Download Statement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Royalties Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Royalties Transactions
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Detailed transaction history of all royalty earnings
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredRoyaltyTransactions.length} transactions
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-0 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search design name or ID..."
                  value={transactionSearchTerm}
                  onChange={(e) => setTransactionSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={transactionStatusFilter}
              onChange={(e) => setTransactionStatusFilter(e.target.value as 'all' | 'Pending' | 'Available' | 'Paid')}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Available">Available</option>
              <option value="Paid">Paid</option>
            </select>

            {/* Date Range */}
            <select
              value={transactionDateRange}
              onChange={(e) => setTransactionDateRange(e.target.value as '30d' | '90d')}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            {/* Sort */}
            <select
              value={transactionSortBy}
              onChange={(e) => setTransactionSortBy(e.target.value as 'newest' | 'highest')}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Amount</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Design
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRoyaltyTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(transaction.date)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.id}
                    </div>
                  </td>

                  {/* Design */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white max-w-48">
                      {transaction.design}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.designId}
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSourceBadge(transaction.source)}`}>
                      {transaction.source}
                    </span>
                  </td>

                  {/* Reference */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {transaction.reference}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.qty}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      prints
                    </div>
                  </td>

                  {/* Rate */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.rate)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      per print
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRoyaltyTransactions.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              <i className="ri-file-list-line text-4xl mb-2"></i>
              <p className="text-sm">No transactions found for the selected filters.</p>
            </div>
          </div>
        )}

        {/* Table Footer with Summary */}
        {filteredRoyaltyTransactions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-6">
                <span>
                  Showing {filteredRoyaltyTransactions.length} transactions
                </span>
                <span>
                  Total Prints: {filteredRoyaltyTransactions.reduce((sum, t) => sum + t.qty, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>
                  Total Amount: {formatCurrency(filteredRoyaltyTransactions.reduce((sum, t) => sum + t.amount, 0))}
                </span>
                <span>
                  Avg Rate: {formatCurrency(filteredRoyaltyTransactions.reduce((sum, t) => sum + t.rate, 0) / filteredRoyaltyTransactions.length)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payout Method Management Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsPayoutModalOpen(false)}
            ></div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Manage Payout Method
                  </h3>
                  <button
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Method Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Payout Method Type
                    </label>
                    <select
                      value={payoutMethod.type}
                      onChange={(e) => setPayoutMethod(prev => ({ ...prev, type: e.target.value as 'Bank' | 'Stripe' | 'PayPal' }))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Bank">Bank Transfer</option>
                      <option value="Stripe">Stripe Connect</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>

                  {/* Account Holder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={payoutMethod.accountHolder}
                      onChange={(e) => setPayoutMethod(prev => ({ ...prev, accountHolder: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter account holder name"
                    />
                  </div>

                  {/* Account Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      {payoutMethod.type === 'Bank' ? 'Bank Account' :
                       payoutMethod.type === 'Stripe' ? 'Stripe Account' : 'PayPal Email'}
                    </label>
                    <input
                      type="text"
                      value={payoutMethod.accountDetails}
                      onChange={(e) => setPayoutMethod(prev => ({ ...prev, accountDetails: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        payoutMethod.type === 'Bank' ? 'Enter bank account number' :
                        payoutMethod.type === 'Stripe' ? 'Enter Stripe account ID' :
                        'Enter PayPal email address'
                      }
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start">
                      <i className="ri-shield-check-line text-green-400 text-lg mt-0.5 mr-3"></i>
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">
                          Secure & Encrypted
                        </h4>
                        <p className="text-xs text-gray-300">
                          Your payment information is encrypted and stored securely. We never store full account details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-8">
                  <button
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePayoutMethod}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Save Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerRoyalties;
