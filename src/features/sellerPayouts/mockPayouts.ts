// Mock data and helper functions for seller payouts
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

interface NextPayoutData {
  date: string;
  estimatedAmount: string;
  method: string;
  methodType: string;
  status: string;
  statusClass: string;
}

interface PayoutMethodPayload {
  payoutType: string;
  accountNumber: string;
}

// Balances object
export const balances = {
  kpis: {
    availableBalance: {
      value: '$12,847.50',
      subtitle: 'Ready for payout',
      change: '+$2,156.30',
      changeType: 'positive',
      period: 'vs last week'
    },
    pendingPayouts: {
      value: '$8,924.75',
      subtitle: 'Processing payouts',
      change: '-$1,248.25',
      changeType: 'negative',
      period: 'vs last week'
    },
    paidOut30d: {
      value: '$47,329.80',
      subtitle: 'Last 30 days',
      change: '+18.5%',
      changeType: 'positive',
      period: 'vs previous 30d'
    },
    avgMargin: {
      value: '24.8%',
      subtitle: 'Last 30 days',
      change: '+2.3%',
      changeType: 'positive',
      period: 'vs previous 30d'
    }
  },
  charts: {
    payouts: {
      data: [
        2847, 3156, 2934, 4125, 3789, 2965, 3445, 4287, 3612, 4089,
        3967, 4234, 3578, 3892, 4156, 3734, 4012, 3623, 3889, 4178,
        3945, 4298, 3667, 4034, 3756, 4167, 4323, 3834, 4256, 4089
      ]
    },
    margins: {
      data: [
        22.5, 24.1, 23.7, 25.8, 26.2, 23.9, 24.6, 25.3, 24.8, 26.1,
        25.7, 26.4, 24.2, 24.9, 25.6, 25.1, 25.8, 24.4, 25.2, 25.9,
        25.4, 26.3, 24.7, 25.4, 24.1, 25.7, 26.2, 25.8, 26.5, 24.8
      ]
    },
  },
  balanceBreakdown: {
    available: '$12,847.50',
    pending: '$3,245.80',
    onHold: '$892.25',
    refundReserve: '$1,156.75'
  }
};

// Next payout object (exported as a function to allow for state management)
export const getInitialNextPayout = (): NextPayoutData => ({
  date: 'Dec 25, 2024',
  estimatedAmount: '$12,847.50',
  method: 'Bank •••• 1234',
  methodType: 'Bank Transfer',
  status: 'Scheduled',
  statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
});

// Transactions array
export const transactions: PayoutData[] = [
  {
    id: 'PO-2024-1234',
    amount: '$4,256.75',
    date: 'Dec 18, 2024',
    status: 'Completed',
    statusClass: 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
    method: 'Bank Transfer',
    reference: 'TXN-4567891234',
    fees: '$12.77'
  },
  {
    id: 'PO-2024-1233',
    amount: '$3,892.40',
    date: 'Dec 11, 2024',
    status: 'Completed',
    statusClass: 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
    method: 'PayPal',
    reference: 'PP-9876543210',
    fees: '$116.77'
  },
  {
    id: 'PO-2024-1232',
    amount: '$2,134.65',
    date: 'Dec 4, 2024',
    status: 'Processing',
    statusClass: 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300',
    method: 'Bank Transfer',
    reference: 'TXN-2345678901',
    fees: '$6.40'
  },
  {
    id: 'PO-2024-1231',
    amount: '$5,678.90',
    date: 'Nov 27, 2024',
    status: 'Completed',
    statusClass: 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
    method: 'Stripe',
    reference: 'ST-1234567890',
    fees: '$170.37'
  },
  {
    id: 'PO-2024-1230',
    amount: '$1,456.25',
    date: 'Nov 20, 2024',
    status: 'Failed',
    statusClass: 'bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300',
    method: 'Bank Transfer',
    reference: 'TXN-9876543210',
    fees: '$4.37'
  }
];

