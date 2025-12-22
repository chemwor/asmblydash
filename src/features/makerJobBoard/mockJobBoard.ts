// Job Board interfaces and mock data
export interface JobBoardJob {
  id: string;
  title: string;
  description: string;
  product: string;
  thumbnail: string;
  qty: number;
  material: string;
  color: string;
  dueDate: string;
  priority: 'Rush' | 'Standard';
  payout: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedHours: number;
  requiredSkills: string[];
  postedDate: string;
  clientRating: number;
  isRecommended?: boolean;
  category: string;
  region: string;
  distance: string;
  requirements: string[];
  files: JobFile[];
  slaExpectations: string[];
  payoutBreakdown: PayoutBreakdown;
  fullRequirements: string;
}

export interface JobFile {
  name: string;
  type: 'STL' | 'PDF' | 'Image' | 'Notes';
  size: string;
  url: string;
}

export interface PayoutBreakdown {
  basePay: number;
  rushBonus?: number;
  qualityBonus?: number;
  total: number;
}

export interface JobBoardFilters {
  category?: string;
  material?: string;
  priority?: string;
  difficulty?: string;
  minPayout?: number;
  maxPayout?: number;
  searchQuery?: string;
  sortBy?: string;
}

export interface JobBoardStats {
  totalAvailable: number;
  avgPayout: number;
  rushJobs: number;
  newToday: number;
}

