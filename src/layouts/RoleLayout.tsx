import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../auth/getCurrentUser';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SidebarMenu from '../components/Layout/SidebarMenu';

const RoleLayout: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const { pathname } = useLocation();
  const user = getCurrentUser();

  const toggleActive = (): void => {
    setActive(!active);
  };

  // Redirect if no user
  if (!user) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // For testing, use a default navigation structure that matches SidebarMenu expectations
  const defaultNavItems = [
    {
      title: "Main",
      items: [
        {
          id: "dashboard",
          title: "Dashboard",
          icon: "dashboard",
          path: "/dashboard/ecommerce"
        },
        {
          id: "apps",
          title: "Apps",
          icon: "apps",
          path: "/apps"
        },
        {
          id: "ecommerce",
          title: "eCommerce",
          icon: "shopping_cart",
          path: "/ecommerce"
        }
      ]
    }
  ];

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <>
      <div className={`main-content-wrap transition-all ${active ? "active" : ""}`}>
        {/* Use default navigation for testing */}
        <SidebarMenu toggleActive={toggleActive} navItems={defaultNavItems} />

        <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
          <Header toggleActive={toggleActive} />

          <div className="flex-grow pt-[80px] px-[20px] md:px-[25px] pb-[20px]">
            <Outlet />
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default RoleLayout;
