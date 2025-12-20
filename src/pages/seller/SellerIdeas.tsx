import { Link } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";

// Type definitions
interface Idea {
  id: string;
  name: string;
  category: string;
  description: string;
  demandScore: number;
  competition: string;
  estimatedMargin: string;
  suggestedPrice: string;
  timeToMarket: string;
  status: string;
}

interface IdeaDetailsData {
  whyThisIdea: string[];
  recommendedVariants: Array<{
    variant: string;
    material: string;
    priceModifier: string;
  }>;
}

const SellerIdeas = () => {
  // State for managing idea statuses
  const [ideaStatuses, setIdeaStatuses] = useState<Record<string, string>>({});

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    competition: 'All',
    status: 'All',
    sortBy: 'demand'
  });

  // Modal state
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock ideas data
  const ideasData = useMemo(() => ({
    kpis: {
      newIdeasThisWeek: {
        value: '12',
        icon: 'lightbulb',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        textColor: 'text-blue-600 dark:text-blue-300',
        iconColor: 'text-blue-600 dark:text-blue-300'
      },
      savedIdeas: {
        value: '47',
        icon: 'bookmark',
        bgColor: 'bg-green-100 dark:bg-green-900',
        textColor: 'text-green-600 dark:text-green-300',
        iconColor: 'text-green-600 dark:text-green-300'
      },
      ideasInReview: {
        value: '8',
        icon: 'rate_review',
        bgColor: 'bg-orange-100 dark:bg-orange-900',
        textColor: 'text-orange-600 dark:text-orange-300',
        iconColor: 'text-orange-600 dark:text-orange-300'
      },
      estimatedAvgMargin: {
        value: '34.2%',
        icon: 'trending_up',
        bgColor: 'bg-purple-100 dark:bg-purple-900',
        textColor: 'text-purple-600 dark:text-purple-300',
        iconColor: 'text-purple-600 dark:text-purple-300'
      }
    },
    trendingIdeas: [
      {
        id: 'IDEA-001',
        title: 'Ergonomic Wireless Mouse Pad',
        category: 'Office Accessories',
        demandScore: 92,
        estimatedMargin: '42%',
        competitionLevel: 'Medium',
        keywords: ['ergonomic', 'wireless charging', 'mouse pad'],
        status: 'Hot',
        statusClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
      },
      {
        id: 'IDEA-002',
        title: 'Sustainable Phone Case with Card Holder',
        category: 'Mobile Accessories',
        demandScore: 87,
        estimatedMargin: '38%',
        competitionLevel: 'Low',
        keywords: ['sustainable', 'eco-friendly', 'card holder'],
        status: 'Rising',
        statusClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
      },
      {
        id: 'IDEA-003',
        title: 'Modular Desk Organizer System',
        category: 'Home Office',
        demandScore: 84,
        estimatedMargin: '31%',
        competitionLevel: 'High',
        keywords: ['modular', 'desk organizer', '3D printed'],
        status: 'Trending',
        statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
      },
      {
        id: 'IDEA-004',
        title: 'Smart Plant Watering System',
        category: 'Smart Home',
        demandScore: 79,
        estimatedMargin: '45%',
        competitionLevel: 'Medium',
        keywords: ['IoT', 'plant care', 'automation'],
        status: 'New',
        statusClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
      }
    ],
    savedIdeas: [
      {
        id: 'SAVED-001',
        title: 'Foldable Laptop Stand',
        category: 'Tech Accessories',
        savedDate: 'Dec 18, 2025',
        estimatedMargin: '35%',
        notes: 'Great for remote workers, lightweight design'
      },
      {
        id: 'SAVED-002',
        title: 'Minimalist Wallet with RFID',
        category: 'Fashion Accessories',
        savedDate: 'Dec 15, 2025',
        estimatedMargin: '28%',
        notes: 'Security-focused, growing market demand'
      },
      {
        id: 'SAVED-003',
        title: 'Adjustable Monitor Arm',
        category: 'Office Equipment',
        savedDate: 'Dec 12, 2025',
        estimatedMargin: '41%',
        notes: 'Ergonomic trend, WFH market still strong'
      }
    ],
    allIdeas: [
      {
        id: 'GRID-001',
        name: 'Wireless Charging Mouse Pad',
        category: 'Office Accessories',
        description: 'Ergonomic mouse pad with built-in wireless charging for phones and accessories.',
        demandScore: 94,
        competition: 'Medium',
        estimatedMargin: '32-45%',
        suggestedPrice: '$24.99',
        timeToMarket: '2-5 days',
        status: 'New'
      },
      {
        id: 'GRID-002',
        name: 'Modular Phone Stand System',
        category: 'Mobile Accessories',
        description: 'Adjustable phone stand with interchangeable bases for desk, car, and bedside use.',
        demandScore: 88,
        competition: 'Low',
        estimatedMargin: '28-38%',
        suggestedPrice: '$18.99',
        timeToMarket: '1-3 days',
        status: 'Saved'
      },
      {
        id: 'GRID-003',
        name: 'Smart Desk Organizer Hub',
        category: 'Home Office',
        description: 'Multi-compartment organizer with USB charging ports and wireless phone charging.',
        demandScore: 91,
        competition: 'High',
        estimatedMargin: '35-42%',
        suggestedPrice: '$34.99',
        timeToMarket: '1-2 weeks',
        status: 'In Review'
      },
      {
        id: 'GRID-004',
        name: 'Eco-Friendly Cable Management',
        category: 'Office Accessories',
        description: 'Sustainable bamboo cable organizer with magnetic attachment system.',
        demandScore: 76,
        competition: 'Low',
        estimatedMargin: '40-55%',
        suggestedPrice: '$16.99',
        timeToMarket: '3-7 days',
        status: 'New'
      },
      {
        id: 'GRID-005',
        name: 'Portable Laptop Cooling Stand',
        category: 'Tech Accessories',
        description: 'Foldable laptop stand with built-in cooling fans and adjustable height settings.',
        demandScore: 83,
        competition: 'Medium',
        estimatedMargin: '30-40%',
        suggestedPrice: '$42.99',
        timeToMarket: '1-2 weeks',
        status: 'Saved'
      },
      {
        id: 'GRID-006',
        name: 'Smart Water Bottle Tracker',
        category: 'Health & Fitness',
        description: 'IoT-enabled water bottle with hydration tracking and reminder notifications.',
        demandScore: 79,
        competition: 'High',
        estimatedMargin: '25-35%',
        suggestedPrice: '$49.99',
        timeToMarket: '2-3 weeks',
        status: 'New'
      },
      {
        id: 'GRID-007',
        name: 'Minimalist Card Wallet',
        category: 'Fashion Accessories',
        description: 'RFID-blocking slim wallet with magnetic money clip and phone stand feature.',
        demandScore: 85,
        competition: 'Medium',
        estimatedMargin: '45-60%',
        suggestedPrice: '$22.99',
        timeToMarket: '2-5 days',
        status: 'In Review'
      },
      {
        id: 'GRID-008',
        name: 'Adjustable Monitor Arm Mount',
        category: 'Office Equipment',
        description: 'Dual-monitor mount with easy height and angle adjustment for ergonomic setup.',
        demandScore: 87,
        competition: 'Medium',
        estimatedMargin: '35-48%',
        suggestedPrice: '$89.99',
        timeToMarket: '1-2 weeks',
        status: 'Saved'
      },
      {
        id: 'GRID-009',
        name: 'Plant Care Automation Kit',
        category: 'Smart Home',
        description: 'Automated watering system with soil moisture sensors and mobile app control.',
        demandScore: 81,
        competition: 'Low',
        estimatedMargin: '38-50%',
        suggestedPrice: '$67.99',
        timeToMarket: '2-3 weeks',
        status: 'New'
      },
      {
        id: 'GRID-010',
        name: 'Magnetic Tool Organizer',
        category: 'Workshop & Tools',
        description: 'Powerful magnetic strip with tool holders for workshop and garage organization.',
        demandScore: 74,
        competition: 'Low',
        estimatedMargin: '42-58%',
        suggestedPrice: '$28.99',
        timeToMarket: '3-7 days',
        status: 'New'
      },
      {
        id: 'GRID-011',
        name: 'LED Desk Lamp with Wireless Charging',
        category: 'Office Accessories',
        description: 'Adjustable LED desk lamp with built-in wireless charging pad and USB ports.',
        demandScore: 89,
        competition: 'High',
        estimatedMargin: '28-38%',
        suggestedPrice: '$54.99',
        timeToMarket: '1-2 weeks',
        status: 'In Review'
      },
      {
        id: 'GRID-012',
        name: 'Collapsible Storage Cubes',
        category: 'Home Organization',
        description: 'Space-saving fabric storage cubes with reinforced structure and easy assembly.',
        demandScore: 78,
        competition: 'Medium',
        estimatedMargin: '50-65%',
        suggestedPrice: '$19.99',
        timeToMarket: '2-5 days',
        status: 'Saved'
      },
      {
        id: 'GRID-013',
        name: 'Smart Keychain Finder',
        category: 'Smart Accessories',
        description: 'Bluetooth tracker with loud alarm, LED light, and smartphone app integration.',
        demandScore: 86,
        competition: 'High',
        estimatedMargin: '30-42%',
        suggestedPrice: '$12.99',
        timeToMarket: '1-3 days',
        status: 'New'
      },
      {
        id: 'GRID-014',
        name: 'Ergonomic Wrist Rest Pad',
        category: 'Office Accessories',
        description: 'Memory foam wrist support with cooling gel and non-slip base for keyboards.',
        demandScore: 82,
        competition: 'Medium',
        estimatedMargin: '55-70%',
        suggestedPrice: '$15.99',
        timeToMarket: '2-5 days',
        status: 'Saved'
      },
      {
        id: 'GRID-015',
        name: 'Portable Phone Photography Kit',
        category: 'Photography',
        description: 'Compact tripod with phone mount, LED ring light, and wireless remote shutter.',
        demandScore: 90,
        competition: 'Medium',
        estimatedMargin: '32-45%',
        suggestedPrice: '$39.99',
        timeToMarket: '1-2 weeks',
        status: 'In Review'
      }
    ]
  }), []);

  const getDemandLevel = (score: number) => {
    if (score >= 90) return { label: 'Very High', class: 'text-red-600 dark:text-red-400' };
    if (score >= 80) return { label: 'High', class: 'text-orange-600 dark:text-orange-400' };
    if (score >= 70) return { label: 'Medium', class: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Low', class: 'text-gray-600 dark:text-gray-400' };
  };

  const getCompetitionColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'saved': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'in review': return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get unique categories from all ideas
  const uniqueCategories = useMemo(() => {
    const categories = ideasData.allIdeas.map(idea => idea.category);
    return ['All', ...Array.from(new Set(categories))];
  }, [ideasData.allIdeas]);

  // Helper function to get current status (from state or default)
  const getCurrentStatus = useCallback((ideaId: string, defaultStatus: string) => {
    return ideaStatuses[ideaId] || defaultStatus;
  }, [ideaStatuses]);

  // Filter and sort ideas based on current filters
  const filteredAndSortedIdeas = useMemo(() => {
    const filtered = ideasData.allIdeas.filter(idea => {
      const currentStatus = getCurrentStatus(idea.id, idea.status);

      // Search filter (name + category)
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        idea.name.toLowerCase().includes(searchTerm) ||
        idea.category.toLowerCase().includes(searchTerm);

      // Category filter
      const matchesCategory = filters.category === 'All' || idea.category === filters.category;

      // Competition filter
      const matchesCompetition = filters.competition === 'All' || idea.competition === filters.competition;

      // Status filter
      const matchesStatus = filters.status === 'All' || currentStatus === filters.status;

      return matchesSearch && matchesCategory && matchesCompetition && matchesStatus;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'demand':
          return b.demandScore - a.demandScore; // desc
        case 'margin': {
          // Extract first number from margin range for sorting
          const getMarginValue = (margin: string) => {
            const match = margin.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          return getMarginValue(b.estimatedMargin) - getMarginValue(a.estimatedMargin); // desc
        }
        case 'competition': {
          // Competition order: Low (1) -> Medium (2) -> High (3) for asc
          const competitionOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          return competitionOrder[a.competition as keyof typeof competitionOrder] -
                 competitionOrder[b.competition as keyof typeof competitionOrder]; // asc
        }
        case 'timeToMarket': {
          // Convert time to market to days for sorting
          const getTimeValue = (time: string) => {
            if (time.includes('week')) {
              const weeks = parseInt(time.match(/(\d+)/)?.[1] || '0');
              return weeks * 7; // Convert weeks to days
            }
            return parseInt(time.match(/(\d+)/)?.[1] || '0');
          };
          return getTimeValue(a.timeToMarket) - getTimeValue(b.timeToMarket); // asc
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [ideasData.allIdeas, filters, getCurrentStatus]);

  // Action handlers
  const handleSaveIdea = (ideaId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Saved' ? 'New' : 'Saved';
    setIdeaStatuses(prev => ({ ...prev, [ideaId]: newStatus }));
  };

  const handleConvertToProduct = (_ideaId: string, ideaName: string) => {
    alert(`Converting "${ideaName}" to product... (placeholder action)`);
  };

  const handleRequestCustomSTL = (ideaId: string, ideaName: string) => {
    // Navigate to STL requests with idea info
    window.location.href = `/seller/stl-requests?idea=${ideaId}&name=${encodeURIComponent(ideaName)}`;
  };

  const handleRefreshIdeas = () => {
    // Placeholder handler for refreshing ideas
    alert('Refreshing ideas... (placeholder action)');
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Check if any filters are applied
  const hasActiveFilters = filters.search || filters.category !== 'All' ||
    filters.competition !== 'All' || filters.status !== 'All' || filters.sortBy !== 'demand';

  // Open idea details modal
  const openIdeaDetailsModal = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  // Close idea details modal
  const closeIdeaDetailsModal = () => {
    setSelectedIdea(null);
    setIsModalOpen(false);
  };

  // Get mock data for idea details
  const getIdeaDetailsData = (idea: Idea): IdeaDetailsData => {
    return {
      whyThisIdea: [
        'High market demand with growing trend',
        'Low manufacturing complexity and cost',
        'Strong profit margins with scalable production',
        'Multiple customer segments and use cases',
        'Minimal competition in current market space'
      ],
      recommendedVariants: [
        { variant: 'Premium Edition', material: 'Carbon Fiber', priceModifier: '+$15' },
        { variant: 'Standard Version', material: 'ABS Plastic', priceModifier: 'Base Price' },
        { variant: 'Eco-Friendly', material: 'Recycled PLA', priceModifier: '+$8' },
        { variant: 'Limited Edition', material: 'Wood Composite', priceModifier: '+$25' }
      ]
    };
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-0">Product Ideas</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Launch new products with strong demand and healthy margins
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
            Product Ideas
          </li>
        </ol>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* New Ideas This Week */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className={`w-12 h-12 ${ideasData.kpis.newIdeasThisWeek.bgColor} rounded-full flex items-center justify-center mr-3`}>
                  <i className={`material-symbols-outlined ${ideasData.kpis.newIdeasThisWeek.iconColor} text-xl`}>
                    {ideasData.kpis.newIdeasThisWeek.icon}
                  </i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Ideas</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {ideasData.kpis.newIdeasThisWeek.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +3 from last week
              </p>
            </div>
          </div>
        </div>

        {/* Saved Ideas */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className={`w-12 h-12 ${ideasData.kpis.savedIdeas.bgColor} rounded-full flex items-center justify-center mr-3`}>
                  <i className={`material-symbols-outlined ${ideasData.kpis.savedIdeas.iconColor} text-xl`}>
                    {ideasData.kpis.savedIdeas.icon}
                  </i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Ideas</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {ideasData.kpis.savedIdeas.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ready for review
              </p>
            </div>
          </div>
        </div>

        {/* Ideas In Review */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className={`w-12 h-12 ${ideasData.kpis.ideasInReview.bgColor} rounded-full flex items-center justify-center mr-3`}>
                  <i className={`material-symbols-outlined ${ideasData.kpis.ideasInReview.iconColor} text-xl`}>
                    {ideasData.kpis.ideasInReview.icon}
                  </i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Review</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {ideasData.kpis.ideasInReview.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Being evaluated
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Avg Margin */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className={`w-12 h-12 ${ideasData.kpis.estimatedAvgMargin.bgColor} rounded-full flex items-center justify-center mr-3`}>
                  <i className={`material-symbols-outlined ${ideasData.kpis.estimatedAvgMargin.iconColor} text-xl`}>
                    {ideasData.kpis.estimatedAvgMargin.icon}
                  </i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Margin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Saved Ideas</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {ideasData.kpis.estimatedAvgMargin.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Above industry avg
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trending Ideas */}
        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">trending_up</i>
                Trending Ideas
              </h6>
              <button className="trezo-btn bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                View All Ideas
              </button>
            </div>

            <div className="space-y-4">
              {ideasData.trendingIdeas.map((idea) => (
                <div key={idea.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h6 className="font-semibold text-gray-900 dark:text-white">
                          {idea.title}
                        </h6>
                        <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${idea.statusClass}`}>
                          {idea.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {idea.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {idea.keywords.map((keyword, keyIndex) => (
                          <span key={keyIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="trezo-btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-md transition-colors">
                      <i className="material-symbols-outlined text-sm">bookmark_border</i>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Demand Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${idea.demandScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getDemandLevel(idea.demandScore).class}`}>
                          {idea.demandScore}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. Margin</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {idea.estimatedMargin}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Competition</p>
                      <p className={`text-sm font-medium ${getCompetitionColor(idea.competitionLevel)}`}>
                        {idea.competitionLevel}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Saved Ideas */}
        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <h6 className="!mb-0 flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-500">bookmark</i>
                Saved Ideas
              </h6>
              <Link
                to="/seller/ideas/saved"
                className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {ideasData.savedIdeas.map((idea) => (
                <div key={idea.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
                        {idea.title}
                      </h6>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {idea.category} • {idea.savedDate}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {idea.notes}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Est. Margin: <span className="font-medium text-gray-900 dark:text-white">{idea.estimatedMargin}</span>
                    </span>
                    <div className="flex gap-2">
                      <button className="trezo-btn bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="trezo-btn w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 py-2 rounded-md text-sm font-medium transition-colors">
                <i className="material-symbols-outlined mr-2 text-sm">add</i>
                Add New Idea
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Grid Section */}
      <div className="mt-8">
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
            <h6 className="!mb-0 flex items-center gap-2">
              <i className="material-symbols-outlined text-primary-500">grid_view</i>
              All Product Ideas
            </h6>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredAndSortedIdeas.length} of {ideasData.allIdeas.length} ideas
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="material-symbols-outlined text-gray-400 text-sm">search</i>
                  </div>
                  <input
                    type="text"
                    placeholder="Search ideas by name or category..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="trezo-input w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="trezo-btn bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.competition}
                  onChange={(e) => handleFilterChange('competition', e.target.value)}
                  className="trezo-btn bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="All">All Competition</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="trezo-btn bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="All">All Status</option>
                  <option value="New">New</option>
                  <option value="Saved">Saved</option>
                  <option value="In Review">In Review</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="trezo-btn bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="demand">Sort by Demand ↓</option>
                  <option value="margin">Sort by Margin ↓</option>
                  <option value="competition">Sort by Competition ↑</option>
                  <option value="timeToMarket">Sort by Time ↑</option>
                </select>

                {(filters.search || filters.category !== 'All' || filters.competition !== 'All' || filters.status !== 'All' || filters.sortBy !== 'demand') && (
                  <button
                    onClick={() => setFilters({
                      search: '',
                      category: 'All',
                      competition: 'All',
                      status: 'All',
                      sortBy: 'demand'
                    })}
                    className="trezo-btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <i className="material-symbols-outlined mr-1 text-sm">clear_all</i>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ideas Grid or Empty States */}
          {ideasData.allIdeas.length === 0 ? (
            /* Empty State - No Ideas At All */
            <div className="py-16 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <i className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">lightbulb</i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No ideas yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  We're working on generating new product ideas for you. Check back soon for fresh opportunities.
                </p>
                <button
                  onClick={handleRefreshIdeas}
                  className="trezo-btn bg-primary-600 text-white hover:bg-primary-700 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  <i className="material-symbols-outlined mr-2 text-sm">refresh</i>
                  Refresh Ideas
                </button>
              </div>
            </div>
          ) : filteredAndSortedIdeas.length === 0 ? (
            /* Empty State - No Ideas Found (Filtered) */
            <div className="py-16 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <i className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">search_off</i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No ideas found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  No product ideas match your current filters. Try adjusting your search criteria or clearing the filters.
                </p>
                <button
                  onClick={() => setFilters({
                    search: '',
                    category: 'All',
                    competition: 'All',
                    status: 'All',
                    sortBy: 'demand'
                  })}
                  className="trezo-btn bg-primary-600 text-white hover:bg-primary-700 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  <i className="material-symbols-outlined mr-2 text-sm">clear_all</i>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            /* Ideas Grid */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedIdeas.map((idea) => {
                  const currentStatus = getCurrentStatus(idea.id, idea.status);

                  return (
                    <div
                      key={idea.id}
                      onClick={() => openIdeaDetailsModal(idea)}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${getStatusBadgeClass(currentStatus)}`}>
                              {currentStatus}
                            </span>
                            <span className="px-[8px] py-[3px] rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                              {idea.category}
                            </span>
                          </div>
                          <h6 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {idea.name}
                          </h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {idea.description}
                          </p>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Demand Score</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full"
                                style={{ width: `${idea.demandScore}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${getDemandLevel(idea.demandScore).class}`}>
                              {idea.demandScore}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Competition</p>
                          <p className={`text-sm font-medium ${getCompetitionColor(idea.competition)}`}>
                            {idea.competition}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. Margin</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {idea.estimatedMargin}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time to Market</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {idea.timeToMarket}
                          </p>
                        </div>
                      </div>

                      {/* Price Display */}
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Suggested Price</p>
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {idea.suggestedPrice}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveIdea(idea.id, currentStatus);
                            }}
                            className={`trezo-btn px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              currentStatus === 'Saved' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <i className="material-symbols-outlined mr-1 text-sm">
                              {currentStatus === 'Saved' ? 'bookmark' : 'bookmark_border'}
                            </i>
                            {currentStatus === 'Saved' ? 'Saved' : 'Save'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvertToProduct(idea.id, idea.name);
                            }}
                            className="trezo-btn bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            <i className="material-symbols-outlined mr-1 text-sm">shopping_cart</i>
                            Convert
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequestCustomSTL(idea.id, idea.name);
                          }}
                          className="trezo-btn w-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <i className="material-symbols-outlined mr-1 text-sm">precision_manufacturing</i>
                          Request Custom STL
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              <div className="mt-8 text-center">
                <button className="trezo-btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-6 py-3 rounded-md font-medium transition-colors">
                  <i className="material-symbols-outlined mr-2">refresh</i>
                  Load More Ideas
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Idea Details Modal */}
      {isModalOpen && selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-slate-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <i className="material-symbols-outlined text-white text-lg">lightbulb</i>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">
                    {selectedIdea.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {getCurrentStatus(selectedIdea.id, selectedIdea.status)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                      {selectedIdea.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeIdeaDetailsModal}
                className="text-slate-400 hover:text-white transition-colors p-2"
              >
                <i className="material-symbols-outlined text-xl">close</i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Larger Description */}
              <div className="mb-6">
                <h6 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">Description</h6>
                <p className="text-slate-200 leading-relaxed">
                  {selectedIdea.description} This innovative product addresses a significant market gap with its unique design and functionality.
                  The concept has been thoroughly researched and validated through market analysis, showing strong potential for success in the current competitive landscape.
                </p>
              </div>

              {/* Scores Recap */}
              <div className="mb-6">
                <h6 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Market Scores</h6>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Demand Score</p>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-primary-500 h-3 rounded-full"
                          style={{ width: `${selectedIdea.demandScore}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-white">{selectedIdea.demandScore}</span>
                    </div>
                    <p className={`text-sm font-medium ${getDemandLevel(selectedIdea.demandScore).class}`}>
                      {getDemandLevel(selectedIdea.demandScore).label}
                    </p>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Competition Level</p>
                    <div className="mb-2">
                      <span className="text-lg font-bold text-white">{selectedIdea.competition}</span>
                    </div>
                    <p className={`text-sm font-medium ${getCompetitionColor(selectedIdea.competition)}`}>
                      Market Competition
                    </p>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Estimated Margin</p>
                    <div className="mb-2">
                      <span className="text-lg font-bold text-white">{selectedIdea.estimatedMargin}</span>
                    </div>
                    <p className="text-sm font-medium text-green-400">
                      Profit Potential
                    </p>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Time to Market</p>
                    <div className="mb-2">
                      <span className="text-lg font-bold text-white">{selectedIdea.timeToMarket}</span>
                    </div>
                    <p className="text-sm font-medium text-blue-400">
                      Production Time
                    </p>
                  </div>
                </div>
              </div>

              {/* Why This Idea */}
              <div className="mb-6">
                <h6 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Why This Idea</h6>
                <div className="bg-slate-800 rounded-lg p-4">
                  <ul className="space-y-3">
                    {getIdeaDetailsData(selectedIdea).whyThisIdea.map((reason, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-200 leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Variants/Materials */}
              <div className="mb-8">
                <h6 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Recommended Variants & Materials</h6>
                <div className="grid gap-3">
                  {getIdeaDetailsData(selectedIdea).recommendedVariants.map((item, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h6 className="text-white font-medium mb-1">{item.variant}</h6>
                        <p className="text-slate-400 text-sm">{item.material}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 font-medium">{item.priceModifier}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-700">
                <button
                  onClick={() => {
                    handleSaveIdea(selectedIdea.id, getCurrentStatus(selectedIdea.id, selectedIdea.status));
                    closeIdeaDetailsModal();
                  }}
                  className={`trezo-btn flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                    getCurrentStatus(selectedIdea.id, selectedIdea.status) === 'Saved' 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  <i className="material-symbols-outlined mr-2 text-sm">
                    {getCurrentStatus(selectedIdea.id, selectedIdea.status) === 'Saved' ? 'bookmark' : 'bookmark_border'}
                  </i>
                  {getCurrentStatus(selectedIdea.id, selectedIdea.status) === 'Saved' ? 'Unsave Idea' : 'Save Idea'}
                </button>

                <button
                  onClick={() => {
                    handleConvertToProduct(selectedIdea.id, selectedIdea.name);
                    closeIdeaDetailsModal();
                  }}
                  className="trezo-btn flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  <i className="material-symbols-outlined mr-2 text-sm">shopping_cart</i>
                  Convert to Product
                </button>

                <button
                  onClick={() => {
                    handleRequestCustomSTL(selectedIdea.id, selectedIdea.name);
                    closeIdeaDetailsModal();
                  }}
                  className="trezo-btn flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  <i className="material-symbols-outlined mr-2 text-sm">precision_manufacturing</i>
                  Request Custom STL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerIdeas;