// Available jobs array - jobs that can be accepted by makers
export const availableJobs: JobBoardJob[] = [
  {
    id: 'JB-001',
    title: 'Precision Phone Case with Custom Engraving',
    description: 'High-quality phone case for iPhone 15 Pro with personalized laser engraving. Requires attention to detail and precision work.',
    product: 'Custom Phone Case - iPhone 15 Pro',
    thumbnail: '/images/products/phone-case.jpg',
    qty: 3,
    material: 'PLA',
    color: 'Midnight Black',
    dueDate: '2025-12-25',
    priority: 'Rush',
    payout: 42.50,
    difficulty: 'Medium',
    estimatedHours: 4,
    requiredSkills: ['Precision Printing', 'Post-Processing', 'Quality Control'],
    postedDate: '2025-12-20',
    clientRating: 4.8,
    isRecommended: true,
    category: 'Electronics',
    region: 'North America',
    distance: '5 miles',
    requirements: ['iPhone 15 Pro', 'Laser Engraving Software'],
    files: [
      { name: 'Phone_Case_Design.stl', type: 'STL', size: '2MB', url: '/files/phone_case_design.stl' },
      { name: 'Engraving_Pattern.pdf', type: 'PDF', size: '500KB', url: '/files/engraving_pattern.pdf' }
    ],
    slaExpectations: ['24-hour turnaround', 'Quality check required'],
    payoutBreakdown: {
      basePay: 35.00,
      rushBonus: 7.50,
      qualityBonus: 5.00,
      total: 42.50
    },
    fullRequirements: 'Maker must have experience with precision printing and laser engraving. iPhone 15 Pro model required for case fitting.'
  },
  {
    id: 'JB-002',
    title: 'Architectural Scale Model - Modern Building',
    description: 'Detailed architectural model with intricate features. Perfect for experienced makers with attention to detail.',
    product: 'Architectural Scale Model',
    thumbnail: '/images/products/building.jpg',
    qty: 1,
    material: 'Resin',
    color: 'White',
    dueDate: '2025-12-28',
    priority: 'Standard',
    payout: 125.00,
    difficulty: 'Hard',
    estimatedHours: 12,
    requiredSkills: ['Resin Printing', 'Fine Detail Work', 'Assembly'],
    postedDate: '2025-12-19',
    clientRating: 4.9,
    isRecommended: true,
    category: 'Architecture',
    region: 'Europe',
    distance: '10 miles',
    requirements: ['Access to high-resolution architectural plans', 'Resin printing capabilities'],
    files: [
      { name: 'Building_Model_Design.stl', type: 'STL', size: '5MB', url: '/files/building_model_design.stl' },
      { name: 'Assembly_Instructions.pdf', type: 'PDF', size: '1MB', url: '/files/assembly_instructions.pdf' }
    ],
    slaExpectations: ['48-hour turnaround', 'Detailed quality inspection'],
    payoutBreakdown: {
      basePay: 100.00,
      qualityBonus: 25.00,
      total: 125.00
    },
    fullRequirements: 'Maker must provide own resin and have experience with fine detail resin printing. Assembly required.'
  },
  {
    id: 'JB-003',
    title: 'Gaming Miniatures Set',
    description: 'Collection of detailed gaming miniatures for tabletop RPG. Great for makers who enjoy character work.',
    product: 'Fantasy Character Set (5 pieces)',
    thumbnail: '/images/products/miniatures.jpg',
    qty: 5,
    material: 'Resin',
    color: 'Gray (Primer)',
    dueDate: '2025-12-30',
    priority: 'Standard',
    payout: 89.75,
    difficulty: 'Medium',
    estimatedHours: 8,
    requiredSkills: ['Miniature Printing', 'Support Removal', 'Detail Work'],
    postedDate: '2025-12-18',
    clientRating: 4.7,
    category: 'Gaming',
    region: 'Asia',
    distance: '15 miles',
    requirements: ['Detail painting supplies', 'Experience with miniature models'],
    files: [
      { name: 'Miniature_Models_Design.stl', type: 'STL', size: '3MB', url: '/files/miniature_models_design.stl' },
      { name: 'Painting_Guide.pdf', type: 'PDF', size: '600KB', url: '/files/painting_guide.pdf' }
    ],
    slaExpectations: ['72-hour turnaround', 'Miniature detailing standards'],
    payoutBreakdown: {
      basePay: 80.00,
      qualityBonus: 9.75,
      total: 89.75
    },
    fullRequirements: 'Maker must have experience with miniature painting and detailing. Support removal required.'
  },
  {
    id: 'JB-004',
    title: 'Replacement Drone Components',
    description: 'Quick turnaround job for drone propellers and landing gear. Simple but urgent.',
    product: 'Drone Propeller & Landing Gear Set',
    thumbnail: '/images/products/drone-parts.jpg',
    qty: 8,
    material: 'PETG',
    color: 'Black',
    dueDate: '2025-12-22',
    priority: 'Rush',
    payout: 35.25,
    difficulty: 'Easy',
    estimatedHours: 3,
    requiredSkills: ['PETG Printing', 'Basic Assembly'],
    postedDate: '2025-12-20',
    clientRating: 4.6,
    category: 'Electronics',
    region: 'North America',
    distance: '8 miles',
    requirements: ['Drone model specifications', 'PETG filament'],
    files: [
      {
        name: 'Drone_Parts_Design.stl',
        type: 'STL',
        size: '1MB',
        url: '/files/drone_parts_design.stl'
      },
      {
        name: 'Assembly_Notes.txt',
        type: 'Notes',
        size: '200KB',
        url: '/files/assembly_notes.txt'
      }
    ],
    slaExpectations: ['24-hour turnaround', 'Functional testing of parts'],
    payoutBreakdown: {
      basePay: 30.00,
      rushBonus: 5.25,
      total: 35.25
    },
    fullRequirements: 'Maker must have a drone for testing fit and function of parts. Basic assembly required.'
  },
  {
    id: 'JB-005',
    title: 'Kitchen Gadget Prototypes',
    description: 'Multiple prototype iterations for a new kitchen gadget. Food-safe material required.',
    product: 'Kitchen Gadget Prototype Set',
    thumbnail: '/images/products/kitchen-gadget.jpg',
    qty: 4,
    material: 'Food-Safe PLA',
    color: 'Natural',
    dueDate: '2025-12-27',
    priority: 'Standard',
    payout: 67.50,
    difficulty: 'Medium',
    estimatedHours: 6,
    requiredSkills: ['Food-Safe Materials', 'Prototype Work', 'Testing'],
    postedDate: '2025-12-17',
    clientRating: 4.5,
    category: 'Prototypes',
    region: 'Europe',
    distance: '12 miles',
    requirements: ['Food-safe certification', 'Access to kitchen for testing'],
    files: [
      {
        name: 'Gadget_Prototype_Design.stl',
        type: 'STL',
        size: '2MB',
        url: '/files/gadget_prototype_design.stl'
      },
      {
        name: 'Testing_Protocol.pdf',
        type: 'PDF',
        size: '300KB',
        url: '/files/testing_protocol.pdf'
      }
    ],
    slaExpectations: ['48-hour turnaround', 'Food safety compliance'],
    payoutBreakdown: {
      basePay: 60.00,
      qualityBonus: 7.50,
      total: 67.50
    },
    fullRequirements: 'Maker must use food-safe materials and have access to a kitchen for testing prototypes.'
  },
  {
    id: 'JB-006',
    title: 'Jewelry Display Stands',
    description: 'Elegant jewelry display stands for a boutique. Requires smooth finish and professional appearance.',
    product: 'Jewelry Display Stand Set',
    thumbnail: '/images/products/jewelry-stands.jpg',
    qty: 12,
    material: 'PLA+',
    color: 'Pearl White',
    dueDate: '2025-12-26',
    priority: 'Standard',
    payout: 95.00,
    difficulty: 'Easy',
    estimatedHours: 5,
    requiredSkills: ['Surface Finishing', 'Batch Production'],
    postedDate: '2025-12-16',
    clientRating: 4.8,
    isRecommended: true,
    category: 'Retail',
    region: 'North America',
    distance: '10 miles',
    requirements: ['Jewelry design files', 'PLA+ material'],
    files: [
      {
        name: 'Display_Stand_Design.stl',
        type: 'STL',
        size: '1.5MB',
        url: '/files/display_stand_design.stl'
      },
      {
        name: 'Finishing_Techniques.pdf',
        type: 'PDF',
        size: '400KB',
        url: '/files/finishing_techniques.pdf'
      }
    ],
    slaExpectations: ['24-hour turnaround', 'Surface finish quality check'],
    payoutBreakdown: {
      basePay: 85.00,
      qualityBonus: 10.00,
      total: 95.00
    },
    fullRequirements: 'Maker must ensure a smooth and professional finish on all display stands. Batch production experience preferred.'
  },
  {
    id: 'JB-007',
    title: 'Educational Math Manipulatives',
    description: 'Colorful math learning tools for elementary students. Multiple colors and precise dimensions required.',
    product: 'Math Manipulatives Set',
    thumbnail: '/images/products/math-tools.jpg',
    qty: 24,
    material: 'PLA',
    color: 'Multi-Color',
    dueDate: '2025-12-29',
    priority: 'Standard',
    payout: 78.00,
    difficulty: 'Easy',
    estimatedHours: 6,
    requiredSkills: ['Multi-Color Printing', 'Educational Materials'],
    postedDate: '2025-12-15',
    clientRating: 4.9,
    category: 'Education',
    region: 'Asia',
    distance: '20 miles',
    requirements: ['Access to educational standards', 'Multi-color printing capabilities'],
    files: [
      {
        name: 'Math_Tools_Design.stl',
        type: 'STL',
        size: '2.5MB',
        url: '/files/math_tools_design.stl'
      },
      {
        name: 'Usage_Guide.pdf',
        type: 'PDF',
        size: '350KB',
        url: '/files/usage_guide.pdf'
      }
    ],
    slaExpectations: ['72-hour turnaround', 'Compliance with educational standards'],
    payoutBreakdown: {
      basePay: 70.00,
      qualityBonus: 8.00,
      total: 78.00
    },
    fullRequirements: 'Maker must ensure all manipulatives are safe and suitable for elementary students. Multi-color printing required.'
  },
  {
    id: 'JB-008',
    title: 'Automotive Interior Trim Piece',
    description: 'Custom replacement trim for vintage car restoration. Requires automotive-grade materials.',
    product: 'Car Interior Trim Replacement',
    thumbnail: '/images/products/car-trim.jpg',
    qty: 2,
    material: 'ABS',
    color: 'Charcoal Gray',
    dueDate: '2025-12-31',
    priority: 'Standard',
    payout: 156.00,
    difficulty: 'Hard',
    estimatedHours: 10,
    requiredSkills: ['ABS Printing', 'Automotive Standards', 'Precision Fitting'],
    postedDate: '2025-12-14',
    clientRating: 4.7,
    category: 'Automotive',
    region: 'North America',
    distance: '25 miles',
    requirements: ['Automotive design software', 'ABS material'],
    files: [
      {
        name: 'Trim_Piece_Design.stl',
        type: 'STL',
        size: '4MB',
        url: '/files/trim_piece_design.stl'
      },
      {
        name: 'Fitting_Instructions.pdf',
        type: 'PDF',
        size: '800KB',
        url: '/files/fitting_instructions.pdf'
      }
    ],
    slaExpectations: ['48-hour turnaround', 'Fitment testing required'],
    payoutBreakdown: {
      basePay: 140.00,
      qualityBonus: 16.00,
      total: 156.00
    },
    fullRequirements: 'Maker must have experience with automotive parts and ensure precise fitting. ABS material required.'
  },
  // Additional jobs to reach 30+ total
  {
    id: 'JB-009',
    title: 'Medical Device Housing',
    description: 'Biocompatible housing for medical monitoring device.',
    product: 'Medical Device Case',
    thumbnail: '/images/products/medical-device.jpg',
    qty: 6,
    material: 'Medical Grade PLA',
    color: 'White',
    dueDate: '2025-12-24',
    priority: 'Rush',
    payout: 185.00,
    difficulty: 'Hard',
    estimatedHours: 8,
    requiredSkills: ['Medical Grade Materials', 'Sterile Processing'],
    postedDate: '2025-12-19',
    clientRating: 4.9,
    category: 'Medical',
    region: 'North America',
    distance: '12 miles',
    requirements: ['Medical Grade', 'Sterile Processing', 'FDA Compliance'],
    files: [
      { name: 'Device_Housing.stl', type: 'STL', size: '3MB', url: '/files/device_housing.stl' },
      { name: 'Medical_Standards.pdf', type: 'PDF', size: '1MB', url: '/files/medical_standards.pdf' }
    ],
    slaExpectations: ['24-hour turnaround', 'Medical grade compliance', 'Sterile packaging'],
    payoutBreakdown: { basePay: 150.00, rushBonus: 25.00, qualityBonus: 10.00, total: 185.00 },
    fullRequirements: 'Must use medical grade materials and follow sterile processing protocols.'
  },
  {
    id: 'JB-010',
    title: 'Robotics Chassis Components',
    description: 'Structural components for educational robotics kit.',
    product: 'Robot Chassis Parts',
    thumbnail: '/images/products/robot-parts.jpg',
    qty: 15,
    material: 'PETG',
    color: 'Blue',
    dueDate: '2025-12-30',
    priority: 'Standard',
    payout: 112.50,
    difficulty: 'Medium',
    estimatedHours: 7,
    requiredSkills: ['PETG Printing', 'Assembly Testing'],
    postedDate: '2025-12-18',
    clientRating: 4.6,
    category: 'Robotics',
    region: 'Asia',
    distance: '18 miles',
    requirements: ['PETG', 'Assembly Testing', 'Electronics Knowledge'],
    files: [
      { name: 'Chassis_Design.stl', type: 'STL', size: '4MB', url: '/files/chassis_design.stl' },
      { name: 'Assembly_Guide.pdf', type: 'PDF', size: '2MB', url: '/files/assembly_guide.pdf' }
    ],
    slaExpectations: ['48-hour turnaround', 'Functional testing required'],
    payoutBreakdown: { basePay: 100.00, qualityBonus: 12.50, total: 112.50 },
    fullRequirements: 'Experience with robotics assembly and electronics integration preferred.'
  },
  {
    id: 'JB-011',
    title: 'Art Gallery Display Mounts',
    description: 'Custom mounting hardware for art exhibition.',
    product: 'Gallery Display Mounts',
    thumbnail: '/images/products/art-mounts.jpg',
    qty: 20,
    material: 'PLA+',
    color: 'Museum White',
    dueDate: '2025-12-27',
    priority: 'Standard',
    payout: 95.00,
    difficulty: 'Easy',
    estimatedHours: 5,
    requiredSkills: ['Precision Mounting', 'Museum Quality'],
    postedDate: '2025-12-17',
    clientRating: 4.8,
    category: 'Art',
    region: 'Europe',
    distance: '8 miles',
    requirements: ['Museum Quality', 'Precision Mounting', 'White Finish'],
    files: [
      { name: 'Display_Mounts.stl', type: 'STL', size: '2MB', url: '/files/display_mounts.stl' },
      { name: 'Installation_Notes.pdf', type: 'PDF', size: '500KB', url: '/files/installation_notes.pdf' }
    ],
    slaExpectations: ['36-hour turnaround', 'Museum quality standards'],
    payoutBreakdown: { basePay: 85.00, qualityBonus: 10.00, total: 95.00 },
    fullRequirements: 'Must meet museum quality standards with pristine white finish.'
  },
  {
    id: 'JB-012',
    title: 'Aerospace Test Fixtures',
    description: 'Testing fixtures for aerospace component validation.',
    product: 'Test Fixture Set',
    thumbnail: '/images/products/aerospace-fixture.jpg',
    qty: 4,
    material: 'Carbon Fiber Nylon',
    color: 'Black',
    dueDate: '2025-12-26',
    priority: 'Rush',
    payout: 275.00,
    difficulty: 'Hard',
    estimatedHours: 12,
    requiredSkills: ['Carbon Fiber', 'Aerospace Standards', 'Precision'],
    postedDate: '2025-12-20',
    clientRating: 4.9,
    category: 'Aerospace',
    region: 'North America',
    distance: '22 miles',
    requirements: ['Carbon Fiber Nylon', 'Aerospace Standards', 'High Precision'],
    files: [
      { name: 'Test_Fixtures.stl', type: 'STL', size: '6MB', url: '/files/test_fixtures.stl' },
      { name: 'Aerospace_Specs.pdf', type: 'PDF', size: '3MB', url: '/files/aerospace_specs.pdf' }
    ],
    slaExpectations: ['24-hour turnaround', 'Aerospace grade quality', 'Dimensional accuracy ±0.05mm'],
    payoutBreakdown: { basePay: 225.00, rushBonus: 35.00, qualityBonus: 15.00, total: 275.00 },
    fullRequirements: 'Must meet aerospace standards with high precision requirements.'
  },
  {
    id: 'JB-013',
    title: 'Custom Cookie Cutters',
    description: 'Food-safe cookie cutters for bakery chain.',
    product: 'Cookie Cutter Set',
    thumbnail: '/images/products/cookie-cutters.jpg',
    qty: 50,
    material: 'Food-Safe PETG',
    color: 'Clear',
    dueDate: '2025-12-28',
    priority: 'Standard',
    payout: 87.50,
    difficulty: 'Easy',
    estimatedHours: 6,
    requiredSkills: ['Food-Safe Materials', 'Batch Production'],
    postedDate: '2025-12-16',
    clientRating: 4.7,
    category: 'Food Service',
    region: 'North America',
    distance: '14 miles',
    requirements: ['Food-Safe PETG', 'Batch Production', 'Quality Control'],
    files: [
      { name: 'Cookie_Shapes.stl', type: 'STL', size: '1.5MB', url: '/files/cookie_shapes.stl' },
      { name: 'Food_Safety_Guide.pdf', type: 'PDF', size: '400KB', url: '/files/food_safety_guide.pdf' }
    ],
    slaExpectations: ['48-hour turnaround', 'Food safety compliance'],
    payoutBreakdown: { basePay: 75.00, qualityBonus: 12.50, total: 87.50 },
    fullRequirements: 'Must use food-safe materials and follow food safety protocols.'
  },
  {
    id: 'JB-014',
    title: 'Theater Prop Replicas',
    description: 'Period-accurate prop replicas for theater production.',
    product: 'Theater Props',
    thumbnail: '/images/products/theater-props.jpg',
    qty: 8,
    material: 'PLA',
    color: 'Antique Bronze',
    dueDate: '2025-12-29',
    priority: 'Standard',
    payout: 145.00,
    difficulty: 'Medium',
    estimatedHours: 9,
    requiredSkills: ['Historical Accuracy', 'Painting', 'Finishing'],
    postedDate: '2025-12-15',
    clientRating: 4.8,
    category: 'Entertainment',
    region: 'Europe',
    distance: '16 miles',
    requirements: ['Historical Research', 'Painting Skills', 'Antique Finishing'],
    files: [
      { name: 'Prop_Designs.stl', type: 'STL', size: '5MB', url: '/files/prop_designs.stl' },
      { name: 'Historical_Reference.pdf', type: 'PDF', size: '2MB', url: '/files/historical_reference.pdf' }
    ],
    slaExpectations: ['72-hour turnaround', 'Historical accuracy verification'],
    payoutBreakdown: { basePay: 125.00, qualityBonus: 20.00, total: 145.00 },
    fullRequirements: 'Must research historical accuracy and apply appropriate finishing techniques.'
  },
  {
    id: 'JB-015',
    title: 'Laboratory Equipment Adapters',
    description: 'Custom adapters for scientific laboratory equipment.',
    product: 'Lab Equipment Adapters',
    thumbnail: '/images/products/lab-adapters.jpg',
    qty: 12,
    material: 'Chemical Resistant PETG',
    color: 'Clear',
    dueDate: '2025-12-25',
    priority: 'Rush',
    payout: 165.00,
    difficulty: 'Medium',
    estimatedHours: 6,
    requiredSkills: ['Chemical Resistance', 'Precision Fitting'],
    postedDate: '2025-12-19',
    clientRating: 4.9,
    category: 'Scientific',
    region: 'North America',
    distance: '11 miles',
    requirements: ['Chemical Resistant PETG', 'Precision Fitting', 'Lab Standards'],
    files: [
      { name: 'Lab_Adapters.stl', type: 'STL', size: '2.5MB', url: '/files/lab_adapters.stl' },
      { name: 'Chemical_Compatibility.pdf', type: 'PDF', size: '800KB', url: '/files/chemical_compatibility.pdf' }
    ],
    slaExpectations: ['24-hour turnaround', 'Chemical compatibility testing'],
    payoutBreakdown: { basePay: 140.00, rushBonus: 15.00, qualityBonus: 10.00, total: 165.00 },
    fullRequirements: 'Must use chemical resistant materials and ensure precise fitting.'
  },
  {
    id: 'JB-016',
    title: 'Sports Equipment Prototypes',
    description: 'Prototype components for new sports equipment design.',
    product: 'Sports Gear Prototypes',
    thumbnail: '/images/products/sports-gear.jpg',
    qty: 6,
    material: 'TPU',
    color: 'Neon Green',
    dueDate: '2025-12-31',
    priority: 'Standard',
    payout: 125.00,
    difficulty: 'Hard',
    estimatedHours: 8,
    requiredSkills: ['TPU Printing', 'Flexible Materials', 'Sports Testing'],
    postedDate: '2025-12-14',
    clientRating: 4.6,
    category: 'Sports',
    region: 'Asia',
    distance: '24 miles',
    requirements: ['TPU Experience', 'Flexible Materials', 'Sports Equipment Knowledge'],
    files: [
      { name: 'Sports_Prototypes.stl', type: 'STL', size: '3.5MB', url: '/files/sports_prototypes.stl' },
      { name: 'Testing_Protocol.pdf', type: 'PDF', size: '1.2MB', url: '/files/testing_protocol.pdf' }
    ],
    slaExpectations: ['48-hour turnaround', 'Flexibility testing required'],
    payoutBreakdown: { basePay: 110.00, qualityBonus: 15.00, total: 125.00 },
    fullRequirements: 'Experience with TPU printing and flexible materials required.'
  },
  {
    id: 'JB-017',
    title: 'Industrial Safety Guards',
    description: 'Safety guards for industrial machinery.',
    product: 'Machine Safety Guards',
    thumbnail: '/images/products/safety-guards.jpg',
    qty: 10,
    material: 'PC (Polycarbonate)',
    color: 'Safety Yellow',
    dueDate: '2025-12-26',
    priority: 'Rush',
    payout: 195.00,
    difficulty: 'Hard',
    estimatedHours: 10,
    requiredSkills: ['PC Printing', 'Safety Standards', 'Industrial Design'],
    postedDate: '2025-12-18',
    clientRating: 4.8,
    category: 'Industrial',
    region: 'North America',
    distance: '19 miles',
    requirements: ['PC Material', 'Safety Standards', 'Impact Testing'],
    files: [
      { name: 'Safety_Guards.stl', type: 'STL', size: '4.5MB', url: '/files/safety_guards.stl' },
      { name: 'Safety_Specifications.pdf', type: 'PDF', size: '1.5MB', url: '/files/safety_specifications.pdf' }
    ],
    slaExpectations: ['24-hour turnaround', 'Safety compliance testing'],
    payoutBreakdown: { basePay: 165.00, rushBonus: 20.00, qualityBonus: 10.00, total: 195.00 },
    fullRequirements: 'Must meet industrial safety standards and pass impact testing.'
  },
  {
    id: 'JB-018',
    title: 'Vintage Radio Restoration Parts',
    description: 'Replacement parts for vintage radio restoration.',
    product: 'Radio Restoration Parts',
    thumbnail: '/images/products/vintage-radio.jpg',
    qty: 5,
    material: 'ABS',
    color: 'Vintage Cream',
    dueDate: '2025-12-30',
    priority: 'Standard',
    payout: 78.00,
    difficulty: 'Medium',
    estimatedHours: 5,
    requiredSkills: ['Vintage Restoration', 'Color Matching', 'Electronics'],
    postedDate: '2025-12-17',
    clientRating: 4.7,
    category: 'Restoration',
    region: 'Europe',
    distance: '13 miles',
    requirements: ['Color Matching', 'Vintage Knowledge', 'Electronics Background'],
    files: [
      { name: 'Radio_Parts.stl', type: 'STL', size: '2MB', url: '/files/radio_parts.stl' },
      { name: 'Restoration_Guide.pdf', type: 'PDF', size: '1MB', url: '/files/restoration_guide.pdf' }
    ],
    slaExpectations: ['48-hour turnaround', 'Color matching verification'],
    payoutBreakdown: { basePay: 68.00, qualityBonus: 10.00, total: 78.00 },
    fullRequirements: 'Knowledge of vintage electronics and color matching required.'
  },
  {
    id: 'JB-019',
    title: 'Marine Hardware Components',
    description: 'Corrosion-resistant marine hardware for boat repair.',
    product: 'Marine Hardware Set',
    thumbnail: '/images/products/marine-hardware.jpg',
    qty: 8,
    material: 'ASA',
    color: 'Marine White',
    dueDate: '2025-12-27',
    priority: 'Standard',
    payout: 135.00,
    difficulty: 'Medium',
    estimatedHours: 7,
    requiredSkills: ['Marine Grade Materials', 'Corrosion Resistance'],
    postedDate: '2025-12-16',
    clientRating: 4.8,
    category: 'Marine',
    region: 'North America',
    distance: '26 miles',
    requirements: ['ASA Material', 'Marine Environment', 'UV Resistance'],
    files: [
      { name: 'Marine_Hardware.stl', type: 'STL', size: '3MB', url: '/files/marine_hardware.stl' },
      { name: 'Marine_Standards.pdf', type: 'PDF', size: '900KB', url: '/files/marine_standards.pdf' }
    ],
    slaExpectations: ['36-hour turnaround', 'UV and corrosion resistance testing'],
    payoutBreakdown: { basePay: 120.00, qualityBonus: 15.00, total: 135.00 },
    fullRequirements: 'Must use marine-grade materials with UV and corrosion resistance.'
  },
  {
    id: 'JB-020',
    title: 'Electronic Device Enclosures',
    description: 'Custom enclosures for IoT devices.',
    product: 'IoT Device Enclosures',
    thumbnail: '/images/products/iot-enclosures.jpg',
    qty: 25,
    material: 'ABS',
    color: 'Tech Gray',
    dueDate: '2025-12-28',
    priority: 'Standard',
    payout: 198.50,
    difficulty: 'Medium',
    estimatedHours: 9,
    requiredSkills: ['Electronics Enclosures', 'Batch Production', 'Heat Dissipation'],
    postedDate: '2025-12-15',
    clientRating: 4.6,
    category: 'Electronics',
    region: 'Asia',
    distance: '17 miles',
    requirements: ['ABS Material', 'Heat Dissipation', 'Electronics Knowledge'],
    files: [
      { name: 'IoT_Enclosures.stl', type: 'STL', size: '4MB', url: '/files/iot_enclosures.stl' },
      { name: 'Electronics_Specs.pdf', type: 'PDF', size: '1.3MB', url: '/files/electronics_specs.pdf' }
    ],
    slaExpectations: ['48-hour turnaround', 'Heat dissipation testing'],
    payoutBreakdown: { basePay: 175.00, qualityBonus: 23.50, total: 198.50 },
    fullRequirements: 'Understanding of electronics and heat dissipation requirements.'
  }
];

