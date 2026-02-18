import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Dashboard_Components/Sidebar.jsx';
import Navbar from '../Dashboard_Components/Navbar.jsx';

const Layout = () => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loginPath = ['/login', '/', '/forgot_password', '/reset_password','/register_account']; // Define login paths
  const isLoginPage = loginPath.includes(location.pathname);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  // LABEL Path → Menu name mapping
  const pathToMenu = {
    //  Admin Routes

    //  Subject Teacher Routes '/home_admin': 'Home',
    '/manage_users_admin': 'Users',

  };

  const activeMenu = pathToMenu[location.pathname] || 'Dashboard';

  if (isLoginPage) {
    // Special layout for login page → full screen center
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isModalOpen={isModalOpen}
        onCloseMobile={closeMobileSidebar}
        activeMenu={location.pathname} // LABEL still pass path for highlighting
      />

      {/* Navbar + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          toggleMobileSidebar={toggleMobileSidebar}
          activeMenu={activeMenu} // LABEL pass readable menu name
          setIsModalOpen={setIsModalOpen}
        />

        <main className="flex-1 overflow-y-auto px-1 min-w-0">
          <Outlet
            context={{
              toggleMobileSidebar,
              isMobileSidebarOpen,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Layout;
