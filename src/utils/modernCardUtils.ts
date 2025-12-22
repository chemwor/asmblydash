// Modern Card Component Utility
// Use this to quickly modernize all your existing cards

export const modernCardClasses = {
  // Main card container - replaces "trezo-card"
  card: "bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40 transition-all duration-300 ease-out ring-1 ring-gray-950/[0.02] dark:ring-white/[0.02] p-6",

  // Card with elevation effect
  cardElevated: "bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200/60 dark:border-gray-800/60 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-300 ease-out ring-1 ring-gray-950/[0.05] dark:ring-white/[0.05] p-6",

  // Card with gradient background
  cardGradient: "bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/80 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-lg hover:border-gray-300/80 dark:hover:border-gray-600/80 transition-all duration-300 ease-out p-6",

  // Header section
  header: "flex items-center justify-between mb-6",

  // Title styling
  title: "text-lg font-semibold text-gray-900 dark:text-white mb-0",

  // Info/alert boxes
  infoBox: "mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/40 dark:border-blue-800/40",

  // Form elements container
  formElement: "flex items-center gap-3 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors",

  // Modern checkbox
  checkbox: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer",

  // Modern input field
  input: "h-12 rounded-lg text-gray-900 dark:text-white border border-gray-300/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 px-4 block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",

  // Modern select dropdown
  select: "h-12 rounded-lg border border-gray-300/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 px-4 block w-full outline-0 cursor-pointer transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
};

// Quick replacement function
export const modernizeCard = (oldClasses: string): string => {
  return oldClasses
    .replace(/trezo-card\s+bg-white[^"]*rounded-md[^"]*/g, modernCardClasses.card)
    .replace(/trezo-card-header[^"]*/g, modernCardClasses.header)
    .replace(/trezo-card-title[^"]*/g, '')
    .replace(/h5[^"]*!mb-0[^"]*/g, modernCardClasses.title);
};
