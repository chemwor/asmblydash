import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

const SellerOrders = () => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [makerFilter, setMakerFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Extended mock data for orders table with all required columns
  const orders = [
    {
      id: "ORD-2024-001",
      createdDate: "Dec 18, 2025",
      customer: "Sarah Johnson",
      customerMasked: "s****@email.com",
      product: "Wireless Bluetooth Headphones",
      qty: 2,
      status: "Printing",
      statusClass: "bg-info-100 text-info-600 dark:bg-info-900 dark:text-info-300",
      maker: "TechCraft Co.",
      eta: "Dec 22, 2025",
      tracking: "1Z9999W99999999999",
      total: "$31.98"
    },
    {
      id: "ORD-2024-002",
      createdDate: "Dec 17, 2025",
      customer: "Michael Chen",
      customerMasked: "m****@email.com",
      product: "Smart Fitness Tracker",
      qty: 1,
      status: "Shipping",
      statusClass: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300",
      maker: "FitTech Makers",
      eta: "Dec 19, 2025", // Delayed
      tracking: "1Z8888E88888888888",
      total: "$24.99"
    },
    {
      id: "ORD-2024-003",
      createdDate: "Dec 15, 2025",
      customer: "Emma Wilson",
      customerMasked: "e****@email.com",
      product: "USB-C Cable Set",
      qty: 3,
      status: "Delivered",
      statusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      maker: "Cable Solutions",
      eta: "Dec 18, 2025",
      tracking: "1Z7777R77777777777",
      total: "$26.97"
    },
    {
      id: "ORD-2024-004",
      createdDate: "Dec 14, 2025",
      customer: "David Rodriguez",
      customerMasked: "d****@email.com",
      product: "Laptop Stand Adjustable",
      qty: 1,
      status: "Issue",
      statusClass: "bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300",
      maker: "Desk Dynamics",
      eta: "Dec 17, 2025", // Delayed
      tracking: "—",
      total: "$19.99"
    },
    {
      id: "ORD-2024-005",
      createdDate: "Dec 19, 2025",
      customer: "Lisa Thompson",
      customerMasked: "l****@email.com",
      product: "Ergonomic Mouse Pad",
      qty: 2,
      status: "QC",
      statusClass: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300",
      maker: "Comfort Craft",
      eta: "Dec 21, 2025", // At risk (1 day)
      tracking: "—",
      total: "$37.98"
    },
    {
      id: "ORD-2024-006",
      createdDate: "Dec 16, 2025",
      customer: "James Park",
      customerMasked: "j****@email.com",
      product: "Portable Phone Charger",
      qty: 4,
      status: "Delivered",
      statusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      maker: "PowerTech Labs",
      eta: "Dec 19, 2025",
      tracking: "1Z6666T66666666666",
      total: "$49.96"
    },
    {
      id: "ORD-2024-007",
      createdDate: "Dec 18, 2025",
      customer: "Maria Garcia",
      customerMasked: "m****@email.com",
      product: "Bluetooth Speaker",
      qty: 1,
      status: "New",
      statusClass: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      maker: "Audio Makers",
      eta: "Dec 24, 2025",
      tracking: "—",
      total: "$45.50"
    },
    {
      id: "ORD-2024-008",
      createdDate: "Dec 13, 2025",
      customer: "Robert Kim",
      customerMasked: "r****@email.com",
      product: "Wireless Charging Pad",
      qty: 2,
      status: "Shipping",
      statusClass: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300",
      maker: "ChargeTech Pro",
      eta: "Dec 21, 2025", // At risk (1 day)
      tracking: "1Z5555Y55555555555",
      total: "$59.98"
    },
    {
      id: "ORD-2024-009",
      createdDate: "Dec 20, 2025",
      customer: "Jennifer Lee",
      customerMasked: "j****@email.com",
      product: "Smart Watch Band",
      qty: 3,
      status: "Printing",
      statusClass: "bg-info-100 text-info-600 dark:bg-info-900 dark:text-info-300",
      maker: "Wearable Works",
      eta: "Dec 26, 2025",
      tracking: "—",
      total: "$35.97"
    },
    {
      id: "ORD-2024-010",
      createdDate: "Dec 12, 2025",
      customer: "Andrew Davis",
      customerMasked: "a****@email.com",
      product: "Tablet Stand",
      qty: 1,
      status: "Issue",
      statusClass: "bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300",
      maker: "Stand Masters",
      eta: "Dec 16, 2025", // Delayed
      tracking: "—",
      total: "$22.99"
    },
    {
      id: "ORD-2024-011",
      createdDate: "Dec 19, 2025",
      customer: "Sophie Brown",
      customerMasked: "s****@email.com",
      product: "Keyboard Wrist Rest",
      qty: 1,
      status: "QC",
      statusClass: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300",
      maker: "ErgoTech",
      eta: "Dec 22, 2025", // At risk (2 days)
      tracking: "—",
      total: "$18.50"
    },
    {
      id: "ORD-2024-012",
      createdDate: "Dec 11, 2025",
      customer: "Thomas Wilson",
      customerMasked: "t****@email.com",
      product: "Phone Grip Ring",
      qty: 5,
      status: "Delivered",
      statusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      maker: "Grip Solutions",
      eta: "Dec 15, 2025",
      tracking: "1Z4444U44444444444",
      total: "$24.95"
    },
    {
      id: "ORD-2024-013",
      createdDate: "Dec 20, 2025",
      customer: "Rachel Green",
      customerMasked: "r****@email.com",
      product: "Cable Organizer",
      qty: 2,
      status: "New",
      statusClass: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      maker: "OrganizeTech",
      eta: "Dec 27, 2025",
      tracking: "—",
      total: "$16.98"
    },
    {
      id: "ORD-2024-014",
      createdDate: "Dec 17, 2025",
      customer: "Kevin Martinez",
      customerMasked: "k****@email.com",
      product: "Desk Lamp Base",
      qty: 1,
      status: "Printing",
      statusClass: "bg-info-100 text-info-600 dark:bg-info-900 dark:text-info-300",
      maker: "Light Makers",
      eta: "Dec 24, 2025",
      tracking: "—",
      total: "$42.00"
    },
    {
      id: "ORD-2024-015",
      createdDate: "Dec 10, 2025",
      customer: "Amanda Taylor",
      customerMasked: "a****@email.com",
      product: "Monitor Stand Riser",
      qty: 1,
      status: "Delivered",
      statusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      maker: "Display Pro",
      eta: "Dec 14, 2025",
      tracking: "1Z3333I33333333333",
      total: "$38.75"
    },
    {
      id: "ORD-2024-016",
      createdDate: "Dec 18, 2025",
      customer: "Daniel Johnson",
      customerMasked: "d****@email.com",
      product: "Headphone Stand",
      qty: 1,
      status: "QC",
      statusClass: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300",
      maker: "Audio Stands",
      eta: "Dec 22, 2025", // At risk (2 days)
      tracking: "—",
      total: "$28.99"
    },
    {
      id: "ORD-2024-017",
      createdDate: "Dec 16, 2025",
      customer: "Laura Miller",
      customerMasked: "l****@email.com",
      product: "Webcam Privacy Cover",
      qty: 6,
      status: "Shipping",
      statusClass: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300",
      maker: "Privacy Tech",
      eta: "Dec 21, 2025", // At risk (1 day)
      tracking: "1Z2222O22222222222",
      total: "$17.94"
    },
    {
      id: "ORD-2024-018",
      createdDate: "Dec 19, 2025",
      customer: "Chris Anderson",
      customerMasked: "c****@email.com",
      product: "Gaming Controller Stand",
      qty: 2,
      status: "Printing",
      statusClass: "bg-info-100 text-info-600 dark:bg-info-900 dark:text-info-300",
      maker: "Game Gear Co",
      eta: "Dec 25, 2025",
      tracking: "—",
      total: "$33.98"
    },
    {
      id: "ORD-2024-019",
      createdDate: "Dec 14, 2025",
      customer: "Nicole White",
      customerMasked: "n****@email.com",
      product: "Laptop Cooling Stand",
      qty: 1,
      status: "Issue",
      statusClass: "bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300",
      maker: "Cool Tech",
      eta: "Dec 18, 2025", // Delayed
      tracking: "—",
      total: "$54.99"
    },
    {
      id: "ORD-2024-020",
      createdDate: "Dec 20, 2025",
      customer: "Mark Thompson",
      customerMasked: "m****@email.com",
      product: "Smartphone Car Mount",
      qty: 1,
      status: "New",
      statusClass: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      maker: "Auto Accessories",
      eta: "Dec 28, 2025",
      tracking: "—",
      total: "$21.50"
    }
  ];

  // Get unique makers from mock data
  const uniqueMakers = useMemo(() => {
    const makers = [...new Set(orders.map(order => order.maker))].sort();
    return makers;
  }, [orders]);

  // Filter orders based on date range
  const filterByDateRange = (order: any) => {
    const orderDate = new Date(order.createdDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (dateRange) {
      case "Last 7 days":
        return daysDiff <= 7;
      case "Last 30 days":
        return daysDiff <= 30;
      case "Last 90 days":
        return daysDiff <= 90;
      default:
        return true;
    }
  };

  // Filter logic
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      // Search filter
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase());

      // Tab filter
      let matchesTab = true;
      switch (activeTab) {
        case "Active":
          matchesTab = ["New", "Printing", "QC", "Shipping"].includes(order.status);
          break;
        case "Delivered":
          matchesTab = order.status === "Delivered";
          break;
        case "Issues":
          matchesTab = order.status === "Issue";
          break;
        default:
          matchesTab = true;
      }

      // Status filter (more granular than tabs)
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;

      // Maker filter
      const matchesMaker = makerFilter === "All" || order.maker === makerFilter;

      // Date range filter
      const matchesDateRange = filterByDateRange(order);

      return matchesSearch && matchesTab && matchesStatus && matchesMaker && matchesDateRange;
    });

    // Sort logic
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case "Oldest":
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        case "ETA soonest":
          return new Date(a.eta).getTime() - new Date(b.eta).getTime();
        case "Status": {
          const statusOrder = { "Issue": 0, "New": 1, "Printing": 2, "QC": 3, "Shipping": 4, "Delivered": 5 };
          const aOrder = statusOrder[a.status as keyof typeof statusOrder] || 99;
          const bOrder = statusOrder[b.status as keyof typeof statusOrder] || 99;
          return aOrder - bOrder;
        }
        default:
          return 0;
      }
    });
  }, [searchTerm, activeTab, statusFilter, makerFilter, dateRange, sortBy, orders]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setActiveTab("All");
    setStatusFilter("All");
    setMakerFilter("All");
    setDateRange("All");
    setSortBy("Newest");
  };

  // Helper functions to determine order risk status
  const isOrderDelayed = (order: any) => {
    const today = new Date();
    const etaDate = new Date(order.eta);
    return etaDate < today && order.status !== "Delivered";
  };

  const isOrderAtRisk = (order: any) => {
    const today = new Date();
    const etaDate = new Date(order.eta);
    const daysDiff = Math.ceil((etaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const activeStatuses = ["New", "Printing", "QC", "Shipping"];
    return daysDiff <= 2 && daysDiff >= 0 && activeStatuses.includes(order.status);
  };

  // Compute KPI values from mock data
  const computedStats = useMemo(() => {
    const activeCount = orders.filter(order => ["New", "Printing", "QC", "Shipping"].includes(order.status)).length;
    const delayedCount = orders.filter(order => isOrderDelayed(order)).length;

    // Calculate average fulfillment time (mock calculation)
    const deliveredOrders = orders.filter(order => order.status === "Delivered");
    const avgFulfillment = deliveredOrders.length > 0 ?
      (deliveredOrders.reduce((sum, order) => {
        const created = new Date(order.createdDate);
        const eta = new Date(order.eta);
        const days = Math.ceil((eta.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / deliveredOrders.length).toFixed(1) : "2.4";

    // Calculate on-time delivery percentage
    const onTimeDeliveries = deliveredOrders.filter(order => {
      const today = new Date();
      const eta = new Date(order.eta);
      return eta >= today; // Delivered on or before ETA
    }).length;
    const onTimePercentage = deliveredOrders.length > 0 ?
      ((onTimeDeliveries / deliveredOrders.length) * 100).toFixed(1) : "94.2";

    return {
      activeCount,
      delayedCount,
      avgFulfillment,
      onTimePercentage
    };
  }, [orders]);

  // Mock data for summary cards
  const summaryStats = [
    {
      id: "active-orders",
      title: "Active Orders",
      value: computedStats.activeCount.toString(),
      icon: "shopping_cart",
      bgColor: "bg-primary-100 dark:bg-primary-900",
      iconColor: "text-primary-600 dark:text-primary-300",
      change: "+12 this week",
      changeType: "positive"
    },
    {
      id: "orders-delayed",
      title: "Orders Delayed",
      value: computedStats.delayedCount.toString(),
      icon: "schedule",
      bgColor: "bg-danger-100 dark:bg-danger-900",
      iconColor: "text-danger-600 dark:text-danger-300",
      change: computedStats.delayedCount > 0 ? `${computedStats.delayedCount} need attention` : "No delays",
      changeType: computedStats.delayedCount > 0 ? "negative" : "positive"
    },
    {
      id: "avg-fulfillment",
      title: "Avg Fulfillment Time",
      value: `${computedStats.avgFulfillment} days`,
      icon: "timer",
      bgColor: "bg-warning-100 dark:bg-warning-900",
      iconColor: "text-warning-600 dark:text-warning-300",
      change: "0.2 days faster",
      changeType: "positive"
    },
    {
      id: "on-time-delivery",
      title: "On-Time Delivery %",
      value: `${computedStats.onTimePercentage}%`,
      icon: "check_circle",
      bgColor: "bg-success-100 dark:bg-success-900",
      iconColor: "text-success-600 dark:text-success-300",
      change: "+2.1% this month",
      changeType: "positive"
    }
  ];

  // Tab counts for display
  const tabCounts = useMemo(() => {
    const activeCount = orders.filter(order => ["New", "Printing", "QC", "Shipping"].includes(order.status)).length;
    const deliveredCount = orders.filter(order => order.status === "Delivered").length;
    const issuesCount = orders.filter(order => order.status === "Issue").length;

    return {
      All: orders.length,
      Active: activeCount,
      Delivered: deliveredCount,
      Issues: issuesCount
    };
  }, [orders]);

  return (
    <>
      {/* Page Header with Breadcrumb */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0">Orders</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track fulfillment status and resolve issues fast
          </p>
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
            Orders
          </li>
        </ol>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((stat) => (
          <div key={stat.id} className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 ${stat.bgColor} rounded-full mr-3`}>
                  <i className={`material-symbols-outlined ${stat.iconColor} text-xl`}>
                    {stat.icon}
                  </i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-1 ${
                    stat.changeType === 'positive' ? 'text-success-600 dark:text-success-400' :
                    stat.changeType === 'negative' ? 'text-danger-600 dark:text-danger-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between flex-wrap gap-3">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Order Management</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monitor and manage all customer orders
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8" aria-label="Tabs">
            {["All", "Active", "Delivered", "Issues"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}>
                  {tabCounts[tab as keyof typeof tabCounts]}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filter and Search Controls */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-[#15203c] rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px] max-w-[300px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders, customers, products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <i className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  search
                </i>
              </div>
            </div>

            {/* Status Filter */}
            <div className="min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Printing">Printing</option>
                <option value="QC">QC</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
                <option value="Issue">Issue</option>
              </select>
            </div>

            {/* Maker Filter */}
            <div className="min-w-[140px]">
              <select
                value={makerFilter}
                onChange={(e) => setMakerFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="All">All Makers</option>
                {uniqueMakers.map((maker) => (
                  <option key={maker} value={maker}>
                    {maker}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="min-w-[140px]">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="All">All Time</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 90 days">Last 90 days</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="min-w-[140px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="ETA soonest">ETA soonest</option>
                <option value="Status">Status</option>
              </select>
            </div>

            {/* Results Count and Clear Filters */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {filteredAndSortedOrders.length} of {orders.length} orders
              </div>

              {(searchTerm || activeTab !== "All" || statusFilter !== "All" || makerFilter !== "All" || dateRange !== "All" || sortBy !== "Newest") && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          {/* Orders Table */}
          {filteredAndSortedOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="material-symbols-outlined text-gray-400 text-3xl">search_off</i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="trezo-btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                      Order
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Customer
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Product
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Qty
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Maker
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      ETA
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Tracking
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Total
                    </th>
                    <th className="font-medium text-center px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap last:rounded-tr-md">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredAndSortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div>
                          <span className="block font-medium">{order.id}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {order.createdDate}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div>
                          <span className="block font-medium">{order.customer}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customerMasked}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="font-medium">{order.product}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-sm">{order.qty}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center gap-2">
                          <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${order.statusClass}`}>
                            {order.status}
                          </span>
                          {isOrderDelayed(order) && (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full"
                              title="Order is delayed"
                            >
                              <i className="material-symbols-outlined text-red-600 dark:text-red-400 text-xs">
                                warning
                              </i>
                            </span>
                          )}
                          {!isOrderDelayed(order) && isOrderAtRisk(order) && (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 dark:bg-orange-900 rounded-full"
                              title="Order at risk - ETA within 2 days"
                            >
                              <i className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-xs">
                                schedule
                              </i>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-sm">{order.maker}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{order.eta}</span>
                          {isOrderDelayed(order) && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                              Delayed
                            </span>
                          )}
                          {!isOrderDelayed(order) && isOrderAtRisk(order) && (
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                              At Risk
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className={`text-sm font-mono ${order.tracking === "—" ? "text-gray-400" : ""}`}>
                          {order.tracking}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="font-medium text-success-600 dark:text-success-400">{order.total}</span>
                      </td>
                      <td className="text-center whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Button */}
                          <Link
                            to={`/seller/orders/${order.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-300 transition-colors"
                            title="View Order"
                          >
                            <i className="material-symbols-outlined text-sm">visibility</i>
                          </Link>
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
    </>
  );
};

export default SellerOrders;
