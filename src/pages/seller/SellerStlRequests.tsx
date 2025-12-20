import React, { useState } from 'react';

const SellerStlRequests: React.FC = () => {
  // Mock data for STL requests
  const mockData = {
    kpis: {
      openRequests: {
        value: '12',
        label: 'Open Requests',
        icon: 'ri-file-paper-line',
        color: 'blue',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        textColor: 'text-blue-600 dark:text-blue-300',
        change: '+3',
        changeType: 'positive'
      },
      inDesign: {
        value: '8',
        label: 'In Design',
        icon: 'ri-pencil-ruler-2-line',
        color: 'orange',
        bgColor: 'bg-orange-100 dark:bg-orange-900',
        textColor: 'text-orange-600 dark:text-orange-300',
        change: '+2',
        changeType: 'positive'
      },
      inReview: {
        value: '5',
        label: 'In Review',
        icon: 'ri-search-eye-line',
        color: 'purple',
        bgColor: 'bg-purple-100 dark:bg-purple-900',
        textColor: 'text-purple-600 dark:text-purple-300',
        change: '-1',
        changeType: 'negative'
      },
      completed: {
        value: '23',
        label: 'Completed (30d)',
        icon: 'ri-checkbox-circle-line',
        color: 'green',
        bgColor: 'bg-green-100 dark:bg-green-900',
        textColor: 'text-green-600 dark:text-green-300',
        change: '+18',
        changeType: 'positive'
      }
    },
    requests: [
      {
        id: 'STL-2024-001',
        title: 'Custom Phone Grip with Logo',
        category: 'Accessories',
        requestDate: '2024-12-18',
        updatedDate: '2024-12-19',
        dueDate: '2024-12-25',
        status: 'submitted',
        statusLabel: 'Submitted',
        statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        priority: 'high',
        priorityLabel: 'High',
        priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        budget: '$150 - $200',
        targetPrice: '$12.99',
        description: 'Custom phone grip with company logo and unique ergonomic design for promotional use.',
        requesterEmail: 'client@techcorp.com'
      },
      {
        id: 'STL-2024-002',
        title: 'Miniature Building Model',
        category: 'Architecture',
        requestDate: '2024-12-17',
        updatedDate: '2024-12-19',
        dueDate: '2024-12-31',
        status: 'in_design',
        statusLabel: 'In Design',
        statusClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        priority: 'normal',
        priorityLabel: 'Normal',
        priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        budget: '$300 - $500',
        targetPrice: '$45.00',
        description: 'Detailed architectural model of downtown office building for presentation purposes.',
        requesterEmail: 'architect@designstudio.com'
      },
      {
        id: 'STL-2024-003',
        title: 'Gaming Controller Stand',
        category: 'Gaming',
        requestDate: '2024-12-16',
        updatedDate: '2024-12-18',
        dueDate: '2024-12-23',
        status: 'review',
        statusLabel: 'Review',
        statusClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        priority: 'normal',
        priorityLabel: 'Normal',
        priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        budget: '$100',
        targetPrice: '$24.99',
        description: 'Ergonomic controller stand with cable management for popular gaming consoles.',
        requesterEmail: 'gamer@streamtech.com'
      },
      {
        id: 'STL-2024-004',
        title: 'Medical Device Prototype',
        category: 'Medical',
        requestDate: '2024-12-15',
        updatedDate: '2024-12-17',
        dueDate: '2024-12-20',
        status: 'approved',
        statusLabel: 'Approved',
        statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        priority: 'high',
        priorityLabel: 'High',
        priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        budget: '$800 - $1200',
        targetPrice: '$89.99',
        description: 'Prototype housing for medical monitoring device with precise specifications.',
        requesterEmail: 'dr.smith@medtech.com'
      },
      {
        id: 'STL-2024-005',
        title: 'Custom Jewelry Mold',
        category: 'Fashion',
        requestDate: '2024-12-14',
        updatedDate: '2024-12-16',
        dueDate: '2024-12-21',
        status: 'delivered',
        statusLabel: 'Delivered',
        statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        priority: 'low',
        priorityLabel: 'Low',
        priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        budget: '$200 - $300',
        targetPrice: '$35.00',
        description: 'Intricate jewelry casting mold for custom ring design with detailed engravings.',
        requesterEmail: 'jeweler@craftworks.com'
      },
      {
        id: 'STL-2024-006',
        title: 'Drone Frame Prototype',
        category: 'Technology',
        requestDate: '2024-12-13',
        updatedDate: '2024-12-19',
        dueDate: '2024-12-28',
        status: 'in_design',
        statusLabel: 'In Design',
        statusClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        priority: 'high',
        priorityLabel: 'High',
        priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        budget: '$400 - $600',
        targetPrice: '$55.99',
        description: 'Lightweight carbon fiber drone frame with advanced aerodynamics.',
        requesterEmail: 'pilot@dronetech.com'
      },
      {
        id: 'STL-2024-007',
        title: 'Kitchen Utensil Holder',
        category: 'Home & Garden',
        requestDate: '2024-12-12',
        updatedDate: '2024-12-18',
        dueDate: '2024-12-26',
        status: 'submitted',
        statusLabel: 'Submitted',
        statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        priority: 'low',
        priorityLabel: 'Low',
        priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        budget: '$75 - $125',
        targetPrice: '',
        description: 'Modern kitchen utensil organizer with multiple compartments.',
        requesterEmail: 'chef@culinaryarts.com'
      },
      {
        id: 'STL-2024-008',
        title: 'Car Dashboard Mount',
        category: 'Automotive',
        requestDate: '2024-12-11',
        updatedDate: '2024-12-17',
        dueDate: '2024-12-24',
        status: 'review',
        statusLabel: 'Review',
        statusClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        priority: 'normal',
        priorityLabel: 'Normal',
        priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        budget: '$120',
        targetPrice: '$19.99',
        description: 'Universal smartphone mount for car dashboard with adjustable viewing angles.',
        requesterEmail: 'driver@autoparts.com'
      },
      {
        id: 'STL-2024-009',
        title: 'Miniature Figurine Set',
        category: 'Entertainment',
        requestDate: '2024-12-10',
        updatedDate: '2024-12-16',
        dueDate: '2024-12-30',
        status: 'rejected',
        statusLabel: 'Rejected',
        statusClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        priority: 'low',
        priorityLabel: 'Low',
        priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        budget: '$250 - $350',
        targetPrice: '$8.99',
        description: 'Detailed miniature character figurines for tabletop gaming.',
        requesterEmail: 'gamer@tabletopgames.com'
      },
      {
        id: 'STL-2024-010',
        title: 'Tool Organizer Tray',
        category: 'Industrial',
        requestDate: '2024-12-09',
        updatedDate: '2024-12-18',
        dueDate: '2024-12-27',
        status: 'approved',
        statusLabel: 'Approved',
        statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        priority: 'normal',
        priorityLabel: 'Normal',
        priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        budget: '$180 - $250',
        targetPrice: '$32.50',
        description: 'Modular tool organization system for workshop storage.',
        requesterEmail: 'mechanic@workshop.com'
      },
      {
        id: 'STL-2024-011',
        title: 'Plant Pot with Drainage',
        category: 'Home & Garden',
        requestDate: '2024-12-08',
        updatedDate: '2024-12-19',
        dueDate: '2024-12-22',
        status: 'delivered',
        statusLabel: 'Delivered',
        statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        priority: 'low',
        priorityLabel: 'Low',
        priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        budget: '$50 - $80',
        targetPrice: '$15.99',
        description: 'Self-watering plant pot with integrated drainage system.',
        requesterEmail: 'gardener@greenthumb.com'
      },
      {
        id: 'STL-2024-012',
        title: 'VR Headset Stand',
        category: 'Technology',
        requestDate: '2024-12-07',
        updatedDate: '2024-12-17',
        dueDate: '2024-12-29',
        status: 'in_design',
        statusLabel: 'In Design',
        statusClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        priority: 'high',
        priorityLabel: 'High',
        priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        budget: '$90 - $150',
        targetPrice: '$27.99',
        description: 'Ergonomic VR headset stand with cable management and ventilation.',
        requesterEmail: 'vr@immersive.com'
      },
      {
        id: 'STL-2024-013',
        title: 'Desk Cable Organizer',
        category: 'Office',
        requestDate: '2024-12-06',
        updatedDate: '2024-12-18',
        dueDate: '2024-12-25',
        status: 'submitted',
        statusLabel: 'Submitted',
        statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        priority: 'normal',
        priorityLabel: 'Normal',
        priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        budget: '$60 - $100',
        targetPrice: '$18.99',
        description: 'Multi-channel cable management system for office desks.',
        requesterEmail: 'office@productivity.com'
      },
      {
        id: 'STL-2024-014',
        title: 'Modular Storage Bins',
        category: 'Home & Garden',
        requestDate: '2024-12-05',
        updatedDate: '2024-12-16',
        dueDate: '2024-12-28',
        status: 'review',
        statusLabel: 'Review',
        statusClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        priority: 'low',
        priorityLabel: 'Low',
        priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        budget: '$140 - $200',
        targetPrice: '$22.99',
        description: 'Stackable storage bins with interlocking mechanism.',
        requesterEmail: 'organizer@storage.com'
      },
      {
        id: 'STL-2024-015',
        title: 'Custom Trophy Design',
        category: 'Awards',
        requestDate: '2024-12-04',
        updatedDate: '2024-12-19',
        dueDate: '2024-12-23',
        status: 'approved',
        statusLabel: 'Approved',
        statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        priority: 'high',
        priorityLabel: 'High',
        priorityClass: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        budget: '$300 - $450',
        targetPrice: '$65.00',
        description: 'Custom trophy design for annual company achievement awards.',
        requesterEmail: 'hr@corporation.com'
      },
      {
        id: 'STL-2024-016',
        title: 'Smartphone Camera Lens',
        category: 'Accessories',
        requestDate: '2024-12-03',
        updatedDate: '2024-12-17',
        dueDate: '2024-12-26',
        status: 'delivered',
        statusLabel: 'Delivered',
        statusClass: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        priority: 'normal',
        priorityLabel: 'Normal',
        priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        budget: '$80 - $120',
        targetPrice: '$29.99',
        description: 'Clip-on macro lens attachment for smartphone photography.',
        requesterEmail: 'photographer@mobile.com'
      },
      {
        id: 'STL-2024-017',
        title: 'Pet Food Dispenser',
        category: 'Pet Supplies',
        requestDate: '2024-12-02',
        updatedDate: '2024-12-18',
        dueDate: '2024-12-30',
        status: 'in_design',
        statusLabel: 'In Design',
        statusClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        priority: 'normal',
        priorityLabel: 'Normal',
        priorityClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        budget: '$110 - $160',
        targetPrice: '$34.99',
        description: 'Automatic pet food dispenser with portion control.',
        requesterEmail: 'petowner@animals.com'
      },
      {
        id: 'STL-2024-018',
        title: 'Bookend Set',
        category: 'Home & Garden',
        requestDate: '2024-12-01',
        updatedDate: '2024-12-16',
        dueDate: '2024-12-24',
        status: 'submitted',
        statusLabel: 'Submitted',
        statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        priority: 'low',
        priorityLabel: 'Low',
        priorityClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        budget: '$70 - $110',
        targetPrice: '',
        description: 'Decorative bookends with geometric design pattern.',
        requesterEmail: 'reader@library.com'
      }
    ]
  };

  // Filter and search state
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('updated_desc');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [requests, setRequests] = useState(mockData.requests);

  // New request form state
  const [newRequest, setNewRequest] = useState({
    title: '',
    category: '',
    description: '',
    referenceLinks: [''],
    intendedUse: '',
    targetPrice: '',
    budget: '',
    priority: 'normal',
    deliveryDate: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get unique categories from mock data
  const uniqueCategories = Array.from(new Set(requests.map(request => request.category))).sort();

  // Category options for new request form
  const categoryOptions = [
    'Accessories', 'Architecture', 'Automotive', 'Awards', 'Entertainment',
    'Fashion', 'Gaming', 'Home & Garden', 'Industrial', 'Medical',
    'Office', 'Pet Supplies', 'Technology'
  ];

  // Helper functions for filtering and sorting
  const getTabStatusesForFilter = (tab: string) => {
    switch (tab) {
      case 'open':
        return ['submitted', 'in_design'];
      case 'in_review':
        return ['review'];
      case 'completed':
        return ['approved', 'delivered', 'rejected'];
      default:
        return [];
    }
  };

  const getPriorityValue = (priority: string) => {
    switch (priority) {
      case 'high': return 3;
      case 'normal': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const sortRequests = (requests: any[]) => {
    return [...requests].sort((a, b) => {
      switch (sortBy) {
        case 'updated_desc':
          return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
        case 'due_date_asc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority_desc':
          return getPriorityValue(b.priority) - getPriorityValue(a.priority);
        default:
          return 0;
      }
    });
  };

  // Apply all filters (updated to use requests state)
  const filteredRequests = sortRequests(
    requests.filter(request => {
      // Tab filter
      if (activeTab !== 'all') {
        const tabStatuses = getTabStatusesForFilter(activeTab);
        if (!tabStatuses.includes(request.status)) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!request.title.toLowerCase().includes(query) && !request.id.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && request.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && request.priority !== selectedPriority) {
        return false;
      }

      return true;
    })
  );

  // Tab configuration (updated to use requests state)
  const tabs = [
    { key: 'all', label: 'All', count: requests.length },
    { key: 'open', label: 'Open', count: requests.filter(r => ['submitted', 'in_design'].includes(r.status)).length },
    { key: 'in_review', label: 'In Review', count: requests.filter(r => r.status === 'review').length },
    { key: 'completed', label: 'Completed', count: requests.filter(r => ['approved', 'delivered', 'rejected'].includes(r.status)).length }
  ];

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newRequest.title.trim()) {
      errors.title = 'Request title is required';
    }

    if (!newRequest.category) {
      errors.category = 'Category is required';
    }

    if (!newRequest.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!newRequest.budget.trim()) {
      errors.budget = 'Budget is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewRequest(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle reference links
  const addReferenceLink = () => {
    setNewRequest(prev => ({
      ...prev,
      referenceLinks: [...prev.referenceLinks, '']
    }));
  };

  const updateReferenceLink = (index: number, value: string) => {
    setNewRequest(prev => ({
      ...prev,
      referenceLinks: prev.referenceLinks.map((link, i) => i === index ? value : link)
    }));
  };

  const removeReferenceLink = (index: number) => {
    setNewRequest(prev => ({
      ...prev,
      referenceLinks: prev.referenceLinks.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmitRequest = () => {
    if (!validateForm()) {
      return;
    }

    // Generate new request ID
    const newId = `STL-2024-${String(requests.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    // Create new request object
    const requestData = {
      id: newId,
      title: newRequest.title,
      category: newRequest.category,
      requestDate: today,
      updatedDate: today,
      dueDate: newRequest.deliveryDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 14 days from now
      status: 'submitted',
      statusLabel: 'Submitted',
      statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      priority: newRequest.priority,
      priorityLabel: newRequest.priority === 'high' ? 'High' : newRequest.priority === 'low' ? 'Low' : 'Normal',
      priorityClass: newRequest.priority === 'high'
        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
        : newRequest.priority === 'low'
        ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
        : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      budget: newRequest.budget,
      targetPrice: newRequest.targetPrice,
      description: newRequest.description,
      requesterEmail: 'seller@example.com'
    };

    // Add to requests array
    setRequests(prev => [requestData, ...prev]);

    // Reset form
    setNewRequest({
      title: '',
      category: '',
      description: '',
      referenceLinks: [''],
      intendedUse: '',
      targetPrice: '',
      budget: '',
      priority: 'normal',
      deliveryDate: ''
    });

    // Close modal and show toast
    setShowRequestModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleViewRequest = (requestId: string) => {
    // Navigate to detail page - placeholder for now
    console.log(`Navigate to /seller/stl-requests/${requestId}`);
  };

  const handleMessageRequest = (requestId: string) => {
    // Open messaging interface - placeholder for now
    console.log(`Open message for request ${requestId}`);
  };

  const handleCancelRequest = (requestId: string) => {
    // Cancel request - placeholder for now
    console.log(`Cancel request ${requestId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return 'ri-file-paper-line';
      case 'in_design': return 'ri-pencil-ruler-2-line';
      case 'review': return 'ri-search-eye-line';
      case 'approved': return 'ri-checkbox-circle-line';
      case 'delivered': return 'ri-truck-line';
      case 'rejected': return 'ri-close-circle-line';
      default: return 'ri-file-line';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const canCancel = (status: string) => {
    return status === 'submitted' || status === 'in_design';
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px]">
        <h4 className="text-[20px] font-semibold text-black dark:text-white mb-[8px]">
          Custom STL Requests
        </h4>
        <p className="text-gray-500 dark:text-gray-400">
          Request unique designs and track progress from draft to approval
        </p>

        {/* Breadcrumb */}
        <nav className="mt-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a href="/seller/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li className="text-gray-900 dark:text-white font-medium">
              STL Requests
            </li>
          </ol>
        </nav>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Object.entries(mockData.kpis).map(([key, kpi]) => (
          <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className={`p-3 ${kpi.bgColor} rounded-full mr-3`}>
                    <i className={`${kpi.icon} ${kpi.textColor} text-xl`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.label}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`flex items-center text-sm ${
                    kpi.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <i className={`${
                      kpi.changeType === 'positive' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
                    } mr-1`}></i>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">this week</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="trezo-card-title mb-4 sm:mb-0">
            <h5 className="!mb-0">STL Requests</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all your custom design requests</p>
          </div>

          {/* New Request Button */}
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            New Request
          </button>
        </div>

        {/* Filtering Controls */}
        <div className="mb-6 space-y-4">
          {/* Status Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or ID..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="updated_desc">Updated (newest)</option>
                <option value="due_date_asc">Due date (soonest)</option>
                <option value="priority_desc">Priority (high first)</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {filteredRequests.length} of {mockData.requests.length} requests
              {searchQuery && (
                <span className="ml-1">
                  for "<span className="font-medium">{searchQuery}</span>"
                </span>
              )}
            </span>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedPriority('all');
                  setActiveTab('all');
                }}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Request Details
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Category
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Priority
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Timeline
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Budget
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    Target Price
                  </th>
                  <th className="font-medium text-center px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap last:rounded-tr-md">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-start">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                          <i className={`${getStatusIcon(request.status)} text-gray-600 dark:text-gray-400 text-lg`}></i>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-900 dark:text-white mb-1">
                            {request.title}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {request.id}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xs">
                            {request.description}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                            Requested: {formatDate(request.requestDate)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                        {request.category}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${request.statusClass}`}>
                        {request.statusLabel}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className={`px-[8px] py-[3px] rounded-full text-xs font-medium ${request.priorityClass}`}>
                        {request.priorityLabel}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getDaysUntilDue(request.dueDate)}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {request.budget}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {request.targetPrice}
                      </span>
                    </td>
                    <td className="text-center whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewRequest(request.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <i className="ri-eye-line text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleMessageRequest(request.id)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Message Requester"
                        >
                          <i className="ri-message-3-line text-sm"></i>
                        </button>
                        {canCancel(request.status) && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Cancel Request"
                          >
                            <i className="ri-delete-bin-line text-sm"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-file-search-line text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
              <p className="text-gray-500 dark:text-gray-400">No requests found for the selected status.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Categories */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px]">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Request Categories</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Popular design categories</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Accessories', count: 8, color: 'bg-blue-500' },
              { name: 'Architecture', count: 5, color: 'bg-green-500' },
              { name: 'Gaming', count: 4, color: 'bg-purple-500' },
              { name: 'Medical', count: 3, color: 'bg-red-500' },
              { name: 'Fashion', count: 3, color: 'bg-yellow-500' }
            ].map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${category.color} rounded-full mr-3`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px]">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Recent Activity</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest updates on your requests</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { action: 'Design completed', request: 'STL-2024-004', time: '2 hours ago', icon: 'ri-checkbox-circle-line', color: 'text-green-500' },
              { action: 'Review started', request: 'STL-2024-003', time: '5 hours ago', icon: 'ri-search-eye-line', color: 'text-purple-500' },
              { action: 'New request received', request: 'STL-2024-001', time: '1 day ago', icon: 'ri-file-paper-line', color: 'text-blue-500' },
              { action: 'Design phase started', request: 'STL-2024-002', time: '2 days ago', icon: 'ri-pencil-ruler-2-line', color: 'text-orange-500' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                  <i className={`${activity.icon} ${activity.color} text-sm`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.request} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Modal for New Request */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New STL Request</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Request Form */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Request Title
                  </label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                      formErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    placeholder="Enter a brief title for your request"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                      formErrors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    formErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                  }`}
                  rows={3}
                  placeholder="Provide a detailed description of your request"
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              {/* Reference Links */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference Links
                </label>
                {newRequest.referenceLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => updateReferenceLink(index, e.target.value)}
                      className="block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 border-gray-300 focus:ring-primary-500"
                      placeholder="Enter a reference link"
                    />
                    <button
                      onClick={() => removeReferenceLink(index)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-md"
                      type="button"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
                <button
                  onClick={addReferenceLink}
                  className="text-primary-500 hover:underline text-sm"
                  type="button"
                >
                  + Add another link
                </button>
              </div>

              {/* Intended Use */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intended Use
                </label>
                <input
                  type="text"
                  value={newRequest.intendedUse}
                  onChange={(e) => handleInputChange('intendedUse', e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 border-gray-300 focus:ring-primary-500"
                  placeholder="Describe the intended use of the design"
                />
              </div>

              {/* Target Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Price
                </label>
                <input
                  type="text"
                  value={newRequest.targetPrice}
                  onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 border-gray-300 focus:ring-primary-500"
                  placeholder="Enter your target price"
                />
              </div>

              {/* Budget */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget
                </label>
                <input
                  type="text"
                  value={newRequest.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    formErrors.budget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                  }`}
                  placeholder="Enter your budget"
                />
                {formErrors.budget && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.budget}</p>
                )}
              </div>

              {/* Priority */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newRequest.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 border-gray-300 focus:ring-primary-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Delivery Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={newRequest.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 border-gray-300 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (for request submission) */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm w-full z-50">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <i className="ri-check-line text-green-600"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Request submitted successfully!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your STL request has been sent for review.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerStlRequests;
