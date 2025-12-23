import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Role {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  route: string;
  description: string;
}

const roles: Role[] = [
  {
    id: "maker",
    name: "maker",
    displayName: "Maker",
    icon: "build",
    route: "/maker/dashboard",
    description: "Create and manage projects"
  },
  {
    id: "designer",
    name: "designer",
    displayName: "Designer",
    icon: "palette",
    route: "/designer/dashboard",
    description: "Design and create artwork"
  },
  {
    id: "seller",
    name: "seller",
    displayName: "Seller",
    icon: "storefront",
    route: "/seller/dashboard",
    description: "Sell products and services"
  }
];

const RoleSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role>(roles[0]); // Default to maker
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setActive((prevState) => !prevState);
  };

  const handleRoleSwitch = (role: Role) => {
    setCurrentRole(role);
    setActive(false);
    // Navigate to the role's dashboard
    navigate(role.route);

    // Store the current role in localStorage for persistence
    localStorage.setItem('currentRole', role.id);
  };

  // Load saved role from localStorage on component mount
  useEffect(() => {
    const savedRole = localStorage.getItem('currentRole');
    if (savedRole) {
      const role = roles.find(r => r.id === savedRole);
      if (role) {
        setCurrentRole(role);
      }
    }
  }, []);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative role-switcher mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleDropdownToggle}
        className={`flex items-center px-[12px] py-[6px] rounded-md transition-all border-2 ${
          active 
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
            : "border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400"
        } text-black dark:text-white`}
      >
        <i className="material-symbols-outlined text-lg ltr:mr-[8px] rtl:ml-[8px]">
          {currentRole.icon}
        </i>
        <span className="font-medium text-sm">{currentRole.displayName}</span>
        <i className={`material-symbols-outlined text-sm transition-transform ltr:ml-[8px] rtl:mr-[8px] ${
          active ? "rotate-180" : ""
        }`}>
          keyboard_arrow_down
        </i>
      </button>

      <div
        className={`role-switcher-dropdown absolute ltr:right-0 rtl:left-0 top-full mt-[8px] w-[280px] bg-white dark:bg-[#0c1427] border border-gray-100 dark:border-[#172036] rounded-md shadow-lg transition-all z-50 ${
          active
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="p-[4px]">
          <div className="px-[12px] py-[8px] border-b border-gray-100 dark:border-[#172036]">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Switch Role
            </span>
          </div>

          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSwitch(role)}
              className={`w-full flex items-center px-[12px] py-[10px] rounded-md transition-all text-left ${
                currentRole.id === role.id
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "hover:bg-gray-50 dark:hover:bg-[#15203c] text-gray-700 dark:text-gray-200"
              }`}
            >
              <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ltr:mr-[12px] rtl:ml-[12px] ${
                currentRole.id === role.id
                  ? "bg-primary-100 dark:bg-primary-800/30"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}>
                <i className="material-symbols-outlined text-lg">
                  {role.icon}
                </i>
              </div>

              <div className="flex-1">
                <div className="font-medium text-sm">{role.displayName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                  {role.description}
                </div>
              </div>

              {currentRole.id === role.id && (
                <i className="material-symbols-outlined text-primary-500 text-lg">
                  check_circle
                </i>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;
