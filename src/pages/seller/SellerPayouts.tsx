import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import type { ApexOptions } from "apexcharts";
import {
  balances,
  getInitialNextPayout,
  transactions as recentPayouts,
  generateDetailedTransactions,
  statements,
  updatePayoutMethod
} from "../../features/sellerPayouts/mockPayouts";

interface PayoutData {
  id: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Processing' | 'Failed';
  statusClass: string;
  method: string;
  reference: string;
  fees: string;
}

interface TransactionData {
  id: string;
  orderId: string;
  amount: string;
  fees: string;
  netAmount: string;
  date: string;
  type: 'Sale' | 'Refund' | 'Chargeback';
  typeClass: string;
}

interface DetailedTransaction {
  id: string;
  date: string;
  type: 'Order Earnings' | 'Platform Fee' | 'Maker Cost' | 'Refund' | 'Adjustment' | 'Payout';
  typeClass: string;
  reference: string;
  description: string;
  gross: number;
  fees: number;
  net: number;
  status: 'Pending' | 'Completed' | 'Reversed';
  statusClass: string;
}

interface StatementData {
  id: string;
  period: string;
  totalOrders: number;
  grossRevenue: number;
  totalFees: number;
  netEarnings: number;
  status: 'Draft' | 'Final';
  statusClass: string;
  generatedDate: string;
}

