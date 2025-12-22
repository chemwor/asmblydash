import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export interface NavItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  badge?: {
    text: string;
    color: string;
    bgColor: string;
  };
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarMenuProps {
  toggleActive: () => void;
  navItems?: NavSection[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleActive, navItems = [] }) => {
  const { pathname } = useLocation();

  // Initialize openIndex to 0 to open the first item by default
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const renderNavItem = (item: NavItem, isChild = false) => {
    const linkClass = isChild
      ? `sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
          pathname === item.path ? "active" : ""
        }`
      : `accordion-button flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
          pathname === item.path ? "active" : ""
        }`;

    if (item.path && !item.children) {
      return (
        <Link to={item.path} className={linkClass}>
          {item.icon && !isChild && (
            <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
              {item.icon}
            </i>
          )}
          <span className="title leading-none">{item.title}</span>
          {item.badge && (
            <span className={`text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] ${item.badge.color} ${item.badge.bgColor} dark:bg-[#ffffff14] inline-block rounded-sm`}>
              {item.badge.text}
            </span>
          )}
        </Link>
      );
    }

    return (
      <span className="title leading-none">{item.title}</span>
    );
  };

  const renderAccordionItem = (item: NavItem, index: number) => {
    if (!item.children || item.children.length === 0) {
      return (
        <div key={item.id} className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
          {renderNavItem(item)}
        </div>
      );
    }

    return (
      <div key={item.id} className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
        <button
          className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
            openIndex === index ? "open" : ""
          }`}
          type="button"
          onClick={() => toggleAccordion(index)}
        >
          {item.icon && (
            <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
              {item.icon}
            </i>
          )}
          <span className="title leading-none">{item.title}</span>
          {item.badge && (
            <span className={`rounded-full font-medium inline-block text-center w-[20px] h-[20px] text-[11px] leading-[20px] ${item.badge.color} ${item.badge.bgColor} dark:bg-[#ffffff14] ltr:ml-auto rtl:mr-auto`}>
              {item.badge.text}
            </span>
          )}
        </button>

        <div className={`accordion-collapse ${openIndex === index ? "open" : "hidden"}`}>
          <div className="pt-[4px]">
            <ul className="sidebar-sub-menu">
              {item.children.map((child) => (
                <li key={child.id} className="sidemenu-item mb-[4px] last:mb-0">
                  {renderNavItem(child, true)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="sidebar-area bg-white dark:bg-[#0c1427] fixed z-[7] top-0 h-screen transition-all rounded-r-md">
        <div className="logo bg-white dark:bg-[#0c1427] border-b border-gray-100 dark:border-[#172036] px-[25px] pt-[19px] pb-[15px] absolute z-[2] right-0 top-0 left-0">
          <Link
            to="/dashboard/ecommerce"
            className="transition-none relative flex items-center outline-none"
          >
            <img
              src="/images/logo-icon.svg"
              alt="logo-icon"
              width={26}
              height={26}
            />
            <span className="font-bold text-black dark:text-white relative ltr:ml-[8px] rtl:mr-[8px] top-px text-xl">
              Trezo
            </span>
          </Link>

          <button
            type="button"
            className="burger-menu inline-block absolute z-[3] top-[24px] ltr:right-[25px] rtl:left-[25px] transition-all hover:text-primary-500"
            onClick={toggleActive}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>

        <div className="pt-[89px] px-[22px] pb-[20px] h-screen overflow-y-scroll sidebar-custom-scrollbar">
          <div className="accordion">
            {navItems.map((section, sectionIndex) => (
              <React.Fragment key={section.title}>
                <span className="block relative font-medium uppercase text-gray-400 mb-[8px] text-xs [&:not(:first-child)]:mt-[22px]">
                  {section.title}
                </span>
                {section.items.map((item, itemIndex) => {
                  const globalIndex = sectionIndex * 100 + itemIndex; // Ensure unique indices across sections
                  return renderAccordionItem(item, globalIndex);
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
