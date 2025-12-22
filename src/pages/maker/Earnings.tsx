import Cards from "../../components/Finance/Wallet/Cards";
import Statistics from "../../components/Finance/Wallet/Statistics";
import TotalBalance from "../../components/Finance/Wallet/TotalBalance";
import TotalExpenses from "../../components/Finance/Wallet/TotalExpenses";
import TotalIncome from "../../components/Finance/Wallet/TotalIncome";
import TransactionHistory from "../../components/Finance/Wallet/TransactionHistory";
import { Link } from "react-router-dom";

const Earnings = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Earnings</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              to="/maker"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Maker
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Earnings
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TotalBalance />
        <TotalIncome />
        <TotalExpenses />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Statistics />
        <Cards />
      </div>

      <TransactionHistory />
    </>
  );
};

export default Earnings;
