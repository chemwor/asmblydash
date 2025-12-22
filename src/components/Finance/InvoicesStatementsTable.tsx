import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Statement Data Interface
interface Statement {
  id: string;
  period: string;
  totalOrders: number;
  grossRevenue: string;
  totalFees: string;
  netEarnings: string;
  status: "Draft" | "Final";
}

// Mock Statement Data
const statements: Statement[] = [
  {
    id: "STMT-2024-12",
    period: "Dec 1–Dec 31",
    totalOrders: 145,
    grossRevenue: "$28,750",
    totalFees: "$1,437",
    netEarnings: "$27,313",
    status: "Draft",
  },
  {
    id: "STMT-2024-11",
    period: "Nov 1–Nov 30",
    totalOrders: 132,
    grossRevenue: "$25,640",
    totalFees: "$1,282",
    netEarnings: "$24,358",
    status: "Final",
  },
  {
    id: "STMT-2024-10",
    period: "Oct 1–Oct 31",
    totalOrders: 156,
    grossRevenue: "$32,180",
    totalFees: "$1,609",
    netEarnings: "$30,571",
    status: "Final",
  },
  {
    id: "STMT-2024-09",
    period: "Sep 1–Sep 30",
    totalOrders: 128,
    grossRevenue: "$24,960",
    totalFees: "$1,248",
    netEarnings: "$23,712",
    status: "Final",
  },
  {
    id: "STMT-2024-08",
    period: "Aug 1–Aug 31",
    totalOrders: 141,
    grossRevenue: "$27,395",
    totalFees: "$1,370",
    netEarnings: "$26,025",
    status: "Final",
  },
  {
    id: "STMT-2024-07",
    period: "Jul 1–Jul 31",
    totalOrders: 168,
    grossRevenue: "$34,720",
    totalFees: "$1,736",
    netEarnings: "$32,984",
    status: "Final",
  },
  {
    id: "STMT-2024-06",
    period: "Jun 1–Jun 30",
    totalOrders: 139,
    grossRevenue: "$26,825",
    totalFees: "$1,341",
    netEarnings: "$25,484",
    status: "Final",
  },
  {
    id: "STMT-2024-05",
    period: "May 1–May 31",
    totalOrders: 152,
    grossRevenue: "$29,640",
    totalFees: "$1,482",
    netEarnings: "$28,158",
    status: "Final",
  },
  {
    id: "STMT-2024-04",
    period: "Apr 1–Apr 30",
    totalOrders: 134,
    grossRevenue: "$26,130",
    totalFees: "$1,307",
    netEarnings: "$24,823",
    status: "Final",
  },
  {
    id: "STMT-2024-03",
    period: "Mar 1–Mar 31",
    totalOrders: 147,
    grossRevenue: "$28,665",
    totalFees: "$1,433",
    netEarnings: "$27,232",
    status: "Final",
  },
  {
    id: "STMT-2024-02",
    period: "Feb 1–Feb 29",
    totalOrders: 125,
    grossRevenue: "$24,375",
    totalFees: "$1,219",
    netEarnings: "$23,156",
    status: "Final",
  },
  {
    id: "STMT-2024-01",
    period: "Jan 1–Jan 31",
    totalOrders: 143,
    grossRevenue: "$27,885",
    totalFees: "$1,394",
    netEarnings: "$26,491",
    status: "Final",
  },
];

const InvoicesStatementsTable: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Year");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Number of statements per page

  // Filter statements based on the search query
  const filteredStatements = statements.filter(
    (statement) =>
      statement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination based on filtered statements
  const totalPages = Math.ceil(filteredStatements.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStatements = filteredStatements.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Placeholder functions for actions
  const handleView = (statementId: string) => {
    // Placeholder - would show toast notification
    console.log(`View statement: ${statementId}`);
    alert(`View statement: ${statementId}`);
  };

  const handleDownloadPDF = (statementId: string) => {
    // Placeholder - would show toast notification
    console.log(`Download PDF for statement: ${statementId}`);
    alert(`Download PDF for statement: ${statementId}`);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px] sm:mb-0">
              Invoices & Statements
            </h3>
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search statements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="rezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["This Month", "This Quarter", "This Year", "All Time"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Statement ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Statement Period
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Total Orders
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Gross Revenue
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Total Fees
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Net Earnings
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedStatements.map((statement, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="font-medium text-primary-500">
                        {statement.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {statement.period}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="font-medium">{statement.totalOrders}</span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="font-medium text-success-500">
                        {statement.grossRevenue}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-danger-500">
                        {statement.totalFees}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="font-semibold text-success-500">
                        {statement.netEarnings}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`inline-block px-[8px] py-[4px] text-xs font-medium rounded-full ${
                          statement.status === "Final"
                            ? "bg-success-100 text-success-500 dark:bg-success-500/10"
                            : "bg-warning-100 text-warning-500 dark:bg-warning-500/10"
                        }`}
                      >
                        {statement.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center gap-[9px]">
                        <button
                          type="button"
                          onClick={() => handleView(statement.id)}
                          className="text-primary-500 leading-none custom-tooltip hover:text-primary-600 transition-colors"
                          title="View Statement"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPDF(statement.id)}
                          className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip hover:text-gray-600 transition-colors"
                          title="Download PDF"
                        >
                          <i className="material-symbols-outlined !text-md">
                            download
                          </i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredStatements.length)} of{" "}
              {filteredStatements.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 flex">
              <li className="inline-block mx-[2px]">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, pageIndex) => (
                <li key={pageIndex} className="inline-block mx-[2px]">
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === pageIndex + 1
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036]"
                    } transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500`}
                    onClick={() => handlePageChange(pageIndex + 1)}
                  >
                    {pageIndex + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px]">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicesStatementsTable;