/**
 * Get filtered and sorted jobs from available jobs
 */
export const getJobs = (filters?: JobBoardFilters): JobBoardJob[] => {
  let filtered = [...availableJobs];

  if (!filters) {
    return filtered;
  }

  // Apply filters
  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(job => job.category === filters.category);
  }

  if (filters.material && filters.material !== 'All') {
    filtered = filtered.filter(job => job.material === filters.material);
  }

  if (filters.priority && filters.priority !== 'All') {
    filtered = filtered.filter(job => job.priority === filters.priority);
  }

  if (filters.difficulty && filters.difficulty !== 'All') {
    filtered = filtered.filter(job => job.difficulty === filters.difficulty);
  }

  if (filters.minPayout) {
    filtered = filtered.filter(job => job.payout >= filters.minPayout);
  }

  if (filters.maxPayout) {
    filtered = filtered.filter(job => job.payout <= filters.maxPayout);
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(job =>
      job.id.toLowerCase().includes(query) ||
      job.product.toLowerCase().includes(query) ||
      job.title.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'payout-highest':
        filtered.sort((a, b) => b.payout - a.payout);
        break;
      case 'payout-lowest':
        filtered.sort((a, b) => a.payout - b.payout);
        break;
      case 'due-date-soonest':
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'due-date-latest':
        filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        break;
      case 'posted-newest':
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'posted-oldest':
        filtered.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
        break;
      case 'recommended':
      default:
        // Sort by recommendation score (isRecommended first, then by payout)
        filtered.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return b.payout - a.payout;
        });
        break;
    }
  }

  return filtered;
};

