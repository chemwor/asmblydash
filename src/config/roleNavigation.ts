import type { NavSection } from "../components/Layout/SidebarMenu";

// Seller Role Navigation
export const sellerNavigation: NavSection[] = [
  {
    title: "Primary",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: "dashboard",
        path: "/seller/dashboard",
      },
      {
        id: "products",
        title: "Products",
        icon: "inventory_2",
        path: "/seller/products",
      },
      {
        id: "orders",
        title: "Orders",
        icon: "shopping_cart",
        path: "/seller/orders",
      }
    ]
  },
  {
    title: "Growth",
    items: [
      {
        id: "product-ideas",
        title: "Product Ideas",
        icon: "lightbulb",
        path: "/seller/ideas",
      },
      {
        id: "custom-stl-requests",
        title: "Custom STL Requests",
        icon: "view_in_ar",
        path: "/seller/stl-requests",
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        id: "messages",
        title: "Messages",
        icon: "chat",
        path: "/seller/messages",
      },
      {
        id: "files",
        title: "Files",
        icon: "folder",
        path: "/seller/files",
      }
    ]
  },
  {
    title: "Finance",
    items: [
      {
        id: "payouts-billing",
        title: "Payouts & Billing",
        icon: "payments",
        path: "/seller/payouts",
      }
    ]
  },
  {
    title: "Support",
    items: [
      {
        id: "support-issues",
        title: "Support & Issues",
        icon: "support_agent",
        path: "/seller/support",
      }
    ]
  },
  {
    title: "Settings",
    items: [
      {
        id: "settings",
        title: "Settings",
        icon: "settings",
        path: "/seller/settings",
      }
    ]
  }
];

// Maker Role Navigation
export const makerNavigation: NavSection[] = [
  {
    title: "Primary",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: "dashboard",
        path: "/maker/dashboard",
      },
      {
        id: "jobs",
        title: "Jobs",
        icon: "work",
        path: "/maker/jobs",
      },
      {
        id: "calendar",
        title: "Calendar",
        icon: "date_range",
        path: "/maker/calendar",
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        id: "job-board",
        title: "Job Board",
        icon: "view_list",
        path: "/maker/job-board",
      },
      {
        id: "messages",
        title: "Messages",
        icon: "chat",
        path: "/maker/messages",
      },
      {
        id: "files",
        title: "Files",
        icon: "folder",
        path: "/maker/files",
      }
    ]
  },
  {
    title: "Finance",
    items: [
      {
        id: "payouts",
        title: "Earnings & Payouts",
        icon: "payments",
        path: "/maker/payouts",
      }
    ]
  },
  {
    title: "Profile",
    items: [
      {
        id: "profile",
        title: "Profile & Capabilities",
        icon: "person",
        path: "/maker/profile",
      }
    ]
  },
  {
    title: "Settings",
    items: [
      {
        id: "settings",
        title: "Settings",
        icon: "settings",
        path: "/maker/settings",
      }
    ]
  },
  {
    title: "Support",
    items: [
      {
        id: "support",
        title: "Support",
        icon: "support_agent",
        path: "/maker/support",
      }
    ]
  }
];

// Designer Role Navigation
export const designerNavigation: NavSection[] = [
  {
    title: "Primary",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: "dashboard",
        path: "/designer/dashboard",
      },
      {
        id: "requests",
        title: "Requests",
        icon: "assignment",
        path: "/designer/requests",
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        id: "files",
        title: "Files / Deliverables",
        icon: "folder",
        path: "/designer/files",
      },
      {
        id: "messages",
        title: "Messages",
        icon: "chat",
        path: "/designer/messages",
      }
    ]
  },
  {
    title: "Performance",
    items: [
      {
        id: "royalties",
        title: "Royalties",
        icon: "monetization_on",
        path: "/designer/royalties",
      }
    ]
  },
  {
    title: "Profile",
    items: [
      {
        id: "profile",
        title: "Profile",
        icon: "person",
        path: "/designer/profile",
      }
    ]
  },
  {
    title: "Settings",
    items: [
      {
        id: "settings",
        title: "Settings",
        icon: "settings",
        path: "/designer/settings",
      }
    ]
  }
];

