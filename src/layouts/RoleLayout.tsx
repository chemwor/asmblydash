import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../auth/getCurrentUser';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SidebarMenu from '../components/Layout/SidebarMenu';
import { roleNavigation } from '../config/roleNavigation';

const RoleLayout: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const { pathname } = useLocation();
  const user = getCurrentUser();

  const toggleActive = (): void => {
    setActive(!active);
  };

  // Scroll to top on route change - must be called before conditional return
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Redirect if no user
  if (!user) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // Get navigation items based on current route
  const getNavigationForRole = () => {
    // Detect role from current pathname
    const detectRoleFromPath = () => {
      if (pathname.startsWith('/maker')) return 'maker';
      if (pathname.startsWith('/seller')) return 'seller';
      if (pathname.startsWith('/designer')) return 'designer';
      if (pathname.startsWith('/admin')) return 'admin';
      return 'default';
    };

    const role = detectRoleFromPath();
    return roleNavigation[role as keyof typeof roleNavigation] || roleNavigation.default;
  };

  const navItems = getNavigationForRole();

  return (
    <>
      <div className={`main-content-wrap transition-all ${active ? "active" : ""}`}>
        {/* Use role-based navigation */}
        <SidebarMenu toggleActive={toggleActive} navItems={navItems} />

        <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
          <Header toggleActive={toggleActive} />

          <div className="flex-grow pt-[25px] pl-[285px] pr-[25px] pb-0">
            <Outlet />
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default RoleLayout;