/**
 * Accept a job and remove it from available jobs
 * Returns the job payload if successful, null if job not found
 */
export const acceptJob = (jobId: string): JobBoardJob | null => {
  const jobIndex = availableJobs.findIndex(job => job.id === jobId);

  if (jobIndex === -1) {
    console.error(`Job with ID ${jobId} not found in available jobs`);
    return null;
  }

  // Remove the job from available jobs and return it
  const [acceptedJob] = availableJobs.splice(jobIndex, 1);

  console.log(`Job ${jobId} accepted and removed from job board`);
  return acceptedJob;
};

/**
 * Compute statistics for available jobs
 */
export const computeStats = (jobs: JobBoardJob[] = availableJobs): JobBoardStats => {
  const totalAvailable = jobs.length;

  const avgPayout = totalAvailable > 0
    ? jobs.reduce((sum, job) => sum + job.payout, 0) / totalAvailable
    : 0;

  const rushJobs = jobs.filter(job => job.priority === 'Rush').length;

  // Jobs posted today (assuming current date is 2025-12-20)
  const today = '2025-12-20';
  const newToday = jobs.filter(job => job.postedDate === today).length;

  return {
    totalAvailable,
    avgPayout: Math.round(avgPayout * 100) / 100, // Round to 2 decimal places
    rushJobs,
    newToday
  };
};

// Legacy function names for backward compatibility with existing MakerJobBoard.tsx
export const getJobBoardJobs = getJobs;
export const markJobAsAccepted = acceptJob;

/**
 * Get KPI data for the job board dashboard
 */
export const getJobBoardKPIs = () => {
  const stats = computeStats();
  const highestPayout = availableJobs.length > 0
    ? Math.max(...availableJobs.map(job => job.payout))
    : 0;

  return {
    recommendedJobs: availableJobs.filter(job => job.isRecommended).length,
    newToday: stats.newToday,
    highestPayout,
    rushJobs: stats.rushJobs
  };
};

/**
 * Get filter options for the job board
 */
export const getJobBoardFilterOptions = () => {
  const categories = Array.from(new Set(availableJobs.map(job => job.category)));
  const materials = Array.from(new Set(availableJobs.map(job => job.material)));
  const difficulties = Array.from(new Set(availableJobs.map(job => job.difficulty)));

  return {
    categories,
    materials,
    difficulties
  };
};