// Default/Admin Navigation (fallback to original navigation)
export const defaultNavigation: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: "dashboard",
        badge: {
          text: "30",
          color: "text-orange-500",
          bgColor: "bg-orange-50"
        },
        children: [
          { id: "ecommerce", title: "eCommerce", path: "/dashboard/ecommerce" },
          { id: "crm", title: "CRM", path: "/dashboard/crm" },
          { id: "project-management", title: "Project Management", path: "/dashboard/project-management" },
          { id: "lms", title: "LMS", path: "/dashboard/lms" },
          { id: "helpdesk", title: "HelpDesk", path: "/dashboard/helpdesk", badge: { text: "Hot", color: "text-danger-500", bgColor: "bg-danger-100" } },
          { id: "analytics", title: "Analytics", path: "/dashboard/analytics" },
          { id: "crypto", title: "Crypto", path: "/dashboard/crypto" },
          { id: "sales", title: "Sales", path: "/dashboard/sales" },
          { id: "hospital", title: "Hospital", path: "/dashboard/hospital" },
          { id: "hrm", title: "HRM", path: "/dashboard/hrm" },
          { id: "school", title: "School", path: "/dashboard/school" },
          { id: "call-center", title: "Call Center", path: "/dashboard/call-center", badge: { text: "Popular", color: "text-success-600", bgColor: "bg-success-100" } },
          { id: "marketing", title: "Marketing", path: "/dashboard/marketing" },
          { id: "nft", title: "NFT", path: "/dashboard/nft" },
          { id: "saas", title: "SaaS", path: "/dashboard/saas" },
          { id: "real-estate", title: "Real Estate", path: "/dashboard/real-estate", badge: { text: "Top", color: "text-purple-500", bgColor: "bg-purple-100" } },
          { id: "shipment", title: "Shipment", path: "/dashboard/shipment" },
          { id: "finance", title: "Finance", path: "/dashboard/finance" },
          { id: "pos-system", title: "POS System", path: "/dashboard/pos-system" },
          { id: "podcast", title: "Podcast", path: "/dashboard/podcast" },
          { id: "social-media", title: "Social Media", path: "/dashboard/social-media" },
          { id: "doctor", title: "Doctor", path: "/dashboard/doctor" },
          { id: "beauty-salon", title: "Beauty Salon", path: "/dashboard/beauty-salon" },
          { id: "store-analysis", title: "Store Analysis", path: "/dashboard/store-analysis" },
          { id: "restaurant", title: "Restaurant", path: "/dashboard/restaurant" },
          { id: "hotel", title: "Hotel", path: "/dashboard/hotel", badge: { text: "New", color: "text-orange-500", bgColor: "bg-orange-100" } },
          { id: "real-estate-agent", title: "Real Estate Agent", path: "/dashboard/real-estate-agent", badge: { text: "New", color: "text-orange-500", bgColor: "bg-orange-100" } },
          { id: "credit-card", title: "Credit Card", path: "/dashboard/credit-card", badge: { text: "New", color: "text-orange-500", bgColor: "bg-orange-100" } },
          { id: "crypto-trader", title: "Crypto Trader", path: "/dashboard/crypto-trader", badge: { text: "New", color: "text-orange-500", bgColor: "bg-orange-100" } },
          { id: "crypto-performance", title: "Crypto Perf.", path: "/dashboard/crypto-performance", badge: { text: "New", color: "text-orange-500", bgColor: "bg-orange-100" } }
        ]
      },
      {
        id: "front-pages",
        title: "Front Pages",
        icon: "note_stack",
        children: [
          { id: "home", title: "Home", path: "/" },
          { id: "features", title: "Features", path: "/front-pages/features" },
          { id: "team", title: "Our Team", path: "/front-pages/team" },
          { id: "faq", title: "FAQ's", path: "/front-pages/faq" },
          { id: "contact", title: "Contact", path: "/front-pages/contact" }
        ]
      }
    ]
  },
  {
    title: "Apps",
    items: [
      { id: "to-do-list", title: "To Do List", icon: "format_list_bulleted", path: "/apps/to-do-list" },
      { id: "calendar", title: "Calendar", icon: "date_range", path: "/apps/calendar" },
      { id: "contacts", title: "Contacts", icon: "contact_page", path: "/apps/contacts" },
      { id: "chat", title: "Chat", icon: "chat", path: "/apps/chat" },
      {
        id: "email",
        title: "Email",
        icon: "mail",
        children: [
          { id: "inbox", title: "Inbox", path: "/apps/email" },
          { id: "compose", title: "Compose", path: "/apps/email/compose" }
        ]
      }
    ]
  }
];

// Role navigation mapping
export const roleNavigation = {
  seller: sellerNavigation,
  maker: makerNavigation,
  designer: designerNavigation,
  admin: defaultNavigation,
  default: defaultNavigation
};
