import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa';
import ProfileModal from '../Modal/ProfileModal';
import ChangePasswordModal from '../Modal/ChangePasswordModal';
import ConfirmationBox from '../Modal/ConfirmationBox';
import { useUser } from '../context/UserContext';
import NotificationDropdown from './NotificationDropdown';
import { useNotificationContext } from '../../context/NotificationContext';
//import { supabase } from '../../supabaseClient';

export default function Navbar({
  activeMenu = '',
  toggleMobileSidebar,
  setIsModalOpen,
}) {
  const [open, setOpen] = useState(false); // dropdown
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUser(); // get dynamic logged-in user
  const [loading, setLoading] = useState(false);
  
  // Custom hook for notifications
  const { notificationCount, loading: notificationLoading } = useNotificationContext();

  // Handle modal state for sidebar z-index
  useEffect(() => {
    const anyModalOpen =
      isProfileModalOpen || isChangePasswordModalOpen || logoutConfirm || isNotificationOpen;
    setIsModalOpen(anyModalOpen);
  }, [
    isProfileModalOpen,
    isChangePasswordModalOpen,
    logoutConfirm,
    isNotificationOpen,
    setIsModalOpen,
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close notifications when clicking outside notification area (but not on the button itself)
  useEffect(() => {
    function handleNotificationClickOutside(event) {
      const notificationButton = event.target.closest('[data-notification-button]');
      const notificationDropdown = event.target.closest('[data-notification-dropdown]');
      
      // Only close if clicking outside both button and dropdown
      // Add a small delay to avoid conflicts with button click
      setTimeout(() => {
        if (!notificationButton && !notificationDropdown && isNotificationOpen) {
          setIsNotificationOpen(false);
        }
      }, 10);
    }
    
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleNotificationClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleNotificationClickOutside);
    };
  }, [isNotificationOpen]);

  const handlePasswordChange = (data) => {
    console.log('Password data:', data);
  };

  const handleLogout = async () => {
    setLoading(true); // start loading
    try {
      //await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      navigate('/login'); // always redirect
      setLoading(false); // stop loading
    }
  };

  // Extract initials from name
  const getInitials = (firstName = '', lastName = '') => {
    if (!firstName && !lastName) return 'U';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  return (
    <nav className="w-full bg-white shadow-lg px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Hamburger + Active Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-full text-gray-700 text-xl focus:outline-none lg:hidden hover:bg-gray-200 transition-colors cursor-pointer"
          title="Show menu items"
        >
          <FaBars />
        </button>

        <div className="text-base sm:text-lg font-semibold text-gray-800 truncate">
          {activeMenu}
        </div>
      </div>

      {/* Right: Notifications + Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <div className="relative">
          <button
            data-notification-button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Notification button clicked! Current state:', isNotificationOpen);
              
              // Toggle the notification state
              const newState = !isNotificationOpen;
              setIsNotificationOpen(newState);
              setOpen(false); // Close profile dropdown when opening notifications
            }}
            className={`relative p-2 rounded-full transition-all duration-200 focus:outline-none text-gray-600 hover:bg-gray-100 hover:scale-105`}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <FaBell className="text-xl" />
            {/* Notification Badge */}
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-bounce bg-red-500">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
            {/* Loading indicator */}
            {notificationLoading && (
              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="focus:outline-none group"
          title="Toggle Profile Menu"
        >
          <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-medium transition-all group-hover:shadow-md hover:cursor-pointer">
            {getInitials(user?.first_name, user?.last_name)}
          </div>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 mt-2 w-48 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-100 transform transition-all duration-200 origin-top-right ${
            open
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={() => {
              setIsProfileModalOpen(true);
              setOpen(false);
              setIsNotificationOpen(false); // Close notifications when opening profile
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white rounded text-sm sm:text-base transition-colors"
          >
            Profile
          </button>

          <button
            onClick={() => {
              setIsChangePasswordModalOpen(true);
              setOpen(false);
              setIsNotificationOpen(false); // Close notifications when opening change password
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white rounded text-sm sm:text-base transition-colors"
          >
            Change Password
          </button>

          <button
            onClick={() => {
              setLogoutConfirm(true);
              setOpen(false);
              setIsNotificationOpen(false); // Close notifications when opening logout
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white rounded text-sm sm:text-base transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />

      {/* Logout Confirmation Modal */}
      {logoutConfirm && (
        <ConfirmationBox
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          label={'Logout'}
          disabled={loading} // disable button while loading
          isLoading={loading}
          loadingText={'Logging out ........'}
          onConfirm={async () => {
            await handleLogout();
            setLogoutConfirm(false);
          }}
          onCancel={() => setLogoutConfirm(false)}
        />
      )}
    </nav>
  );
}