// Generate mock detailed transactions data (35 items)
export const generateDetailedTransactions = (): DetailedTransaction[] => {
  const transactions: DetailedTransaction[] = [];
  const types = ['Order Earnings', 'Platform Fee', 'Maker Cost', 'Refund', 'Adjustment', 'Payout'];
  const typeClasses = {
    'Order Earnings': 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
    'Platform Fee': 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    'Maker Cost': 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    'Refund': 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300',
    'Adjustment': 'bg-info-100 text-info-600 dark:bg-info-900 dark:text-info-300',
    'Payout': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
  };
  const statuses = ['Pending', 'Completed', 'Reversed'];
  const statusClasses = {
    'Pending': 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300',
    'Completed': 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
    'Reversed': 'bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300'
  };

  for (let i = 1; i <= 35; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const type = types[Math.floor(Math.random() * types.length)] as keyof typeof typeClasses;
    const status = statuses[Math.floor(Math.random() * statuses.length)] as keyof typeof statusClasses;
    const gross = Math.random() * 500 + 10;
    const fees = type === 'Platform Fee' ? 0 : gross * (Math.random() * 0.05 + 0.01);
    const net = gross - fees;

    transactions.push({
      id: `TXN-2024-${String(9876 - i).padStart(4, '0')}`,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type,
      typeClass: typeClasses[type],
      reference: type === 'Payout' ? `PO-2024-${String(1234 + i).padStart(4, '0')}` : `ORD-2024-${String(1847 + i).padStart(4, '0')}`,
      description: type === 'Order Earnings' ? `Product sale commission` :
                  type === 'Platform Fee' ? `Monthly platform fee` :
                  type === 'Maker Cost' ? `Manufacturing cost` :
                  type === 'Refund' ? `Customer refund processed` :
                  type === 'Adjustment' ? `Balance adjustment` :
                  `Payout to bank account`,
      gross: Math.round(gross * 100) / 100,
      fees: Math.round(fees * 100) / 100,
      net: Math.round(net * 100) / 100,
      status,
      statusClass: statusClasses[status]
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock statements data (10 statements)
export const generateStatements = (): StatementData[] => {
  const statements: StatementData[] = [];
  const months = [
    'Dec 2024', 'Nov 2024', 'Oct 2024', 'Sep 2024', 'Aug 2024',
    'Jul 2024', 'Jun 2024', 'May 2024', 'Apr 2024', 'Mar 2024'
  ];

  months.forEach((month, index) => {
    const year = month.split(' ')[1];
    const monthName = month.split(' ')[0];
    const monthNum = new Date(`${monthName} 1, ${year}`).getMonth();
    const daysInMonth = new Date(parseInt(year), monthNum + 1, 0).getDate();
    const period = `${monthName} 1–${monthName} ${daysInMonth}`;

    const totalOrders = Math.floor(Math.random() * 200) + 50;
    const grossRevenue = (Math.random() * 15000) + 5000;
    const totalFees = grossRevenue * (Math.random() * 0.05 + 0.02);
    const netEarnings = grossRevenue - totalFees;
    const status = index === 0 ? 'Draft' : 'Final';
    const generatedDate = index === 0 ? 'In progress' : `${monthName} ${daysInMonth + 3}, ${year}`;

    statements.push({
      id: `STMT-${year}-${String(monthNum + 1).padStart(2, '0')}`,
      period,
      totalOrders,
      grossRevenue: Math.round(grossRevenue * 100) / 100,
      totalFees: Math.round(totalFees * 100) / 100,
      netEarnings: Math.round(netEarnings * 100) / 100,
      status: status as 'Draft' | 'Final',
      statusClass: status === 'Draft'
        ? 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300'
        : 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300',
      generatedDate
    });
  });

  return statements;
};

// Statements array
export const statements = generateStatements();

// Update payout method helper
export const updatePayoutMethod = (payload: PayoutMethodPayload): NextPayoutData => {
  const lastFourDigits = payload.accountNumber.slice(-4);
  const methodDisplay = payload.payoutType === 'Bank Transfer'
    ? `Bank •••• ${lastFourDigits}`
    : `Stripe •••• ${lastFourDigits}`;

  return {
    date: 'Dec 25, 2024',
    estimatedAmount: '$12,847.50',
    method: methodDisplay,
    methodType: payload.payoutType,
    status: 'Scheduled',
    statusClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
  };
};
