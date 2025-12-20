import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

const SellerProducts = () => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shopifyFilter, setShopifyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Updated (desc)");

  // State for Add Product modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Mock data for quick stats
  const quickStats = [
    {
      id: "active-products",
      title: "Active Products",
      value: "47",
      icon: "inventory_2",
      bgColor: "bg-success-100 dark:bg-success-900",
      iconColor: "text-success-600 dark:text-success-300",
      change: "+3 this week",
      changeType: "positive"
    },
    {
      id: "live-shopify",
      title: "Live on Shopify",
      value: "42",
      icon: "storefront",
      bgColor: "bg-primary-100 dark:bg-primary-900",
      iconColor: "text-primary-600 dark:text-primary-300",
      change: "+2 this week",
      changeType: "positive"
    },
    {
      id: "pending-approval",
      title: "Pending Approval",
      value: "8",
      icon: "pending_actions",
      bgColor: "bg-warning-100 dark:bg-warning-900",
      iconColor: "text-warning-600 dark:text-warning-300",
      change: "-1 this week",
      changeType: "negative"
    },
    {
      id: "at-risk",
      title: "Products at Risk",
      value: "3",
      icon: "warning",
      bgColor: "bg-danger-100 dark:bg-danger-900",
      iconColor: "text-danger-600 dark:text-danger-300",
      change: "Same as last week",
      changeType: "neutral"
    }
  ];

  // Enhanced mock data for products table
  const products = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-2024-001",
      thumbnail: "/images/products/headphones.jpg",
      status: "Live",
      statusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      shopifyStatus: "Synced",
      shopifyStatusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      unitsSold: "247",
      revenue: "$3,921.53",
      avgFulfillmentTime: "2.3",
      margin: "34.2%",
      lastUpdated: "2 hours ago",
      isPaused: false,
      isOnShopify: true
    },
    {
      id: "2",
      name: "Smart Fitness Tracker",
      sku: "SFT-2024-002",
      thumbnail: "/images/products/fitness-tracker.jpg",
      status: "Live",
      statusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      shopifyStatus: "Synced",
      shopifyStatusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      unitsSold: "189",
      revenue: "$4,723.11",
      avgFulfillmentTime: "1.8",
      margin: "42.8%",
      lastUpdated: "5 hours ago",
      isPaused: false,
      isOnShopify: true
    },
    {
      id: "3",
      name: "Portable Phone Charger",
      sku: "PPC-2024-003",
      thumbnail: "/images/products/phone-charger.jpg",
      status: "Draft",
      statusClass: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      shopifyStatus: "Not Added",
      shopifyStatusClass: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300",
      unitsSold: "0",
      revenue: "$0.00",
      avgFulfillmentTime: "—",
      margin: "28.5%",
      lastUpdated: "1 day ago",
      isPaused: false,
      isOnShopify: false
    },
    {
      id: "4",
      name: "USB-C Cable Set",
      sku: "UCS-2024-004",
      thumbnail: "/images/products/usb-cable.jpg",
      status: "Live",
      statusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      shopifyStatus: "Synced",
      shopifyStatusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      unitsSold: "421",
      revenue: "$3,788.79",
      avgFulfillmentTime: "1.2",
      margin: "55.7%",
      lastUpdated: "3 hours ago",
      isPaused: false,
      isOnShopify: true
    },
    {
      id: "5",
      name: "Laptop Stand Adjustable",
      sku: "LSA-2024-005",
      thumbnail: "/images/products/laptop-stand.jpg",
      status: "Needs Attention",
      statusClass: "bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300",
      shopifyStatus: "Error",
      shopifyStatusClass: "bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300",
      unitsSold: "12",
      revenue: "$239.88",
      avgFulfillmentTime: "4.7",
      margin: "31.4%",
      lastUpdated: "2 days ago",
      isPaused: false,
      isOnShopify: true
    },
    {
      id: "6",
      name: "Ergonomic Mouse Pad",
      sku: "EMP-2024-006",
      thumbnail: "/images/products/mouse-pad.jpg",
      status: "Paused",
      statusClass: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      shopifyStatus: "Synced",
      shopifyStatusClass: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300",
      unitsSold: "156",
      revenue: "$1,872.00",
      avgFulfillmentTime: "2.1",
      margin: "48.3%",
      lastUpdated: "1 week ago",
      isPaused: true,
      isOnShopify: true
    }
  ];

  const handleTogglePause = (productId: string) => {
    // Toggle pause/unpause functionality (UI only for now)
    console.log(`Toggle pause for product: ${productId}`);
  };

  const handleAddToShopify = (productId: string) => {
    // Add to Shopify functionality (UI only for now)
    console.log(`Add product ${productId} to Shopify`);
  };

  const handleAddFromCatalog = () => {
    console.log("Add from Asmbly Catalog clicked");
    setShowAddProductModal(false);
    // TODO: Navigate to catalog selection
  };

  const handleRequestCustomSTL = () => {
    console.log("Request Custom STL clicked");
    setShowAddProductModal(false);
    // TODO: Navigate to custom STL request form
  };

  // Filter and sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "All" || product.status === statusFilter;

      // Shopify filter
      const matchesShopify = shopifyFilter === "All" || product.shopifyStatus === shopifyFilter;

      return matchesSearch && matchesStatus && matchesShopify;
    });

    // Sort logic
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Updated (desc)":
          // For simplicity, we'll sort by lastUpdated string - in real app would use dates
          return a.lastUpdated.localeCompare(b.lastUpdated);
        case "Revenue (desc)":
          const revenueA = parseFloat(a.revenue.replace(/[$,]/g, ''));
          const revenueB = parseFloat(b.revenue.replace(/[$,]/g, ''));
          return revenueB - revenueA;
        case "Units Sold (desc)":
          return parseInt(b.unitsSold) - parseInt(a.unitsSold);
        case "Margin (asc)":
          const marginA = parseFloat(a.margin.replace('%', ''));
          const marginB = parseFloat(b.margin.replace('%', ''));
          return marginA - marginB;
        case "Fulfillment Time (asc)":
          const timeA = a.avgFulfillmentTime === "—" ? 999 : parseFloat(a.avgFulfillmentTime);
          const timeB = b.avgFulfillmentTime === "—" ? 999 : parseFloat(b.avgFulfillmentTime);
          return timeA - timeB;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchTerm, statusFilter, shopifyFilter, sortBy]);

  return (
    <>
      {/* Page Header with Breadcrumb */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0">Products</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your Asmbly catalog and Shopify sync
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
            Products
          </li>
        </ol>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat) => (
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

      {/* Products Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between flex-wrap gap-3">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Product Catalog</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your products across Asmbly and Shopify
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="trezo-btn bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <i className="material-symbols-outlined mr-2 text-sm">add</i>
              Add Product
            </button>
            <button className="trezo-btn bg-success-500 text-white hover:bg-success-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <i className="material-symbols-outlined mr-2 text-sm">sync</i>
              Sync Shopify
            </button>
          </div>
        </div>

        {/* Show filters only if there are products */}
        {products.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-[#15203c] rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px] max-w-[300px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
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
                  <option value="Draft">Draft</option>
                  <option value="Live">Live</option>
                  <option value="Paused">Paused</option>
                  <option value="Needs Attention">Needs Attention</option>
                </select>
              </div>

              {/* Shopify Filter */}
              <div className="min-w-[140px]">
                <select
                  value={shopifyFilter}
                  onChange={(e) => setShopifyFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="All">All Shopify</option>
                  <option value="Synced">Synced</option>
                  <option value="Not Added">Not Added</option>
                  <option value="Error">Error</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="min-w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Updated (desc)">Sort by Updated ↓</option>
                  <option value="Revenue (desc)">Sort by Revenue ↓</option>
                  <option value="Units Sold (desc)">Sort by Units Sold ↓</option>
                  <option value="Margin (asc)">Sort by Margin ↑</option>
                  <option value="Fulfillment Time (asc)">Sort by Fulfillment ↑</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {filteredAndSortedProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        )}

        <div className="trezo-card-content">
          {/* Empty State: No Products at All */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="material-symbols-outlined text-gray-400 text-4xl">inventory_2</i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start your catalog
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                Add products from Asmbly or request a custom STL to sell.
              </p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="trezo-btn bg-primary-500 text-white hover:bg-primary-600 px-6 py-3 rounded-md text-sm font-medium transition-colors"
              >
                <i className="material-symbols-outlined mr-2 text-sm">add</i>
                Add Product
              </button>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            /* Empty State: No Products After Filtering */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="material-symbols-outlined text-gray-400 text-3xl">search_off</i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting filters or add a product to your catalog.
              </p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="trezo-btn bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors mr-3"
              >
                <i className="material-symbols-outlined mr-2 text-sm">add</i>
                Add Product
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setShopifyFilter("All");
                  setSortBy("Updated (desc)");
                }}
                className="trezo-btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Products Table */
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                      Product
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Shopify
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Units Sold (30d)
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Revenue (30d)
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Avg Fulfillment (days)
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Margin %
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Updated
                    </th>
                    <th className="font-medium text-center px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap last:rounded-tr-md">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredAndSortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<i class="material-symbols-outlined text-gray-500 dark:text-gray-400">inventory_2</i>`;
                                }
                              }}
                            />
                          </div>
                          <div>
                            <span className="block font-medium">{product.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${product.statusClass}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${product.shopifyStatusClass}`}>
                          {product.shopifyStatus}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="font-medium">{product.unitsSold}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="font-medium text-success-600 dark:text-success-400">{product.revenue}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-sm">{product.avgFulfillmentTime}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="font-medium">{product.margin}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.lastUpdated}
                        </span>
                      </td>
                      <td className="text-center whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Button */}
                          <Link
                            to={`/seller/products/${product.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-300 transition-colors"
                            title="View Product"
                          >
                            <i className="material-symbols-outlined text-sm">visibility</i>
                          </Link>

                          {/* Add to Shopify Button (only if not on Shopify) */}
                          {!product.isOnShopify && (
                            <button
                              onClick={() => handleAddToShopify(product.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-success-100 hover:bg-success-200 dark:bg-success-900 dark:hover:bg-success-800 text-success-600 dark:text-success-300 transition-colors"
                              title="Add to Shopify"
                            >
                              <i className="material-symbols-outlined text-sm">storefront</i>
                            </button>
                          )}

                          {/* Pause/Unpause Toggle */}
                          <button
                            onClick={() => handleTogglePause(product.id)}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                              product.isPaused
                                ? 'bg-success-100 hover:bg-success-200 dark:bg-success-900 dark:hover:bg-success-800 text-success-600 dark:text-success-300'
                                : 'bg-warning-100 hover:bg-warning-200 dark:bg-warning-900 dark:hover:bg-warning-800 text-warning-600 dark:text-warning-300'
                            }`}
                            title={product.isPaused ? 'Unpause Product' : 'Pause Product'}
                          >
                            <i className="material-symbols-outlined text-sm">
                              {product.isPaused ? 'play_arrow' : 'pause'}
                            </i>
                          </button>
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

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAddProductModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-[#0c1427] shadow-xl transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Product
                </h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i className="material-symbols-outlined text-xl">close</i>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Choose how you'd like to add a new product to your catalog
                </p>

                {/* Option 1: Add from Catalog */}
                <button
                  onClick={handleAddFromCatalog}
                  className="w-full p-4 text-left border-2 border-primary-200 dark:border-primary-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 bg-primary-50 dark:bg-primary-900/20 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                        <i className="material-symbols-outlined text-white text-xl">inventory_2</i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        Add from Asmbly Catalog
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Browse our catalog of verified products and add them to your store
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <i className="material-symbols-outlined text-gray-400 group-hover:text-primary-500 text-lg">
                        arrow_forward
                      </i>
                    </div>
                  </div>
                </button>

                {/* Option 2: Request Custom STL */}
                <button
                  onClick={handleRequestCustomSTL}
                  className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                        <i className="material-symbols-outlined text-white text-xl">view_in_ar</i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        Request Custom STL
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Submit a request for a custom 3D model to be created for you
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <i className="material-symbols-outlined text-gray-400 group-hover:text-gray-500 text-lg">
                        arrow_forward
                      </i>
                    </div>
                  </div>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerProducts;
