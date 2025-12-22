import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  transactions,
  statements,
} from "../../features/makerPayouts/mockMakerPayouts";

const SecondaryTransactionsTable: React.FC = () => {
  // Accordion state - collapsed by default
  const [isExpanded, setIsExpanded] = useState(false);

  // Modal state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Payout method state
  const [payoutMethod, setPayoutMethod] = useState({
    type: "Bank Transfer",
    accountHolderName: "John Doe",
    accountDetails: "****1234",
    billingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    type: "Bank Transfer",
    accountHolderName: "",
    accountDetails: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  // Open payout method modal
  const openPayoutModal = () => {
    setFormData(payoutMethod);
    setIsPayoutModalOpen(true);
  };

  // Close payout method modal
  const closePayoutModal = () => {
    setIsPayoutModalOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("billingAddress.")) {
      const addressField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Save payout method
  const savePayoutMethod = () => {
    // Update the payout method
    setPayoutMethod(formData);

    // Show success toast
    alert("Payout method updated successfully!");

    // Close modal
    setIsPayoutModalOpen(false);
  };

  // Toast notification handler
  const showToast = (action: string, period: string) => {
    // In a real app, this would trigger a toast notification
    console.log(`${action} for statement ${period}`);
    alert(`${action} for statement ${period} - Feature coming soon!`);
  };

  // Mask account details for display
  const getMaskedAccountDetails = (details: string) => {
    if (details.length <= 4) return details;
    return "****" + details.slice(-4);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Job payout":
        return "bg-success-50 text-success-600 dark:bg-[#15203c] dark:text-success-400";
      case "Bonus":
        return "bg-primary-50 text-primary-600 dark:bg-[#15203c] dark:text-primary-400";
      case "Adjustment":
        return "bg-warning-50 text-warning-600 dark:bg-[#15203c] dark:text-warning-400";
      case "Payout transfer":
        return "bg-info-50 text-info-600 dark:bg-[#15203c] dark:text-info-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-[#15203c] dark:text-gray-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success-50 text-success-600 dark:bg-[#15203c] dark:text-success-400";
      case "Pending":
        return "bg-warning-50 text-warning-600 dark:bg-[#15203c] dark:text-warning-400";
      case "Processing":
        return "bg-info-50 text-info-600 dark:bg-[#15203c] dark:text-info-400";
      case "Failed":
        return "bg-red-50 text-red-600 dark:bg-[#15203c] dark:text-red-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-[#15203c] dark:text-gray-400";
    }
  };

  const getAmountColor = (amount: string) => {
    return amount.startsWith("+")
      ? "text-success-600 dark:text-success-400"
      : "text-red-600 dark:text-red-400";
  };

  const getAdjustmentColor = (adjustment: string) => {
    if (adjustment === "$0.00") return "text-gray-500 dark:text-gray-400";
    return adjustment.startsWith("+")
      ? "text-success-600 dark:text-success-400"
      : "text-red-600 dark:text-red-400";
  };

  return (
    <>
      {/* Payout Method Info Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h4 className="text-black dark:text-white text-lg md:text-xl font-semibold mb-[5px]">
              Next Payout
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Payout method: {payoutMethod.type} -{" "}
              {getMaskedAccountDetails(payoutMethod.accountDetails)}
            </p>
          </div>
          <button
            onClick={openPayoutModal}
            className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
          >
            Manage Method
          </button>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white">
          <button
            className={`toc-accordion-button text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
              isExpanded ? "open" : ""
            }`}
            type="button"
            onClick={toggleAccordion}
          >
            <div className="flex items-center justify-between">
              <span>
                Transaction History ({transactions.length} transactions)
              </span>
              <i
                className={`ri-arrow-down-s-line text-[20px] transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              ></i>
            </div>
          </button>

          <div
            className={`toc-accordion-collapse ${
              isExpanded ? "open" : "hidden"
            }`}
          >
            <div className="trezo-card-content -mx-[20px] md:-mx-[25px] px-[20px] md:px-[25px] pb-[20px]">
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      {["Date", "Type", "Reference", "Amount", "Status"].map(
                        (header, index) => (
                          <th
                            key={index}
                            className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-100 dark:bg-[#15203c] whitespace-nowrap text-sm"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody className="text-black dark:text-white">
                    {transactions.map((transaction, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                      >
                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[12px] py-[12px] border-b border-gray-100 dark:border-[#172036] text-sm">
                          {transaction.date}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[12px] py-[12px] border-b border-gray-100 dark:border-[#172036]">
                          <span
                            className={`px-[6px] py-[2px] inline-block rounded-sm font-medium text-xs ${getTypeBadgeColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type}
                          </span>
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[12px] py-[12px] border-b border-gray-100 dark:border-[#172036] text-sm">
                          {transaction.reference}
                        </td>

                        <td
                          className={`font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[12px] py-[12px] border-b border-gray-100 dark:border-[#172036] text-sm ${getAmountColor(
                            transaction.amount
                          )}`}
                        >
                          {transaction.amount}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[12px] py-[12px] border-b border-gray-100 dark:border-[#172036]">
                          <span
                            className={`px-[6px] py-[2px] inline-block rounded-sm font-medium text-xs ${getStatusBadgeColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statements Section */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h4 className="text-black dark:text-white text-lg md:text-xl font-semibold mb-[5px]">
              Statements
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Monthly earnings statements and summaries
            </p>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "Period",
                    "Jobs Completed",
                    "Gross Earnings",
                    "Adjustments",
                    "Net",
                    "Status",
                    "Actions",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {statements.map((statement, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                  >
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {statement.period}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {statement.jobsCompleted}
                    </td>

                    <td className="text-primary-500 font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {statement.grossEarnings}
                    </td>

                    <td
                      className={`font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ${getAdjustmentColor(
                        statement.adjustments
                      )}`}
                    >
                      {statement.adjustments}
                    </td>

                    <td className="text-success-600 dark:text-success-400 font-semibold ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {statement.net}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                          statement.status === "Final"
                            ? "bg-success-50 text-success-600 dark:bg-[#15203c]"
                            : "bg-warning-50 text-warning-600 dark:bg-[#15203c]"
                        }`}
                      >
                        {statement.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[9px]">
                        <div className="relative group">
                          <button
                            type="button"
                            className="text-primary-500 leading-none"
                            onClick={() =>
                              showToast("View Statement", statement.period)
                            }
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-red-500 leading-none"
                            onClick={() =>
                              showToast("Download PDF", statement.period)
                            }
                          >
                            <i className="material-symbols-outlined !text-md">
                              download
                            </i>
                          </button>
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Download PDF
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payout Method Modal */}
      <Dialog open={isPayoutModalOpen} onClose={closePayoutModal} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Payout Method
                </h3>
                <button
                  onClick={closePayoutModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="material-symbols-outlined !text-[24px]">close</i>
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Method Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Method Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Stripe">Stripe</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter account holder name"
                  />
                </div>

                {/* Account Details */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Account Details
                  </label>
                  <input
                    type="password"
                    value={formData.accountDetails}
                    onChange={(e) => handleInputChange("accountDetails", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={formData.type === "Bank Transfer" ? "Account number" : formData.type === "PayPal" ? "Email address" : "Connect account"}
                  />
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Billing Address
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.billingAddress.street}
                      onChange={(e) => handleInputChange("billingAddress.street", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Street address"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.billingAddress.city}
                        onChange={(e) => handleInputChange("billingAddress.city", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={formData.billingAddress.state}
                        onChange={(e) => handleInputChange("billingAddress.state", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.billingAddress.zipCode}
                        onChange={(e) => handleInputChange("billingAddress.zipCode", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="ZIP Code"
                      />
                      <input
                        type="text"
                        value={formData.billingAddress.country}
                        onChange={(e) => handleInputChange("billingAddress.country", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closePayoutModal}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePayoutMethod}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md hover:bg-primary-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SecondaryTransactionsTable;