const SellerPayouts: React.FC = () => {
  // Chart component state for dynamic imports
  const [ChartComponent, setChartComponent] = useState<React.ComponentType<any> | null>(null);

  // Filter states for transactions table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('30d');

  // Modal state for payout method management
  const [payoutMethodModalOpen, setPayoutMethodModalOpen] = useState(false);

  // Form state for payout method
  const [payoutMethodForm, setPayoutMethodForm] = useState({
    payoutType: 'Bank Transfer',
    accountHolderName: '',
    routingNumber: '',
    accountNumber: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: ''
  });

  // Form errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock data for payouts and billing (with updated nextPayout state)
  const [nextPayoutData, setNextPayoutData] = useState(getInitialNextPayout());

  // Use imported balances data
  const payoutData = balances;

  // Dynamically import react-apexcharts
  useEffect(() => {
    import("react-apexcharts").then((module) => {
      setChartComponent(() => module.default);
    });
  }, []);

  // Generate last 30 days for x-axis
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
  };

  const payoutsOptions: ApexOptions = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#10B981"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.5,
      },
    },
    xaxis: {
      categories: getLast30Days(),
      axisTicks: { show: false, color: "#ECEEF2" },
      axisBorder: { show: false, color: "#ECEEF2" },
      labels: {
        show: true,
        style: { colors: "#8695AA", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: { colors: "#64748B", fontSize: "12px" },
        formatter: (value) => `$${value}`,
      },
    },
    tooltip: {
      y: { formatter: (value) => `$${value}` },
    },
  };

  const marginOptions: ApexOptions = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
      type: 'line',
    },
    colors: ["#3B82F6"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    xaxis: {
      categories: getLast30Days(),
      axisTicks: { show: false, color: "#ECEEF2" },
      axisBorder: { show: false, color: "#ECEEF2" },
      labels: {
        show: true,
        style: { colors: "#8695AA", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: { colors: "#64748B", fontSize: "12px" },
        formatter: (value) => `${value}%`,
      },
    },
    tooltip: {
      y: { formatter: (value) => `${value}%` },
    },
  };

  const detailedTransactions = generateDetailedTransactions();

  // Filter transactions based on current filters
  const filteredTransactions = detailedTransactions.filter(transaction => {
    const matchesSearch = searchTerm === '' ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'All' || transaction.status === filterStatus;

    // Date range filtering
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    const daysAgo = filterDateRange === '7d' ? 7 : filterDateRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const matchesDateRange = transactionDate >= cutoffDate;

    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });

  // Form validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!payoutMethodForm.accountHolderName.trim()) {
      errors.accountHolderName = 'Account holder name is required';
    }

    if (!payoutMethodForm.routingNumber.trim()) {
      errors.routingNumber = 'Routing number is required';
    } else if (payoutMethodForm.routingNumber.length < 9) {
      errors.routingNumber = 'Routing number must be at least 9 digits';
    }

    if (!payoutMethodForm.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
    } else if (payoutMethodForm.accountNumber.length < 8) {
      errors.accountNumber = 'Account number must be at least 8 digits';
    }

    if (!payoutMethodForm.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required';
    }

    if (!payoutMethodForm.city.trim()) {
      errors.city = 'City is required';
    }

    if (!payoutMethodForm.state.trim()) {
      errors.state = 'State is required';
    }

    if (!payoutMethodForm.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSavePayoutMethod = () => {
    if (validateForm()) {
      // Update the next payout method display using the helper
      const updatedPayout = updatePayoutMethod({
        payoutType: payoutMethodForm.payoutType,
        accountNumber: payoutMethodForm.accountNumber
      });

      setNextPayoutData(updatedPayout);

      // Close modal and reset form
      setPayoutMethodModalOpen(false);
      setPayoutMethodForm({
        payoutType: 'Bank Transfer',
        accountHolderName: '',
        routingNumber: '',
        accountNumber: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: ''
      });
      setFormErrors({});

      // Show success message (in a real app, this would be a toast notification)
      alert('Payout method updated successfully!');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setPayoutMethodForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Mask input for routing and account numbers
  const maskInput = (value: string, maskType: 'routing' | 'account') => {
    const numericValue = value.replace(/\D/g, '');
    if (maskType === 'routing') {
      return numericValue.slice(0, 9);
    }
    return numericValue.slice(0, 12);
  };

  return (
    <>
      {/* Page Header & Breadcrumb */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0">Payouts & Billing</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track earnings, fees, and payout schedule</p>
        </div>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/seller"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Seller
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Payouts & Billing
          </li>
        </ol>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Available Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                  <i className="ri-wallet-3-line text-green-600 dark:text-green-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Balance</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{payoutData.kpis.availableBalance.subtitle}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{payoutData.kpis.availableBalance.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <i className="ri-arrow-up-line mr-1"></i>
                  {payoutData.kpis.availableBalance.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{payoutData.kpis.availableBalance.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full mr-3">
                  <i className="ri-time-line text-orange-600 dark:text-orange-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payouts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{payoutData.kpis.pendingPayouts.subtitle}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{payoutData.kpis.pendingPayouts.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-red-600 dark:text-red-400">
                  <i className="ri-arrow-down-line mr-1"></i>
                  {payoutData.kpis.pendingPayouts.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{payoutData.kpis.pendingPayouts.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paid Out (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                  <i className="ri-bank-card-line text-blue-600 dark:text-blue-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Out (30d)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{payoutData.kpis.paidOut30d.subtitle}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{payoutData.kpis.paidOut30d.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <i className="ri-arrow-up-line mr-1"></i>
                  {payoutData.kpis.paidOut30d.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{payoutData.kpis.paidOut30d.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avg Margin % (30d) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                  <i className="ri-percent-line text-purple-600 dark:text-purple-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Margin % (30d)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{payoutData.kpis.avgMargin.subtitle}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{payoutData.kpis.avgMargin.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <i className="ri-arrow-up-line mr-1"></i>
                  {payoutData.kpis.avgMargin.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{payoutData.kpis.avgMargin.period}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Breakdown and Next Payout Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Panel: Balance Breakdown */}
        <div className="trezo-card bg-white dark:bg-gray-800 p-[20px] md:p-[25px] rounded-md shadow-sm">
          <div className="trezo-card-header mb-[20px]">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Balance Breakdown</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed view of your account balance</p>
            </div>
          </div>
          <div className="trezo-card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{payoutData.balanceBreakdown.available}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{payoutData.balanceBreakdown.pending}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">On Hold</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{payoutData.balanceBreakdown.onHold}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Refund Reserve</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{payoutData.balanceBreakdown.refundReserve}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel: Next Payout */}
        <div className="trezo-card bg-white dark:bg-gray-800 p-[20px] md:p-[25px] rounded-md shadow-sm">
          <div className="trezo-card-header mb-[20px]">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Next Payout</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your upcoming scheduled payout</p>
            </div>
          </div>
          <div className="trezo-card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Next payout date</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{nextPayoutData.date}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated amount</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{nextPayoutData.estimatedAmount}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Payout method</span>
                <div className="flex items-center">
                  <i className="ri-bank-line text-gray-500 dark:text-gray-400 mr-2"></i>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{nextPayoutData.method}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${nextPayoutData.statusClass}`}>
                  {nextPayoutData.status}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setPayoutMethodModalOpen(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i className="ri-settings-3-line mr-2"></i>
                  Manage Payout Method
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Insights */}
        <div className="trezo-card bg-white dark:bg-gray-800 p-[20px] md:p-[25px] rounded-md shadow-sm">
          <div className="trezo-card-header mb-[20px]">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Insights</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Key performance highlights</p>
            </div>
          </div>
          <div className="trezo-card-content">
            <div className="space-y-4">
              {/* Positive Insight - Margin Up */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center w-6 h-6 bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300 rounded-full">
                    <i className="ri-arrow-up-line text-xs mx-auto"></i>
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your avg margin is up <span className="font-semibold text-success-600 dark:text-success-400">3.2%</span> vs last month
                  </p>
                </div>
              </div>

              {/* Neutral/Warning Insight - Refunds */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center w-6 h-6 bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300 rounded-full">
                    <i className="ri-error-warning-line text-xs mx-auto"></i>
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-warning-600 dark:text-warning-400">2 refunds</span> reduced net earnings by $84
                  </p>
                </div>
              </div>

              {/* Alert Insight - Below Threshold */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center w-6 h-6 bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300 rounded-full">
                    <i className="ri-alert-line text-xs mx-auto"></i>
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-danger-600 dark:text-danger-400">3 products</span> are below your target margin threshold (15%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Payout Trends Chart */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Payout Trends</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Daily payouts over last 30 days</p>
            </div>
          </div>
          <div className="trezo-card-content">
            {ChartComponent && (
              <ChartComponent
                options={payoutsOptions}
                series={[{ name: "Daily Payouts", data: payoutData.charts.payouts.data }]}
                type="area"
                height={300}
              />
            )}
          </div>
        </div>

        {/* Margin Trends Chart */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Profit Margin Trends</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Daily margins over last 30 days</p>
            </div>
          </div>
          <div className="trezo-card-content">
            {ChartComponent && (
              <ChartComponent
                options={marginOptions}
                series={[{ name: "Daily Margin %", data: payoutData.charts.margins.data }]}
                type="line"
                height={300}
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Payouts Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Payouts</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your latest payout transactions</p>
          </div>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Request Payout
          </button>
        </div>

        <div className="trezo-card-content">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Payout ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Fees</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reference</th>
                </tr>
              </thead>
              <tbody>
                {recentPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{payout.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{payout.amount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{payout.fees}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{payout.method}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{payout.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payout.statusClass}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{payout.reference}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comprehensive Transactions Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Transactions</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete transaction history with filters</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search reference or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="All">All Types</option>
            <option value="Order Earnings">Order Earnings</option>
            <option value="Platform Fee">Platform Fee</option>
            <option value="Maker Cost">Maker Cost</option>
            <option value="Refund">Refund</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Payout">Payout</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Reversed">Reversed</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div className="trezo-card-content">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reference</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Description</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Gross</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Fees</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Net</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.typeClass}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                        {transaction.reference}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${transaction.gross.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ${transaction.fees.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-sm font-semibold ${transaction.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${transaction.net.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.statusClass}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Results count */}
            {filteredTransactions.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredTransactions.length} of {detailedTransactions.length} transactions
              </div>
            )}

            {/* No results message */}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <i className="ri-search-line text-3xl"></i>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No transactions found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('All');
                    setFilterStatus('All');
                    setFilterDateRange('30d');
                  }}
                  className="mt-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manage Payout Method Modal */}
      <Dialog
        open={payoutMethodModalOpen}
        onClose={() => setPayoutMethodModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-slate-900 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-slate-900 px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Payout Method</h3>
                    <p className="text-sm text-gray-400 mt-1">Update your payout method details</p>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => setPayoutMethodModalOpen(false)}
                  >
                    <i className="ri-close-fill text-xl"></i>
                  </button>
                </div>

                {/* Payout Method Form */}
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Payout Method Type
                    </label>
                    <select
                      value={payoutMethodForm.payoutType}
                      onChange={(e) => handleInputChange('payoutType', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Stripe">Stripe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      value={payoutMethodForm.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-800 border ${
                        formErrors.accountHolderName ? 'border-red-500' : 'border-slate-600'
                      } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="John Doe"
                    />
                    {formErrors.accountHolderName && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.accountHolderName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Routing Number *
                    </label>
                    <input
                      type="text"
                      value={payoutMethodForm.routingNumber}
                      onChange={(e) => handleInputChange('routingNumber', maskInput(e.target.value, 'routing'))}
                      className={`w-full px-3 py-2 bg-slate-800 border ${
                        formErrors.routingNumber ? 'border-red-500' : 'border-slate-600'
                      } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="123456789"
                      maxLength={9}
                    />
                    {formErrors.routingNumber && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.routingNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={payoutMethodForm.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', maskInput(e.target.value, 'account'))}
                      className={`w-full px-3 py-2 bg-slate-800 border ${
                        formErrors.accountNumber ? 'border-red-500' : 'border-slate-600'
                      } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="987654321"
                      maxLength={12}
                    />
                    {formErrors.accountNumber && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.accountNumber}</p>
                    )}
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-200 mb-3">Billing Address</h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          value={payoutMethodForm.addressLine1}
                          onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                          className={`w-full px-3 py-2 bg-slate-800 border ${
                            formErrors.addressLine1 ? 'border-red-500' : 'border-slate-600'
                          } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          placeholder="123 Main Street"
                        />
                        {formErrors.addressLine1 && (
                          <p className="mt-1 text-sm text-red-400">{formErrors.addressLine1}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={payoutMethodForm.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-800 border ${
                              formErrors.city ? 'border-red-500' : 'border-slate-600'
                            } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                            placeholder="Anytown"
                          />
                          {formErrors.city && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            value={payoutMethodForm.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-800 border ${
                              formErrors.state ? 'border-red-500' : 'border-slate-600'
                            } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                            placeholder="CA"
                            maxLength={2}
                          />
                          {formErrors.state && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.state}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            value={payoutMethodForm.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-800 border ${
                              formErrors.postalCode ? 'border-red-500' : 'border-slate-600'
                            } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                            placeholder="12345"
                            maxLength={10}
                          />
                          {formErrors.postalCode && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.postalCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={() => setPayoutMethodModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePayoutMethod}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors flex items-center"
                    >
                      <i className="ri-save-line mr-2"></i>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SellerPayouts;
