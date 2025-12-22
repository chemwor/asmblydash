import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";

interface OrderDetail {
  eta: string;
  status: string;
}

const SellerOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock orders data (same as in SellerOrders)
  const orders = useMemo(() => [
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
      eta: "Dec 19, 2025",
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
      eta: "Dec 17, 2025",
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
      eta: "Dec 21, 2025",
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
      eta: "Dec 21, 2025",
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
      eta: "Dec 16, 2025",
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
      eta: "Dec 22, 2025",
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
      eta: "Dec 22, 2025",
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
      eta: "Dec 21, 2025",
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
      eta: "Dec 18, 2025",
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
  ], []);

  // Find the order by ID
  const order = orders.find(o => o.id === id);

  // Helper functions for risk status
  const isOrderDelayed = (order: OrderDetail) => {
    const today = new Date();
    const etaDate = new Date(order.eta);
    return etaDate < today && order.status !== "Delivered";
  };

  const isOrderAtRisk = (order: OrderDetail) => {
    const today = new Date();
    const etaDate = new Date(order.eta);
    const daysDiff = Math.ceil((etaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const activeStatuses = ["New", "Printing", "QC", "Shipping"];
    return daysDiff <= 2 && daysDiff >= 0 && activeStatuses.includes(order.status);
  };

  // Status timeline data
  const getStatusTimeline = (status: string) => {
    const timeline = [
      {
        status: "New",
        label: "Order Placed",
        completed: true,
        icon: "shopping_bag",
        date: order?.createdDate
      },
      {
        status: "Printing",
        label: "In Production",
        completed: ["Printing", "QC", "Shipping", "Delivered"].includes(status),
        icon: "print",
        date: status === "Printing" ? "In Progress" : (["QC", "Shipping", "Delivered"].includes(status) ? "Completed" : "Pending")
      },
      {
        status: "QC",
        label: "Quality Check",
        completed: ["QC", "Shipping", "Delivered"].includes(status),
        icon: "verified",
        date: status === "QC" ? "In Progress" : (["Shipping", "Delivered"].includes(status) ? "Completed" : "Pending")
      },
      {
        status: "Shipping",
        label: "Shipped",
        completed: ["Shipping", "Delivered"].includes(status),
        icon: "local_shipping",
        date: status === "Shipping" ? "In Progress" : (status === "Delivered" ? "Completed" : "Pending")
      },
      {
        status: "Delivered",
        label: "Delivered",
        completed: status === "Delivered",
        icon: "check_circle",
        date: status === "Delivered" ? order?.eta : "Pending"
      }
    ];

    // Handle Issue status
    if (status === "Issue") {
      return timeline.map(step => ({
        ...step,
        completed: step.status === "New",
        date: step.status === "New" ? step.date : "On Hold"
      }));
    }

    return timeline;
  };

  if (!order) {
    return (
      <>
        {/* Page Header */}
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-0">Order Not Found</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              The requested order could not be found
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
              <Link to="/seller/orders">Orders</Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              Order Not Found
            </li>
          </ol>
        </div>

        {/* Not Found State */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="material-symbols-outlined text-gray-400 text-4xl">search_off</i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Order Not Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              The order with ID "{id}" could not be found. It may have been removed or the URL is incorrect.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/seller/orders"
                className="trezo-btn bg-primary-600 text-white hover:bg-primary-700 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const timeline = getStatusTimeline(order.status);

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0">Order #{order.id}</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Order placed on {order.createdDate}
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
            <Link to="/seller/orders">Orders</Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            {order.id}
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px]">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">timeline</i>
                Status Timeline
              </h6>
            </div>

            <div className="space-y-4">
              {timeline.map((step, index) => (
                <div key={step.status} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? "bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}>
                    <i className="material-symbols-outlined text-sm">{step.icon}</i>
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.completed 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.date}
                    </p>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-px h-8 ${
                      step.completed ? "bg-success-200 dark:bg-success-800" : "bg-gray-200 dark:bg-gray-700"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Details */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px]">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">precision_manufacturing</i>
                Fulfillment Details
              </h6>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Maker
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{order.maker}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${order.statusClass}`}>
                    {order.status}
                  </span>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Expected Delivery
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{order.eta}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Tracking Number
                </label>
                <p className={`font-mono ${
                  order.tracking === "—" 
                    ? "text-gray-400" 
                    : "text-gray-900 dark:text-white font-medium"
                }`}>
                  {order.tracking}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px]">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">inventory_2</i>
                Order Items
              </h6>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-[#15203c] px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <div className="col-span-2">Product</div>
                  <div>Quantity</div>
                  <div className="text-right">Price</div>
                </div>
              </div>
              <div className="px-4 py-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900 dark:text-white">{order.product}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SKU: PRD-{order.id.split('-')[2]}</p>
                  </div>
                  <div className="text-gray-900 dark:text-white">{order.qty}</div>
                  <div className="text-right font-medium text-gray-900 dark:text-white">{order.total}</div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-[#15203c] px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px]">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">chat</i>
                Messages
              </h6>
            </div>

            <div className="text-center py-8">
              <i className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-4xl mb-3">
                chat_bubble_outline
              </i>
              <p className="text-gray-500 dark:text-gray-400">
                No messages yet. Communication with the maker will appear here.
              </p>
            </div>
          </div>

          {/* Files */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px]">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">folder</i>
                Files & Attachments
              </h6>
            </div>

            <div className="text-center py-8">
              <i className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-4xl mb-3">
                folder_open
              </i>
              <p className="text-gray-500 dark:text-gray-400">
                No files uploaded yet. Design files and documentation will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] rounded-md">
            <div className="trezo-card-header mb-[15px]">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">person</i>
                Customer
              </h6>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <p className="font-medium text-gray-900 dark:text-white">{order.customer}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <p className="text-gray-900 dark:text-white">{order.customerMasked}</p>
              </div>
            </div>
          </div>

          {/* Issue Actions */}
          {(order.status === "Issue" || isOrderDelayed(order) || isOrderAtRisk(order)) && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] rounded-md">
              <div className="trezo-card-header mb-[15px]">
                <h6 className="!mb-0 flex items-center gap-2">
                  <i className="material-symbols-outlined text-danger-500">warning</i>
                  Issue Actions
                </h6>
              </div>

              <div className="space-y-3">
                {order.status === "Issue" && (
                  <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-3">
                    <p className="text-danger-700 dark:text-danger-300 text-sm font-medium mb-2">
                      Order has an issue that needs attention
                    </p>
                  </div>
                )}

                {isOrderDelayed(order) && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-700 dark:text-red-300 text-sm font-medium mb-2">
                      Order is delayed past ETA
                    </p>
                  </div>
                )}

                {!isOrderDelayed(order) && isOrderAtRisk(order) && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <p className="text-orange-700 dark:text-orange-300 text-sm font-medium mb-2">
                      Order is at risk - ETA within 2 days
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <button className="trezo-btn w-full bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Contact Maker
                  </button>
                  <button className="trezo-btn w-full bg-warning-600 text-white hover:bg-warning-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Report Issue
                  </button>
                  <button className="trezo-btn w-full bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Request Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] rounded-md">
            <div className="trezo-card-header mb-[15px]">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">quick_reference_all</i>
                Quick Actions
              </h6>
            </div>

            <div className="flex flex-col gap-2">
              <button className="trezo-btn w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Download Invoice
              </button>
              <button className="trezo-btn w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Print Order
              </button>
              <Link
                to="/seller/orders"
                className="trezo-btn w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerOrderDetail;
