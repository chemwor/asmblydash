import React from 'react';

const DesignerDashboard: React.FC = () => {
  return (
    <div className="main-content-area">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Designer Dashboard
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <i className="ri-image-line text-blue-600 dark:text-blue-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">67</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <i className="ri-artboard-line text-green-600 dark:text-green-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <i className="ri-user-star-line text-yellow-600 dark:text-yellow-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">34</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <i className="ri-gallery-line text-purple-600 dark:text-purple-300 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Design Assets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">245</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Welcome to your Designer Dashboard
        </h4>
        <p className="text-gray-600 dark:text-gray-400">
          This is your designer dashboard where you can manage your portfolio, projects, and client work.
          Use the sidebar navigation to access your creative workspace and design management tools.
        </p>
      </div>
    </div>
  );
};

export default DesignerDashboard;
