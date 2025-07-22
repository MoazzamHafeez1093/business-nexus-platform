import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Users, 
  MessageCircle, 
  Settings, 
  LogOut,
  Sparkles,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import Notifications from '../components/Notifications';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  // Get current path for navigation highlighting
  const getCurrentPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/investor')) return 'investor';
    if (path.includes('/dashboard/entrepreneur')) return 'entrepreneur';
    if (path.includes('/profile/')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/help')) return 'help';
    return '';
  };

  const currentPath = getCurrentPath();

  const navigation = [
    {
      name: 'Dashboard',
      href: `/dashboard/${role}`,
      icon: Home,
      current: currentPath === 'investor' || currentPath === 'entrepreneur'
    },
    {
      name: 'Chat',
      href: `/chat/${userId}`,
      icon: MessageCircle,
      current: currentPath === 'messages'
    },
    {
      name: 'Profile',
      href: `/profile/${role}/${userId}`,
      icon: User,
      current: currentPath === 'profile'
    },
    {
      name: 'Settings',
      href: `/settings`,
      icon: Settings,
      current: currentPath === 'settings'
    }
  ];

  return (
    <div className="layout flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="sidebar fixed z-30 top-0 left-0 h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:relative lg:translate-x-0"
            style={{ width: 256, minWidth: 64 }}
            aria-label="Sidebar navigation"
          >
            <div className="flex items-center h-16 px-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text hidden lg:block animate-fade-in">FundFlow</span>
              </div>
              <button
                className="ml-auto text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-6 px-2">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 ${
                        item.current ? 'active bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border-l-4 border-primary-500 shadow-md' : ''
                      }`}
                      tabIndex={0}
                      aria-current={item.current ? 'page' : undefined}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="icon flex items-center justify-center w-6 h-6">{<item.icon />}</span>
                      <span className="label truncate hidden md:inline-block">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="my-6 border-t border-gray-100 dark:border-gray-800" />
              <button
                onClick={handleLogout}
                className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg w-full font-medium text-error-600 dark:text-error-300 hover:bg-error-50 dark:hover:bg-error-900 hover:text-error-700 dark:hover:text-error-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-error-200 dark:focus:ring-error-900 mt-2"
              >
                <span className="icon flex items-center justify-center w-6 h-6"><LogOut /></span>
                <span className="label truncate hidden md:inline-block">Logout</span>
              </button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <motion.div
          key="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 ml-0 lg:ml-64 transition-all duration-300">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800 flex items-center h-16 px-4 sm:px-6 lg:px-8 rounded-b-xl">
          <button
            type="button"
            className="lg:hidden mr-4 p-2 text-primary-600 bg-primary-50 shadow rounded-xl border border-primary-100 transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-200"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center min-w-0">
            <div className="ml-2 lg:ml-0 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 break-words max-w-full">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={handleDarkModeToggle}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <Notifications />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm font-medium text-white">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{userName || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="main-content">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
