import React, { useEffect, useState } from 'react';
import type { ApexOptions } from "apexcharts";

const SellerDashboard: React.FC = () => {
  // Chart component state for dynamic imports
  const [ChartComponent, setChartComponent] = useState<React.ComponentType<any> | null>(null);

  // Centralized dashboard data object
  const dashboardData = {
    kpis: {
      totalRevenue: {
        value: '$47,892',
        period: 'Last 30 days',
        change: '+12.5%',
        changeType: 'positive'
      },
      ordersFulfilled: {
        value: '1,847',
        period: 'This month',
        change: '+8.3%',
        changeType: 'positive'
      },
      grossProfit: {
        value: '$18,756',
        period: 'This month',
        change: '-3.2%',
        changeType: 'negative'
      },
      avgFulfillmentTime: {
        value: '2.4 days',
        period: 'Last 30 days',
        change: '-15.7%',
        changeType: 'positive',
        changeLabel: 'faster than before'
      }
    },
    charts: {
      revenue: {
        data: [
          1250, 1420, 1180, 1650, 1890, 1340, 1580, 1720, 1460, 1830,
          1970, 2140, 1680, 1520, 1750, 1920, 2080, 1640, 1780, 1850,
          1960, 2200, 1740, 1820, 1680, 2050, 2180, 1890, 2240, 2100
        ]
      },
      orders: {
        data: [
          45, 52, 38, 61, 73, 42, 58, 67, 49, 71,
          76, 83, 54, 48, 62, 74, 81, 53, 69, 72,
          78, 86, 56, 70, 54, 79, 84, 73, 88, 82
        ]
      }
    },
    topProducts: [
      {
        id: 'WBH-2024-001',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-2024-001',
        unitsSold: '1,247',
        revenue: '$18,705',
        avgFulfillmentTime: '1.8 days',
        status: 'Trending',
        statusClass: 'bg-success-100 text-success-600'
      },
      {
        id: 'SFT-2024-002',
        name: 'Smart Fitness Tracker',
        sku: 'SFT-2024-002',
        unitsSold: '892',
        revenue: '$13,380',
        avgFulfillmentTime: '2.1 days',
        status: 'Stable',
        statusClass: 'bg-primary-50 text-primary-500'
      },
      {
        id: 'PPC-2024-003',
        name: 'Portable Phone Charger',
        sku: 'PPC-2024-003',
        unitsSold: '634',
        revenue: '$9,510',
        avgFulfillmentTime: '2.6 days',
        status: 'Trending',
        statusClass: 'bg-success-100 text-success-600'
      },
      {
        id: 'UCS-2024-004',
        name: 'USB-C Cable Set',
        sku: 'UCS-2024-004',
        unitsSold: '421',
        revenue: '$6,315',
        avgFulfillmentTime: '1.2 days',
        status: 'Stable',
        statusClass: 'bg-primary-50 text-primary-500'
      },
      {
        id: 'LSA-2024-005',
        name: 'Laptop Stand Adjustable',
        sku: 'LSA-2024-005',
        unitsSold: '187',
        revenue: '$3,740',
        avgFulfillmentTime: '4.2 days',
        status: 'At Risk',
        statusClass: 'bg-danger-100 text-danger-500'
      }
    ],
    ordersInProgress: {
      summary: {
        activeOrders: 12,
        ordersDelayed: 3
      },
      orders: [
        {
          id: '#ORD-2024-1847',
          product: 'Wireless Bluetooth Headphones',
          quantity: '25 units',
          maker: {
            name: 'TechMaker Pro',
            location: 'San Francisco, CA',
            initials: 'TM',
            bgColor: 'bg-purple-100 dark:bg-purple-900',
            textColor: 'text-purple-600 dark:text-purple-300'
          },
          status: 'Printing',
          statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
          eta: 'Dec 22, 2024',
          isDelayed: false
        },
        {
          id: '#ORD-2024-1846',
          product: 'Smart Fitness Tracker',
          quantity: '15 units',
          maker: {
            name: 'FitnessTech Hub',
            location: 'Austin, TX',
            initials: 'FH',
            bgColor: 'bg-green-100 dark:bg-green-900',
            textColor: 'text-green-600 dark:text-green-300'
          },
          status: 'QC',
          statusClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
          eta: 'Dec 21, 2024',
          isDelayed: false
        },
        {
          id: '#ORD-2024-1845',
          product: 'Portable Phone Charger',
          quantity: '50 units',
          maker: {
            name: 'PowerElectronics',
            location: 'Seattle, WA',
            initials: 'PE',
            bgColor: 'bg-blue-100 dark:bg-blue-900',
            textColor: 'text-blue-600 dark:text-blue-300'
          },
          status: 'Shipping',
          statusClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
          eta: 'Dec 20, 2024',
          isDelayed: false
        },
        {
          id: '#ORD-2024-1844',
          product: 'USB-C Cable Set',
          quantity: '100 units',
          maker: {
            name: 'CableArt Studios',
            location: 'Denver, CO',
            initials: 'CA',
            bgColor: 'bg-orange-100 dark:bg-orange-900',
            textColor: 'text-orange-600 dark:text-orange-300'
          },
          status: 'Printing',
          statusClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
          eta: 'Dec 18, 2024 (Delayed)',
          etaClass: 'text-red-600 dark:text-red-400',
          isDelayed: true
        },
        {
          id: '#ORD-2024-1843',
          product: 'Laptop Stand Adjustable',
          quantity: '8 units',
          maker: {
            name: 'MetalSmith Co.',
            location: 'Portland, OR',
            initials: 'MS',
            bgColor: 'bg-indigo-100 dark:bg-indigo-900',
            textColor: 'text-indigo-600 dark:text-indigo-300'
          },
          status: 'QC',
          statusClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
          eta: 'Dec 23, 2024',
          isDelayed: false
        }
      ]
    },
    alerts: [
      {
        id: 'delayed-orders',
        type: 'danger',
        icon: 'ri-alarm-warning-line',
        message: '2 orders are delayed beyond SLA',
        classes: 'text-danger-500 bg-danger-50 border border-danger-200',
        hoverClass: 'hover:text-danger-700'
      },
      {
        id: 'low-margin',
        type: 'warning',
        icon: 'ri-arrow-down-circle-line',
        message: '1 product margin dropped below 15%',
        classes: 'text-warning-500 bg-warning-50 border border-warning-200',
        hoverClass: 'hover:text-warning-700'
      },
      {
        id: 'trending-opportunity',
        type: 'success',
        icon: 'ri-trend-up-line',
        message: 'New product idea trending in your category',
        classes: 'text-success-500 bg-success-50 border border-success-200',
        hoverClass: 'hover:text-success-700'
      },
      {
        id: 'stl-request',
        type: 'info',
        icon: 'ri-file-3d-line',
        message: 'Custom STL request awaiting review',
        classes: 'text-info-500 bg-info-50 border border-info-200',
        hoverClass: 'hover:text-info-700'
      }
    ]
  };

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

  const revenueOptions: ApexOptions = {
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

  const ordersOptions: ApexOptions = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
      type: 'bar',
    },
    colors: ["#3B82F6"],
    dataLabels: { enabled: false },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 2,
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
      },
    },
    tooltip: {
      y: { formatter: (value) => `${value} orders` },
    },
  };

  return (
    <div className="main-content-area">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Seller Dashboard
        </h3>
      </div>

      {/* High-level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue (Last 30 Days) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                  <i className="ri-money-dollar-circle-line text-green-600 dark:text-green-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dashboardData.kpis.totalRevenue.period}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.kpis.totalRevenue.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <i className="ri-arrow-up-line mr-1"></i>
                  {dashboardData.kpis.totalRevenue.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs prev period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Fulfilled */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                  <i className="ri-truck-line text-blue-600 dark:text-blue-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders Fulfilled</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dashboardData.kpis.ordersFulfilled.period}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.kpis.ordersFulfilled.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <i className="ri-arrow-up-line mr-1"></i>
                  {dashboardData.kpis.ordersFulfilled.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs prev period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                  <i className="ri-line-chart-line text-purple-600 dark:text-purple-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gross Profit</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dashboardData.kpis.grossProfit.period}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.kpis.grossProfit.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-red-600 dark:text-red-400">
                  <i className="ri-arrow-down-line mr-1"></i>
                  {dashboardData.kpis.grossProfit.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs prev period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Fulfillment Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full mr-3">
                  <i className="ri-time-line text-orange-600 dark:text-orange-300 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Fulfillment Time</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dashboardData.kpis.avgFulfillmentTime.period}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.kpis.avgFulfillmentTime.value}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <i className="ri-arrow-down-line mr-1"></i>
                  {dashboardData.kpis.avgFulfillmentTime.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{dashboardData.kpis.avgFulfillmentTime.changeLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Revenue Over Time</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
            </div>
          </div>
          <div className="trezo-card-content">
            {ChartComponent && (
              <ChartComponent
                options={revenueOptions}
                series={[{ name: "Daily Revenue", data: dashboardData.charts.revenue.data }]}
                type="area"
                height={300}
              />
            )}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Orders Over Time</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
            </div>
          </div>
          <div className="trezo-card-content">
            {ChartComponent && (
              <ChartComponent
                options={ordersOptions}
                series={[{ name: "Daily Orders", data: dashboardData.charts.orders.data }]}
                type="bar"
                height={300}
              />
            )}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Products</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Best performing products this month</p>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Product Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Units Sold
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Revenue
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Avg Fulfillment Time
                  </th>
                  <th className="font-medium text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap last:rounded-tr-md">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {dashboardData.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="ltr:mr-[12px] rtl:ml-[12px]">
                          <span className="block font-medium">{product.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="font-medium">{product.unitsSold}</span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="font-medium">{product.revenue}</span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span>{product.avgFulfillmentTime}</span>
                    </td>
                    <td className="text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${product.statusClass}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Orders in Progress Section */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Orders in Progress</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your active manufacturing orders</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                <i className="ri-shopping-bag-line text-blue-600 dark:text-blue-300 text-lg"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Orders</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{dashboardData.ordersInProgress.summary.activeOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full mr-3">
                <i className="ri-alarm-warning-line text-orange-600 dark:text-orange-300 text-lg"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Orders Delayed</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">{dashboardData.ordersInProgress.summary.ordersDelayed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Order ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Product
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Maker
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap last:rounded-tr-md">
                    ETA
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {dashboardData.ordersInProgress.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{order.id}</span>
                    </td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="ltr:mr-[12px] rtl:ml-[12px]">
                          <span className="block font-medium">{order.product}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Qty: {order.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${order.maker.bgColor} flex items-center justify-center mr-3`}>
                          <span className={`text-xs font-semibold ${order.maker.textColor}`}>{order.maker.initials}</span>
                        </div>
                        <div>
                          <span className="block font-medium">{order.maker.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{order.maker.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className={`text-sm ${order.etaClass || ''}`}>{order.eta}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alerts & Insights Panel */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Alerts & Insights</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Actionable items requiring your attention</p>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="space-y-4">
            {dashboardData.alerts.map((alert) => (
              <div key={alert.id} className={`alert py-[1rem] px-[1rem] rounded-md flex items-center justify-between ${alert.classes}`}>
                <div className="flex items-center gap-[8px]">
                  <i className={`${alert.icon} text-[20px]`}></i>
                  <span>{alert.message}</span>
                </div>
                <button className={`leading-none text-[20px] close-btn ${alert.hoverClass} transition-colors`}>
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Welcome to your Seller Dashboard
        </h4>
        <p className="text-gray-600 dark:text-gray-400">
          This is your seller dashboard where you can manage your products, orders, and customers.
          Use the sidebar navigation to access different sections of your seller portal.
        </p>
      </div>
    </div>
  );
};

export default SellerDashboard;
