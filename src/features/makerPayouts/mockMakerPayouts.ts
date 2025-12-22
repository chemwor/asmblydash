// Mock data for maker payouts feature module

// Balances object
export const balances = {
  availableBalance: 2847.50,
  pendingBalance: 1256.75,
  paidOut30d: 8920.25,
  bonuses30d: 450.00,
  breakdown: {
    available: 2847.50,
    pending: 1256.75,
    onHold: 342.25,
    adjustments: -45.50
  }
};

// Next payout object
export let nextPayout = {
  date: '2024-12-27',
  estimatedAmount: 2847.50,
  method: 'Bank ••••1234',
  status: 'Scheduled'
};

// Job earnings array
export const jobEarnings = [
  { id: 'earn-001', jobId: 'job-001', productName: 'Custom Phone Case - iPhone 15', qty: 2, basePayout: 125.00, bonuses: 15.00, adjustments: 0, status: 'Available', dateCompleted: '2024-12-18' },
  { id: 'earn-002', jobId: 'job-003', productName: 'Automotive Part - Brake Mount', qty: 1, basePayout: 89.50, bonuses: 0, adjustments: -5.00, status: 'Pending', dateCompleted: '2024-12-17' },
  { id: 'earn-003', jobId: 'job-002', productName: 'Miniature Dragon Figure', qty: 3, basePayout: 75.25, bonuses: 10.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-12-16' },
  { id: 'earn-004', jobId: 'job-004', productName: 'Jewelry Display Stand', qty: 1, basePayout: 45.00, bonuses: 5.00, adjustments: 0, status: 'Available', dateCompleted: '2024-12-15' },
  { id: 'earn-005', jobId: 'job-005', productName: 'Custom Keychain Set', qty: 5, basePayout: 120.00, bonuses: 20.00, adjustments: -10.00, status: 'Paid', dateCompleted: '2024-12-14' },
  { id: 'earn-006', jobId: 'job-006', productName: 'Prototype Widget', qty: 1, basePayout: 200.00, bonuses: 25.00, adjustments: 0, status: 'Available', dateCompleted: '2024-12-13' },
  { id: 'earn-007', jobId: 'job-007', productName: 'Medical Device Component', qty: 2, basePayout: 180.00, bonuses: 0, adjustments: -15.00, status: 'Pending', dateCompleted: '2024-12-12' },
  { id: 'earn-008', jobId: 'job-008', productName: 'Architecture Model Part', qty: 4, basePayout: 95.00, bonuses: 12.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-12-11' },
  { id: 'earn-009', jobId: 'job-009', productName: 'Gaming Accessory', qty: 1, basePayout: 65.00, bonuses: 8.00, adjustments: -2.00, status: 'Available', dateCompleted: '2024-12-10' },
  { id: 'earn-010', jobId: 'job-010', productName: 'Industrial Fixture', qty: 2, basePayout: 150.00, bonuses: 0, adjustments: 0, status: 'Paid', dateCompleted: '2024-12-09' },
  { id: 'earn-011', jobId: 'job-011', productName: 'Art Installation Piece', qty: 1, basePayout: 300.00, bonuses: 40.00, adjustments: 0, status: 'Available', dateCompleted: '2024-12-08' },
  { id: 'earn-012', jobId: 'job-012', productName: 'Kitchen Utensil Holder', qty: 3, basePayout: 55.00, bonuses: 5.00, adjustments: 0, status: 'Pending', dateCompleted: '2024-12-07' },
  { id: 'earn-013', jobId: 'job-013', productName: 'Drone Part - Propeller Guard', qty: 4, basePayout: 80.00, bonuses: 10.00, adjustments: -3.00, status: 'Paid', dateCompleted: '2024-12-06' },
  { id: 'earn-014', jobId: 'job-014', productName: 'Educational Model', qty: 1, basePayout: 110.00, bonuses: 15.00, adjustments: 0, status: 'Available', dateCompleted: '2024-12-05' },
  { id: 'earn-015', jobId: 'job-015', productName: 'Custom Tool Handle', qty: 2, basePayout: 70.00, bonuses: 0, adjustments: -5.00, status: 'Paid', dateCompleted: '2024-12-04' },
  { id: 'earn-016', jobId: 'job-016', productName: 'Replacement Part - Vacuum', qty: 1, basePayout: 40.00, bonuses: 5.00, adjustments: 0, status: 'Available', dateCompleted: '2024-12-03' },
  { id: 'earn-017', jobId: 'job-017', productName: 'Collectible Figure Base', qty: 5, basePayout: 85.00, bonuses: 12.00, adjustments: 0, status: 'Pending', dateCompleted: '2024-12-02' },
  { id: 'earn-018', jobId: 'job-018', productName: 'Electronic Enclosure', qty: 1, basePayout: 135.00, bonuses: 0, adjustments: -8.00, status: 'Paid', dateCompleted: '2024-12-01' },
  { id: 'earn-019', jobId: 'job-019', productName: 'Mounting Bracket', qty: 3, basePayout: 60.00, bonuses: 8.00, adjustments: 0, status: 'Available', dateCompleted: '2024-11-30' },
  { id: 'earn-020', jobId: 'job-020', productName: 'Decorative Vase', qty: 1, basePayout: 90.00, bonuses: 10.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-11-29' },
  { id: 'earn-021', jobId: 'job-021', productName: 'Camera Mount Adapter', qty: 2, basePayout: 75.00, bonuses: 0, adjustments: -3.00, status: 'Available', dateCompleted: '2024-11-28' },
  { id: 'earn-022', jobId: 'job-022', productName: 'Board Game Piece', qty: 10, basePayout: 120.00, bonuses: 20.00, adjustments: 0, status: 'Pending', dateCompleted: '2024-11-27' },
  { id: 'earn-023', jobId: 'job-023', productName: 'Furniture Hardware', qty: 4, basePayout: 100.00, bonuses: 15.00, adjustments: -5.00, status: 'Paid', dateCompleted: '2024-11-26' },
  { id: 'earn-024', jobId: 'job-024', productName: 'Toy Component', qty: 6, basePayout: 95.00, bonuses: 12.00, adjustments: 0, status: 'Available', dateCompleted: '2024-11-25' },
  { id: 'earn-025', jobId: 'job-025', productName: 'Laboratory Equipment Part', qty: 1, basePayout: 250.00, bonuses: 30.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-11-24' },
  { id: 'earn-026', jobId: 'job-026', productName: 'Automotive Trim Piece', qty: 2, basePayout: 85.00, bonuses: 0, adjustments: -4.00, status: 'Available', dateCompleted: '2024-11-23' },
  { id: 'earn-027', jobId: 'job-027', productName: 'Custom Figurine', qty: 1, basePayout: 160.00, bonuses: 20.00, adjustments: 0, status: 'Pending', dateCompleted: '2024-11-22' },
  { id: 'earn-028', jobId: 'job-028', productName: 'Mechanical Part - Gear', qty: 3, basePayout: 90.00, bonuses: 10.00, adjustments: -2.00, status: 'Paid', dateCompleted: '2024-11-21' },
  { id: 'earn-029', jobId: 'job-029', productName: 'Architectural Detail', qty: 1, basePayout: 200.00, bonuses: 25.00, adjustments: 0, status: 'Available', dateCompleted: '2024-11-20' },
  { id: 'earn-030', jobId: 'job-030', productName: 'Sports Equipment Part', qty: 2, basePayout: 110.00, bonuses: 15.00, adjustments: -5.00, status: 'Paid', dateCompleted: '2024-11-19' },
  { id: 'earn-031', jobId: 'job-031', productName: 'Electronic Component Housing', qty: 1, basePayout: 140.00, bonuses: 0, adjustments: 0, status: 'Available', dateCompleted: '2024-11-18' },
  { id: 'earn-032', jobId: 'job-032', productName: 'Custom Connector', qty: 5, basePayout: 125.00, bonuses: 18.00, adjustments: 0, status: 'Pending', dateCompleted: '2024-11-17' },
  { id: 'earn-033', jobId: 'job-033', productName: 'Prototype Casing', qty: 1, basePayout: 185.00, bonuses: 22.00, adjustments: -7.00, status: 'Paid', dateCompleted: '2024-11-16' },
  { id: 'earn-034', jobId: 'job-034', productName: 'Replacement Knob', qty: 4, basePayout: 45.00, bonuses: 5.00, adjustments: 0, status: 'Available', dateCompleted: '2024-11-15' },
  { id: 'earn-035', jobId: 'job-035', productName: 'Industrial Tool Part', qty: 2, basePayout: 170.00, bonuses: 0, adjustments: -10.00, status: 'Paid', dateCompleted: '2024-11-14' },
  { id: 'earn-036', jobId: 'job-036', productName: 'Home Decor Item', qty: 1, basePayout: 80.00, bonuses: 10.00, adjustments: 0, status: 'Available', dateCompleted: '2024-11-13' },
  { id: 'earn-037', jobId: 'job-037', productName: 'Custom Bracket Set', qty: 3, basePayout: 95.00, bonuses: 12.00, adjustments: -3.00, status: 'Pending', dateCompleted: '2024-11-12' },
  { id: 'earn-038', jobId: 'job-038', productName: 'Miniature Building Model', qty: 1, basePayout: 220.00, bonuses: 28.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-11-11' },
  { id: 'earn-039', jobId: 'job-039', productName: 'Automotive Sensor Housing', qty: 2, basePayout: 130.00, bonuses: 15.00, adjustments: -5.00, status: 'Available', dateCompleted: '2024-11-10' },
  { id: 'earn-040', jobId: 'job-040', productName: 'Custom Adapter Plate', qty: 1, basePayout: 75.00, bonuses: 8.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-11-09' },
  { id: 'earn-041', jobId: 'job-041', productName: 'Machine Component', qty: 2, basePayout: 155.00, bonuses: 0, adjustments: -8.00, status: 'Available', dateCompleted: '2024-11-08' },
  { id: 'earn-042', jobId: 'job-042', productName: 'Educational Tool', qty: 4, basePayout: 105.00, bonuses: 15.00, adjustments: 0, status: 'Pending', dateCompleted: '2024-11-07' },
  { id: 'earn-043', jobId: 'job-043', productName: 'Precision Part', qty: 1, basePayout: 280.00, bonuses: 35.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-11-06' },
  { id: 'earn-044', jobId: 'job-044', productName: 'Custom Enclosure', qty: 1, basePayout: 165.00, bonuses: 20.00, adjustments: -6.00, status: 'Available', dateCompleted: '2024-11-05' },
  { id: 'earn-045', jobId: 'job-045', productName: 'Replacement Component', qty: 3, basePayout: 85.00, bonuses: 10.00, adjustments: 0, status: 'Paid', dateCompleted: '2024-11-04' }
];

// Transactions array (from SecondaryTransactionsTable component)
export const transactions = [
  {
    id: "ST001",
    date: "Dec 21, 2024",
    type: "Job payout" as const,
    reference: "JOB-2024-4521",
    jobTitle: "Custom Phone Case - iPhone 15",
    jobId: "job-001",
    amount: "+$2,450.00",
    status: "Completed" as const,
    payoutDate: "Dec 23, 2024",
  },
  {
    id: "ST002",
    date: "Dec 20, 2024",
    type: "Bonus" as const,
    reference: "BONUS-Q4-2024",
    jobTitle: "Quality Bonus",
    jobId: "bonus-q4",
    amount: "+$500.00",
    status: "Completed" as const,
    payoutDate: "Dec 22, 2024",
  },
  {
    id: "ST003",
    date: "Dec 19, 2024",
    type: "Payout transfer" as const,
    reference: "PAYOUT-78945",
    jobTitle: "Bank Transfer",
    jobId: "transfer-001",
    amount: "-$1,200.00",
    status: "Processing" as const,
    payoutDate: "Dec 20, 2024",
  },
  {
    id: "ST004",
    date: "Dec 18, 2024",
    type: "Job payout" as const,
    reference: "JOB-2024-4498",
    jobTitle: "Automotive Part - Brake Mount",
    jobId: "job-003",
    amount: "+$3,200.00",
    status: "Completed" as const,
    payoutDate: "Dec 20, 2024",
  },
  {
    id: "ST005",
    date: "Dec 17, 2024",
    type: "Adjustment" as const,
    reference: "ADJ-2024-156",
    jobTitle: "Quality Adjustment",
    jobId: "adj-001",
    amount: "-$75.00",
    status: "Completed" as const,
    payoutDate: "Dec 18, 2024",
  },
  {
    id: "ST006",
    date: "Dec 16, 2024",
    type: "Job payout" as const,
    reference: "JOB-2024-4475",
    jobTitle: "Miniature Dragon Figure",
    jobId: "job-002",
    amount: "+$1,850.00",
    status: "Pending" as const,
    payoutDate: "Dec 18, 2024",
  },
  {
    id: "ST007",
    date: "Dec 15, 2024",
    type: "Payout transfer" as const,
    reference: "PAYOUT-78901",
    jobTitle: "Bank Transfer",
    jobId: "transfer-002",
    amount: "-$2,100.00",
    status: "Failed" as const,
  },
  {
    id: "ST008",
    date: "Dec 14, 2024",
    type: "Bonus" as const,
    reference: "BONUS-HOLIDAY-2024",
    jobTitle: "Holiday Bonus",
    jobId: "bonus-holiday",
    amount: "+$250.00",
    status: "Completed" as const,
    payoutDate: "Dec 16, 2024",
  },
];

// Statements array (from SecondaryTransactionsTable component)
export const statements = [
  {
    id: "STMT001",
    period: "Dec 1–Dec 31, 2024",
    jobsCompleted: 24,
    grossEarnings: "$12,450.00",
    adjustments: "-$125.00",
    net: "$12,325.00",
    status: "Draft" as const,
  },
  {
    id: "STMT002",
    period: "Nov 1–Nov 30, 2024",
    jobsCompleted: 28,
    grossEarnings: "$14,200.00",
    adjustments: "+$50.00",
    net: "$14,250.00",
    status: "Final" as const,
  },
  {
    id: "STMT003",
    period: "Oct 1–Oct 31, 2024",
    jobsCompleted: 31,
    grossEarnings: "$15,800.00",
    adjustments: "-$200.00",
    net: "$15,600.00",
    status: "Final" as const,
  },
  {
    id: "STMT004",
    period: "Sep 1–Sep 30, 2024",
    jobsCompleted: 26,
    grossEarnings: "$13,100.00",
    adjustments: "$0.00",
    net: "$13,100.00",
    status: "Final" as const,
  },
  {
    id: "STMT005",
    period: "Aug 1–Aug 31, 2024",
    jobsCompleted: 29,
    grossEarnings: "$14,750.00",
    adjustments: "-$75.00",
    net: "$14,675.00",
    status: "Final" as const,
  },
  {
    id: "STMT006",
    period: "Jul 1–Jul 31, 2024",
    jobsCompleted: 33,
    grossEarnings: "$16,950.00",
    adjustments: "+$100.00",
    net: "$17,050.00",
    status: "Final" as const,
  },
  {
    id: "STMT007",
    period: "Jun 1–Jun 30, 2024",
    jobsCompleted: 27,
    grossEarnings: "$13,650.00",
    adjustments: "-$150.00",
    net: "$13,500.00",
    status: "Final" as const,
  },
  {
    id: "STMT008",
    period: "May 1–May 31, 2024",
    jobsCompleted: 30,
    grossEarnings: "$15,200.00",
    adjustments: "$0.00",
    net: "$15,200.00",
    status: "Final" as const,
  },
  {
    id: "STMT009",
    period: "Apr 1–Apr 30, 2024",
    jobsCompleted: 25,
    grossEarnings: "$12,800.00",
    adjustments: "+$25.00",
    net: "$12,825.00",
    status: "Final" as const,
  },
  {
    id: "STMT010",
    period: "Mar 1–Mar 31, 2024",
    jobsCompleted: 32,
    grossEarnings: "$16,400.00",
    adjustments: "-$100.00",
    net: "$16,300.00",
    status: "Final" as const,
  },
];

// Detailed transactions data
export const detailedTransactions = [
  { id: 'txn-d001', date: '2024-12-20', type: 'Job payout', reference: 'job-001', amount: 125.00, status: 'Available' },
  { id: 'txn-d002', date: '2024-12-20', type: 'Bonus', reference: 'job-001', amount: 15.00, status: 'Available' },
  { id: 'txn-d003', date: '2024-12-19', type: 'Job payout', reference: 'job-003', amount: 89.50, status: 'Pending' },
  { id: 'txn-d004', date: '2024-12-19', type: 'Adjustment', reference: 'job-003', amount: -5.00, status: 'Pending' },
  { id: 'txn-d005', date: '2024-12-18', type: 'Job payout', reference: 'job-002', amount: 75.25, status: 'Paid' },
  { id: 'txn-d006', date: '2024-12-18', type: 'Bonus', reference: 'job-002', amount: 10.00, status: 'Paid' },
  { id: 'txn-d007', date: '2024-12-17', type: 'Job payout', reference: 'job-004', amount: 45.00, status: 'Available' },
  { id: 'txn-d008', date: '2024-12-17', type: 'Bonus', reference: 'job-004', amount: 5.00, status: 'Available' },
  { id: 'txn-d009', date: '2024-12-16', type: 'Job payout', reference: 'job-005', amount: 120.00, status: 'Paid' },
  { id: 'txn-d010', date: '2024-12-16', type: 'Bonus', reference: 'job-005', amount: 20.00, status: 'Paid' },
  { id: 'txn-d011', date: '2024-12-16', type: 'Adjustment', reference: 'job-005', amount: -10.00, status: 'Paid' },
  { id: 'txn-d012', date: '2024-12-15', type: 'Job payout', reference: 'job-006', amount: 200.00, status: 'Available' },
  { id: 'txn-d013', date: '2024-12-15', type: 'Bonus', reference: 'job-006', amount: 25.00, status: 'Available' },
  { id: 'txn-d014', date: '2024-12-14', type: 'Payout transfer', reference: 'payout-001', amount: -890.25, status: 'Completed' },
  { id: 'txn-d015', date: '2024-12-13', type: 'Job payout', reference: 'job-007', amount: 180.00, status: 'Pending' },
  { id: 'txn-d016', date: '2024-12-13', type: 'Adjustment', reference: 'job-007', amount: -15.00, status: 'Pending' },
  { id: 'txn-d017', date: '2024-12-12', type: 'Job payout', reference: 'job-008', amount: 95.00, status: 'Paid' },
  { id: 'txn-d018', date: '2024-12-12', type: 'Bonus', reference: 'job-008', amount: 12.00, status: 'Paid' },
  { id: 'txn-d019', date: '2024-12-11', type: 'Job payout', reference: 'job-009', amount: 65.00, status: 'Available' },
  { id: 'txn-d020', date: '2024-12-11', type: 'Bonus', reference: 'job-009', amount: 8.00, status: 'Available' },
  { id: 'txn-d021', date: '2024-12-11', type: 'Adjustment', reference: 'job-009', amount: -2.00, status: 'Available' },
  { id: 'txn-d022', date: '2024-12-10', type: 'Job payout', reference: 'job-010', amount: 150.00, status: 'Paid' },
  { id: 'txn-d023', date: '2024-12-09', type: 'Job payout', reference: 'job-011', amount: 300.00, status: 'Available' },
  { id: 'txn-d024', date: '2024-12-09', type: 'Bonus', reference: 'job-011', amount: 40.00, status: 'Available' },
  { id: 'txn-d025', date: '2024-12-08', type: 'Job payout', reference: 'job-012', amount: 55.00, status: 'Pending' },
  { id: 'txn-d026', date: '2024-12-08', type: 'Bonus', reference: 'job-012', amount: 5.00, status: 'Pending' },
  { id: 'txn-d027', date: '2024-12-07', type: 'Payout transfer', reference: 'payout-002', amount: -1250.75, status: 'Completed' },
  { id: 'txn-d028', date: '2024-12-06', type: 'Job payout', reference: 'job-013', amount: 80.00, status: 'Paid' },
  { id: 'txn-d029', date: '2024-12-06', type: 'Bonus', reference: 'job-013', amount: 10.00, status: 'Paid' },
  { id: 'txn-d030', date: '2024-12-06', type: 'Adjustment', reference: 'job-013', amount: -3.00, status: 'Paid' },
];

// Payout method types
interface PayoutMethodPayload {
  type: "Bank Transfer" | "Stripe" | "PayPal";
  accountHolderName: string;
  accountDetails: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Update payout method function
export const updatePayoutMethod = (payload: PayoutMethodPayload): void => {
  // Mask the account details for display
  const maskedDetails = payload.accountDetails.length > 4
    ? "••••" + payload.accountDetails.slice(-4)
    : payload.accountDetails;

  // Update the nextPayout method display
  nextPayout = {
    ...nextPayout,
    method: `${payload.type} ${maskedDetails}`
  };

  console.log('Payout method updated:', payload);
};
