import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaClipboardCheck,
  FaUpload,
  FaBook,
  FaThLarge,
  FaGraduationCap,
  FaCog,
  FaFileArchive,
  FaDatabase,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
} from 'react-icons/fa';
import System_Logo from '../Logo/System_Logo';
import Tooltip from '../utility/Tooltip';
import { useUser } from '../context/UserContext';

export default function Sidebar({ isMobileOpen, onCloseMobile, isModalOpen }) {
  const [collapsed, setCollapsed] = useState(true); // Default collapsed
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [hoveredSubIndex, setHoveredSubIndex] = useState({});
  const [hoveredCollapseBtn, setHoveredCollapseBtn] = useState(false); // for collapse button tooltip

  const location = useLocation();
  const { user } = useUser();
  const { role } = user || {};

  // Auto open/close sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base role menus
  const roleMenus = {
    Admin: [
      { name: 'Home', icon: <FaHome />, path: '/home_admin' },
      
      {
        name: 'Students',
        icon: <FaGraduationCap />,
        path: '/manage_students_admin',
      },
      { name: 'Subjects', icon: <FaBook />, path: '/manage_subjects_admin' },
      { name: 'Sections', icon: <FaThLarge />, path: '/manage_sections_admin' },
      {
        name: 'Grades',
        icon: <FaClipboardCheck />,
        path: '/manage_grades_admin',
      },
      {
        name: 'Settings',
        icon: <FaCog />,
        textTooltip: 'Please expand to see the settings',
        submenu: [
          {
            name: 'Audit Trail',
            icon: <FaFileArchive />,
            path: '/manage_audit_admin',
          },
          {
            name: 'Backup & Restore',
            icon: <FaDatabase />,
            path: '/backup_restore_admin',
          },
        ],
      },
    ],
  };


  // Final menu based on role
  const menuItems =
    role === 'Admin' ? roleMenus.Admin : role === 'Teacher' ? roleMenus.Teacher || [] : [];

  const toggleSubmenu = (name) => {
    setOpenSubmenu((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (!collapsed) setOpenSubmenu({});
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-500 ease-in-out shadow-lg z-50
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isModalOpen ? 'lg:z-0' : 'lg:z-50'}
        `}
      >
        {/* Logo */}
        <div className="bg-primary flex items-center justify-center h-16 border-b border-base-200">
          {collapsed ? (
            <System_Logo className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <System_Logo className="w-5 h-5" />
              <span className="text-lg font-extrabold text-white tracking-wide">
                Consoli<span className="text-yellow-400">Grade</span>
              </span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-1 py-4 overflow-visible">
          <ul className="space-y-2">
            {menuItems.map((item, idx) => {
              const isActive = item.path === location.pathname;
              const tooltipText =
                collapsed && item.textTooltip ? item.textTooltip : item.name;

              return (
                <li key={idx} className="relative">
                  <Tooltip
                    text={tooltipText}
                    show={hoveredIndex === idx && collapsed}
                  >
                    <div className="flex flex-col w-full rounded-lg transition-colors text-xs">
                      <div
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`flex rounded-md w-full py-3 px-4 items-center justify-between cursor-pointer transition-colors
                          ${isActive ? 'bg-primary text-white' : ''}
                          ${hoveredIndex === idx ? 'bg-primary/80 text-white' : ''}
                          ${collapsed ? 'justify-center' : 'justify-between gap-3'}
                        `}
                        onClick={() => item.submenu && toggleSubmenu(item.name)}
                      >
                        {item.path && !item.submenu ? (
                          <Link
                            to={item.path}
                            className="flex items-center gap-3 w-full"
                            onClick={() => {
                              if (window.innerWidth < 1024) onCloseMobile();
                            }}
                          >
                            <span className="text-lg">{item.icon}</span>
                            {!collapsed && (
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
                            )}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 w-full">
                            <span className="text-lg">{item.icon}</span>
                            {!collapsed && (
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
                            )}
                          </div>
                        )}

                        {!collapsed && item.submenu && (
                          <span
                            className={`transition-transform duration-500 ease-in-out ${
                              openSubmenu[item.name] ? 'rotate-180' : ''
                            }`}
                          >
                            <FaChevronDown />
                          </span>
                        )}
                      </div>

                      {!collapsed && item.submenu && openSubmenu[item.name] && (
                        <ul className="pl-10 space-y-1">
                          {item.submenu.map((sub, subIdx) => {
                            const isSubActive = sub.path === location.pathname;
                            return (
                              <li
                                key={subIdx}
                                onMouseEnter={() =>
                                  setHoveredSubIndex((prev) => ({
                                    ...prev,
                                    [item.name]: subIdx,
                                  }))
                                }
                                onMouseLeave={() =>
                                  setHoveredSubIndex((prev) => ({
                                    ...prev,
                                    [item.name]: null,
                                  }))
                                }
                                className={`flex items-center gap-2 py-2 px-2 rounded cursor-pointer transition-colors
                                  ${isSubActive ? 'bg-primary text-white' : ''}
                                  ${
                                    hoveredSubIndex[item.name] === subIdx
                                      ? 'bg-primary/80 text-white'
                                      : ''
                                  }
                                `}
                              >
                                {sub.path ? (
                                  <Link
                                    to={sub.path}
                                    className="flex items-center gap-2 w-full"
                                    onClick={() => {
                                      setOpenSubmenu((prev) => ({
                                        ...prev,
                                        [item.name]: false,
                                      }));
                                      if (window.innerWidth < 1024) {
                                        onCloseMobile();
                                      }
                                    }}
                                  >
                                    <span className="text-lg">{sub.icon}</span>
                                    <span className="text-sm">{sub.name}</span>
                                  </Link>
                                ) : (
                                  <>
                                    <span className="text-lg">{sub.icon}</span>
                                    <span className="text-sm">{sub.name}</span>
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Expand/Collapse Button - Hidden on small screens */}
        <div
          className="hidden lg:block p-4 pt-2 border-t border-base-200/50"
          onMouseEnter={() => setHoveredCollapseBtn(true)}
          onMouseLeave={() => setHoveredCollapseBtn(false)}
        >
          <Tooltip
            text={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            show={hoveredCollapseBtn && collapsed}
          >
            <button
              onClick={toggleSidebar}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="group flex items-center justify-center w-full py-2.5 px-3 rounded-lg border border-base-300/50 hover:border-primary/40 bg-white/50 hover:bg-white/80 shadow-sm hover:shadow-xs transition-all duration-200 ease-in-out cursor-pointer"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                {collapsed ? (
                  <FaChevronRight className="text-xs text-primary/70 group-hover:text-primary" />
                ) : (
                  <FaChevronLeft className="text-xs text-primary/70 group-hover:text-primary" />
                )}
              </div>

              {!collapsed && (
                <span className="ml-2 text-xs font-medium text-gray-800 group-hover:text-gray-800 transition-colors">
                  {collapsed ? 'Expand' : 'Collapse'}
                </span>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
